import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/db";
import { requireCurrentAdmin } from "@/lib/authz";
import { serializeDocument } from "@/lib/serialize";
import { productMutationSchema } from "@/lib/validation";
import { Product } from "@/models/Product";
import "@/models/Category";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectToDatabase();
  const product = await Product.findOne(
    Types.ObjectId.isValid(id) ? { _id: id } : { slug: id },
  )
    .populate("category", "name slug")
    .lean();
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ item: serializeDocument(product) });
}

async function requireAdmin() {
  return Boolean(await requireCurrentAdmin());
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  const parsed = productMutationSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid product payload", details: parsed.error.flatten() }, { status: 400 });
  await connectToDatabase();
  const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true }).lean();
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ item: serializeDocument(product) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  await connectToDatabase();
  const deleted = await Product.findByIdAndDelete(id).lean();
  if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
