import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protects the agent dashboard and its API with HTTP Basic Auth.
// Credentials are read from env vars; falls back to dev defaults locally.
// NOTE: Basic Auth is an optimistic gate suitable for a single-agent tool.
// For multi-user production, replace with a real session/auth provider.

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "openhouse";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Hop In Real Estate Admin", charset="UTF-8"',
    },
  });
}

export function proxy(request: NextRequest) {
  const auth = request.headers.get("authorization");

  if (!auth || !auth.startsWith("Basic ")) {
    return unauthorized();
  }

  let user = "";
  let pass = "";
  try {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(":");
    user = decoded.slice(0, idx);
    pass = decoded.slice(idx + 1);
  } catch {
    return unauthorized();
  }

  if (user !== ADMIN_USER || pass !== ADMIN_PASSWORD) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
