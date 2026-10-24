import type { LeadFormData, LeadProduct } from "@/types/lead";

// ─── /api/leads input allowlist ───────────────────────────────────────────────
// The saved record is built ONLY from these fields, so a caller can't forge
// fields the /start form never collects (specials-guide product, TCPA
// consent, moveMonth...).

export const STRING_FIELDS = [
  "role", "clientType", "firstName", "lastName", "email", "phone", "timeline",
  "budgetMin", "budgetMax", "propertyType", "bedrooms", "bathrooms",
  "neighborhoods", "purchasePurpose", "employmentType", "creditRange",
  "investorStrategy", "propertiesOwned", "sellerAddress", "sellerEstimatedValue",
  "sellerMortgageStatus", "sellerReason", "sellerTimeline", "notes", "source",
] as const;

export const BOOLEAN_FIELDS = [
  "isPreApproved", "ownedHomeLast3Years", "isVeteran", "buyingSimultaneously",
  "iabsAcknowledged", "buyerRepAcknowledged",
] as const;

export const MAX_STRING = 2000;
// Notes can hold the visitor's own notes (NOTES_USER_MAX on the textarea) plus
// an included journey plan (up to 4000, journey-brief.ts), so they get more room.
export const NOTES_USER_MAX = 5000;
export const MAX_NOTES = 10000;

export function pickLead(body: Record<string, unknown>, product: LeadProduct): LeadFormData {
  const out: Record<string, unknown> = { product };
  for (const k of STRING_FIELDS) {
    const v = body[k];
    if (typeof v === "string") out[k] = v.slice(0, k === "notes" ? MAX_NOTES : MAX_STRING);
  }
  for (const k of BOOLEAN_FIELDS) {
    if (typeof body[k] === "boolean") out[k] = body[k];
  }
  return out as unknown as LeadFormData;
}
