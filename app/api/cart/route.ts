import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/models/Cart";
import { serializeDocument } from "@/lib/serialize";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const cart = await Cart.findOne({ user: session.user.id }).lean();
  return NextResponse.json({ items: serializeDocument(cart?.items ?? []) });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { items?: unknown };
  if (!Array.isArray(body.items)) return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });

  await connectToDatabase();
  const cart = await Cart.findOneAndUpdate(
    { user: session.user.id },
    { $set: { items: body.items } },
    { upsert: true, new: true, runValidators: true },
  ).lean();
  return NextResponse.json({ items: serializeDocument(cart.items) });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  await Cart.deleteOne({ user: session.user.id });
  return NextResponse.json({ items: [] });
}
