export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-[1.75rem] bg-white shadow-[0_8px_24px_rgba(47,41,38,0.06)]"
        >
          <div className="aspect-[4/5] bg-[#eadfd4]" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/3 rounded-full bg-[#eadfd4]" />
            <div className="h-5 w-3/4 rounded-full bg-[#eadfd4]" />
            <div className="h-4 w-1/4 rounded-full bg-[#f2e7df]" />
            <div className="h-11 rounded-full bg-[#f2e7df]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <main className="mx-auto grid min-h-[720px] max-w-[1200px] gap-10 px-5 py-12 md:grid-cols-2">
      <div className="animate-pulse rounded-[2rem] bg-[#eadfd4] aspect-[4/5] md:aspect-auto md:min-h-[620px]" />
      <div className="animate-pulse space-y-5 py-4">
        <div className="h-3 w-28 rounded-full bg-[#eadfd4]" />
        <div className="h-12 w-4/5 rounded-full bg-[#eadfd4]" />
        <div className="space-y-2 pt-3">
          <div className="h-4 w-full rounded-full bg-[#f2e7df]" />
          <div className="h-4 w-5/6 rounded-full bg-[#f2e7df]" />
          <div className="h-4 w-2/3 rounded-full bg-[#f2e7df]" />
        </div>
        <div className="h-8 w-28 rounded-full bg-[#eadfd4] pt-5" />
        <div className="h-20 rounded-2xl bg-[#f2ebe4]" />
        <div className="h-14 rounded-full bg-[#eadfd4]" />
      </div>
    </main>
  );
}

export function AdminPageSkeleton() {
  return (
    <main className="mx-auto min-h-[720px] max-w-[1440px] animate-pulse px-5 py-12 sm:px-8 lg:px-12">
      <div className="h-12 w-64 rounded-full bg-[#eadfd4]" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-32 rounded-3xl bg-white" />
        ))}
      </div>
      <div className="mt-10 h-80 rounded-3xl bg-white" />
    </main>
  );
}

export function HomePageSkeleton() {
  return (
    <main className="min-h-[900px] animate-pulse">
      <section className="mx-auto grid max-w-[1440px] gap-4 px-5 pb-20 pt-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:pt-8">
        <div className="min-h-[580px] rounded-[2.5rem] bg-[#2f2926]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="min-h-[280px] rounded-[2.5rem] bg-[#eadfd4]" />
          <div className="min-h-[280px] rounded-[2.5rem] bg-[#f0dfd1]" />
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mb-8 h-10 w-56 rounded-full bg-[#eadfd4]" />
        <ProductGridSkeleton count={4} />
      </section>
    </main>
  );
}

export function PageLoadingSkeleton() {
  return (
    <main className="mx-auto min-h-[720px] max-w-[1440px] animate-pulse px-5 py-12 sm:px-8 lg:px-12">
      <div className="h-10 w-56 rounded-full bg-[#eadfd4]" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.34fr]">
        <div className="min-h-[420px] rounded-3xl bg-white" />
        <div className="min-h-[260px] rounded-3xl bg-[#f2ebe4]" />
      </div>
    </main>
  );
}
