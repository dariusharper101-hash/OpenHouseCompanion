import type { LeadFormData } from "@/types/lead";

export const BUYER_PLAN_KEY = "hop-buyer-plan-v1";
export type BuyerPlan = { areas: string; budget: string; bedrooms: string; mustHaves: string; readiness: string; origin: string };
export function parseBuyerPlan(raw: string | null): BuyerPlan | null {
  try {
    const p = JSON.parse(raw || "null");
    if (!p || typeof p !== "object" || Array.isArray(p)) return null;
    const fields = ["areas", "budget", "bedrooms", "mustHaves", "readiness", "origin"] as const;
    if (fields.some(k => typeof p[k] !== "string" || p[k].length > 500)) return null;
    if (!["exploring", "lender-needed", "approval-in-hand"].includes(p.readiness)) return null;
    return Object.fromEntries(fields.map(k => [k, p[k]])) as BuyerPlan;
  } catch { return null; }
}
export function planToInquiry(p: BuyerPlan): Partial<LeadFormData> {
  return {
    neighborhoods: p.areas, bedrooms: p.bedrooms,
    notes: `Buyer plan\nComfortable purchase budget: ${p.budget || "Still exploring"}\nMust-haves: ${p.mustHaves}\nReadiness (self-reported): ${p.readiness}\nRequested next step: area-specific shortlist and readiness conversation.`,
    source: p.origin === "social" ? "social-buyer-plan" : "buyer-plan",
    product: p.origin === "social" ? "social" : "website",
  };
}
