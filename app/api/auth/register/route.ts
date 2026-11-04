import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signUpSchema } from "@/lib/validation";
import { User } from "@/models/User";

export async function POST(request: Request) {
  const parsed = signUpSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration data", details: parsed.error.flatten() }, { status: 400 });
  }

  await connectToDatabase();
  const existing = await User.exists({ email: parsed.data.email.toLowerCase() });
  if (existing) return NextResponse.json({ error: "Email is already registered" }, { status: 409 });

  const user = await User.create({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    passwordHash: await hashPassword(parsed.data.password),
  });
  return NextResponse.json({ id: user._id.toString() }, { status: 201 });
}
