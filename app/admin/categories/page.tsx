import { AdminCategoriesPanel } from "@/components/admin/admin-categories-panel";
import { serializeDocument } from "@/lib/serialize";
import { requireRole } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { Category } from "@/models/Category";

export const instant = false;

export default async function AdminCategoriesPage() {
  await requireRole("admin");
  await connectToDatabase();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8"><p className="text-xs uppercase tracking-[0.18em] text-[#a27a62]">Admin / Categories</p><h1 className="mt-2 text-4xl tracking-tight">Categories</h1><AdminCategoriesPanel initialCategories={serializeDocument(categories).map((category) => ({ _id: category._id.toString(), name: category.name, slug: category.slug, image: category.image }))} /></main>;
}
