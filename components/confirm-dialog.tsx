"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#2f2926]/35 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onCancel();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-3xl border border-[#e5d9d0] bg-[#fbf8f4] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7e3df] text-[#a45742]"><AlertTriangle size={21} /></div>
              <button type="button" onClick={onCancel} aria-label={cancelLabel} className="rounded-full p-2 text-[#8a7970] hover:bg-[#f2e7df]"><X size={18} /></button>
            </div>
            <h2 className="mt-5 text-xl tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#665a55]">{message}</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-[#d9c8bc] bg-white px-4 py-3 text-sm hover:bg-[#f7eee8]">{cancelLabel}</button>
              <button type="button" onClick={onConfirm} className="flex-1 rounded-full bg-[#a45742] px-4 py-3 text-sm text-white hover:bg-[#813f30]">{confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
