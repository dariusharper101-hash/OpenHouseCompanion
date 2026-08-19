// ─── Curated home list ────────────────────────────────────────────────────────
// This is the single source of truth for the shareable property list rendered at
// /list. Update THIS file whenever the list changes — the page, the grouping, and
// the copy-paste text version all read from here.
//
// HOW TO UPDATE A HOME
//   1. photo         → the BEST photo of the house. Easiest path: save the photo
//                      from the listing into /public/listings/ and point to it,
//                      e.g. photo: "/listings/416-mount-auburn.jpg". A full remote
//                      https:// URL also works if the image is publicly hotlinkable.
//                      Leave "" and the card shows a clean placeholder.
//   2. daysOnMarket  → number of days on market (drives the sort + the DOM badge).
//                      Use null if unknown.
//   3. price         → list price in whole dollars, e.g. 285000. null hides it.
//   4. beds / baths / sqft → null hides that stat.
//   5. status        → "active" | "pending" | "coming-soon" | "sold". Defaults active.
//   6. note          → one short line ("New roof", "Corner lot", "Investor special").
//
// Everything else (address, neighborhood grouping, listing link) is already filled
// in from Jo's list. Add or remove homes by editing the HOMES array.

export type HomeStatus = "active" | "pending" | "coming-soon" | "sold";

export interface Home {
  /** Street line, e.g. "416 Mount Auburn Ave". */
  street: string;
  city: string;
  state: string;
  zip: string;
  /** Listing link (prospects.com share link from the MLS). */
  link: string;
  /** Best photo: a /public path ("/listings/foo.jpg") or full https:// URL. "" → placeholder. */
  photo: string;
  /** Days on market. Drives sort order and the badge. null = unknown. */
  daysOnMarket: number | null;
  /** List price in whole dollars. null hides it. */
  price: number | null;
  beds: number | null;
  baths: number | null;
  /** Interior square footage. */
  sqft: number | null;
  status: HomeStatus;
  /** One short highlight line. */
  note: string;
}

// Name + timestamp shown at the top of the shared page.
export const LIST_META = {
  name: "Jo's House List",
  // Update when you refresh the list. Shown as "Updated {date}".
  updatedOn: "August 19, 2026",
};

// Dallas ZIP → neighborhood label used for the location grouping.
// Add ZIPs here as the search area expands.
const NEIGHBORHOOD_BY_ZIP: Record<string, string> = {
  "75223": "East Dallas",
  "75212": "West Dallas",
  "75211": "Oak Cliff",
  "75215": "South Dallas",
};

// Order the neighborhood sections appear in on the page.
const NEIGHBORHOOD_ORDER = ["East Dallas", "West Dallas", "Oak Cliff", "South Dallas"];

export function neighborhoodFor(home: Home): string {
  return NEIGHBORHOOD_BY_ZIP[home.zip] ?? `Dallas ${home.zip}`;
}

