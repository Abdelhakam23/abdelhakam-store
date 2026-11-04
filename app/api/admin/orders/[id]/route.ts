import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { requireCurrentAdmin } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { serializeDocument } from "@/lib/serialize";
import { orderStatusSchema } from "@/lib/validation";
import { Order } from "@/models/Order";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireCurrentAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  const body = await request.json();
  const parsed = orderStatusSchema.safeParse(body.status);
  if (!parsed.success) return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  await connectToDatabase();
  const order = await Order.findByIdAndUpdate(id, { status: parsed.data }, { new: true }).lean();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ item: serializeDocument(order) });
}
