"use client";

import type { Profile, SocialLink } from "@/lib/types";

const field =
  "w-full rounded-lg border border-slate-700 bg-void-900 px-3 py-2.5 text-sm text-white outline-none focus:border-quantum-cyan";
const label = "mb-1.5 block text-xs font-medium text-slate-400";

export default function ProfileEditor({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (p: Profile) => void;
}) {
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    onChange({ ...profile, [key]: value });

  const setSocial = (i: number, patch: Partial<SocialLink>) => {
    const socials = profile.socials.map((s, idx) =>
      idx === i ? { ...s, ...patch } : s
    );
    onChange({ ...profile, socials });
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">
          Profile
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Name</label>
            <input
              className={field}
              value={profile.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Location</label>
            <input
              className={field}
              value={profile.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={label}>Headline</label>
          <input
            className={field}
            value={profile.headline}
            onChange={(e) => set("headline", e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className={label}>Bio</label>
          <textarea
            rows={4}
            className={`${field} resize-none`}
            value={profile.bio}
            onChange={(e) => set("bio", e.target.value)}
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">
          Contact & Social Links
        </h2>
        <div className="space-y-4">
          {profile.socials.map((s, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-xl border border-slate-800 p-4 sm:grid-cols-3"
            >
              <div>
                <label className={label}>Label</label>
                <input
                  className={field}
                  value={s.label}
                  onChange={(e) => setSocial(i, { label: e.target.value })}
                />
              </div>
              <div>
                <label className={label}>Display Value</label>
                <input
                  className={field}
                  value={s.value}
                  onChange={(e) => setSocial(i, { value: e.target.value })}
                />
              </div>
              <div>
                <label className={label}>Link (href)</label>
                <input
                  className={field}
                  value={s.href}
                  onChange={(e) => setSocial(i, { href: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
