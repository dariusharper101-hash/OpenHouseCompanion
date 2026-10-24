import { storageMode, StorageConfigurationError } from "@/lib/storage-config";
import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/leads";
import { notifyNewLead } from "@/lib/notify";
import type { LeadFormData, LeadProduct } from "@/types/lead";

// ─── POST /api/leads ──────────────────────────────────────────────────────────
// Intake for the /start form and the open-house sign-in. The saved record is
// built ONLY from the allowlist below, so a caller can't forge fields this
// form never collects (specials-guide product, TCPA consent, moveMonth...).
// The specials guide has its own endpoint: /api/specials.

const ALLOWED_PRODUCTS: LeadProduct[] = ["website", "social", "open-house"];

const STRING_FIELDS = [
  "role", "clientType", "firstName", "lastName", "email", "phone", "timeline",
  "budgetMin", "budgetMax", "propertyType", "bedrooms", "bathrooms",
  "neighborhoods", "purchasePurpose", "employmentType", "creditRange",
  "investorStrategy", "propertiesOwned", "sellerAddress", "sellerEstimatedValue",
  "sellerMortgageStatus", "sellerReason", "sellerTimeline", "notes", "source",
] as const;

const BOOLEAN_FIELDS = [
  "isPreApproved", "ownedHomeLast3Years", "isVeteran", "buyingSimultaneously",
  "iabsAcknowledged", "buyerRepAcknowledged",
] as const;

const MAX_STRING = 2000;

function pickLead(body: Record<string, unknown>, product: LeadProduct): LeadFormData {
  const out: Record<string, unknown> = { product };
  for (const k of STRING_FIELDS) {
    const v = body[k];
    if (typeof v === "string") out[k] = v.slice(0, MAX_STRING);
  }
  for (const k of BOOLEAN_FIELDS) {
    if (typeof body[k] === "boolean") out[k] = body[k];
  }
  return out as unknown as LeadFormData;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Missing product keeps the historical default (open-house, set in addLead).
  const rawProduct = body.product ?? "open-house";
  if (!ALLOWED_PRODUCTS.includes(rawProduct as LeadProduct)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }
  const input = pickLead(body, rawProduct as LeadProduct);

  try {
    const required = ["firstName", "lastName", "email", "phone", "role"] as const;
    for (const field of required) {
      if (!input[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(input.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!input.iabsAcknowledged) {
      return NextResponse.json(
        { error: "IABS acknowledgment is required" },
        { status: 400 }
      );
    }

    storageMode();
    const lead = await addLead(input);

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
