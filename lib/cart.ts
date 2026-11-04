import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  variantKey?: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  selectedAttributes?: Record<string, string>;
};

type CartState = {
  items: CartItem[];
  ownerId?: string;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  syncOwner: (ownerId: string) => void;
  replaceItems: (items: CartItem[], ownerId?: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      ownerId: undefined,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((entry) => entry.productId === item.productId && entry.variantKey === item.variantKey);
          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.productId === item.productId && entry.variantKey === item.variantKey
                  ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, 99) }
                  : entry,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.variantKey !== productId && item.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((item) =>
                  (item.variantKey === productId || item.productId === productId) ? { ...item, quantity: Math.min(quantity, 99) } : item,
                )
              : state.items.filter((item) => item.variantKey !== productId && item.productId !== productId),
        })),
      clear: () => set({ items: [], ownerId: undefined }),
      syncOwner: (ownerId) => set((state) => state.ownerId === ownerId ? state : { items: [], ownerId }),
      replaceItems: (items, ownerId) => set({ items, ownerId }),
    }),
    { name: "abdelhakam-store-cart" },
  ),
);
