"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useLocale } from "@/components/app-providers";
import { LoadingButton } from "@/components/loading-button";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { copy } = useLocale();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(form)),
        });
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Registration failed");
        }
      }
      const result = await signIn("credentials", {
        email: form.get("email"),
        password: form.get("password"),
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid email or password");
      router.push("/");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm"
    >
      <h1 className="text-3xl tracking-tight">
        {mode === "login" ? copy.ui.welcomeBack : copy.ui.createAccount}
      </h1>
      {mode === "register" && (
        <input
          name="name"
          required
          placeholder={copy.ui.fullName}
          className="rounded-xl border p-3"
        />
      )}
      <input
        name="email"
        required
        type="email"
        placeholder={copy.ui.email}
        className="rounded-xl border p-3"
      />
      <input
        name="password"
        required
        minLength={8}
        type="password"
        placeholder={copy.ui.password}
        className="rounded-xl border p-3"
      />
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <LoadingButton
        loading={pending}
        className="rounded-full bg-[#2f2926] px-5 py-3 text-white disabled:opacity-50"
      >
        {pending
          ? copy.ui.pleaseWait
          : mode === "login"
            ? copy.ui.signIn
            : copy.ui.create}
      </LoadingButton>
    </form>
  );
}
