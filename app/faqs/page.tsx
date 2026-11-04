import { getServerLocale, messages } from "@/lib/i18n";

export const instant = false;

export default async function FaqsPage() {
  const copy = messages[await getServerLocale()];
  const faqs = [[copy.ui.faqOne, copy.ui.faqOneAnswer], [copy.ui.faqTwo, copy.ui.faqTwoAnswer], [copy.ui.faqThree, copy.ui.faqThreeAnswer]];
  return (
    <main className="mx-auto max-w-[900px] px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.ui.faqs}</p>
      <h1 className="mt-5 text-5xl tracking-[-0.06em] sm:text-7xl">{copy.ui.faqTitle}</h1>
      <div className="mt-16 divide-y divide-[#e5d9d0] border-y border-[#e5d9d0]">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xl">{question}<span className="text-2xl text-[#a27a62] transition group-open:rotate-45">+</span></summary>
            <p className="max-w-2xl pt-4 leading-7 text-[#665a55]">{answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
