"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  Maximize2,
  Users,
} from "lucide-react";
import { driveEmbedUrl } from "@/lib/utils";
import type { ResearchPaper } from "@/lib/types";
import PdfModal from "./PdfModal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Primary section of the portfolio. Each paper renders its Google Drive PDF
 * in an inline viewer so the reader never has to leave the site; a fullscreen
 * modal and a direct Drive link stay available as escape hatches.
 */
export default function Research({ papers }: { papers: ResearchPaper[] }) {
  const sorted = useMemo(
    () => [...papers].sort((a, b) => a.order - b.order),
    [papers]
  );

  // First paper opens by default so the reader lands straight on a document.
  // One reader at a time: the closed panel unmounts, so only a single Drive
  // iframe is ever live on the page.
  const [openId, setOpenId] = useState<string | null>(sorted[0]?.id ?? null);
  const [fullscreen, setFullscreen] = useState<ResearchPaper | null>(null);

  const toggle = (id: string) =>
    setOpenId((cur) => (cur === id ? null : id));

  return (
    <section
      id="research"
      className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:py-28"
    >
      {/* Section heading */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="mb-12 text-center"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-quantum-cyan/30 bg-quantum-cyan/10 px-4 py-1.5 text-xs font-medium text-quantum-cyan">
          <BookOpen className="h-3.5 w-3.5" />
          Research
        </div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Research in <span className="text-gradient">nuclear data</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Neutron-induced reaction cross sections, screened against the
          experimental EXFOR record and the major evaluated libraries. Every
          paper below is readable in full without leaving this page.
        </p>
      </motion.div>

      {sorted.length === 0 ? (
        <p className="text-center text-sm text-slate-500">
          No papers published yet.
        </p>
      ) : (
        <div className="space-y-8">
          {sorted.map((paper, i) => {
            const isOpen = openId === paper.id;
            const embed = driveEmbedUrl(paper.driveLink);
            const hasDoc = Boolean(embed);

            return (
              <motion.article
                key={paper.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className="glass overflow-hidden rounded-2xl border-quantum-cyan/10"
              >
                {/* ---- Metadata ---- */}
                <div className="border-b border-slate-700/40 p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-xs font-semibold text-quantum-cyan/70">
                      Paper {String(i + 1).padStart(2, "0")}
                    </span>
                    {paper.venue && (
                      <span className="rounded-full border border-quantum-green/30 bg-quantum-green/10 px-3 py-1 text-[11px] font-medium text-quantum-green">
                        {paper.venue}
                      </span>
                    )}
                    {paper.date && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {paper.date}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-3xl">
                    {paper.title}
                  </h3>

                  {paper.authors && (
                    <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-slate-400">
                      <Users className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        {paper.authors.split(",").map((name, n, all) => {
                          const clean = name.trim();
                          const isOwner = /shahnewaj/i.test(clean);
                          return (
                            <span key={`${clean}-${n}`}>
                              <span
                                className={
                                  isOwner ? "font-semibold text-quantum-cyan" : ""
                                }
                              >
                                {clean}
                              </span>
                              {n < all.length - 1 ? ", " : ""}
                            </span>
                          );
                        })}
                      </span>
                    </p>
                  )}

                  {paper.abstract && (
                    <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
                      {paper.abstract}
                    </p>
                  )}

                  {paper.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {paper.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-700 bg-void-800 px-2.5 py-0.5 text-[11px] text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ---- Actions ---- */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => toggle(paper.id)}
                      disabled={!hasDoc}
                      className="inline-flex items-center gap-2 rounded-full bg-quantum-cyan px-5 py-2.5 text-sm font-semibold text-void-950 shadow-glow transition-all hover:shadow-glow-lg disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
                    >
                      <FileText className="h-4 w-4" />
                      {isOpen ? "Hide paper" : "Read full paper"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => setFullscreen(paper)}
                      disabled={!hasDoc}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-void-800/60 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-quantum-cyan/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Fullscreen
                    </button>

                    {hasDoc && (
                      <a
                        href={embed.replace("/preview", "/view")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:text-quantum-cyan"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in Drive
                      </a>
                    )}
                  </div>
                </div>

                {/* ---- Inline Drive reader ---- */}
                <AnimatePresence initial={false}>
                  {isOpen && hasDoc && (
                    <motion.div
                      key="reader"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="bg-void-900/60 p-3 sm:p-4 lg:p-6">
                        <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden rounded-xl border border-slate-700/50 bg-void-900">
                          <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-xs text-slate-500">
                            Loading the document from Google Drive…
                          </p>
                          <iframe
                            src={embed}
                            title={paper.title}
                            allow="autoplay"
                            loading="lazy"
                            className="relative h-full w-full"
                          />
                        </div>
                        <p className="mt-3 text-center text-[11px] text-slate-500">
                          Scroll inside the frame to read. If nothing appears,
                          the file may not be shared publicly — use{" "}
                          <span className="text-slate-400">Open in Drive</span>.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      )}

      <PdfModal paper={fullscreen} onClose={() => setFullscreen(null)} />
    </section>
  );
}
