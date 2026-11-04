import { model, models, Schema, type InferSchemaType } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    variantKey: String,
    slug: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 99 },
    image: String,
    selectedAttributes: { type: Map, of: String, default: {} },
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true },
);

export type CartDocument = InferSchemaType<typeof cartSchema>;
export const Cart = models.Cart || model("Cart", cartSchema);
