"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/lib/cart";

export function CartBadge({ label }: { label: string }) {
  const count = useCart((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  return (
    <Link href="/cart" aria-label={label} className="relative rounded-full p-2.5 transition hover:bg-[#f2e7df]">
      <ShoppingBag size={19} strokeWidth={1.7} />
      <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2f2926] px-1 text-[9px] text-white">
        {count}
      </span>
    </Link>
  );
}
