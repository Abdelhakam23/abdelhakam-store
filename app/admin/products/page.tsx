import { AdminProductsPanel } from "@/components/admin/admin-products-panel";
import { requireRole } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { serializeDocument } from "@/lib/serialize";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export const instant = false;

export default async function AdminProductsPage() {
  await requireRole("admin");
  await connectToDatabase();
  const [categories, products] = await Promise.all([
    Category.find().select("name").sort({ name: 1 }).lean(),
    Product.find().select("title slug description price discountPrice stock category images attributes").sort({ createdAt: -1 }).limit(50).lean(),
  ]);
  const safeCategories = serializeDocument(categories).map((category) => ({ _id: category._id.toString(), name: category.name }));
  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8">
      <p className="text-xs uppercase tracking-[0.18em] text-[#a27a62]">Admin / Products</p>
      <h1 className="mt-2 text-4xl tracking-tight">Add a product</h1>
      <p className="mt-3 text-[#665a55]">Products created here appear automatically in Shop, collections, and product detail pages.</p>
      <AdminProductsPanel
        categories={safeCategories}
        initialProducts={products.map((product) => ({ _id: product._id.toString(), title: product.title, slug: product.slug, description: product.description, price: product.price, discountPrice: product.discountPrice, stock: product.stock, category: product.category.toString(), images: product.images, attributes: product.attributes }))}
      />
    </main>
  );
}
