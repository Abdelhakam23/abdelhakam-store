"use client";

import Link from "next/link";
import { AtSign, Globe, Mail, Send } from "lucide-react";
import { useLocale } from "@/components/app-providers";

export function SiteFooter() {
  const { copy } = useLocale();
  return (
    <footer className="mt-auto border-t border-[#e5d9d0] bg-[#f2ebe4] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-xl font-semibold tracking-[-0.06em]">Abdelhakam<span className="text-[#b98768]"> Store</span></Link>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[#8a7970]">{copy.collectionDescription}</p>
          <div className="mt-6 flex gap-3">
            <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#cbd3ca] p-2.5 transition hover:bg-white"><AtSign size={16} /></a>
            <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#cbd3ca] p-2.5 transition hover:bg-white"><Globe size={16} /></a>
            <a aria-label="Twitter" href="https://x.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#cbd3ca] p-2.5 transition hover:bg-white"><Send size={16} /></a>
            <a aria-label="Email" href="mailto:support@abdelhakam-store.example" className="rounded-full border border-[#cbd3ca] p-2.5 transition hover:bg-white"><Mail size={16} /></a>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[#a27a62]">{copy.ui.shop}</p>
          <div className="flex flex-col gap-3 text-sm text-[#665a55]">
            <Link href="/shop">{copy.ui.shop}</Link>
            <Link href="/cart">{copy.ui.bag}</Link>
            <Link href="/wishlist">{copy.ui.wishlist}</Link>
            <Link href="/profile">{copy.ui.account}</Link>
            <Link href="/about">{copy.ui.about}</Link>
            {copy.nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[#a27a62]">{copy.ui.customerCare}</p>
          <div className="flex flex-col gap-3 text-sm text-[#665a55]">
            <Link href="/contact">{copy.ui.contact}</Link>
            <Link href="/faqs">{copy.ui.faqs}</Link>
            <Link href="/privacy-policy">{copy.ui.privacy}</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1440px] border-t border-[#e5d9d0] pt-5 text-xs text-[#a27a62]">© 2026 Abdelhakam Store. {copy.ui.allRights}</div>
    </footer>
  );
}
