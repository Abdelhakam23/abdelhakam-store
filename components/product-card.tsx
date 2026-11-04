"use client";

import { Heart, Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { useLocale } from "@/components/app-providers";
import { LoadingButton } from "@/components/loading-button";
import { useToast } from "@/components/toast-provider";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  getSelectableProductAttributes,
  normalizeProductAttributes,
} from "@/lib/product-options";

export type ProductCardData = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  discountPrice?: number;
  stock: number;
  image?: string;
  attributes?: { name: string; values: string[] }[];
};

export function ProductCard({ product, compact = false, animationIndex = 0 }: { product: ProductCardData; compact?: boolean; animationIndex?: number }) {
  const { copy } = useLocale();
  const { toast } = useToast();
  const addItem = useCart((state) => state.addItem);
  const toggleItem = useWishlist((state) => state.toggleItem);
  const [adding, setAdding] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const productAttributes = normalizeProductAttributes(product.attributes);
  const selectableAttributes = getSelectableProductAttributes(product.attributes);
  const isWishlisted = useWishlist((state) => state.items.some((item) => item._id === product._id));
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;
  const visibleAttributes = productAttributes.slice(0, compact ? 1 : 2);
  const hasAllOptions = selectableAttributes.every((attribute) => selectedAttributes[attribute.name]);
  const variantKey = `${product._id}:${Object.entries(selectedAttributes).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => `${name}=${value}`).join("|")}`;

  return (
    <motion.article initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.45, delay: Math.min(animationIndex * 0.06, 0.3), ease: "easeOut" }} className="group min-w-0">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_8px_24px_rgba(47,41,38,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(47,41,38,0.12)]">
        <Link href={`/shop/${product.slug}`} aria-label={product.title} className="absolute inset-0 z-10" />
        <div className="relative aspect-[4/5] overflow-hidden bg-[#eadfd4]">
          {product.image ? <div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${product.image})` }} /> : <div className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-[45%] bg-[#c9a58f] shadow-[12px_18px_25px_rgba(73,48,38,0.16)] transition duration-500 group-hover:scale-110 group-hover:rotate-3" />}
          {hasDiscount && <span className="absolute left-4 top-4 rounded-full bg-[#a45742] px-3 py-1.5 text-xs font-medium text-white">{copy.ui.sale}</span>}
          <button type="button" onClick={(event) => { event.stopPropagation(); if (isWishlisted) setConfirmRemove(true); else { toggleItem(product); toast(copy.ui.wishlistToast, "success"); } }} aria-label={`${copy.wishlist}: ${product.title}`} className="absolute right-4 top-4 z-30 rounded-full bg-white/85 p-3 backdrop-blur transition hover:scale-105 hover:bg-white"><Heart size={16} strokeWidth={1.6} fill={isWishlisted ? "currentColor" : "none"} /></button>
          <span className="absolute bottom-4 left-4 z-20 rounded-full bg-white/85 px-3 py-1.5 text-xs text-[#665a55] backdrop-blur">{product.stock} {copy.ui.inStock}</span>
        </div>
        <div className="relative z-20 p-4">
          <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><p className="text-[11px] uppercase tracking-[0.16em] text-[#a27a62]">{copy.ui.editLabel}</p><h3 className="mt-1 truncate text-[15px]">{product.title}</h3></div>
          <div className="shrink-0 text-right"><p className={`text-sm ${hasDiscount ? "font-medium text-[#a45742]" : ""}`}>${product.discountPrice ?? product.price}</p>{hasDiscount && <p className="text-xs text-[#8a7970] line-through">${product.price}</p>}</div>
          </div>
          {visibleAttributes.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{visibleAttributes.map((attribute) => <span key={attribute.name} className="rounded-full bg-[#f2ebe4] px-2.5 py-1 text-[10px] text-[#76645b]">{attribute.name}: {attribute.values.slice(0, 2).join(" / ")}</span>)}</div>}
          {!pickerOpen ? (
            <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setPickerOpen(true); }} disabled={product.stock === 0} className="mt-4 w-full rounded-full bg-[#2f2926] px-4 py-3 text-center text-xs text-white transition hover:bg-[#5a3e35] disabled:cursor-not-allowed disabled:opacity-50">{copy.ui.addToBag}</button>
          ) : (
            <div className="mt-4 space-y-3 rounded-2xl bg-[#f7eee8] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{copy.ui.addToBag}</span>
                <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setPickerOpen(false); setQuantity(0); setSelectedAttributes({}); }} aria-label={copy.ui.cancel} className="rounded-full p-1.5 text-[#665a55] hover:bg-white">
                  <X size={15} />
                </button>
              </div>
              {selectableAttributes.map((attribute) => (
                <fieldset key={attribute.name}>
                  <legend className="mb-1.5 text-[11px] font-medium">{attribute.name}</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {attribute.values.map((value) => <button key={value} type="button" onClick={() => setSelectedAttributes((current) => ({ ...current, [attribute.name]: value }))} className={`rounded-full border px-2.5 py-1 text-[11px] ${selectedAttributes[attribute.name] === value ? "border-[#2f2926] bg-[#2f2926] text-white" : "border-[#d9c8bc] bg-white hover:border-[#a27a62]"}`}>{value}</button>)}
                  </div>
                </fieldset>
              ))}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-[#665a55]">{copy.ui.quantity}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(0, current - 1))} disabled={quantity === 0} className="flex h-7 w-7 items-center justify-center rounded-full border bg-white disabled:opacity-40"><Minus size={13} /></button>
                  <span className="min-w-5 text-center text-sm">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} disabled={quantity >= product.stock} className="flex h-7 w-7 items-center justify-center rounded-full border bg-white disabled:opacity-40"><Plus size={13} /></button>
                </div>
              </div>
              <LoadingButton type="button" loading={adding} disabled={!hasAllOptions || quantity === 0} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setAdding(true); addItem({ productId: product._id, variantKey, slug: product.slug, title: product.title, price: product.discountPrice ?? product.price, quantity, image: product.image, selectedAttributes }); toast(copy.ui.addedToast, "success"); setQuantity(0); setSelectedAttributes({}); setPickerOpen(false); window.setTimeout(() => setAdding(false), 450); }} className="w-full rounded-full bg-[#2f2926] px-4 py-2.5 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50">{copy.ui.addToBag}</LoadingButton>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog open={confirmRemove} title={copy.ui.confirmDeleteTitle} message={copy.ui.confirmWishlistMessage} confirmLabel={copy.ui.confirm} cancelLabel={copy.ui.cancel} onConfirm={() => { toggleItem(product); toast(copy.ui.removedFromWishlist, "delete"); setConfirmRemove(false); }} onCancel={() => setConfirmRemove(false)} />
    </motion.article>
  );
}
