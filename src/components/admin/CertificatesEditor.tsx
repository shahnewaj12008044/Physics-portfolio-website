"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import type {
  CategoryMeta,
  Certificate,
  CertificateCategory,
} from "@/lib/types";

const field =
  "w-full rounded-lg border border-slate-700 bg-void-900 px-3 py-2.5 text-sm text-white outline-none focus:border-quantum-cyan";
const label = "mb-1.5 block text-xs font-medium text-slate-400";

export default function CertificatesEditor({
  categories,
  certificates,
  onChange,
}: {
  categories: CategoryMeta[];
  certificates: Certificate[];
  onChange: (c: Certificate[]) => void;
}) {
  const [activeCat, setActiveCat] = useState<CertificateCategory>(
    categories[0]?.id ?? "voluntary"
  );

  const inCategory = certificates
    .filter((c) => c.category === activeCat)
    .sort((a, b) => a.order - b.order);

  const update = (id: string, patch: Partial<Certificate>) =>
    onChange(certificates.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const remove = (id: string) =>
    onChange(certificates.filter((c) => c.id !== id));

  // Reorder within the active category by swapping order values.
  const move = (id: string, dir: -1 | 1) => {
    const idx = inCategory.findIndex((c) => c.id === id);
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= inCategory.length) return;
    const a = inCategory[idx];
    const b = inCategory[swapWith];
    onChange(
      certificates.map((c) => {
        if (c.id === a.id) return { ...c, order: b.order };
        if (c.id === b.id) return { ...c, order: a.order };
        return c;
      })
    );
  };

  const add = () => {
    const nextOrder =
      inCategory.length > 0
        ? Math.max(...inCategory.map((c) => c.order)) + 1
        : 0;
    onChange([
      ...certificates,
      {
        id: `cert-${Date.now()}`,
        title: "New Certificate",
        issuer: "",
        date: new Date().getFullYear().toString(),
        description: "",
        category: activeCat,
        image: "/certificates/placeholder.png",
        order: nextOrder,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const count = certificates.filter(
            (c) => c.category === cat.id
          ).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={
                activeCat === cat.id
                  ? "rounded-lg bg-quantum-green/15 px-4 py-2 text-sm font-medium text-quantum-green"
                  : "rounded-lg border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
              }
            >
              {cat.label}{" "}
              <span className="ml-1 text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {categories.find((c) => c.id === activeCat)?.description}
        </p>
        <button
          onClick={add}
          className="inline-flex items-center gap-2 rounded-lg bg-quantum-cyan/15 px-3 py-2 text-sm font-medium text-quantum-cyan hover:bg-quantum-cyan/25"
        >
          <Plus className="h-4 w-4" /> Add Certificate
        </button>
      </div>

      {inCategory.length === 0 && (
        <p className="text-sm text-slate-500">
          No certificates in this category. Click “Add Certificate”.
        </p>
      )}

      {inCategory.map((cert, i) => (
        <div key={cert.id} className="glass rounded-2xl p-5">
          <div className="flex gap-4">
            {/* Preview thumbnail */}
            <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-void-900 sm:block">
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  #{i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(cert.id, -1)}
                    disabled={i === 0}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-void-700 hover:text-white disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => move(cert.id, 1)}
                    disabled={i === inCategory.length - 1}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-void-700 hover:text-white disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(cert.id)}
                    className="rounded-md p-1.5 text-red-400 hover:bg-red-500/10"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className={label}>Title</label>
                <input
                  className={field}
                  value={cert.title}
                  onChange={(e) => update(cert.id, { title: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>Issuer</label>
                  <input
                    className={field}
                    value={cert.issuer}
                    onChange={(e) =>
                      update(cert.id, { issuer: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={label}>Date</label>
                  <input
                    className={field}
                    value={cert.date}
                    onChange={(e) => update(cert.id, { date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className={label}>Description</label>
                <textarea
                  rows={2}
                  className={`${field} resize-none`}
                  value={cert.description}
                  onChange={(e) =>
                    update(cert.id, { description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>Image Path</label>
                  <input
                    className={field}
                    placeholder="/certificates/name.png"
                    value={cert.image}
                    onChange={(e) =>
                      update(cert.id, { image: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={label}>Category</label>
                  <select
                    className={field}
                    value={cert.category}
                    onChange={(e) =>
                      update(cert.id, {
                        category: e.target.value as CertificateCategory,
                      })
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
