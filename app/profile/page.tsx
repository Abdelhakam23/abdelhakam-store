import { requireUser } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { serializeDocument } from "@/lib/serialize";
import { Order } from "@/models/Order";
import { getServerLocale, messages } from "@/lib/i18n";

export const instant = false;

export default async function ProfilePage() {
  const user = await requireUser();
  await connectToDatabase();
  const orders = serializeDocument(
    await Order.find({ user: user.id }).sort({ createdAt: -1 }).limit(20).lean(),
  );
  const copy = messages[await getServerLocale()];
  return (
    <main className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.ui.account}</p>
      <h1 className="text-4xl tracking-tight">{user.name ?? "Your profile"}</h1>
      <p className="mt-3 text-[#665a55]">{user.email}</p>
      <section className="mt-10 rounded-2xl bg-white p-6">
        <h2 className="text-xl">{copy.ui.orders}</h2>
        {orders.length === 0 ? (
          <p className="mt-2 text-sm text-[#665a55]">{copy.ui.noOrders}</p>
        ) : (
          <div className="mt-4 divide-y">
            {orders.map((order) => (
              <div key={order._id.toString()} className="flex items-center justify-between gap-4 py-4 text-sm">
                <div>
                  <p className="font-medium">{copy.ui.order} {order._id.toString().slice(-8)}</p>
                  <p className="mt-1 text-[#8a7970]">{order.items.length} {copy.ui.items}</p>
                </div>
                <div className="text-right">
                  <p>${order.totalPrice.toFixed(2)}</p>
                  <p className="mt-1 capitalize text-[#8a7970]">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
