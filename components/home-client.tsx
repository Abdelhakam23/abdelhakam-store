"use client";

import { ArrowDown, ArrowRight, Leaf, Sparkles, Star } from "lucide-react";
import Link from "next/link";

import { useLocale } from "@/components/app-providers";
import { ProductCard, type ProductCardData } from "@/components/product-card";

type HomeProduct = ProductCardData;
type HomeCategory = { _id: string; name: string; slug: string; image: string };

export default function HomeClient({ products, categories }: { products: HomeProduct[]; categories: HomeCategory[] }) {
  const { copy } = useLocale();
  return (
    <main className="overflow-hidden">
      <section className="mx-auto grid max-w-[1440px] gap-4 px-5 pb-20 pt-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:pt-8">
        <div className="relative flex min-h-[580px] flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#2f2926] p-8 text-[#fbf8f4] sm:p-12 lg:min-h-[690px] lg:p-16">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-[#d8b8a0]/20" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full border border-[#d8b8a0]/20" />
          <div className="relative flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d8b8a0]"><Sparkles size={15} /> {copy.collectionLabel}</div>
          <div className="relative">
            <p className="mb-6 max-w-sm text-sm leading-7 text-[#ddc9bb]">{copy.collectionDescription}</p>
            <h1 className="max-w-2xl text-5xl leading-[0.96] tracking-[-0.07em] sm:text-7xl lg:text-8xl">{copy.heroTitle} <em className="font-serif font-normal text-[#d8b8a0]">{copy.heroAccent}</em> {copy.heroTitleEnd}</h1>
            <Link href="/shop" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#f0dfd1] px-6 py-3.5 text-sm text-[#2f2926] transition hover:bg-white">{copy.explore} <ArrowRight size={16} /></Link>
          </div>
          <div className="relative flex items-center justify-between border-t border-white/15 pt-5 text-xs uppercase tracking-[0.16em] text-[#c7a997]"><span>Abdelhakam Store / 2026</span><ArrowDown size={16} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="relative min-h-[280px] overflow-hidden rounded-[2.5rem] bg-[#eadfd4] p-8 sm:min-h-[335px] lg:p-12"><div className="absolute left-[43%] top-1/2 h-[78%] w-[38%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[48%] bg-[#c9a58f] shadow-[30px_30px_60px_rgba(92,72,48,0.2)]" /><div className="absolute bottom-8 left-8 text-sm text-[#766a5d] lg:left-12">{copy.season}</div><div className="absolute right-8 top-8 rounded-full bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#766a5d] backdrop-blur">01 / 04</div></div>
          <div className="flex min-h-[280px] flex-col justify-between rounded-[2.5rem] bg-[#f0dfd1] p-8 sm:min-h-[335px] lg:p-12"><Leaf className="text-[#a27a62]" size={28} strokeWidth={1.4} /><div><p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.promise}</p><h2 className="max-w-md text-3xl leading-tight tracking-[-0.05em] sm:text-4xl">{copy.promiseTitle} <em className="font-serif font-normal">{copy.promiseAccent}</em></h2></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mb-8 border-b border-[#e5d9d0] pb-5"><p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.curated}</p><h2 className="text-3xl tracking-[-0.04em] sm:text-4xl">{copy.ui.featuredCategories}</h2></div>
        {categories.length === 0 ? <div className="rounded-[2rem] border border-dashed border-[#d8c8bc] bg-[#fbf8f4] p-10 text-center text-sm text-[#8a7970]">{copy.ui.noCategories}</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <Link key={category._id} href={`/shop?category=${category._id}`} className="group interactive-card relative min-h-56 overflow-hidden rounded-[2rem] bg-[#eadfd4] p-6"><div className="absolute inset-0 bg-cover bg-center opacity-75 transition duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(47,41,38,.78)), url(${category.image})` }} /><div className="relative flex h-full flex-col justify-end text-white"><h3 className="text-2xl tracking-tight">{category.name}</h3><span className="mt-2 flex items-center gap-2 text-sm">{copy.ui.exploreCategory} <ArrowRight size={14} /></span></div></Link>)}</div>}
      </section>

      <section id="shop" className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between border-b border-[#e5d9d0] pb-5"><div><p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.curated}</p><h2 className="text-3xl tracking-[-0.04em] sm:text-4xl">{copy.newArrivals}</h2></div><Link href="/shop" className="flex items-center gap-2 text-sm">{copy.viewAll} <ArrowRight size={15} /></Link></div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">{products.length === 0 ? <div className="col-span-full rounded-[2rem] border border-dashed border-[#d8c8bc] bg-[#fbf8f4] p-10 text-center text-sm text-[#8a7970]">{copy.ui.noHomepageProducts}</div> : products.map((product, index) => <ProductCard key={product._id} product={product} animationIndex={index} />)}</div>
      </section>

      <section className="bg-[#f0ede7] px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><p className="mb-5 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.collectionLabel}</p><h2 className="max-w-lg text-4xl leading-tight tracking-[-0.06em] sm:text-6xl">{copy.ui.aboutTitle}</h2></div><div className="grid gap-8 sm:grid-cols-3">{[copy.ui.valueOne, copy.ui.valueTwo, copy.ui.valueThree].map((value, index) => <div key={value} className="border-t border-[#d8c8bc] pt-4"><span className="text-xs text-[#a27a62]">0{index + 1}</span><p className="mt-8 text-lg">{value}</p></div>)}</div></div></section>
      <section className="bg-[#2f2926] px-5 py-20 text-[#fbf8f4] sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 sm:flex-row sm:items-end"><div><p className="mb-5 text-xs uppercase tracking-[0.18em] text-[#c7a997]">{copy.promise}</p><h2 className="max-w-xl text-4xl leading-tight tracking-[-0.05em] sm:text-6xl">{copy.promiseTitle} <em className="font-serif font-normal text-[#d8b8a0]">{copy.promiseAccent}</em></h2></div><div className="max-w-xs text-sm leading-6 text-[#c7a997]"><div className="mb-4 flex gap-1 text-[#f0dfd1]">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div><p>“{copy.quote}”</p><p className="mt-4 text-xs uppercase tracking-[0.14em]">— Clara M.</p></div></div></section>
    </main>
  );
}
