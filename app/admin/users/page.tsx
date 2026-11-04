import { requireRole } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { UserList } from "@/components/admin/user-list";

export const instant = false;

export default async function AdminUsersPage() {
  await requireRole("admin");
  await connectToDatabase();
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 }).limit(100).lean();
  return <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8"><p className="text-xs uppercase tracking-[0.18em] text-[#a27a62]">Admin / Users</p><h1 className="mt-2 text-4xl tracking-tight">Users</h1><UserList initialUsers={users.map((user) => ({ _id: user._id.toString(), name: user.name, email: user.email, role: user.role }))} /></main>;
}
