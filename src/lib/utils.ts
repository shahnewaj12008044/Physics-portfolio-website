import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize a Google Drive share link (or bare file id) into an embeddable
 * preview URL suitable for an <iframe>.
 */
export function driveEmbedUrl(linkOrId: string): string {
  if (!linkOrId) return "";
  // Already a preview URL
  if (linkOrId.includes("/preview")) return linkOrId;

  // Extract file id from common Drive URL shapes
  const fileMatch = linkOrId.match(/\/file\/d\/([^/]+)/);
  const openMatch = linkOrId.match(/[?&]id=([^&]+)/);
  const id = fileMatch?.[1] ?? openMatch?.[1] ?? linkOrId;

  return `https://drive.google.com/file/d/${id}/preview`;
}
