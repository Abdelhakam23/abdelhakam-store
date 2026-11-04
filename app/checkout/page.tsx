import { CheckoutForm } from "@/components/checkout-form";
import { requireUser } from "@/lib/authz";
import { getServerLocale, messages } from "@/lib/i18n";

export const instant = false;

export default async function CheckoutPage() {
  await requireUser();
  const copy = messages[await getServerLocale()];
  return (
    <main className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a27a62]">{copy.ui.checkout}</p>
      <h1 className="mb-8 text-4xl tracking-tight">{copy.ui.shipping}</h1>
      <CheckoutForm />
    </main>
  );
}
