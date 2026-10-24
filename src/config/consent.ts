// ─── TCPA text-consent wording ────────────────────────────────────────────────
// The exact text shown next to the (unchecked, optional) consent box on
// /specials. The server stores BOTH the version and the text with every lead,
// so what we saved always matches what the renter saw.
//
// RULE: if you change one word of `text`, bump `version`.
// Status: DRAFT for broker / counsel review (PLAN §8, §11).
// v2: removed "including with automated technology" (Darius texts by hand).
// TODO(Darius): if Apartment Hunters' licensed name differs, update the text
// and bump the version.

export const TCPA_CONSENT = {
  version: "specials-v2-2026-10-23",
  text:
    "Yes, Darius Harper with Apartment Hunters may text and call me at the number above about " +
    "apartment specials and my move. Consent isn't required " +
    "to get the guide. Msg frequency varies; msg & data rates may apply. Reply STOP to opt out, " +
    "HELP for help. See SMS Terms and Privacy Policy.",
} as const;
