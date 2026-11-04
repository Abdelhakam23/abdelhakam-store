"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, Trash2, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastTone = "success" | "error" | "info" | "delete";
type Toast = { id: number; message: string; tone: ToastTone };
type ToastContextValue = { toast: (message: string, tone?: ToastTone) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4200);
  }, []);
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-5 z-[100] flex flex-col items-end gap-3 sm:left-auto sm:w-[min(380px,calc(100vw-2rem))]">
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 30, scale: 0.96 }} transition={{ duration: 0.22 }} className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-[#e5d9d0] bg-white/95 p-4 text-sm shadow-[0_16px_40px_rgba(47,41,38,0.16)] backdrop-blur">
              {item.tone === "success" ? <CheckCircle2 className="shrink-0 text-emerald-600" size={19} /> : item.tone === "delete" ? <Trash2 className="shrink-0 text-red-600" size={19} /> : item.tone === "error" ? <XCircle className="shrink-0 text-red-600" size={19} /> : <Info className="shrink-0 text-[#a27a62]" size={19} />}
              <span className="flex-1">{item.message}</span>
              <button aria-label="Dismiss notification" onClick={() => setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id))}><X size={16} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
