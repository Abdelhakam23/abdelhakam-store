import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const user = await User.findById(session.user.id).populate("wishlist").lean();
  const items = (user?.wishlist ?? []).map((product: unknown) => {
    const item = product as unknown as {
      _id: Types.ObjectId;
      slug: string;
      title: string;
      price: number;
      discountPrice?: number;
      stock: number;
      images?: string[];
      attributes?: { name: string; values: string[] }[];
    };
    return {
      _id: item._id.toString(),
      slug: item.slug,
      title: item.title,
      price: item.price,
      discountPrice: item.discountPrice,
      stock: item.stock,
      image: item.images?.[0],
      attributes: item.attributes,
    };
  });
  return NextResponse.json({ items });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { productIds?: unknown };
  if (!Array.isArray(body.productIds) || body.productIds.some((id) => typeof id !== "string" || !Types.ObjectId.isValid(id))) {
    return NextResponse.json({ error: "Invalid wishlist payload" }, { status: 400 });
  }
  await connectToDatabase();
  await User.findByIdAndUpdate(session.user.id, { $set: { wishlist: body.productIds } });
  return NextResponse.json({ items: body.productIds });
}
