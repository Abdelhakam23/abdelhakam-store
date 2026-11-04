"use client";

import { useState } from "react";

import { AdminUserRole } from "@/components/admin/admin-user-role";

type User = { _id: string; name: string; email: string; role: string };

export function UserList({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);

  return (
    <div className="mt-8 overflow-x-auto rounded-3xl bg-white p-5">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead><tr className="border-b text-[#8a7970]"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b last:border-0">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3"><AdminUserRole userId={user._id} initialRole={user.role} onDeleted={() => setUsers((current) => current.filter((item) => item._id !== user._id))} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
