import { adminGuard } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { readLeads } from "@/lib/leads";

export async function GET(req: Request) {
  const denied = adminGuard(req);
  if (denied) return denied;
  const leads = await readLeads();
  // Newest first
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(leads, { headers: { "Cache-Control": "private, no-store" } });
}
