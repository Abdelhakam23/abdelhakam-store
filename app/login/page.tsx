import Link from "next/link";

import { AuthForm } from "@/components/auth-form";
import { getServerLocale, messages } from "@/lib/i18n";

export const instant = false;

export default async function LoginPage() {
  const copy = messages[await getServerLocale()];
  return (
    <main className="min-h-screen px-5 py-16">
      <AuthForm mode="login" />
      <p className="mx-auto mt-5 max-w-md text-center text-sm text-[#665a55]">
        {copy.ui.newHere} <Link href="/register" className="underline">{copy.ui.create}</Link>
      </p>
    </main>
  );
}
