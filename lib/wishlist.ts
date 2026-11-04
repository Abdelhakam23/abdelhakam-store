import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ProductCardData } from "@/components/product-card";

type WishlistState = {
  items: ProductCardData[];
  ownerId?: string;
  toggleItem: (item: ProductCardData) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  replaceItems: (items: ProductCardData[], ownerId?: string) => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      ownerId: undefined,
      toggleItem: (item) =>
        set((state) => ({
          items: state.items.some((entry) => entry._id === item._id)
            ? state.items.filter((entry) => entry._id !== item._id)
            : [...state.items, item],
        })),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item._id !== productId) })),
      hasItem: (productId) => get().items.some((item) => item._id === productId),
      replaceItems: (items, ownerId) => set({ items, ownerId }),
    }),
    { name: "abdelhakam-store-wishlist" },
  ),
);
