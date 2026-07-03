// ─── Agent / brokerage configuration ──────────────────────────────────────────
// Single source of truth for everything personal to you. Fill these in and the
// whole site updates — nav, footer, thank-you page, disclosures, and the
// signing hand-off. Empty fields are simply hidden, so nothing false is shown.

export const AGENT = {
  // Product / site name shown in the nav and browser title.
  appName: "Open House Companion",

  // You
  name: "", // e.g. "Jane Smith" — leave blank to keep generic branding
  title: "REALTOR®", // e.g. "REALTOR®", "Broker Associate"
  licenseNumber: "", // your TREC license number (shown near disclosures)
  photoUrl: "", // public URL to a headshot (or leave blank)

  // Contact
  phone: "", // e.g. "(555) 555-5555"
  email: "", // contact email
  serviceArea: "Texas", // e.g. "Greater Houston" — shown in copy

  // Brokerage (Texas requires the brokerage be identified)
  brokerage: "", // brokerage name
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
