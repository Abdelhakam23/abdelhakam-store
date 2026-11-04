"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export function CartSessionSync() {
  const { data: session, status } = useSession();
  const clear = useCart((state) => state.clear);
  const syncOwner = useCart((state) => state.syncOwner);
  const replaceItems = useCart((state) => state.replaceItems);
  const items = useCart((state) => state.items);
  const ownerId = useCart((state) => state.ownerId);
  const loadedOwner = useRef<string | null>(null);
  const hydratedOwner = useRef<string | null>(null);
  const syncing = useRef(false);
  const wishlistItems = useWishlist((state) => state.items);
  const wishlistOwnerId = useWishlist((state) => state.ownerId);
  const replaceWishlist = useWishlist((state) => state.replaceItems);
  const wishlistHydratedOwner = useRef<string | null>(null);
  const wishlistSyncing = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    const userId = session?.user?.id ?? null;
    if (userId) {
      if (loadedOwner.current !== userId) {
        loadedOwner.current = userId;
        hydratedOwner.current = null;
        wishlistHydratedOwner.current = null;
        syncOwner(userId);
        void fetch("/api/cart")
          .then((response) => {
            if (!response.ok) throw new Error("Could not load cart");
            return response.json() as Promise<{ items?: typeof items }>;
          })
          .then((payload) => {
            hydratedOwner.current = userId;
            replaceItems(payload.items ?? [], userId);
          })
          .catch(() => {
            hydratedOwner.current = userId;
            replaceItems([], userId);
          });
        void fetch("/api/wishlist")
          .then((response) => {
            if (!response.ok) throw new Error("Could not load wishlist");
            return response.json() as Promise<{ items?: typeof wishlistItems }>;
          })
          .then((payload) => {
            wishlistHydratedOwner.current = userId;
            replaceWishlist(payload.items ?? [], userId);
          })
          .catch(() => {
            wishlistHydratedOwner.current = userId;
            replaceWishlist([], userId);
          });
      }
    } else {
      loadedOwner.current = null;
      hydratedOwner.current = null;
      wishlistHydratedOwner.current = null;
      clear();
      replaceWishlist([]);
    }
  }, [clear, replaceItems, replaceWishlist, session?.user?.id, status, syncOwner]);

  useEffect(() => {
    if (!ownerId || hydratedOwner.current !== ownerId || syncing.current) return;
    const timer = window.setTimeout(async () => {
      syncing.current = true;
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
      } finally {
        syncing.current = false;
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [items, ownerId]);

  useEffect(() => {
    if (!wishlistOwnerId || wishlistHydratedOwner.current !== wishlistOwnerId || wishlistSyncing.current) return;
    const timer = window.setTimeout(async () => {
      wishlistSyncing.current = true;
      try {
        await fetch("/api/wishlist", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: wishlistItems.map((item) => item._id) }),
        });
      } finally {
        wishlistSyncing.current = false;
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [wishlistItems, wishlistOwnerId]);

  return null;
}
