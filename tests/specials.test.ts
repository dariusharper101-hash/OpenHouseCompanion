import test from "node:test";
import assert from "node:assert/strict";
import { AGENT } from "../src/config/agent";
import { TCPA_CONSENT } from "../src/config/consent";

test("text-consent wording names the configured agent and sponsoring broker", () => {
  assert.ok(TCPA_CONSENT.text.includes(`${AGENT.name} with ${AGENT.brokerage}`));
  assert.match(TCPA_CONSENT.version, /^specials-v\d+-\d{4}-\d{2}-\d{2}$/);
  assert.doesNotMatch(TCPA_CONSENT.text, /Keller|\bKW\b|Apartment Hunters/i);
});
