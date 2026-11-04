import { ProductCard, type ProductCardData } from "@/components/product-card";

export function CollectionPage({
  title,
  description,
  products,
  emptyLabel,
}: {
  title: string;
  description: string;
  products: ProductCardData[];
  emptyLabel: string;
}) {
  return (
    <main className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="relative mb-10 overflow-hidden rounded-[2.5rem] bg-[#eadfd4] p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-[#c9a58f]/50" />
        <div className="pointer-events-none absolute -bottom-36 right-24 h-72 w-72 rounded-full border border-[#c9a58f]/40" />
        <p className="relative text-xs uppercase tracking-[0.18em] text-[#76645b]">Abdelhakam Store collection</p>
        <h1 className="relative mt-4 max-w-3xl text-4xl tracking-[-0.06em] sm:text-6xl">{title}</h1>
        <p className="relative mt-5 max-w-xl leading-7 text-[#665a55]">{description}</p>
      </div>
      {products.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-[#665a55]">{emptyLabel}</p>
      ) : (
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => <ProductCard key={product._id} product={product} animationIndex={index} />)}
        </div>
      )}
    </main>
  );
}
