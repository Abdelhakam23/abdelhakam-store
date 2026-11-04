"use client";

import { useState } from "react";

import { AdminCategoryForm } from "@/components/admin/admin-category-form";

type Category = { _id: string; name: string; slug: string; image: string };

export function AdminCategoriesPanel({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  return (
    <>
      <div className="mt-8"><AdminCategoryForm onCreated={(category) => setCategories((current) => [category, ...current])} /></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => <div key={category._id} className="rounded-2xl bg-white p-5"><p className="font-medium">{category.name}</p><p className="mt-1 text-sm text-[#8a7970]">/{category.slug}</p></div>)}
      </div>
    </>
  );
}
