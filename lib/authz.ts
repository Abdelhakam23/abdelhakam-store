import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import type { UserRole } from "@/types/shop";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();
  if (role === "admin") {
    await connectToDatabase();
    const currentUser = await User.findById(user.id).select("role").lean();
    if (currentUser?.role !== "admin") redirect("/");
    return user;
  }
  if (user.role !== role) redirect("/");
  return user;
}

export async function requireCurrentAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectToDatabase();
  const user = await User.findById(session.user.id).select("role").lean();
  return user?.role === "admin" ? session.user : null;
}
