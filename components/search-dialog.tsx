"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Search, X } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useLocale } from "@/components/app-providers";
import type { ProductCardData } from "@/components/product-card";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

type SearchPayload = { items?: Parameters<typeof toProduct>[0][] };

const SEARCH_CACHE_TTL = 60_000;
const searchCache = new Map<string, { expiresAt: number; payload: SearchPayload }>();
const searchRequests = new Map<string, Promise<SearchPayload>>();

async function searchProducts(query: string) {
  const cached = searchCache.get(query);
  if (cached && cached.expiresAt > Date.now()) return cached.payload;
  if (cached) searchCache.delete(query);

  const existingRequest = searchRequests.get(query);
  if (existingRequest) return existingRequest;

  const request = fetch(
    `/api/products?${new URLSearchParams({ ...(query ? { search: query } : {}), page: "1" })}`,
  )
    .then(async (response) => {
      if (!response.ok) throw new Error("Search request failed");
      return (await response.json()) as SearchPayload;
    })
    .then((payload) => {
      searchCache.set(query, { expiresAt: Date.now() + SEARCH_CACHE_TTL, payload });
      if (searchCache.size > 50) {
        const oldestKey = searchCache.keys().next().value;
        if (oldestKey) searchCache.delete(oldestKey);
      }
      return payload;
    })
    .finally(() => searchRequests.delete(query));

  searchRequests.set(query, request);
  return request;
}

function toProduct(product: {
  _id: string;
  slug: string;
  title: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images?: string[];
  attributes?: { name: string; values: string[] }[];
}): ProductCardData {
  return {
    _id: product._id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    discountPrice: product.discountPrice,
    stock: product.stock,
    image: product.images?.[0],
    attributes: product.attributes,
  };
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const { copy } = useLocale();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setFailed(false);
      try {
        const search = query.trim();
        const payload = await searchProducts(search);
        if (!active) return;
        setProducts((payload.items ?? []).map(toProduct));
        setHasSearched(Boolean(search));
      } catch {
        if (!active) return;
        setProducts([]);
        setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    }, 5);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [open, query, retryCount]);

  function handleClose() {
    setQuery("");
    setProducts([]);
    setHasSearched(false);
    setFailed(false);
    setRetryCount(0);
    onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2f2926]/35 px-4 py-6 backdrop-blur-sm sm:px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={copy.search}
            className="flex max-h-[min(720px,calc(100vh-3rem))] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-[#e5d9d0] bg-[#fbf8f4] shadow-2xl"
          >
            <div className="border-b border-[#e5d9d0] p-4 sm:p-6">
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9c8bc] bg-white px-4 py-3 focus-within:border-[#b98768] focus-within:ring-4 focus-within:ring-[#b98768]/10">
                <Search size={20} className="shrink-0 text-[#8a7970]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.ui.searchPlaceholder}
                  aria-label={copy.search}
                  className="min-w-0 flex-1 !border-0 bg-transparent p-0 text-base !outline-none !shadow-none !ring-0 focus:!border-0 focus:!outline-none focus:!shadow-none focus:!ring-0 focus-visible:!outline-none"
                />
                {loading && <LoaderCircle size={18} className="shrink-0 animate-spin text-[#b98768]" />}
                <button type="button" onClick={handleClose} aria-label={copy.ui.searchClose} className="rounded-full p-1.5 text-[#665a55] hover:bg-[#f2e7df]">
                  <X size={18} />
                </button>
              </div>
              <p className="mt-3 text-xs text-[#8a7970]">{copy.ui.searchHint}</p>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6">
              {failed ? (
                <div className="rounded-2xl bg-white p-8 text-center">
                  <p className="text-sm text-[#a45742]">{copy.ui.searchError}</p>
                  <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mt-4 rounded-full bg-[#2f2926] px-5 py-2.5 text-xs text-white hover:bg-[#5a3e35]">{copy.ui.searchTryAgain}</button>
                </div>
              ) : loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[0, 1, 2].map((item) => <div key={item} className="aspect-[4/5] animate-pulse rounded-2xl bg-[#eadfd4]" />)}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg tracking-tight">{hasSearched ? copy.ui.searchResults : copy.ui.searchSuggestions}</h2>
                    <span className="text-xs text-[#8a7970]">{products.length} {copy.ui.products}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {products.slice(0, 6).map((product) => (
                      <Link key={product._id} href={`/shop/${product.slug}`} onClick={handleClose} className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                        <div className="aspect-square overflow-hidden bg-[#eadfd4]">
                          {product.image ? <div className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${product.image})` }} /> : <div className="mx-auto mt-[20%] h-3/5 w-3/5 rounded-[45%] bg-[#c9a58f]" />}
                        </div>
                        <div className="p-3">
                          <p className="truncate text-sm">{product.title}</p>
                          <p className="mt-1 text-xs text-[#8a7970]">${product.discountPrice ?? product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href={`/shop${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`} onClick={handleClose} className="mt-5 block rounded-full border border-[#d9c8bc] bg-white py-3 text-center text-sm transition hover:border-[#b98768] hover:bg-[#f7eee8]">{copy.ui.searchViewAll}</Link>
                </>
              ) : (
                <div className="rounded-2xl bg-white p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2e7df] text-[#a27a62]"><Search size={24} /></div>
                  <h2 className="mt-4 text-lg">{hasSearched ? copy.ui.searchNoResults : copy.ui.searchNoProducts}</h2>
                  <p className="mt-2 text-sm text-[#8a7970]">{hasSearched ? copy.ui.searchNoResultsHint : copy.ui.searchSuggestionsHint}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
