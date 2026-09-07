"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Building2, Calendar } from "lucide-react";
import { useEffect } from "react";
import type { Certificate } from "@/lib/types";

interface Props {
  certificate: Certificate | null;
  onClose: () => void;
}

/** Zoom modal that shows the full certificate image and metadata. */
export default function CertificateModal({ certificate, onClose }: Props) {
  useEffect(() => {
    if (!certificate) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [certificate, onClose]);

  return (
    <AnimatePresence>
      {certificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void-950/85 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-lg bg-void-950/70 p-2 text-slate-300 transition-colors hover:bg-void-700 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative min-h-0 flex-1 overflow-auto bg-void-900 p-4">
              <div className="relative mx-auto w-full">
                <Image
                  src={certificate.image}
                  alt={certificate.title}
                  width={1200}
                  height={900}
                  className="mx-auto h-auto w-full rounded-lg object-contain"
                />
              </div>
            </div>

            <div className="border-t border-slate-700/50 p-5">
              <h3 className="font-display text-lg font-semibold text-white">
                {certificate.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {certificate.issuer}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {certificate.date}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {certificate.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
