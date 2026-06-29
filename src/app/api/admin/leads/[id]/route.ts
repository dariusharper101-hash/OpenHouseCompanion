import { NextRequest, NextResponse } from "next/server";
import { updateLeadStatus } from "@/lib/leads";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/leads/[id]">
) {
  const { id } = await ctx.params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const status = body.status as LeadStatus;
  if (!status || !LEAD_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${LEAD_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const lead = await updateLeadStatus(id, status);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(lead);
}
