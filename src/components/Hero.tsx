"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, MapPin, MousePointerClick } from "lucide-react";
import FissionCanvas from "./FissionCanvas";
import type { Profile } from "@/lib/types";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function Hero({ profile }: { profile: Profile }) {
  // The canvas spans the whole section, but the nucleus is pinned to this
  // right-hand anchor so the copy on the left never sits under the atom.
  const atomAnchor = useRef<HTMLDivElement>(null);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-24 md:pt-28 lg:pb-14"
    >
      {/* Background grid + fission canvas */}
      <div className="absolute inset-0 bg-grid-quantum bg-[size:44px_44px] opacity-40" />
      <div className="quantum-radial absolute inset-0" />
      <FissionCanvas anchorRef={atomAnchor} />

      {/* Readability scrims: horizontal on laptop, vertical when stacked */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[70%] lg:block"
        style={{
          background:
            "linear-gradient(90deg, #05070d 0%, rgba(5,7,13,0.96) 60%, rgba(5,7,13,0.45) 88%, rgba(5,7,13,0) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[62%] lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, #05070d 0%, rgba(5,7,13,0.92) 60%, rgba(5,7,13,0) 100%)",
        }}
      />

      <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:gap-12">
        {/* ---------- Left: copy ---------- */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="pointer-events-auto text-center lg:text-left"
        >
          <motion.div
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-quantum-cyan/30 bg-quantum-cyan/10 px-4 py-1.5 text-xs font-medium text-quantum-cyan"
          >
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-quantum-green" />
            Available for scholarship opportunities
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 text-lg font-medium text-gradient sm:text-2xl"
          >
            {profile.headline}
          </motion.p>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base lg:mx-0"
          >
            {profile.bio}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400"
          >
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </motion.div>

          <motion.div
            variants={item}
            className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <button
              onClick={() => go("research")}
              className="group inline-flex items-center gap-2 rounded-full bg-quantum-cyan px-6 py-3 text-sm font-semibold text-void-950 shadow-glow transition-all hover:shadow-glow-lg"
            >
              Read the Research
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => go("certificates")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-void-800/50 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur transition-colors hover:border-quantum-cyan/50 hover:text-white"
            >
              <FileText className="h-4 w-4" />
              Certificates
            </button>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-slate-500 lg:mt-6"
          >
            <MousePointerClick className="h-3.5 w-3.5" />
            Click the field to fire a neutron
          </motion.p>
        </motion.div>

        {/* ---------- Right: atom stage ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          className="pointer-events-none relative flex items-center justify-center"
          aria-hidden
        >
          {/* Empty anchor: reserves the space the nucleus is drawn into */}
          <div
            ref={atomAnchor}
            className="h-[210px] w-full max-w-[420px] sm:h-[300px] lg:h-[440px] lg:max-w-none"
          />
        </motion.div>
      </div>

      {/* Fade to page below */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void-950 to-transparent" />
    </section>
  );
}
