import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { requireCurrentAdmin } from "@/lib/authz";
import { connectToDatabase } from "@/lib/db";
import { serializeDocument } from "@/lib/serialize";
import { productFilterSchema, productMutationSchema } from "@/lib/validation";
import { Product } from "@/models/Product";
import { createProductSearchFilter } from "@/lib/product-search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = productFilterSchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product filters" }, { status: 400 });
  }

  await connectToDatabase();
  const { search, category, minPrice, maxPrice, minRating, sort, page } = parsed.data;
  const filter: Record<string, unknown> = {};
  if (search) Object.assign(filter, createProductSearchFilter(search));
  if (category) {
    if (!Types.ObjectId.isValid(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    filter.category = category;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {
      ...(minPrice !== undefined ? { $gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
    };
  }
  if (minRating !== undefined) filter.rating = { $gte: minRating };

  const sortBy: Record<string, 1 | -1> =
    sort === "price-asc"
      ? { price: 1 }
      : sort === "price-desc"
        ? { price: -1 }
        : sort === "popular"
          ? { rating: -1, reviewsCount: -1 }
          : { createdAt: -1 };
  const limit = 12;
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json(
    {
      items: serializeDocument(items),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
      },
    },
  );
}

export async function POST(request: Request) {
  if (!(await requireCurrentAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = productMutationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product payload", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectToDatabase();
  const product = await Product.create(parsed.data);
  return NextResponse.json({ item: serializeDocument(product.toObject()) }, { status: 201 });
}
