import { SPECIALS_BUDGETS, MOVE_MONTHS, DFW_AREAS, AREA_NOT_SURE } from "@/config/rental";

// ─── /specials form validation ────────────────────────────────────────────────
// Pure functions shared by the client form (instant inline errors) and
// /api/specials (the authority). No server-only imports here.

export interface SpecialsInput {
  name: string;
  phone: string;
  moveMonth: string;
  budget: string;
  areas: string[];
  textConsent: boolean;
}

export type SpecialsField = "name" | "phone" | "moveMonth" | "budget" | "areas";
export type SpecialsErrors = Partial<Record<SpecialsField, string>>;

// 10-digit US number → "+1XXXXXXXXXX", or null if it isn't a real-looking
// number. Rejects area codes/exchanges starting 0/1 and the fictional
// 555-01xx block.
export function normalizeUsPhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) return null;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d)) return null;
  if (d.slice(3, 6) === "555" && d.slice(6, 8) === "01") return null;
  return `+1${d}`;
}

// Progressive "(214) 555-0123" formatting as the renter types.
export function formatUsPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length > 10 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// Strip control characters and collapse whitespace.
export function cleanText(raw: unknown, max: number): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function validateSpecials(input: SpecialsInput): SpecialsErrors {
  const e: SpecialsErrors = {};
  const name = cleanText(input.name, 200);
  if (!name) e.name = "Enter your name.";
  else if (name.length > 80) e.name = "Use 80 characters or fewer.";

  if (!input.phone.trim()) e.phone = "Enter your mobile number.";
  else if (!normalizeUsPhone(input.phone)) e.phone = "Enter a 10-digit US phone number.";

  if (!(MOVE_MONTHS as readonly string[]).includes(input.moveMonth)) e.moveMonth = "Pick your move month.";
  if (!(SPECIALS_BUDGETS as readonly string[]).includes(input.budget)) e.budget = "Pick a budget range.";

  const areas = input.areas;
  if (!Array.isArray(areas) || areas.length === 0) e.areas = "Pick at least one area.";
  else if (
    areas.some((a) => !(DFW_AREAS as readonly string[]).includes(a)) ||
    new Set(areas).size !== areas.length ||
    (areas.includes(AREA_NOT_SURE) && areas.length > 1)
  ) {
    e.areas = "Pick areas from the list.";
  }
  return e;
}
