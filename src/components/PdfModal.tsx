"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Maximize2 } from "lucide-react";
import { useEffect } from "react";
import { driveEmbedUrl } from "@/lib/utils";
import type { ResearchPaper } from "@/lib/types";

interface Props {
  paper: ResearchPaper | null;
  onClose: () => void;
}

/**
 * Full-screen / large modal that embeds a Google Drive PDF preview via iframe.
 * Optimized for reading on both desktop and mobile (fills viewport on small
 * screens). Locks body scroll while open and closes on Escape.
 */
export default function PdfModal({ paper, onClose }: Props) {
  useEffect(() => {
    if (!paper) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [paper, onClose]);

  return (
    <AnimatePresence>
      {paper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void-950/85 p-0 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong flex h-full w-full flex-col overflow-hidden rounded-none sm:h-[90vh] sm:max-w-4xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-700/50 p-4">
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-semibold text-white">
                  {paper.title}
                </h3>
                <p className="truncate text-xs text-slate-400">
                  {[paper.venue, paper.date].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={driveEmbedUrl(paper.driveLink).replace(
                    "/preview",
                    "/view"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-void-700 hover:text-quantum-cyan"
                  aria-label="Open in Google Drive"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-void-700 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-void-900">
              <iframe
                src={driveEmbedUrl(paper.driveLink)}
                className="h-full w-full"
                allow="autoplay"
                title={paper.title}
              />
              <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-void-950/70 px-2 py-1 text-[10px] text-slate-500">
                <Maximize2 className="h-3 w-3" /> Google Drive Viewer
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
