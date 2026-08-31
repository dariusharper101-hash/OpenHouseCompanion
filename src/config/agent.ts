// ─── Agent / brokerage configuration ──────────────────────────────────────────
// Single source of truth for everything personal to you. Fill these in and the
// whole site updates — nav, footer, thank-you page, disclosures, and the
// signing hand-off. Empty fields are simply hidden, so nothing false is shown.

export const AGENT = {
  // Product / site name shown in the nav and browser title.
  appName: "Hop In Real Estate",

  // Canonical public URL (no trailing slash) — used for SEO, sitemap, and
  // social share metadata.
  siteUrl: "https://hopinrealestate.com",

  // You
  name: "Darius Harper",
  title: "REALTOR®",
  licenseNumber: "0847860", // TREC license number
  photoUrl: "/darius.jpg", // upload public/darius.jpg; falls back to initials until then

  // Contact
  phone: "(870) 718-0974",
  email: "DariusHarper@kw.com",
  serviceArea: "Dallas–Fort Worth",

  // Social profiles (shown in the agent card, footer, and social funnel)
  socials: {
    instagram: "https://www.instagram.com/hopinrealestate",
    facebook: "https://www.facebook.com/share/199UeSkPuT/",
  },

  // Brokerage (Texas requires the brokerage be identified)
  brokerage: "Keller Williams DPR",
  brokerageLicense: "", // brokerage TREC number (optional)

  // Signing / transaction platform provided by your brokerage.
  // Lone Wolf's e-signature product is Authentisign; clients receive a secure
  // email invite to sign each document per transaction.
  signing: {
    platform: "Lone Wolf (Authentisign)",
    // Reference link for clients ("what is this?"). Actual signing links are
    // emailed per transaction — this is not where they sign.
    infoUrl: "https://www.lwolf.com/solutions/transaction-management",
  },
} as const;

// Convenience: what to show as the human-facing signature line.
export const agentDisplayName = AGENT.name || AGENT.appName;

// Initials for the avatar fallback when no photoUrl is set.
export const agentInitials =
  AGENT.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "HI";
