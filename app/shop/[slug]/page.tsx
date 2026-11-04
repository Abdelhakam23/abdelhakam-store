import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { AddToCart } from "@/components/add-to-cart";
import { ProductGallery } from "@/components/product-gallery";
import { connectToDatabase } from "@/lib/db";
import { serializeDocument } from "@/lib/serialize";
import { Product } from "@/models/Product";
import "@/models/Category";
import { getServerLocale, messages } from "@/lib/i18n";
import { normalizeProductAttributes } from "@/lib/product-options";

export const instant = false;

async function getProduct(slug: string) {
  await connection();
  await connectToDatabase();
  return serializeDocument(
    await Product.findOne({ slug }).populate("category", "name slug").lean(),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product
    ? { title: product.title, description: product.description }
    : { title: "Product not found" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const copy = messages[await getServerLocale()];
  const currentPrice = product.discountPrice ?? product.price;
  const productAttributes = normalizeProductAttributes(product.attributes);

  return (
    <main className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 md:grid-cols-2">
      <ProductGallery images={product.images} title={product.title} />
      <div className="flex flex-col justify-center">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#a27a62]">
          {product.category?.name ?? "Collection"}
        </p>
        <h1 className="text-4xl tracking-tight">{product.title}</h1>
        <p className="mt-5 leading-7 text-[#665a55]">{product.description}</p>
        <div className="mt-8 flex items-baseline gap-3">
          <p
            className={`text-2xl ${product.discountPrice !== undefined ? "font-medium text-[#a45742]" : ""}`}
          >
            ${currentPrice}
          </p>
          {product.discountPrice !== undefined && (
            <p className="text-base text-[#8a7970] line-through">
              ${product.price}
            </p>
          )}
        </div>
        <p className="mt-2 text-sm text-[#76645b]">
          {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
        </p>
        {productAttributes.length > 0 && (
          <div className="mt-8 border-t border-[#e5d9d0] pt-6">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#a27a62]">
              {copy.ui.productDetails}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {productAttributes.map((attribute) => (
                  <div
                    key={attribute.name}
                    className="rounded-2xl bg-[#f2ebe4] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-[#8a7970]">
                      {attribute.name}
                    </p>
                    <p className="mt-2 text-sm">
                      {attribute.values.join(" · ")}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8">
          {product.stock > 0 && (
            <AddToCart
              productId={product._id.toString()}
              slug={product.slug}
              title={product.title}
              price={currentPrice}
              stock={product.stock}
              image={product.images[0]}
              attributes={productAttributes}
            />
          )}
        </div>
      </div>
    </main>
  );
}
