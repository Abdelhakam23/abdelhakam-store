"use client";

import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { useLocale } from "@/components/app-providers";
import { useWishlist } from "@/lib/wishlist";

export function WishlistPage() {
  const { copy } = useLocale();
  const items = useWishlist((state) => state.items);

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mb-10 border-b border-[#e5d9d0] pb-6">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.ui.savedItems}</p>
        <h1 className="text-4xl tracking-[-0.06em] sm:text-6xl">{copy.ui.wishlist}</h1>
      </div>
      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[#d8c8bc] bg-[#fbf8f4] p-12 text-center">
          <p className="text-lg">{copy.ui.emptyWishlist}</p>
          <Link href="/shop" className="mt-5 inline-flex rounded-full bg-[#2f2926] px-6 py-3 text-sm text-white">{copy.ui.continueShopping}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {items.map((item, index) => <ProductCard key={item._id} product={item} animationIndex={index} />)}
        </div>
      )}
    </main>
  );
}
