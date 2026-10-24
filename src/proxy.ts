import { NextResponse, type NextRequest } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { leadsEnabled, reviewMode } from "@/lib/site-mode";

const notFound = () => new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Internal design reference: local review only.
  if (path.startsWith("/design-system")) return reviewMode ? NextResponse.next() : notFound();
  // Lead capture, confirmation and admin stay off until durable storage is configured.
  if (!leadsEnabled) return notFound();
  if (path.startsWith("/api/leads") || path.startsWith("/thank-you")) return NextResponse.next();
  const denied = adminGuard(request);
  if (denied) return denied;
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/api/leads/:path*", "/thank-you/:path*", "/design-system/:path*"] };
