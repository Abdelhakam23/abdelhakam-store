import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import { Order } from "@/models/Order";

const paymentIntentSchema = z.object({
  orderId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid order id"),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { STRIPE_SECRET_KEY } = getServerEnv();
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }
  const parsed = paymentIntentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  await connectToDatabase();
  const order = await Order.findOne({
    _id: parsed.data.orderId,
    user: session.user.id,
    "paymentInfo.status": "pending",
  }).lean();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const amount = Math.round(order.totalPrice * 100);
  if (amount < 50) return NextResponse.json({ error: "Order amount is below Stripe minimum" }, { status: 400 });
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: { orderId: order._id.toString(), userId: session.user.id },
    automatic_payment_methods: { enabled: true },
  });
  return NextResponse.json({ clientSecret: intent.client_secret });
}
