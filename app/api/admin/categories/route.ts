import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { requireCurrentAdmin } from "@/lib/authz";
import { serializeDocument } from "@/lib/serialize";
import { Category } from "@/models/Category";
import { Types } from "mongoose";

export async function GET() {
  await connectToDatabase();
  return NextResponse.json({ items: serializeDocument(await Category.find().sort({ name: 1 }).lean()) });
}

export async function POST(request: Request) {
  if (!(await requireCurrentAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  if (typeof body.name !== "string" || typeof body.slug !== "string" || typeof body.image !== "string") {
    return NextResponse.json({ error: "name, slug, and image are required" }, { status: 400 });
  }

  await connectToDatabase();
  const category = await Category.create({ name: body.name.trim(), slug: body.slug.trim().toLowerCase(), image: body.image.trim() });
  return NextResponse.json({ item: serializeDocument(category.toObject()) }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await requireCurrentAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  if (typeof body.id !== "string" || !Types.ObjectId.isValid(body.id)) {
    return NextResponse.json({ error: "Valid category id is required" }, { status: 400 });
  }
  await connectToDatabase();
  const used = await (await import("@/models/Product")).Product.exists({ category: body.id });
  if (used) return NextResponse.json({ error: "Category is used by products" }, { status: 409 });
  await Category.findByIdAndDelete(body.id);
  return NextResponse.json({ deleted: true });
}
