import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ohc_admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
