"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Atom, Lock, LogOut, Save, Loader2 } from "lucide-react";
import type { PortfolioContent } from "@/lib/types";
import ProfileEditor from "@/components/admin/ProfileEditor";
import PapersEditor from "@/components/admin/PapersEditor";
import CertificatesEditor from "@/components/admin/CertificatesEditor";

type Tab = "profile" | "papers" | "certificates";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Check auth + load content on mount
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth");
      const { authed } = await res.json();
      setAuthed(authed);
      if (authed) loadContent();
    })();
  }, []);

  const loadContent = async () => {
    const res = await fetch("/api/content");
    setContent(await res.json());
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      loadContent();
    } else {
      setLoginError("Incorrect password.");
    }
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
    setContent(null);
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) {
      setSavedAt(new Date().toLocaleTimeString());
    } else {
      alert("Save failed. Are you still logged in?");
    }
  };

  // ---- Loading state ----
  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void-950">
        <Loader2 className="h-8 w-8 animate-spin text-quantum-cyan" />
      </div>
    );
  }

  // ---- Login screen ----
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void-950 px-6">
        <div className="absolute inset-0 bg-grid-quantum bg-[size:44px_44px] opacity-30" />
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={login}
          className="glass-strong relative z-10 w-full max-w-sm rounded-2xl p-8"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 inline-flex rounded-2xl bg-quantum-cyan/10 p-3">
              <Lock className="h-6 w-6 text-quantum-cyan" />
            </div>
            <h1 className="font-display text-xl font-bold text-white">
              Admin Access
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter your password to manage content.
            </p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-slate-700 bg-void-900 px-3 py-2.5 text-sm text-white outline-none focus:border-quantum-cyan"
          />
          {loginError && (
            <p className="mt-2 text-xs text-red-400">{loginError}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-quantum-cyan px-4 py-2.5 text-sm font-semibold text-void-950 shadow-glow transition-all hover:shadow-glow-lg"
          >
            Sign In
          </button>
        </motion.form>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void-950">
        <Loader2 className="h-8 w-8 animate-spin text-quantum-cyan" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "papers", label: "Research Papers" },
    { id: "certificates", label: "Certificates" },
  ];

  // ---- Dashboard ----
  return (
    <div className="min-h-screen bg-void-950">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-40 border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Atom className="h-6 w-6 text-quantum-cyan animate-spin-slow" />
            <span className="font-display font-semibold text-white">
              Content Manager
            </span>
          </div>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="text-xs text-slate-500">Saved {savedAt}</span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-quantum-green px-4 py-2 text-sm font-semibold text-void-950 shadow-glow-green transition-all hover:brightness-110 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-5xl gap-1 px-6 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "rounded-lg bg-quantum-cyan/15 px-4 py-2 text-sm font-medium text-quantum-cyan"
                  : "rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {tab === "profile" && (
          <ProfileEditor
            profile={content.profile}
            onChange={(profile) => setContent({ ...content, profile })}
          />
        )}
        {tab === "papers" && (
          <PapersEditor
            papers={content.papers}
            onChange={(papers) => setContent({ ...content, papers })}
          />
        )}
        {tab === "certificates" && (
          <CertificatesEditor
            categories={content.categories}
            certificates={content.certificates}
            onChange={(certificates) =>
              setContent({ ...content, certificates })
            }
          />
        )}
      </main>
    </div>
  );
}
