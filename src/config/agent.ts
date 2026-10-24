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
  email: "darius@freeapartmenthunters.com",
  serviceArea: "Dallas–Fort Worth",

  // Social profiles (shown in the agent card, footer, and social funnel)
  socials: {
    instagram: "https://www.instagram.com/hopinrealestate",
    facebook: "https://www.facebook.com/share/199UeSkPuT/",
  },

  // Brokerage (Texas requires the brokerage be identified)
  brokerage: "The Realty Influence LLC",
  brokerageLicense: "9015889-BB", // sponsoring broker TREC license

  // TREC Rule 531.20(b) / 535.154: every business website must link to the
  // sponsoring broker's IABS and the TREC Consumer Protection Notice.
  // TODO: replace with The Realty Influence LLC's completed IABS PDF.
  iabsUrl: "https://www.trec.texas.gov/forms/information-about-brokerage-services",
  consumerProtectionUrl: "https://www.trec.texas.gov/forms/consumer-protection-notice",

  // Signing: documents are sent per transaction through the brokerage's
  // approved e-signature process. Update once the brokerage confirms its provider.
  signing: {
    platform: "The Realty Influence LLC",
    infoUrl: "https://freeapartmenthunters.com",
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
