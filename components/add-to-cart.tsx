"use client";

import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";

import { useCart } from "@/lib/cart";
import { useToast } from "@/components/toast-provider";
import { useLocale } from "@/components/app-providers";
import { LoadingButton } from "@/components/loading-button";
import { useWishlist } from "@/lib/wishlist";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  getSelectableProductAttributes,
} from "@/lib/product-options";

export function AddToCart({
  productId,
  slug,
  title,
  price,
  stock,
  image,
  attributes = [],
}: {
  productId: string;
  slug: string;
  title: string;
  price: number;
  stock: number;
  image?: string;
  attributes?: { name: string; values: string[] }[];
}) {
  const addItem = useCart((state) => state.addItem);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();
  const { copy } = useLocale();
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectionError, setSelectionError] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const selectableAttributes = getSelectableProductAttributes(attributes);
  const toggleWishlist = useWishlist((state) => state.toggleItem);
  const isWishlisted = useWishlist((state) => state.items.some((item) => item._id === productId));
  const variantKey = `${productId}:${Object.entries(selectedAttributes).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => `${name}=${value}`).join("|")}`;

  return (
    <div className="w-full">
      {selectableAttributes.length > 0 && (
        <div className="mb-6 space-y-4">
          {selectableAttributes.map((attribute) => (
            <fieldset key={attribute.name}>
              <legend className="mb-2 text-sm font-medium">{attribute.name}</legend>
              <div className="flex flex-wrap gap-2">
                {attribute.values.map((value) => {
                  const selected = selectedAttributes[attribute.name] === value;
                  return (
                    <button key={value} type="button" onClick={() => { setSelectedAttributes((current) => ({ ...current, [attribute.name]: value })); setSelectionError(false); }} className={`rounded-full border px-4 py-2 text-sm transition ${selected ? "border-[#2f2926] bg-[#2f2926] text-white" : "border-[#d9c8bc] bg-white hover:border-[#a27a62]"}`}>
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
          {selectionError && <p role="alert" className="text-sm text-red-700">{copy.ui.selectProductOptions}</p>}
        </div>
      )}
      <div className="mb-3 flex items-center justify-between rounded-2xl bg-[#f7eee8] px-4 py-3">
        <span className="text-sm">{copy.ui.quantity}</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setQuantity((current) => Math.max(0, current - 1))} disabled={quantity === 0} className="flex h-9 w-9 items-center justify-center rounded-full border bg-white disabled:opacity-40"><Minus size={15} /></button>
          <span className="min-w-5 text-center">{quantity}</span>
          <button type="button" onClick={() => setQuantity((current) => Math.min(stock, current + 1))} disabled={quantity >= stock} className="flex h-9 w-9 items-center justify-center rounded-full border bg-white disabled:opacity-40"><Plus size={15} /></button>
        </div>
      </div>
      <LoadingButton
      onClick={() => {
        const missingSelection = selectableAttributes.some((attribute) => !selectedAttributes[attribute.name]);
        if (missingSelection) {
          setSelectionError(true);
          return;
        }
        if (quantity === 0) return;
        setAdding(true);
        addItem({ productId, variantKey, slug, title, price, quantity, image, selectedAttributes });
        setQuantity(0);
        setSelectedAttributes({});
        setSelectionError(false);
        toast(copy.ui.addedToast, "success");
        window.setTimeout(() => setAdding(false), 450);
      }}
      loading={adding}
      disabled={!selectableAttributes.every((attribute) => selectedAttributes[attribute.name]) || quantity === 0}
      className="w-full rounded-full bg-[#2f2926] px-6 py-3 text-sm text-white transition hover:bg-[#5a3e35] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {copy.ui.addToBag}
      </LoadingButton>
      <button type="button" onClick={() => { if (isWishlisted) setConfirmRemove(true); else { toggleWishlist({ _id: productId, slug, title, price, stock: 1, image, attributes }); toast(copy.ui.wishlistToast, "success"); } }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#d9c8bc] bg-white px-6 py-3 text-sm transition hover:border-[#a27a62] hover:bg-[#f7eee8]">
        <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        {isWishlisted ? copy.ui.savedItems : copy.ui.wishlist}
      </button>
      <ConfirmDialog open={confirmRemove} title={copy.ui.confirmDeleteTitle} message={copy.ui.confirmWishlistMessage} confirmLabel={copy.ui.confirm} cancelLabel={copy.ui.cancel} onConfirm={() => { toggleWishlist({ _id: productId, slug, title, price, stock: 1, image, attributes }); toast(copy.ui.removedFromWishlist, "delete"); setConfirmRemove(false); }} onCancel={() => setConfirmRemove(false)} />
    </div>
  );
}
