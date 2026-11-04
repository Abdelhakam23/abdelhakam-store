import { ProductGridSkeleton } from "@/components/page-skeletons";

export default function Loading() {
  return (
    <main className="mx-auto min-h-[720px] max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mb-10 h-10 w-56 animate-pulse rounded-full bg-[#eadfd4]" />
      <ProductGridSkeleton count={4} />
    </main>
  );
}
