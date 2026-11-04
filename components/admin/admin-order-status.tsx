"use client";

import { useState } from "react";
import { useToast } from "@/components/toast-provider";
import { useLocale } from "@/components/app-providers";
import { LoaderCircle } from "lucide-react";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export function AdminOrderStatus({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const { copy } = useLocale();
  async function update(nextStatus: string) {
    setPending(true);
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (response.ok) {
      setStatus(nextStatus);
      toast(copy.ui.statusUpdatedToast, "success");
    } else {
      toast(copy.ui.updateFailedToast, "error");
    }
    setPending(false);
  }
  return <div className="flex items-center gap-2">
    <select value={status} disabled={pending} onChange={(event) => update(event.target.value)} className="rounded-lg border bg-white px-2 py-1 text-sm disabled:opacity-60">
      {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
    </select>
    {pending && <span className="inline-flex items-center gap-1 text-xs text-[#8a7970]"><LoaderCircle size={13} className="animate-spin" />{copy.ui.updatingStatus}</span>}
  </div>;
}
