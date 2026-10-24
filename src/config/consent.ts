// ─── TCPA text-consent wording ────────────────────────────────────────────────
// The exact text shown next to the (unchecked, optional) consent box on
// /specials. The server stores BOTH the version and the text with every lead,
// so what we saved always matches what the renter saw.
//
// RULE: if you change one word of `text`, bump `version`.
// Status: DRAFT for broker / counsel review (PLAN §8, §11).
// v2: removed "including with automated technology" (Darius texts by hand).
// v3: names the live sponsoring broker (AGENT.brokerage). Kept as a literal on
// purpose; tests/specials.test.ts fails if the broker changes without this text.
// TODO(Darius): confirm this v3 wording with The Realty Influence LLC.

export const TCPA_CONSENT = {
  version: "specials-v3-2026-10-24",
  text:
    "Yes, Darius Harper with The Realty Influence LLC may text and call me at the number above about " +
    "apartment specials and my move. Consent isn't required " +
    "to get the guide. Msg frequency varies; msg & data rates may apply. Reply STOP to opt out, " +
    "HELP for help. See SMS Terms and Privacy Policy.",
} as const;
