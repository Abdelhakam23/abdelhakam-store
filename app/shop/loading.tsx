import { ProductGridSkeleton } from "@/components/page-skeletons";

export default function Loading() {
  return (
    <main className="mx-auto min-h-[720px] max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mb-10 animate-pulse border-b border-[#e5d9d0] pb-5">
        <div className="mb-3 h-3 w-28 rounded-full bg-[#eadfd4]" />
        <div className="h-10 w-48 rounded-full bg-[#eadfd4]" />
      </div>
      <ProductGridSkeleton />
    </main>
  );
}
