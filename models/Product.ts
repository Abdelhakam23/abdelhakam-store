import { model, models, Schema, type InferSchemaType } from "mongoose";

const attributeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    values: { type: [String], required: true },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    images: { type: [String], required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    attributes: { type: [attributeSchema], default: [] },
  },
  { timestamps: true },
);

productSchema.index({ title: "text", description: "text" });
productSchema.index({ price: 1, rating: -1, createdAt: -1 });
productSchema.index({ category: 1, createdAt: -1 });

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const Product = models.Product || model("Product", productSchema);
