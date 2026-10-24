import { createHash, timingSafeEqual } from "node:crypto";

// Temporary single-operator gate. Individual identity/MFA is the next auth phase.
// Never accept documented defaults, even if copied into deployment settings.
const unsafePasswords = new Set(["openhouse", "change-me", "changeme", "password"]);
function equal(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}
export function isAdmin(headers: Pick<Headers, "get">): boolean {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!user?.trim() || !password || password.length < 16 || unsafePasswords.has(password.toLowerCase())) return false;
  const auth = headers.get("authorization");
  if (!auth || auth.length > 4096) return false;
  const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(auth);
  if (!match) return false;
  const decoded = Buffer.from(match[1], "base64").toString("utf8");
  const separator = decoded.indexOf(":");
  if (separator < 1) return false;
  const validUser = equal(decoded.slice(0, separator), user);
  const validPassword = equal(decoded.slice(separator + 1), password);
  return validUser && validPassword;
}
export function adminGuard(request: Request): Response | null {
  if (!isAdmin(request.headers)) {
    return new Response("Authentication required", { status: 401, headers: {
      "WWW-Authenticate": 'Basic realm="Hop In Real Estate Admin", charset="UTF-8"',
      "Cache-Control": "private, no-store",
    }});
  }
  // Browsers attach Origin to mutations. Basic credentials alone do not prevent CSRF.
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin !== new URL(request.url).origin) {
      return new Response("Forbidden", { status: 403, headers: { "Cache-Control": "private, no-store" }});
    }
  }
  return null;
}
