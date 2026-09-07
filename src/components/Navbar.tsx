"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, User, Award, Mail, Atom, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "home", label: "Home", short: "Home", icon: Home },
  { id: "research", label: "Research", short: "Research", icon: BookOpen },
  { id: "about", label: "About", short: "About", icon: User },
  { id: "certificates", label: "Certificates", short: "Certs", icon: Award },
  { id: "contact", label: "Contact", short: "Contact", icon: Mail },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop / laptop — full-bleed glass bar pinned to the top edge */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 hidden w-full md:block",
          "transition-shadow duration-300",
          scrolled ? "shadow-glow" : "shadow-none"
        )}
      >
        <div
          className={cn(
            "glass-strong w-full border-x-0 border-t-0 border-b border-slate-700/50",
            "px-6 py-3 lg:px-10 lg:py-4"
          )}
        >
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6">
            <button
              onClick={() => go("home")}
              className="flex shrink-0 items-center gap-2"
              aria-label="Back to top"
            >
              <Atom className="h-5 w-5 text-quantum-cyan animate-spin-slow" />
              <span className="font-display text-sm font-semibold tracking-wide text-slate-100 lg:text-base">
                Shahnewaj
              </span>
            </button>

            <div className="flex items-center gap-1">
              {LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors lg:px-5",
                    active === link.id
                      ? "text-void-950"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-quantum-cyan"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile — full-bleed app bar docked to the bottom edge */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-x-0 bottom-0 z-50 w-full md:hidden"
      >
        <div className="glass-strong w-full border-x-0 border-b-0 border-t border-slate-700/50 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          <div className="flex w-full items-stretch">
            {LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  aria-label={link.label}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors",
                    isActive ? "text-quantum-cyan" : "text-slate-400"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-none">
                    {link.short}
                  </span>
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full transition-colors",
                      isActive ? "bg-quantum-cyan shadow-glow" : "bg-transparent"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </>
  );
}
