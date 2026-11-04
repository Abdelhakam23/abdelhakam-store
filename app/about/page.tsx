import { getServerLocale, messages } from "@/lib/i18n";

export const instant = false;

export default async function AboutPage() {
  const copy = messages[await getServerLocale()];
  return (
    <main className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12">
      <section className="rounded-[2.5rem] bg-[#eadfd4] p-8 sm:p-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[#76645b]">{copy.ui.about}</p>
        <h1 className="mt-5 max-w-3xl text-5xl leading-[0.98] tracking-[-0.07em] sm:text-7xl">{copy.ui.aboutTitle}</h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-[#665a55]">{copy.ui.aboutDescription}</p>
      </section>
      <section className="grid gap-12 py-20 md:grid-cols-2">
        <h2 className="text-3xl tracking-tight">{copy.ui.ourStory}</h2>
        <p className="text-lg leading-8 text-[#665a55]">{copy.ui.storyText}</p>
      </section>
      <section className="border-t border-[#e5d9d0] pt-12">
        <h2 className="mb-8 text-3xl tracking-tight">{copy.ui.values}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[copy.ui.valueOne, copy.ui.valueTwo, copy.ui.valueThree].map((value, index) => (
            <div key={value} className="rounded-3xl bg-[#f0ede7] p-7">
              <span className="text-sm text-[#a27a62]">0{index + 1}</span>
              <h3 className="mt-12 text-xl">{value}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
