// ---------------------------------------------------------------------------
// Central TypeScript interfaces for all dynamic portfolio content.
// These mirror the JSON structure persisted in data/content.json and returned
// by the /api/content route. The admin panel edits objects of these shapes.
// ---------------------------------------------------------------------------

export type CertificateCategory =
  | "voluntary"
  | "academic"
  | "leadership"
  | "physics";

export interface CategoryMeta {
  id: CertificateCategory;
  label: string;
  description: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string; // ISO or human-readable, e.g. "2023-06" or "June 2023"
  description: string;
  category: CertificateCategory;
  image: string; // path under /public or remote URL
  order: number; // sort order within its category
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  venue: string; // journal / conference / repository
  date: string;
  // Google Drive file id OR full drive share link. The reader normalizes it.
  driveLink: string;
  tags: string[];
  order: number;
}

export interface SocialLink {
  label: string;
  value: string; // display value (email address, username)
  href: string; // clickable target
  icon: "email" | "github" | "linkedin" | "scholar";
}

export interface Profile {
  name: string;
  headline: string;
  bio: string;
  location: string;
  avatar?: string;
  socials: SocialLink[];
}

export interface PortfolioContent {
  profile: Profile;
  categories: CategoryMeta[];
  certificates: Certificate[];
  papers: ResearchPaper[];
}
