import type { DfwArea } from "@/config/rental";

// ─── DFW move-in specials guide (/specials) ───────────────────────────────────
// Single source of truth for the guide. Edit entries here; the page re-reads
// this file on every deploy and re-checks expiry hourly (revalidate = 3600).
//
// CONTENT RULES (PLAN §7) — read before adding an entry:
//   - Public sources only: the property's own website/listing, or a call to
//     the leasing office. NEVER from a locator company's IG/TT sheets, NestQuest,
//     Lead Availability or any other broker file.
//   - Darius checks every property against the Block/Grey list himself.
//   - No commission or locator-fee figures, ever.
//   - Every entry needs verifiedOn + expiresOn. Expired entries hide
//     automatically; with fewer than MIN_TO_SHOW left the page says
//     "Guide being refreshed".
//   - Naming a community may need its permission under the broker's locator
//     agreements. Ask the broker before publishing real names.
//   - Fair Housing: describe the special and the property, never the people.
//
// Every entry below is a SAMPLE placeholder so the page can be reviewed.
// TODO(Darius): replace all SAMPLE entries with verified specials, then set
// approvedBy / approvedOn once the broker signs off.

export interface Special {
  id: string;
  property: string;
  area: Exclude<DfwArea, "Not sure yet">;
  special: string;        // e.g. "6 weeks free"
  conditions: string;     // e.g. "On 13-month leases, select 1-bed homes"
  startingAt?: number;    // advertised starting monthly rent, USD
  monthsFree?: number;    // used only for the "worth about $X/mo" line
  leaseMonths?: number;   // used only for the "worth about $X/mo" line
  source: string;         // where it was verified (public source only)
  verifiedOn: string;     // YYYY-MM-DD
  expiresOn: string;      // YYYY-MM-DD (last day the special is shown)
}

export const SPECIALS_GUIDE = {
  // Kill switch: false shows "Guide being refreshed" and hides the form.
  enabled: true,
  // true while every entry is a placeholder; shows a SAMPLE banner on the page.
  sample: true,
  lastUpdated: "2026-10-23",
  approvedBy: "", // TODO(Darius): broker approver name once approved in writing
  approvedOn: "", // TODO(Darius): YYYY-MM-DD of written broker approval
  // When Darius promises the first text. Reads after "I'll send a personal
  // text to (214) 555-0123 ...", so keep it a phrase that ends the sentence.
  textPromise: "within one business day, between 9 am and 9 pm (noon to 9 pm Sunday)",
} as const;

export const MIN_TO_SHOW = 5;

export const SPECIALS: Special[] = [
  {
    id: "sample-uptown-a",
    property: "SAMPLE — Uptown community A",
    area: "Uptown & Downtown Dallas",
    special: "6 weeks free",
    conditions: "On 13-month leases for select 1-bedroom homes",
    startingAt: 1650,
    monthsFree: 1.5,
    leaseMonths: 13,
    source: "SAMPLE — property website",
    verifiedOn: "2026-10-22",
    expiresOn: "2026-12-31",
  },
  {
    id: "sample-downtown-b",
    property: "SAMPLE — Downtown community B",
    area: "Uptown & Downtown Dallas",
    special: "1 month free + waived application fee",
    conditions: "Move in by Dec 31 on a 12-month lease",
    startingAt: 1495,
    monthsFree: 1,
    leaseMonths: 12,
    source: "SAMPLE — call to leasing office",
    verifiedOn: "2026-10-22",
    expiresOn: "2026-12-31",
  },
  {
    id: "sample-east-c",
    property: "SAMPLE — East Dallas community C",
    area: "East Dallas & Deep Ellum",
    special: "Waived admin fee",
    conditions: "On any 12-month or longer lease",
    startingAt: 1325,
    source: "SAMPLE — property website",
    verifiedOn: "2026-10-22",
    expiresOn: "2027-01-31",
  },
  {
    id: "sample-lascolinas-d",
    property: "SAMPLE — Las Colinas community D",
    area: "Las Colinas & Irving",
    special: "8 weeks free",
    conditions: "Select 2-bedroom homes, 14-month lease",
    startingAt: 1890,
    monthsFree: 2,
    leaseMonths: 14,
    source: "SAMPLE — property listing",
    verifiedOn: "2026-10-22",
    expiresOn: "2026-12-15",
  },
  {
    id: "sample-plano-e",
    property: "SAMPLE — Plano community E",
    area: "Plano & Richardson",
    special: "Reduced deposit + 2 weeks free",
    conditions: "Approved applicants, 12-month lease",
    startingAt: 1410,
    monthsFree: 0.5,
    leaseMonths: 12,
    source: "SAMPLE — call to leasing office",
    verifiedOn: "2026-10-22",
    expiresOn: "2027-01-15",
  },
  {
    id: "sample-frisco-f",
    property: "SAMPLE — Frisco community F",
    area: "Frisco & The Colony",
    special: "1 month free",
    conditions: "Move in by Jan 15 on a 13-month lease",
    startingAt: 1575,
    monthsFree: 1,
    leaseMonths: 13,
    source: "SAMPLE — property website",
    verifiedOn: "2026-10-22",
    expiresOn: "2027-01-15",
  },
  {
    id: "sample-fortworth-g",
    property: "SAMPLE — Fort Worth community G",
    area: "Fort Worth",
    special: "Waived application and admin fees",
    conditions: "New residents only",
    startingAt: 1195,
    source: "SAMPLE — property listing",
    verifiedOn: "2026-10-22",
    expiresOn: "2027-02-28",
  },
  {
    // Already expired on purpose: proves auto-hide during QA. Remove with the
    // other SAMPLE entries.
    id: "sample-arlington-expired",
    property: "SAMPLE — Arlington community H (expired)",
    area: "Arlington & Grand Prairie",
    special: "1 month free",
    conditions: "Expired sample; should never appear on the page",
    startingAt: 1250,
    source: "SAMPLE",
    verifiedOn: "2026-09-01",
    expiresOn: "2026-10-01",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Today's date in Dallas, as YYYY-MM-DD, so expiry flips at local midnight.
export function todayInDallas(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// Specials still in date (expiresOn is inclusive).
export function activeSpecials(now: Date = new Date()): Special[] {
  const today = todayInDallas(now);
  return SPECIALS.filter((s) => s.expiresOn >= today);
}

// "Worth about $X/mo" — the free rent spread across the lease. Only shown when
// the entry has all three numbers; never a promise of the renter's actual rent.
export function monthlyValue(s: Special): number | null {
  if (!s.startingAt || !s.monthsFree || !s.leaseMonths) return null;
  return Math.round((s.startingAt * s.monthsFree) / s.leaseMonths);
}

// "2026-10-22" → "Oct 22, 2026" without timezone drift.
export function fmtGuideDate(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
