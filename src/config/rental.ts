// ─── Shared rental (leasing) options ─────────────────────────────────────────
// Used by the /start rental flow and the /specials guide form. Areas are
// chosen by geography only (Fair Housing): no descriptions of who lives there.

// /start rental flow: monthly budget ranges (stored in budgetMin).
export const RENT_BUDGETS = [
  "Under $1,000/mo", "$1,000 – $1,500/mo", "$1,500 – $2,000/mo",
  "$2,000 – $2,500/mo", "$2,500 – $3,500/mo", "$3,500+/mo",
];

// /specials form: narrower bands that match where DFW specials cluster.
export const SPECIALS_BUDGETS = [
  "Under $1,000",
  "$1,000 – $1,299",
  "$1,300 – $1,599",
  "$1,600 – $1,999",
  "$2,000 – $2,499",
  "$2,500+",
  "Not sure yet",
] as const;

export const MOVE_MONTHS = [
  "Dec 2026",
  "Jan 2027",
  "Feb 2027",
  "Later",
  "Not sure yet",
] as const;

// "Not sure yet" is exclusive: picking it clears the others (and vice versa).
export const AREA_NOT_SURE = "Not sure yet";

export const DFW_AREAS = [
  "Uptown & Downtown Dallas",
  "East Dallas & Deep Ellum",
  "North Dallas & Addison",
  "Las Colinas & Irving",
  "Plano & Richardson",
  "Frisco & The Colony",
  "Fort Worth",
  "Arlington & Grand Prairie",
  AREA_NOT_SURE,
] as const;

export type DfwArea = (typeof DFW_AREAS)[number];
