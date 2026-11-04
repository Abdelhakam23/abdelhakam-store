"use client";

import { Children, cloneElement, isValidElement, useState } from "react";
import type { FormHTMLAttributes, ReactNode, InvalidEvent, ReactElement, ChangeEvent } from "react";

import { useLocale } from "@/components/app-providers";

export function ValidatedForm({ children, onInvalid, onSubmit, ...props }: FormHTMLAttributes<HTMLFormElement> & { children: ReactNode }) {
  const { copy } = useLocale();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function getMessage(target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    return target.validity.valueMissing
      ? copy.ui.validationRequired
      : target.type === "email" && target.validity.typeMismatch
        ? copy.ui.validationEmail
        : target.type === "url" && target.validity.typeMismatch
          ? copy.ui.validationUrl
          : copy.ui.validationInvalid;
  }

  function handleInvalid(event: InvalidEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    event.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select").forEach((field) => {
      if (field.name && !field.validity.valid) nextErrors[field.name] = getMessage(field);
    });
    setErrors(nextErrors);
    onInvalid?.(event);
  }

  function handleSubmit(event: Parameters<NonNullable<FormHTMLAttributes<HTMLFormElement>["onSubmit"]>>[0]) {
    const nextErrors: Record<string, string> = {};
    event.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select").forEach((field) => {
      if (field.name && field.required && !field.value.trim()) nextErrors[field.name] = copy.ui.validationRequired;
      else if (field.name && !field.validity.valid) nextErrors[field.name] = getMessage(field);
    });
    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      setErrors(nextErrors);
      return;
    }
    onSubmit?.(event);
  }

  function renderChildren(nodes: ReactNode): ReactNode {
    return Children.map(nodes, (child) => {
      if (!isValidElement(child)) return child;
      if (typeof child.type !== "string") return child;

      const element = child as ReactElement<Record<string, unknown>>;
      const elementType = element.type;
      const name = typeof element.props.name === "string" ? element.props.name : "";
      const isField = typeof elementType === "string" && ["input", "textarea", "select"].includes(elementType) && Boolean(name);
      if (!isField) return child;

      const className = typeof element.props.className === "string" ? element.props.className : "";
      const layoutClasses = className
        .split(/\s+/)
        .filter((classToken) => classToken.includes("col-span"))
        .join(" ");
      const error = errors[name];
      const describedBy = error ? `${name}-error` : undefined;
      const originalOnChange = element.props.onChange as ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void) | undefined;
      const field = cloneElement(element, {
        className: `${className} w-full`.trim(),
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          if (errors[name]) {
            setErrors((current) => {
              const next = { ...current };
              delete next[name];
              return next;
            });
          }
          originalOnChange?.(event);
        },
      });

      return (
        <div className={`min-w-0 w-full ${layoutClasses}`.trim()}>
          {field}
          {error && <p id={describedBy} role="alert" className="mt-1 text-xs text-red-700">{error}</p>}
        </div>
      );
    });
  }

  return <form {...props} onInvalid={handleInvalid} onSubmit={handleSubmit}>{renderChildren(children)}</form>;
}
