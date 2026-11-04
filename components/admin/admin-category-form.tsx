"use client";

import { useState } from "react";
import { useToast } from "@/components/toast-provider";
import { useLocale } from "@/components/app-providers";
import { LoadingButton } from "@/components/loading-button";
import { ValidatedForm } from "@/components/validated-form";

type CategorySummary = { _id: string; name: string; slug: string; image: string };

export function AdminCategoryForm({ onCreated }: { onCreated: (category: CategorySummary) => void }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const { copy } = useLocale();
  async function submit(formData: FormData) {
    setPending(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = (await response.json()) as { error?: string; item?: CategorySummary };
      setMessage(response.ok ? copy.ui.categoryCreatedToast : result.error || copy.ui.updateFailedToast);
      toast(response.ok ? copy.ui.categoryCreatedToast : result.error || copy.ui.updateFailedToast, response.ok ? "success" : "error");
      if (response.ok && result.item) onCreated(result.item);
      if (response.ok) (document.querySelector("#category-form") as HTMLFormElement)?.reset();
    } catch {
      setMessage(copy.ui.updateFailedToast);
      toast(copy.ui.updateFailedToast, "error");
    } finally {
      setPending(false);
    }
  }
  return (
    <ValidatedForm id="category-form" action={submit} className="grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-[1fr_1fr_2fr_auto]">
      <input name="name" required placeholder="Category name" className="rounded-xl border p-3" />
      <input name="slug" required placeholder="category-slug" className="rounded-xl border p-3" />
      <input name="image" required type="url" placeholder="Category image URL" className="rounded-xl border p-3" />
      <LoadingButton loading={pending} className="rounded-full bg-[#2f2926] px-5 py-3 text-sm text-white">{pending ? copy.ui.addingCategory : copy.ui.add}</LoadingButton>
      {message && <p className="sm:col-span-4 text-sm text-[#665a55]">{message}</p>}
    </ValidatedForm>
  );
}
