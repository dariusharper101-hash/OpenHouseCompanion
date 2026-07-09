import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/leads";
import { notifyNewLead } from "@/lib/notify";
import type { LeadFormData } from "@/types/lead";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadFormData;

    const required = ["firstName", "lastName", "email", "phone", "role"] as const;
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!body.iabsAcknowledged) {
      return NextResponse.json(
        { error: "IABS acknowledgment is required" },
        { status: 400 }
      );
    }

    const lead = await addLead(body);

    // Best-effort notification — never blocks or fails the submission.
    await notifyNewLead(lead);

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (err) {
    // Surface the real reason in the server logs (Vercel → Logs) AND in the
    // response `detail` so misconfiguration (missing table, bad key, RLS) is
    // diagnosable during setup. `detail` is safe to remove once things are green.
    console.error("Lead submission failed:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