// ─── The homes ────────────────────────────────────────────────────────────────
// NOTE ON THE NUMBERS: price / beds / baths / sqft below were pulled from public
// real-estate listings (Zillow, Redfin, HAR, etc.) via web search in Aug 2026 as
// a starting point — the prospects.com MLS links couldn't be read directly. Treat
// them as DRAFT and confirm against the MLS before sending. `note: "⚠︎ …"` marks
// homes where public sources conflicted. daysOnMarket is left null everywhere
// because it isn't reliably public — fill it from your MLS (it drives the sort).
export const HOMES: Home[] = [
  {
    street: "416 Mount Auburn Ave",
    city: "Dallas",
    state: "TX",
    zip: "75223",
    link: "https://us-east.prospects.com/prospects/m.do?tk=8cb98cacad611e36de56798e03a17495",
    photo: "",
    daysOnMarket: null,
    price: 899900,
    beds: 5,
    baths: 4.5,
    sqft: 4181,
    status: "active",
    note: "New construction",
  },
  {
    street: "713 Wayne St",
    city: "Dallas",
    state: "TX",
    zip: "75223",
    link: "https://us-east.prospects.com/prospects/m.do?tk=62d4694371e217cb213dc524d148aa89",
    photo: "",
    daysOnMarket: null,
    price: 759000,
    beds: 4,
    baths: 4.5,
    sqft: 3068,
    status: "active",
    note: "New construction near Santa Fe Trail",
  },
  {
    street: "1018 Grandview Ave",
    city: "Dallas",
    state: "TX",
    zip: "75223",
    link: "https://us-east.prospects.com/prospects/m.do?tk=981dc69537bf2e6c8498d67ea9aebf24",
    photo: "",
    daysOnMarket: null,
    price: 940000,
    beds: 5,
    baths: 4,
    sqft: 3300,
    status: "active",
    note: "New construction",
  },
  {
    street: "1904 McBroom St",
    city: "Dallas",
    state: "TX",
    zip: "75212",
    link: "https://us-east.prospects.com/prospects/m.do?tk=9c91751e2cab7beb64997c5882506ae2",
    photo: "",
    daysOnMarket: null,
    price: null,
    beds: null,
    baths: null,
    sqft: null,
    status: "active",
    note: "⚠︎ Public listings conflict — confirm price/beds/baths/sqft from MLS",
  },
  {
    street: "1943 McBroom St",
    city: "Dallas",
    state: "TX",
    zip: "75212",
    link: "https://us-east.prospects.com/prospects/m.do?tk=83fc09144895689787a4b5f2e1f72216",
    photo: "",
    daysOnMarket: null,
    price: 660000,
    beds: 4,
    baths: 4,
    sqft: 2900,
    status: "active",
    note: "New construction (2024)",
  },
  {
    street: "3418 Borger St",
    city: "Dallas",
    state: "TX",
    zip: "75212",
    link: "https://us-east.prospects.com/prospects/m.do?tk=c3209457567763485190e29108bf16e4",
    photo: "",
    daysOnMarket: null,
    price: 687000,
    beds: 6,
    baths: 4,
    sqft: 3259,
    status: "active",
    note: "⚠︎ Price shown online ranges $659K–$705K — confirm",
  },
  {
    street: "1951 Leath St",
    city: "Dallas",
    state: "TX",
    zip: "75212",
    link: "https://us-east.prospects.com/prospects/m.do?tk=648cd8c21470e73bb20fb9e6465edc1e",
    photo: "",
    daysOnMarket: null,
    price: 685000,
    beds: 4,
    baths: 4.5,
    sqft: 2835,
    status: "active",
    note: "New construction",
  },
  {
    street: "4215 Canada Dr",
    city: "Dallas",
    state: "TX",
    zip: "75212",
    link: "https://us-east.prospects.com/prospects/m.do?tk=8db2906a9b64a06939a96fe6b74aee26",
    photo: "",
    daysOnMarket: null,
    price: 649950,
    beds: 4,
    baths: 3.5,
    sqft: 3091,
    status: "active",
    note: "New construction",
  },
  {
    street: "1919 Nomas St",
    city: "Dallas",
    state: "TX",
    zip: "75212",
    link: "https://us-east.prospects.com/prospects/m.do?tk=77d4f369e1ca2cb45645355f9650322e",
    photo: "",
    daysOnMarket: null,
    price: 633000,
    beds: 4,
    baths: 3.5,
    sqft: 3170,
    status: "active",
    note: "New construction",
  },
  {
    street: "2619 Emmett St",
    city: "Dallas",
    state: "TX",
    zip: "75211",
    link: "https://us-east.prospects.com/prospects/m.do?tk=f4360cc83abdca394cae2841267b4d7d",
    photo: "",
    daysOnMarket: null,
    price: 689900,
    beds: 4,
    baths: 4,
    sqft: 2967,
    status: "active",
    note: "⚠︎ Two listings at this address online (renovated $689.9K vs investor special $205K) — confirm which is yours",
  },
  {
    street: "2401 Peabody Ave",
    city: "Dallas",
    state: "TX",
    zip: "75215",
    link: "https://us-east.prospects.com/prospects/m.do?tk=ba94e64f6138d1e22f4e1c5f5668172b",
    photo: "",
    daysOnMarket: null,
    price: 510000,
    beds: 4,
    baths: 3.5,
    sqft: 2701,
    status: "active",
    note: "",
  },
  {
    street: "2706 Valentine St",
    city: "Dallas",
    state: "TX",
    zip: "75215",
    link: "https://us-east.prospects.com/prospects/m.do?tk=6b135e913445c739aa58f6f7c0adb929",
    photo: "",
    daysOnMarket: null,
    price: 521000,
    beds: 4,
    baths: 4,
    sqft: 2617,
    status: "active",
    note: "New construction (2026)",
  },
];

