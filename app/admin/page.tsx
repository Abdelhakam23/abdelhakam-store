import { requireRole } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import Link from "next/link";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { getServerLocale, messages } from "@/lib/i18n";

export const instant = false;

export default async function AdminPage() {
  await requireRole("admin");
  await connectToDatabase();
  const [orders, products, users, revenue] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Order.aggregate([{ $match: { "paymentInfo.status": "paid" } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
  ]);
  const copy = messages[await getServerLocale()];
  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.ui.adminArea}</p>
      <h1 className="text-4xl tracking-tight">{copy.ui.adminArea}</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [copy.ui.revenue, `$${revenue[0]?.total ?? 0}`],
          [copy.ui.orders, orders],
          [copy.ui.products, products],
          [copy.ui.users, users],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5">
            <p className="text-sm text-[#8a7970]">{label}</p>
            <p className="mt-2 text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-10 rounded-3xl bg-white p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[#a27a62]">Admin permissions</p>
        <h2 className="mt-2 text-2xl">{copy.ui.adminArea}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [copy.ui.manageProducts, "/admin/products"],
            [copy.ui.manageCategories, "/admin/categories"],
            [copy.ui.manageOrders, "/admin/orders"],
            [copy.ui.manageUsers, "/admin/users"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-2xl border border-[#e5d9d0] p-4 text-sm transition hover:-translate-y-0.5 hover:bg-[#f7eee8]">
              {label}
            </Link>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-[#8a7970]">
          Your admin role authorizes product create/update/delete, order status updates, category creation, and user role updates. API mutations still verify the role server-side.
        </p>
      </section>
    </main>
  );
}
