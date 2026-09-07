"use client";

import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import type { ResearchPaper } from "@/lib/types";

const field =
  "w-full rounded-lg border border-slate-700 bg-void-900 px-3 py-2.5 text-sm text-white outline-none focus:border-quantum-cyan";
const label = "mb-1.5 block text-xs font-medium text-slate-400";

export default function PapersEditor({
  papers,
  onChange,
}: {
  papers: ResearchPaper[];
  onChange: (p: ResearchPaper[]) => void;
}) {
  const sorted = [...papers].sort((a, b) => a.order - b.order);

  const update = (id: string, patch: Partial<ResearchPaper>) =>
    onChange(papers.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const remove = (id: string) => onChange(papers.filter((p) => p.id !== id));

  // Reorder by swapping order values with the neighbor in the sorted list.
  const move = (id: string, dir: -1 | 1) => {
    const idx = sorted.findIndex((p) => p.id === id);
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapWith];
    onChange(
      papers.map((p) => {
        if (p.id === a.id) return { ...p, order: b.order };
        if (p.id === b.id) return { ...p, order: a.order };
        return p;
      })
    );
  };

  const add = () => {
    const nextOrder =
      papers.length > 0 ? Math.max(...papers.map((p) => p.order)) + 1 : 0;
    onChange([
      ...papers,
      {
        id: `paper-${Date.now()}`,
        title: "New Paper",
        abstract: "",
        authors: "",
        venue: "",
        date: new Date().getFullYear().toString(),
        driveLink: "",
        tags: [],
        order: nextOrder,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-white">
          Research Papers
        </h2>
        <button
          onClick={add}
          className="inline-flex items-center gap-2 rounded-lg bg-quantum-cyan/15 px-3 py-2 text-sm font-medium text-quantum-cyan hover:bg-quantum-cyan/25"
        >
          <Plus className="h-4 w-4" /> Add Paper
        </button>
      </div>

      {sorted.map((paper, i) => (
        <div key={paper.id} className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              #{i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => move(paper.id, -1)}
                disabled={i === 0}
                className="rounded-md p-1.5 text-slate-400 hover:bg-void-700 hover:text-white disabled:opacity-30"
                aria-label="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => move(paper.id, 1)}
                disabled={i === sorted.length - 1}
                className="rounded-md p-1.5 text-slate-400 hover:bg-void-700 hover:text-white disabled:opacity-30"
                aria-label="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(paper.id)}
                className="rounded-md p-1.5 text-red-400 hover:bg-red-500/10"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className={label}>Title</label>
              <input
                className={field}
                value={paper.title}
                onChange={(e) => update(paper.id, { title: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={label}>Authors</label>
                <input
                  className={field}
                  value={paper.authors}
                  onChange={(e) =>
                    update(paper.id, { authors: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Venue</label>
                <input
                  className={field}
                  value={paper.venue}
                  onChange={(e) => update(paper.id, { venue: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={label}>Abstract</label>
              <textarea
                rows={3}
                className={`${field} resize-none`}
                value={paper.abstract}
                onChange={(e) =>
                  update(paper.id, { abstract: e.target.value })
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={label}>Date</label>
                <input
                  className={field}
                  value={paper.date}
                  onChange={(e) => update(paper.id, { date: e.target.value })}
                />
              </div>
              <div>
                <label className={label}>Tags (comma-separated)</label>
                <input
                  className={field}
                  value={paper.tags.join(", ")}
                  onChange={(e) =>
                    update(paper.id, {
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className={label}>Google Drive View Link</label>
              <input
                className={field}
                placeholder="https://drive.google.com/file/d/.../view"
                value={paper.driveLink}
                onChange={(e) =>
                  update(paper.id, { driveLink: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
