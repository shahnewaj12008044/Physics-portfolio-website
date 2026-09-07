"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  GraduationCap,
  Copy,
  Check,
  Send,
} from "lucide-react";
import type { Profile, SocialLink } from "@/lib/types";

const ICONS = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  scholar: GraduationCap,
} as const;

function SocialRow({ social }: { social: SocialLink }) {
  const [copied, setCopied] = useState(false);
  const Icon = ICONS[social.icon];

  const copy = async () => {
    await navigator.clipboard.writeText(social.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass flex items-center gap-3 rounded-xl p-3">
      <div className="inline-flex rounded-lg bg-quantum-cyan/10 p-2.5">
        <Icon className="h-5 w-5 text-quantum-cyan" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{social.label}</p>
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-sm text-slate-200 transition-colors hover:text-quantum-cyan"
        >
          {social.value}
        </a>
      </div>
      <button
        onClick={copy}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-void-700 hover:text-white"
        aria-label={`Copy ${social.label}`}
      >
        {copied ? (
          <Check className="h-4 w-4 text-quantum-green" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default function Contact({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Opens the user's mail client pre-filled — no backend needed. Swap for a
    // fetch() to your API / form service if you want server-side delivery.
    const mailto = `mailto:${profile.socials.find((s) => s.icon === "email")?.value ?? ""}?subject=${encodeURIComponent(
      `Portfolio contact from ${form.name}`
    )}&body=${encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`)}`;
    window.location.href = mailto;
    setStatus("sent");
  };

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-quantum-cyan/20 bg-quantum-cyan/5 px-4 py-1.5 text-xs font-medium text-quantum-cyan">
          <Mail className="h-3.5 w-3.5" />
          Contact
        </div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Let&apos;s <span className="text-gradient">connect</span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          {profile.socials.map((s) => (
            <SocialRow key={s.label} social={s} />
          ))}
        </motion.div>

        {/* Contact form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={submit}
          className="glass space-y-4 rounded-2xl p-6"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-void-900 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-quantum-cyan"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-void-900 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-quantum-cyan"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-none rounded-lg border border-slate-700 bg-void-900 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-quantum-cyan"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-quantum-cyan px-6 py-3 text-sm font-semibold text-void-950 shadow-glow transition-all hover:shadow-glow-lg"
          >
            {status === "sent" ? (
              <>
                <Check className="h-4 w-4" /> Opening mail client…
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                Send Message
              </>
            )}
          </button>
        </motion.form>
      </div>

      <footer className="mt-20 border-t border-slate-800 pt-8 text-center text-xs text-slate-600">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js,
          Tailwind CSS & Framer Motion.
        </p>
      </footer>
    </section>
  );
}
