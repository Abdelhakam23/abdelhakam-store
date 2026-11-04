"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useCart } from "@/lib/cart";
import { useLocale } from "@/components/app-providers";
import { useToast } from "@/components/toast-provider";
import { LoadingButton } from "@/components/loading-button";
import { ValidatedForm } from "@/components/validated-form";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const clear = useCart((state) => state.clear);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { copy } = useLocale();
  const { toast } = useToast();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedAttributes: item.selectedAttributes,
          })),
          paymentMethod: "card",
          shippingAddress: Object.fromEntries(form),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        item?: { _id: string };
      };
      if (!response.ok || !payload.item)
        throw new Error(payload.error ?? "Unable to create order");
      clear();
      toast(copy.ui.orderPlacedToast, "success");
      router.push(`/profile?order=${payload.item._id}`);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create order";
      setError(message);
      toast(message, "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <ValidatedForm onSubmit={submit} className="flex max-w-xl flex-col gap-4">
      {(
        [
          "fullName",
          "line1",
          "city",
          "state",
          "postalCode",
          "country",
          "phone",
        ] as const
      ).map((field) => (
        <input
          key={field}
          name={field}
          required={field !== "phone"}
          placeholder={field === "fullName" ? copy.ui.fullName : field}
          className="rounded-xl border bg-white p-3"
        />
      ))}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <LoadingButton
        loading={pending}
        disabled={items.length === 0}
        className="rounded-full bg-[#2f2926] px-5 py-3 text-white disabled:opacity-50"
      >
        {pending ? copy.ui.pleaseWait : copy.ui.checkout}
      </LoadingButton>
    </ValidatedForm>
  );
}
