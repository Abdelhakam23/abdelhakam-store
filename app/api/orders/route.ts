import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeDocument } from "@/lib/serialize";
import { orderSchema } from "@/lib/validation";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Cart } from "@/models/Cart";
import { requireCurrentAdmin } from "@/lib/authz";
import { getSelectableProductAttributes } from "@/lib/product-options";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const currentAdmin = await requireCurrentAdmin();
  const orders = await Order.find(currentAdmin ? {} : { user: session.user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: serializeDocument(orders) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid order payload", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const productIds = parsed.data.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    const items = parsed.data.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} was not found`);
      if (product.stock < item.quantity) throw new Error(`${product.title} is out of stock`);
      const selectedAttributes = item.selectedAttributes ?? {};
      const selectableAttributes = getSelectableProductAttributes(product.attributes);
      for (const attribute of selectableAttributes) {
        const selectedValue = selectedAttributes[attribute.name];
        if (!selectedValue || !attribute.values.includes(selectedValue)) {
          throw new Error(`Please select a valid ${attribute.name} for ${product.title}`);
        }
      }
      if (Object.keys(selectedAttributes).some((name) => !selectableAttributes.some((attribute) => attribute.name === name))) {
        throw new Error(`Invalid product options for ${product.title}`);
      }
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.discountPrice ?? product.price,
        selectedAttributes,
      };
    });
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const created = await Order.create({
      user: session.user.id,
      items,
      shippingAddress: parsed.data.shippingAddress,
      paymentInfo: { method: parsed.data.paymentMethod, status: "pending" },
      totalPrice,
    });

    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
      if (!updated) {
        await Order.findByIdAndDelete(created._id);
        return NextResponse.json({ error: "Stock changed. Please retry your order." }, { status: 409 });
      }
    }
    await Cart.deleteOne({ user: session.user.id });

    return NextResponse.json({ item: serializeDocument(created.toObject()) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create order";
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
