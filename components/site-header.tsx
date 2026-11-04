"use client";

import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

import { CartBadge } from "@/components/cart-badge";
import { useLocale } from "@/components/app-providers";
import { useToast } from "@/components/toast-provider";
import { LoadingButton } from "@/components/loading-button";
import { SearchDialog } from "@/components/search-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { copy, toggleLocale } = useLocale();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const wishlistCount = useWishlist((state) => state.items.length);
  const clearCart = useCart((state) => state.clear);

  async function handleSignOut() {
    setConfirmSignOut(false);
    clearCart();
    setSigningOut(true);
    toast(copy.ui.signedOutToast, "success");
    await signOut({ callbackUrl: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5d9d0]/80 bg-[#fbf8f4]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold tracking-[-0.06em]"
        >
          Abdelhakam<span className="text-[#b98768]"> Store</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#665a55] lg:flex">
          {copy.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[#2f2926]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={copy.search}
            className="rounded-full p-2.5 transition hover:bg-[#f2e7df]"
          >
            <Search size={19} strokeWidth={1.7} />
          </button>
          <CartBadge label={copy.cart} />
          <Link
            href="/wishlist"
            aria-label={copy.ui.wishlist}
            className="relative rounded-full p-2.5 transition hover:bg-[#f2e7df]"
          >
            <Heart size={19} strokeWidth={1.7} />
            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#a45742] px-1 text-[9px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            onClick={toggleLocale}
            className="hidden rounded-full border border-[#e5d9d0] px-3 py-2 text-xs font-medium transition hover:bg-white sm:block"
          >
            {copy.language}
          </button>
          {status === "loading" ? (
            <span className="mx-2 h-8 w-8 animate-pulse rounded-full bg-[#eadfd4]" />
          ) : session?.user ? (
            <div className="relative">
              <button
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
                aria-label="Account menu"
                className="rounded-full p-2.5 transition hover:bg-[#f2e7df]"
              >
                <UserRound size={19} strokeWidth={1.7} />
              </button>
              {accountOpen && (
                <div className="absolute end-0 top-full z-50 mt-1 w-52 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#e5d9d0] bg-white p-2 shadow-xl">
                  <p className="truncate px-3 py-2 text-xs text-[#8a7970]">
                    {session.user.email}
                  </p>
                  <Link
                    onClick={() => setAccountOpen(false)}
                    href="/profile"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-[#f7eee8]"
                  >
                    <UserRound size={15} /> {copy.ui.profile}
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      onClick={() => setAccountOpen(false)}
                      href="/admin"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-[#f7eee8]"
                    >
                      <ShieldCheck size={15} /> {copy.ui.admin}
                    </Link>
                  )}
                  <LoadingButton
                    loading={signingOut}
                    onClick={() => setConfirmSignOut(true)}
                    className="flex w-full justify-start items-center gap-2 rounded-xl px-3 py-2  text-sm text-red-700 hover:bg-red-50"
                  >
                    <LogOut size={15} /> {copy.ui.signOut}
                  </LoadingButton>
                </div>
              )}
            </div>
          ) : (
            <div className="ms-2 hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#d9c8bc] bg-white px-4 py-2 text-xs font-medium text-[#4d403a] shadow-sm transition hover:border-[#a27a62] hover:bg-[#f7eee8]"
              >
                <LogIn size={15} strokeWidth={1.8} />
                {copy.ui.login}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-full bg-[#2f2926] px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#5a3e35]"
              >
                {copy.ui.signUp}
              </Link>
            </div>
          )}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2.5 lg:hidden"
            aria-label="Open menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-[#e5d9d0] px-5 py-4 lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1 text-sm">
            {copy.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleLocale}
              className="rounded-xl px-3 py-3 text-left hover:bg-white"
            >
              {copy.language}
            </button>
            {!session?.user && status !== "loading" && (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#e5d9d0] pt-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c8bc] bg-white px-4 py-3 text-xs font-medium text-[#4d403a] transition hover:border-[#a27a62] hover:bg-[#f7eee8]"
                >
                  <LogIn size={15} strokeWidth={1.8} />
                  {copy.ui.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-[#2f2926] px-4 py-3 text-xs font-medium text-white transition hover:bg-[#5a3e35]"
                >
                  {copy.ui.signUp}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ConfirmDialog
        open={confirmSignOut}
        title={copy.ui.confirmSignOutTitle}
        message={copy.ui.confirmSignOutMessage}
        confirmLabel={copy.ui.confirm}
        cancelLabel={copy.ui.cancel}
        onConfirm={handleSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </header>
  );
}
