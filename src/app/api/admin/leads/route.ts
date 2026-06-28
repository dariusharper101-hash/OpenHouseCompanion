import { NextResponse } from "next/server";
import { readLeads } from "@/lib/leads";

export async function GET() {
  const leads = await readLeads();
  // Newest first
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(leads);
}
