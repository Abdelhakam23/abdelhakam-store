"use client";

import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, startTransition, useContext, useEffect, useMemo, useState } from "react";

import { DEFAULT_LOCALE, messages, type Locale, type Messages } from "@/lib/i18n";
import { ToastProvider } from "@/components/toast-provider";
import { CartSessionSync } from "@/components/cart-session-sync";

type LocaleContextValue = {
  locale: Locale;
  copy: Messages;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const router = useRouter();

  useEffect(() => {
    const saved = window.localStorage.getItem("abdelhakam-store-locale");
    if (saved === "ar" || saved === "en") {
      startTransition(() => setLocaleState(saved));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("abdelhakam-store-locale", locale);
    document.cookie = `abdelhakam-store-locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [locale, router]);

  const value = useMemo(
    () => ({
      locale,
      copy: messages[locale],
      setLocale: setLocaleState,
      toggleLocale: () => setLocaleState((current) => (current === "en" ? "ar" : "en")),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside AppProviders");
  return context;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <LocaleProvider>
          <CartSessionSync />
          {children}
        </LocaleProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
