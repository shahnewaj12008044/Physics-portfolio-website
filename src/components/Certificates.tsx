"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Award } from "lucide-react";
import type {
  CategoryMeta,
  Certificate,
  CertificateCategory,
} from "@/lib/types";
import CertificateCard from "./CertificateCard";
import CertificateModal from "./CertificateModal";
import { cn } from "@/lib/utils";

type Filter = CertificateCategory | "all";

export default function Certificates({
  categories,
  certificates,
}: {
  categories: CategoryMeta[];
  certificates: Certificate[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<Certificate | null>(null);

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...categories.map((c) => ({ id: c.id as Filter, label: c.label })),
  ];

  const visible = useMemo(() => {
    const list =
      filter === "all"
        ? certificates
        : certificates.filter((c) => c.category === filter);
    return [...list].sort((a, b) =>
      a.category === b.category
        ? a.order - b.order
        : a.category.localeCompare(b.category)
    );
  }, [filter, certificates]);

  return (
    <section id="certificates" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-quantum-green/20 bg-quantum-green/5 px-4 py-1.5 text-xs font-medium text-quantum-green">
          <Award className="h-3.5 w-3.5" />
          Certificates
        </div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Achievements & <span className="text-gradient">Credentials</span>
        </h2>
      </div>

      {/* Filter tabs */}
      <LayoutGroup>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === tab.id
                  ? "text-void-950"
                  : "text-slate-300 hover:text-white"
              )}
            >
              {filter === tab.id && (
                <motion.span
                  layoutId="cert-tab"
                  className="absolute inset-0 rounded-full bg-quantum-green"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onOpen={setActive}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="text-center text-sm text-slate-500">
          No certificates in this category yet.
        </p>
      )}

      <CertificateModal certificate={active} onClose={() => setActive(null)} />
    </section>
  );
}
