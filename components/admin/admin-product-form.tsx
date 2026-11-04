"use client";

import { useState } from "react";

import { useLocale } from "@/components/app-providers";
import { LoadingButton } from "@/components/loading-button";
import { useToast } from "@/components/toast-provider";
import { ValidatedForm } from "@/components/validated-form";

type Category = { _id: string; name: string };
export type ProductSummary = { _id: string; title: string; slug: string; description?: string; price: number; discountPrice?: number; stock: number; category?: string; images?: string[]; attributes?: unknown[] };

export function AdminProductForm({
  categories,
  initialProduct,
  onCreated,
  onUpdated,
  onCancel,
}: {
  categories: Category[];
  initialProduct?: ProductSummary;
  onCreated?: (product: ProductSummary) => void;
  onUpdated?: (product: ProductSummary) => void;
  onCancel?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const { copy } = useLocale();
  const { toast } = useToast();

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");
    const rawAttributes = String(formData.get("attributes") || "").trim();
    let attributes: unknown[] = [];
    try {
      attributes = rawAttributes ? JSON.parse(rawAttributes) : [];
    } catch {
      setMessage(copy.ui.attributes);
      toast(copy.ui.attributes, "error");
      setPending(false);
      return;
    }
    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      discountPrice: formData.get("discountPrice") ? Number(formData.get("discountPrice")) : undefined,
      stock: Number(formData.get("stock")),
      category: formData.get("category"),
      images: String(formData.get("images") || "").split(",").map((image) => image.trim()).filter(Boolean),
      attributes,
    };
    try {
      const response = await fetch(initialProduct ? `/api/products/${initialProduct._id}` : "/api/products", {
        method: initialProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; item?: ProductSummary };
      if (!response.ok || !result.item) throw new Error(result.error || "Could not save product");
      setMessage(initialProduct ? copy.ui.productUpdatedToast : copy.ui.productCreatedToast);
      toast(initialProduct ? copy.ui.productUpdatedToast : copy.ui.productCreatedToast, "success");
      if (initialProduct) {
        onUpdated?.(result.item);
      } else {
        onCreated?.(result.item);
      }
      if (!initialProduct) (document.querySelector("#product-form") as HTMLFormElement)?.reset();
      onCancel?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : copy.ui.updateFailedToast;
      setMessage(errorMessage);
      toast(errorMessage, "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <ValidatedForm id="product-form" action={submit} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
      <input name="title" required defaultValue={initialProduct?.title} placeholder={copy.ui.title} className="rounded-xl border p-3" />
      <input name="slug" required defaultValue={initialProduct?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="product-slug" className="rounded-xl border p-3" />
      <textarea name="description" required defaultValue={initialProduct?.description} placeholder={copy.ui.description} className="min-h-32 rounded-xl border p-3 md:col-span-2" />
      <input name="price" required defaultValue={initialProduct?.price} type="number" min="0" step="0.01" placeholder={copy.ui.price} className="rounded-xl border p-3" />
      <input name="discountPrice" defaultValue={initialProduct?.discountPrice} type="number" min="0" step="0.01" placeholder={copy.ui.discountPrice} className="rounded-xl border p-3" />
      <input name="stock" required defaultValue={initialProduct?.stock} type="number" min="0" placeholder={copy.ui.stock} className="rounded-xl border p-3" />
      <select name="category" required defaultValue={initialProduct?.category ?? ""} className="rounded-xl border bg-white p-3">
        <option value="">Select category</option>
        {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
      </select>
      <input name="images" required defaultValue={initialProduct?.images?.join(", ")} placeholder={copy.ui.imageUrls} className="rounded-xl border p-3 md:col-span-2" />
      <textarea name="attributes" defaultValue={initialProduct?.attributes ? JSON.stringify(initialProduct.attributes) : ""} placeholder={copy.ui.attributes} className="min-h-24 rounded-xl border p-3 md:col-span-2" />
      <div className="flex items-center gap-4 md:col-span-2">
        <LoadingButton loading={pending} className="rounded-full bg-[#2f2926] px-6 py-3 text-sm text-white disabled:opacity-50">{pending ? (initialProduct ? copy.ui.updatingProduct : copy.ui.addingProduct) : initialProduct ? copy.ui.updateProduct : copy.ui.createProduct}</LoadingButton>
        {initialProduct && <button type="button" onClick={onCancel} className="rounded-full border px-6 py-3 text-sm">{copy.ui.cancel}</button>}
        {message && <p role="status" className="text-sm text-[#665a55]">{message}</p>}
      </div>
    </ValidatedForm>
  );
}
