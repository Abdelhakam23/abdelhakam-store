import { notFound } from "next/navigation";
import { connection } from "next/server";

import { CollectionPage } from "@/components/collection-page";
import { connectToDatabase } from "@/lib/db";
import { serializeDocument } from "@/lib/serialize";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { getServerLocale, messages } from "@/lib/i18n";

export const instant = false;

const collectionInfo = {
  "new-arrivals": { title: "New arrivals", description: "Fresh pieces selected for the season." },
  "home-objects": { title: "Home objects", description: "Quiet forms and useful objects for every room." },
  textiles: { title: "Textiles", description: "Soft, tactile pieces made for daily rituals." },
  "self-care": { title: "Self care", description: "Small moments of comfort and restoration." },
} as const;

export default async function CollectionRoute({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const locale = await getServerLocale();
  const info = collectionInfo[slug as keyof typeof collectionInfo];
  if (!info) notFound();
  await connectToDatabase();
  const filter = slug === "new-arrivals" ? {} : { category: (await Category.findOne({ slug }).select("_id").lean())?._id };
  const products = serializeDocument(await Product.find({ ...filter, stock: { $gt: 0 } }).sort({ createdAt: -1 }).limit(24).lean());
  const translated = locale === "ar"
    ? { "new-arrivals": ["وصل حديثًا", "قطع جديدة مختارة لهذا الموسم."], "home-objects": ["قطع منزلية", "أشكال هادئة وقطع عملية لكل غرفة."], textiles: ["منسوجات", "قطع ناعمة ومريحة للاستخدام اليومي."], "self-care": ["العناية الشخصية", "لحظات صغيرة من الراحة والاسترخاء."] }[slug as keyof typeof collectionInfo]
    : [info.title, info.description];
  return <CollectionPage title={translated[0]} description={translated[1]} products={products.map((product) => ({ _id: product._id.toString(), slug: product.slug, title: product.title, price: product.price, discountPrice: product.discountPrice, stock: product.stock, image: product.images[0], attributes: product.attributes }))} emptyLabel={messages[locale].ui.noCollectionProducts} />;
}
