import { getServerLocale, messages } from "@/lib/i18n";

export const instant = false;

export default async function PrivacyPolicyPage() {
  const copy = messages[await getServerLocale()];
  return (
    <main className="mx-auto max-w-[900px] px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.ui.privacy}</p>
      <h1 className="mt-5 text-5xl tracking-[-0.06em] sm:text-7xl">{copy.ui.privacyTitle}</h1>
      <div className="mt-12 space-y-8 text-lg leading-8 text-[#665a55]">
        <p>{copy.ui.privacyIntro}</p>
        <h2 className="pt-6 text-2xl text-[#2f2926]">{copy.ui.privacyCollectTitle}</h2>
        <p>{copy.ui.privacyCollectText}</p>
        <h2 className="pt-6 text-2xl text-[#2f2926]">{copy.ui.privacyUseTitle}</h2>
        <p>{copy.ui.privacyUseText}</p>
        <h2 className="pt-6 text-2xl text-[#2f2926]">{copy.ui.privacyChoicesTitle}</h2>
        <p>{copy.ui.privacyChoicesText}</p>
      </div>
    </main>
  );
}
