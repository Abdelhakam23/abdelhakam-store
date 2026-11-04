import { AdminOrderStatus } from "@/components/admin/admin-order-status";
import { requireRole } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";

export const instant = false;

export default async function AdminOrdersPage() {
  await requireRole("admin");
  await connectToDatabase();
  const orders = await Order.find().populate("user", "email name").sort({ createdAt: -1 }).limit(100).lean();
  return <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8"><p className="text-xs uppercase tracking-[0.18em] text-[#a27a62]">Admin / Orders</p><h1 className="mt-2 text-4xl tracking-tight">Orders</h1><div className="mt-8 overflow-x-auto rounded-3xl bg-white p-5"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b text-[#8a7970]"><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id.toString()} className="border-b last:border-0"><td className="p-3">{order._id.toString().slice(-8)}</td><td className="p-3">{typeof order.user === "object" && order.user ? order.user.email : "Customer"}</td><td className="p-3">${order.totalPrice.toFixed(2)}</td><td className="p-3 capitalize">{order.paymentInfo.status}</td><td className="p-3"><AdminOrderStatus orderId={order._id.toString()} initialStatus={order.status} /></td></tr>)}</tbody></table></div></main>;
}
