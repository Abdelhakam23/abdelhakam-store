"use client";

import { useState } from "react";

import { AdminProductForm, type ProductSummary } from "@/components/admin/admin-product-form";

type Category = { _id: string; name: string };
type Product = ProductSummary;

export function AdminProductsPanel({ categories, initialProducts }: { categories: Category[]; initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  return (
    <>
      <div className="mt-8">
        {editing ? (
          <AdminProductForm categories={categories} initialProduct={editing} onUpdated={(product) => { setProducts((current) => current.map((item) => item._id === product._id ? product : item)); setEditing(null); }} onCancel={() => setEditing(null)} />
        ) : (
          <AdminProductForm categories={categories} onCreated={(product) => setProducts((current) => [product, ...current])} />
        )}
      </div>
      <section className="mt-10 rounded-3xl bg-white p-6">
        <h2 className="text-2xl">Current products</h2>
        <div className="mt-4 divide-y">
          {products.map((product) => <div key={product._id} className="flex items-center justify-between gap-4 py-4 text-sm"><span>{product.title}</span><div className="flex items-center gap-4"><span>${product.price} · {product.stock} in stock</span><button type="button" onClick={() => setEditing(product)} className="rounded-full border px-3 py-1 text-xs">Edit</button></div></div>)}
        </div>
      </section>
    </>
  );
}
