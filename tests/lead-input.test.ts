import test from "node:test";
import assert from "node:assert/strict";
import { pickLead, MAX_NOTES, MAX_STRING, NOTES_USER_MAX } from "../src/lib/lead-input";

test("notes keep user notes plus a full journey plan; short fields stay capped", () => {
  const plan = "p".repeat(4000); // journey-brief.ts max
  const notes = ["n".repeat(NOTES_USER_MAX), plan].join("\n\n");
  const lead = pickLead({ notes, firstName: "f".repeat(5000) }, "website");
  assert.equal(lead.notes, notes);
  assert.equal(lead.firstName.length, MAX_STRING);
  assert.equal(pickLead({ notes: "x".repeat(MAX_NOTES + 50) }, "website").notes.length, MAX_NOTES);
});

test("fields outside the allowlist are dropped", () => {
  const lead = pickLead({ moveMonth: "Dec", consent: { tcpa: true }, product: "specials-guide" }, "website") as unknown as Record<string, unknown>;
  assert.equal(lead.product, "website");
  assert.equal(lead.moveMonth, undefined);
  assert.equal(lead.consent, undefined);
});
