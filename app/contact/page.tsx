import { Mail, MapPin } from "lucide-react";
import { getServerLocale, messages } from "@/lib/i18n";
import { ContactForm } from "@/components/contact-form";

export const instant = false;

export default async function ContactPage() {
  const copy = messages[await getServerLocale()];
  return (
    <main className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12">
      <section className="grid gap-12 rounded-[2.5rem] bg-[#2f2926] p-8 text-[#fbf8f4] sm:p-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8b8a0]">{copy.ui.contact}</p>
          <h1 className="mt-5 max-w-2xl text-5xl leading-[1] tracking-[-0.07em] sm:text-7xl">{copy.ui.contactTitle}</h1>
          <p className="mt-8 max-w-xl leading-7 text-[#b8c5bb]">{copy.ui.contactDescription}</p>
        </div>
        <div className="flex flex-col justify-end gap-6 border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-10">
          <a href="mailto:support@abdelhakam-store.example" className="flex items-center gap-4 text-lg hover:text-[#d8b8a0]"><Mail size={20} /> support@abdelhakam-store.example</a>
          <div className="flex items-center gap-4 text-[#b8c5bb]"><MapPin size={20} /> {copy.ui.address}</div>
          <p className="text-sm text-[#c7a997]">{copy.ui.responseTime}</p>
        </div>
      </section>
      <section className="mx-auto max-w-2xl py-20">
        <h2 className="mb-8 text-3xl tracking-tight">{copy.ui.sendMessage}</h2>
        <ContactForm />
      </section>
    </main>
  );
}
