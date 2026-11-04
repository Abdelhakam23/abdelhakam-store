import { model, models, Schema, type InferSchemaType } from "mongoose";

const orderAddressSchema = new Schema(
  {
    fullName: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    selectedAttributes: { type: Map, of: String, default: {} },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: orderAddressSchema, required: true },
    paymentInfo: {
      status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
      method: { type: String, enum: ["card", "paypal"], required: true },
      transactionId: { type: String, select: false },
    },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;
export const Order = models.Order || model("Order", orderSchema);
