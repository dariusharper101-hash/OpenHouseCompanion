// ─── TCPA text-consent wording ────────────────────────────────────────────────
// The exact text shown next to the (unchecked, optional) consent box on
// /specials. The server stores BOTH the version and the text with every lead,
// so what we saved always matches what the renter saw.
//
// RULE: if you change one word of `text`, bump `version`.
// Status: v1 is a DRAFT for broker / counsel review (PLAN §8, §11).
// TODO(Darius): if Apartment Hunters' licensed name differs, update the text
// and bump the version.

export const TCPA_CONSENT = {
  version: "specials-v1-2026-10-22",
  text:
    "Yes, Darius Harper with Apartment Hunters may text and call me at the number above about " +
    "apartment specials and my move, including with automated technology. Consent isn't required " +
    "to get the guide. Msg frequency varies; msg & data rates may apply. Reply STOP to opt out, " +
    "HELP for help. See SMS Terms and Privacy Policy.",
} as const;
