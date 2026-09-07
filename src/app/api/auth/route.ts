import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";

// POST — login: compare submitted password against ADMIN_PASSWORD env var.
// On success, set an httpOnly session cookie holding ADMIN_SESSION_SECRET.
export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD ?? "changeme";
  const secret = process.env.ADMIN_SESSION_SECRET ?? "dev-secret";

  if (!password || password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  cookies().set(SESSION_COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return NextResponse.json({ ok: true });
}

// DELETE — logout: clear the session cookie.
export async function DELETE() {
  cookies().delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}

// GET — check current auth state (used by the admin page on load).
export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET ?? "dev-secret";
  return NextResponse.json({ authed: Boolean(token && token === secret) });
}
