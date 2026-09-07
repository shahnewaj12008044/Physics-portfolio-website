# Quantum Portfolio

A modern, responsive scholarship portfolio for a physics researcher and full-stack web developer. Built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, and **TypeScript**. Themed around nuclear physics and quantum mechanics with an interactive fission canvas, a custom neutron cursor, a filterable certificates gallery, an embedded Google Drive PDF reader, and a password-protected admin CMS.

## Features

- **Interactive fission hero** — a two-column hero with the copy on the left and the atom on the right. The `<canvas>` spans the full section, so free neutrons streak the whole width before colliding with the nucleus and bursting into fragments, fresh neutrons, and energy particles. Click anywhere to fire a neutron.
- **Neutron cursor** — desktop-only glowing custom pointer with a particle trail (auto-disabled on touch devices and when reduced motion is preferred).
- **Responsive navigation** — full-width glassmorphism bar pinned to the top on laptop/desktop, full-width app-style bar docked to the bottom on mobile.
- **Categorized certificates gallery** — filterable tabs (Voluntary, Marksheets/Academic, Leadership, Physics Competition) with 3D tilt cards and a zoom modal.
- **Research section (primary focus)** — its own section directly below the hero, with each paper's Google Drive PDF embedded inline so readers stay on the site, plus a fullscreen modal and a direct Drive link.
- **Contact section** — social links with copy-to-clipboard and a mailto contact form.
- **Admin CMS at `/admin`** — password login; edit profile, papers, and certificates; reorder items; changes persist to `data/content.json`.

## Tech Stack

| Concern        | Choice                          |
| -------------- | ------------------------------- |
| Framework      | Next.js 14 (App Router)         |
| Language       | TypeScript                      |
| Styling        | Tailwind CSS                    |
| Animation      | Framer Motion + Canvas API      |
| Icons          | lucide-react                    |
| Persistence    | Local JSON (`data/content.json`)|

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set your own admin credentials:

```bash
cp .env.local.example .env.local
```

```env
ADMIN_PASSWORD=your-password-here
ADMIN_SESSION_SECRET=a-long-random-string
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

### 4. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
.
├── data/
│   └── content.json              # The content "database" (profile, certs, papers)
├── public/
│   ├── certificates/             # Certificate images (served statically)
│   └── papers/                   # (optional) local PDF assets
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout, fonts, cursor mount
│   │   ├── page.tsx              # Home — composes all sections
│   │   ├── globals.css           # Tailwind + theme utilities
│   │   ├── admin/
│   │   │   └── page.tsx          # Protected CMS dashboard
│   │   └── api/
│   │       ├── auth/route.ts     # Login / logout / session check
│   │       └── content/route.ts  # GET (public) + PUT (protected)
│   ├── components/
│   │   ├── NeutronCursor.tsx     # Custom desktop cursor
│   │   ├── FissionCanvas.tsx     # Nuclear fission canvas animation
│   │   ├── Navbar.tsx            # Responsive top/bottom nav
│   │   ├── Hero.tsx              # Hero section
│   │   ├── Research.tsx          # Research section + inline Drive readers
│   │   ├── About.tsx             # About cards
│   │   ├── PdfModal.tsx          # Google Drive PDF reader modal
│   │   ├── Certificates.tsx      # Filterable gallery
│   │   ├── CertificateCard.tsx   # Tilt card
│   │   ├── CertificateModal.tsx  # Zoom modal
│   │   ├── Contact.tsx           # Contact details + form
│   │   └── admin/
│   │       ├── ProfileEditor.tsx
│   │       ├── PapersEditor.tsx
│   │       └── CertificatesEditor.tsx
│   └── lib/
│       ├── types.ts              # Shared TypeScript interfaces
│       ├── content.ts            # JSON read/write helpers (server-only)
│       └── utils.ts              # cn() + Google Drive URL helper
└── ...config files
```

## Content Schema

All dynamic content lives in `data/content.json`, typed by `src/lib/types.ts`:

- **`profile`** — name, headline, bio, location, and `socials[]` (email, GitHub, LinkedIn, Google Scholar).
- **`categories[]`** — the four certificate categories (`id`, `label`, `description`).
- **`certificates[]`** — `id`, `title`, `issuer`, `date`, `description`, `category`, `image`, `order`.
- **`papers[]`** — `id`, `title`, `abstract`, `authors`, `venue`, `date`, `driveLink`, `tags[]`, `order`.

### Google Drive PDF links

In the admin Papers editor, paste a standard Drive share link:

```
https://drive.google.com/file/d/FILE_ID/view
```

`driveEmbedUrl()` in `src/lib/utils.ts` normalizes it to the `/preview` embed form. Make sure the file's sharing is set to **"Anyone with the link"**.

## Admin Panel

1. Go to `/admin` and log in with `ADMIN_PASSWORD`.
2. Edit the **Profile**, **Research Papers**, and **Certificates** tabs.
3. Reorder papers and certificates with the up/down arrows (per category).
4. Click **Save Changes** to persist to `data/content.json`.

Auth is a lightweight httpOnly cookie session. It's intended as a simple guard for a single owner, not multi-user auth.

## Deployment Notes

The admin panel writes to `data/content.json` on the local filesystem. This works on a persistent server (VPS, `npm start`, Docker with a volume). On **serverless** platforms (e.g. Vercel) the filesystem is read-only at runtime, so the site renders fine but admin saves won't persist. To deploy admin writes on serverless, swap the two functions in `src/lib/content.ts` for a MongoDB or Supabase client — the content shape is identical.

## License

Personal portfolio project. Certificate images belong to their respective issuers.
