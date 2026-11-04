import HomeClient from "@/components/home-client";
import { connection } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { serializeDocument } from "@/lib/serialize";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export const instant = false;

export default async function Home() {
  await connection();
  await connectToDatabase();
  const [products, categories] = await Promise.all([
    Product.find({ stock: { $gt: 0 } }).sort({ createdAt: -1 }).limit(8).lean(),
    Category.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);
  return (
    <HomeClient
      products={serializeDocument(products).map((product) => ({
        _id: product._id.toString(),
        slug: product.slug,
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        image: product.images[0],
        attributes: product.attributes,
      }))}
      categories={serializeDocument(categories).map((category) => ({
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        image: category.image,
      }))}
    />
  );
}
