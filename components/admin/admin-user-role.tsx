"use client";

import { useState } from "react";
import { useToast } from "@/components/toast-provider";
import { useLocale } from "@/components/app-providers";
import { LoaderCircle, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function AdminUserRole({ userId, initialRole, onDeleted }: { userId: string; initialRole: string; onDeleted: () => void }) {
  const [role, setRole] = useState(initialRole);
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();
  const { copy } = useLocale();
  async function update(nextRole: string) {
    setPending(true);
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    if (response.ok) {
      setRole(nextRole);
      toast(copy.ui.roleUpdatedToast, "success");
    } else {
      toast(copy.ui.updateFailedToast, "error");
    }
    setPending(false);
  }
  async function removeUser() {
    setConfirmDelete(false);
    setPending(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      toast(copy.ui.userDeletedToast, "delete");
      onDeleted();
    } catch {
      toast(copy.ui.updateFailedToast, "error");
    } finally {
      setPending(false);
    }
  }
  return <div className="flex items-center gap-2">
    <select value={role} disabled={pending} onChange={(event) => update(event.target.value)} className="rounded-lg border bg-white px-2 py-1 text-sm disabled:opacity-60">
      <option value="customer">customer</option>
      <option value="admin">admin</option>
    </select>
    <button type="button" disabled={pending} onClick={() => setConfirmDelete(true)} aria-label={copy.ui.deleteUser} className="rounded-full p-2 text-[#a45742] transition hover:bg-[#f7eee8] disabled:opacity-50"><Trash2 size={15} /></button>
    {pending && <span className="inline-flex items-center gap-1 text-xs text-[#8a7970]"><LoaderCircle size={13} className="animate-spin" />{copy.ui.updatingRole}</span>}
    <ConfirmDialog open={confirmDelete} title={copy.ui.deleteUserTitle} message={copy.ui.deleteUserMessage} confirmLabel={copy.ui.confirm} cancelLabel={copy.ui.cancel} onConfirm={removeUser} onCancel={() => setConfirmDelete(false)} />
  </div>;
}
