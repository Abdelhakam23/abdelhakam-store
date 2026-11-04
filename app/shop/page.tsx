import { connection } from "next/server";
import { Types } from "mongoose";

import { serializeDocument } from "@/lib/serialize";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerLocale, messages } from "@/lib/i18n";
import { ProductCard } from "@/components/product-card";
import { createProductSearchFilter } from "@/lib/product-search";

export const instant = false;

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  await connection();
  await connectToDatabase();
  const { category, search } = await searchParams;
  const filter: Record<string, unknown> = category && Types.ObjectId.isValid(category) ? { category, stock: { $gt: 0 } } : { stock: { $gt: 0 } };
  if (search?.trim()) Object.assign(filter, createProductSearchFilter(search));
  const products = serializeDocument(
    await Product.find(filter).sort({ createdAt: -1 }).limit(24).lean(),
  );
  const copy = messages[await getServerLocale()];

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mb-10 flex items-end justify-between border-b border-[#e5d9d0] pb-5">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.ui.collection}</p>
          <h1 className="text-4xl tracking-tight">{copy.ui.shopAll}</h1>
        </div>
        <span className="text-sm text-[#8a7970]">{products.length} {copy.ui.products}</span>
      </div>
      {products.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-[#665a55]">{copy.ui.noProducts}</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product._id.toString()} animationIndex={index} product={{ _id: product._id.toString(), slug: product.slug, title: product.title, price: product.price, discountPrice: product.discountPrice, stock: product.stock, image: product.images[0], attributes: product.attributes }} />
          ))}
        </div>
      )}
    </main>
  );
}
