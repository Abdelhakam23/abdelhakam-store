import { z } from "zod";

import { ORDER_STATUSES, USER_ROLES } from "@/types/shop";

const trimmedString = (label: string, max = 500) =>
  z.string().trim().min(1, `${label} is required`).max(max);

export const addressSchema = z.object({
  fullName: trimmedString("Full name", 100),
  line1: trimmedString("Address", 200),
  line2: z.string().trim().max(200).optional(),
  city: trimmedString("City", 100),
  state: trimmedString("State", 100),
  postalCode: trimmedString("Postal code", 20),
  country: trimmedString("Country", 100),
  phone: z.string().trim().max(30).optional(),
});

export const userRoleSchema = z.enum(USER_ROLES);

export const productSchema = z.object({
  title: trimmedString("Title", 160),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: trimmedString("Description", 5000),
  price: z.number().nonnegative(),
  discountPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative(),
  category: z.string().trim().min(1),
  images: z.array(z.string().url()).min(1).max(12),
  attributes: z
    .array(
      z.object({
        name: trimmedString("Attribute name", 50),
        values: z.array(trimmedString("Attribute value", 100)).min(1).max(30),
      }),
    )
    .max(20)
    .default([]),
});

export const productFilterSchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "popular"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
});

export const productMutationSchema = productSchema.extend({
  category: z.string().regex(/^[a-f\d]{24}$/i, "Invalid category id"),
});

export const reviewSchema = z.object({
  productId: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
  comment: trimmedString("Comment", 2000),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().int().positive().max(99),
        selectedAttributes: z.record(z.string().trim().min(1), z.string().trim().min(1)).optional(),
      }),
    )
    .min(1),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(["card", "paypal"]),
});

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const signInSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128),
});

export const signUpSchema = signInSchema.extend({
  name: trimmedString("Name", 100),
});
