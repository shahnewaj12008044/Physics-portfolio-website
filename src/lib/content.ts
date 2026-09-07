import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { PortfolioContent } from "./types";

// Absolute path to the JSON "database". In a serverless deploy this file is
// read-only; for full write persistence on such platforms, swap the two
// functions below for a MongoDB / Supabase client (schema is identical).
const DATA_PATH = path.join(process.cwd(), "data", "content.json");

export async function getContent(): Promise<PortfolioContent> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as PortfolioContent;
}

export async function saveContent(content: PortfolioContent): Promise<void> {
  const serialized = JSON.stringify(content, null, 2);
  await fs.writeFile(DATA_PATH, serialized, "utf-8");
}
