"use client";

import { FormEvent, useState } from "react";

import { useLocale } from "@/components/app-providers";
import { LoadingButton } from "@/components/loading-button";
import { useToast } from "@/components/toast-provider";
import { ValidatedForm } from "@/components/validated-form";

export function ContactForm() {
  const { copy } = useLocale();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      form.reset();
      toast(copy.ui.messageSentToast, "success");
    }, 650);
  }

  return (
    <ValidatedForm onSubmit={submit} className="grid gap-4">
      <input required name="name" placeholder={copy.ui.name} className="rounded-2xl border border-[#e5d9d0] bg-white p-4 outline-none focus:border-[#b98768]" />
      <input required type="email" name="email" placeholder={copy.ui.email} className="rounded-2xl border border-[#e5d9d0] bg-white p-4 outline-none focus:border-[#b98768]" />
      <textarea required name="message" placeholder={copy.ui.message} className="min-h-40 rounded-2xl border border-[#e5d9d0] bg-white p-4 outline-none focus:border-[#b98768]" />
      <LoadingButton loading={pending} className="mt-2 rounded-full bg-[#2f2926] px-6 py-4 text-sm text-white">{pending ? copy.ui.pleaseWait : copy.ui.submit}</LoadingButton>
    </ValidatedForm>
  );
}
