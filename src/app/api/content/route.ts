import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getContent, saveContent } from "@/lib/content";
import type { PortfolioContent } from "@/lib/types";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "admin_session";

function isAuthed(): boolean {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return Boolean(token && token === process.env.ADMIN_SESSION_SECRET);
}

// GET — public: return current content
export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

// PUT — protected: overwrite content with the posted payload
export async function PUT(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as PortfolioContent;
    // Minimal shape validation
    if (
      !body.profile ||
      !Array.isArray(body.certificates) ||
      !Array.isArray(body.papers) ||
      !Array.isArray(body.categories)
    ) {
      return NextResponse.json(
        { error: "Invalid content shape" },
        { status: 400 }
      );
    }
    await saveContent(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
