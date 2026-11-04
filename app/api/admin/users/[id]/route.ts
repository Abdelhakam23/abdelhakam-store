import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { requireCurrentAdmin } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { userRoleSchema } from "@/lib/validation";
import { User } from "@/models/User";
import { Cart } from "@/models/Cart";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  const parsed = userRoleSchema.safeParse((await request.json()).role);
  if (!parsed.success) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  if (id === admin.id && parsed.data !== "admin") return NextResponse.json({ error: "You cannot remove your own admin role" }, { status: 400 });
  await connectToDatabase();
  const user = await User.findByIdAndUpdate(id, { role: parsed.data }, { new: true }).select("name email role").lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ item: user });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }
  if (id === admin.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findByIdAndDelete(id).select("_id").lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  await Cart.deleteOne({ user: id });

  return NextResponse.json({ deleted: true });
}