// ─── Derived helpers ──────────────────────────────────────────────────────────

/** URL-safe slug for a home (used for anchors and photo file names). */
export function homeSlug(home: Home): string {
  return home.street
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function fullAddress(home: Home): string {
  return `${home.street}, ${home.city}, ${home.state} ${home.zip}`;
}

/**
 * The note to show clients. Notes beginning with "⚠︎" are internal reminders
 * (data to verify) and are hidden from the public page and text export.
 */
export function publicNote(home: Home): string {
  return home.note.startsWith("⚠︎") ? "" : home.note;
}

export function formatPrice(price: number | null): string | null {
  if (price == null) return null;
  return `$${price.toLocaleString("en-US")}`;
}

/** Human label for the DOM badge. */
export function domLabel(days: number | null): string {
  if (days == null) return "New listing";
  if (days <= 0) return "Just listed";
  if (days === 1) return "1 day on market";
  return `${days} days on market`;
}

/** Sort homes freshest-first (fewest days on market). Unknown DOM sorts last. */
export function byDaysOnMarket(a: Home, b: Home): number {
  const av = a.daysOnMarket ?? Number.POSITIVE_INFINITY;
  const bv = b.daysOnMarket ?? Number.POSITIVE_INFINITY;
  return av - bv;
}

export interface HomeGroup {
  neighborhood: string;
  homes: Home[];
}

/**
 * Group homes by neighborhood (location), each group internally sorted by days
 * on market. Groups appear in NEIGHBORHOOD_ORDER, with any extras appended
 * alphabetically. This is the shape the /list page renders.
 */
export function groupedHomes(homes: Home[] = HOMES): HomeGroup[] {
  const byHood = new Map<string, Home[]>();
  for (const home of homes) {
    const hood = neighborhoodFor(home);
    (byHood.get(hood) ?? byHood.set(hood, []).get(hood)!).push(home);
  }

  const rank = (hood: string) => {
    const i = NEIGHBORHOOD_ORDER.indexOf(hood);
    return i === -1 ? NEIGHBORHOOD_ORDER.length : i;
  };

  return [...byHood.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([neighborhood, hs]) => ({
      neighborhood,
      homes: [...hs].sort(byDaysOnMarket),
    }));
}

/**
 * Plain-text version of the list for SMS, email, and social captions. Mirrors
 * the on-page grouping: location headers, homes sorted by days on market.
 */
export function formatTextList(homes: Home[] = HOMES): string {
  const lines: string[] = [`${LIST_META.name} — Updated ${LIST_META.updatedOn}`, ""];

  for (const group of groupedHomes(homes)) {
    lines.push(`📍 ${group.neighborhood}`);
    for (const home of group.homes) {
      const bits: string[] = [];
      const price = formatPrice(home.price);
      if (price) bits.push(price);
      if (home.beds != null) bits.push(`${home.beds} bd`);
      if (home.baths != null) bits.push(`${home.baths} ba`);
      if (home.sqft != null) bits.push(`${home.sqft.toLocaleString("en-US")} sqft`);
      if (home.daysOnMarket != null) bits.push(domLabel(home.daysOnMarket));

      lines.push(`• ${home.street}, ${home.city} ${home.zip}`);
      if (bits.length) lines.push(`  ${bits.join(" · ")}`);
      const note = publicNote(home);
      if (note) lines.push(`  ${note}`);
      lines.push(`  ${home.link}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}
