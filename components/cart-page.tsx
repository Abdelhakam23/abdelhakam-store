"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "@/lib/cart";
import { useLocale } from "@/components/app-providers";
import { useToast } from "@/components/toast-provider";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useState } from "react";

export function CartPage() {
  const items = useCart((state) => state.items);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const clear = useCart((state) => state.clear);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { copy } = useLocale();
  const { toast } = useToast();
  const [removeKey, setRemoveKey] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mb-10 border-b border-[#e5d9d0] pb-6">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.ui.bag}</p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl tracking-[-0.06em] sm:text-6xl">{copy.cart}</h1>
          {items.length > 0 && <button type="button" onClick={() => setClearConfirm(true)} className="rounded-full border border-[#d9c8bc] px-4 py-2 text-sm text-[#a45742] transition hover:border-[#a45742] hover:bg-[#f7eee8]">{copy.ui.clearCart}</button>}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[#d8c8bc] bg-[#fbf8f4] p-12 text-center">
          <p className="text-lg">{copy.ui.emptyBag}</p>
          <Link href="/shop" className="mt-5 inline-flex rounded-full bg-[#2f2926] px-6 py-3 text-sm text-white">{copy.ui.continueShopping}</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div key={item.variantKey ?? item.productId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} layout className="flex flex-col gap-4 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <Link href={`/shop/${item.slug}`} aria-label={item.title} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#eadfd4]">
                    {item.image ? <div className="h-full w-full bg-cover bg-center transition duration-300 hover:scale-105" style={{ backgroundImage: `url(${item.image})` }} /> : <div className="mx-auto mt-4 h-12 w-12 rounded-[45%] bg-[#c9a58f]" />}
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/shop/${item.slug}`} className="block truncate font-medium hover:text-[#a45742]">{item.title}</Link>
                    <p className="mt-1 text-sm text-[#665a55]">${item.price}</p>
                    {item.selectedAttributes && <p className="mt-1 truncate text-xs text-[#8a7970]">{Object.entries(item.selectedAttributes).map(([name, value]) => `${name}: ${value}`).join(" · ")}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <button onClick={() => updateQuantity(item.variantKey ?? item.productId, item.quantity - 1)} className="h-8 w-8 rounded-full border">−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantKey ?? item.productId, item.quantity + 1)} className="h-8 w-8 rounded-full border">+</button>
                  <button onClick={() => setRemoveKey(item.variantKey ?? item.productId)} className="ml-2 text-sm underline">{copy.ui.remove}</button>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
          <aside className="h-fit rounded-2xl bg-[#eadfd4] p-5">
            <div className="flex justify-between"><span>{copy.ui.subtotal}</span><strong>${total.toFixed(2)}</strong></div>
            <Link href="/checkout" className="mt-5 block rounded-full bg-[#2f2926] px-5 py-3 text-center text-sm text-white">{copy.ui.continueCheckout}</Link>
          </aside>
        </div>
      )}
      <ConfirmDialog open={removeKey !== null} title={copy.ui.confirmDeleteTitle} message={copy.ui.confirmDeleteMessage} confirmLabel={copy.ui.confirm} cancelLabel={copy.ui.cancel} onConfirm={() => { if (removeKey) { removeItem(removeKey); toast(copy.ui.remove, "delete"); } setRemoveKey(null); }} onCancel={() => setRemoveKey(null)} />
      <ConfirmDialog open={clearConfirm} title={copy.ui.clearCartTitle} message={copy.ui.clearCartMessage} confirmLabel={copy.ui.confirm} cancelLabel={copy.ui.cancel} onConfirm={() => { clear(); toast(copy.ui.cartClearedToast, "delete"); setClearConfirm(false); }} onCancel={() => setClearConfirm(false)} />
    </main>
  );
}
