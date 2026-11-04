import { NextResponse } from "next/server";
import Stripe from "stripe";

import { connectToDatabase } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import { Order } from "@/models/Order";

export async function POST(request: Request) {
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = getServerEnv();
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  }
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const orderId = intent.metadata.orderId;
    if (orderId) {
      await connectToDatabase();
      const order = await Order.findById(orderId).select("totalPrice paymentInfo.status").lean();
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      if (intent.amount_received !== Math.round(order.totalPrice * 100)) {
        return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
      }
      if (order.paymentInfo.status === "pending") {
        await Order.findOneAndUpdate(
          { _id: orderId, "paymentInfo.status": "pending" },
          {
            "paymentInfo.status": "paid",
            "paymentInfo.transactionId": intent.id,
            status: "processing",
          },
        );
      }
    }
  }
  return NextResponse.json({ received: true });
}
