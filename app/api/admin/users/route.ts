import { NextResponse } from "next/server";

import { requireCurrentAdmin } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  if (!(await requireCurrentAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectToDatabase();
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: users });
}
