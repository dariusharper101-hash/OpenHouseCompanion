import { storageMode, StorageConfigurationError } from "@/lib/storage-config";
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

    storageMode();
    const lead = await addLead(body);

    // Best-effort notification, bounded to five seconds. Durable outbox follows separately.
    await notifyNewLead(lead);

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("Lead submission failed", { category: err instanceof StorageConfigurationError ? "storage-configuration" : "submission" });
    return NextResponse.json(
      { error: "We could not confirm your submission. Please try again or contact the agent." },
      { status: err instanceof StorageConfigurationError ? 503 : 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
