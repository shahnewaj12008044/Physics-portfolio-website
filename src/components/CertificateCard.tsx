"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Building2 } from "lucide-react";
import type { Certificate } from "@/lib/types";

/**
 * Interactive certificate card with a 3D tilt-on-hover effect driven by mouse
 * position. Clicking opens the zoom modal (handled by the parent).
 */
export default function CertificateCard({
  certificate,
  onOpen,
}: {
  certificate: Certificate;
  onOpen: (c: Certificate) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // Max ~8deg tilt
    setTilt({ rx: (0.5 - py) * 16, ry: (px - 0.5) * 16 });
  };

  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={() => onOpen(certificate)}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="group glass relative overflow-hidden rounded-2xl text-left transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-void-900">
        <Image
          src={certificate.image}
          alt={certificate.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-white line-clamp-1">
          {certificate.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{certificate.issuer}</span>
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {certificate.date}
        </p>
      </div>
    </motion.button>
  );
}
