"use client";

import { motion } from "framer-motion";
import { Atom, Code2, ArrowUpRight, User } from "lucide-react";
import type { Profile } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About({ profile }: { profile: Profile }) {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="mb-14 text-center"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-quantum-cyan/20 bg-quantum-cyan/5 px-4 py-1.5 text-xs font-medium text-quantum-cyan">
          <User className="h-3.5 w-3.5" />
          About
        </div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Where physics meets <span className="text-gradient">code</span>
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Physics card */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass rounded-2xl p-6"
        >
          <div className="mb-4 inline-flex rounded-xl bg-quantum-cyan/10 p-3">
            <Atom className="h-6 w-6 text-quantum-cyan" />
          </div>
          <h3 className="mb-2 font-display text-xl font-semibold text-white">
            Physics Background
          </h3>
          <p className="text-sm leading-relaxed text-slate-400">
            Focused on nuclear physics and quantum mechanics, with hands-on
            computational modeling of neutron-induced reactions, cross-section
            evaluation, and level-density systematics. Committed to rigorous,
            curiosity-driven research.
          </p>
          <button
            onClick={() => go("research")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-quantum-cyan transition-colors hover:text-white"
          >
            See the publications
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Web dev card */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass rounded-2xl p-6"
        >
          <div className="mb-4 inline-flex rounded-xl bg-quantum-green/10 p-3">
            <Code2 className="h-6 w-6 text-quantum-green" />
          </div>
          <h3 className="mb-2 font-display text-xl font-semibold text-white">
            Full-Stack Development
          </h3>
          <p className="text-sm leading-relaxed text-slate-400">
            Building modern web applications with Next.js, React, TypeScript,
            and Node.js. Comfortable across the stack — from interactive
            front-end animation to API and database design.
          </p>
        </motion.div>
      </div>

      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-slate-400"
      >
        {profile.bio}
      </motion.p>
    </section>
  );
}
