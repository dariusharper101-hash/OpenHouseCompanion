import test from "node:test";
import assert from "node:assert/strict";
import { parseBuyerPlan, planToInquiry } from "../src/lib/buyer-plan";
import { upcomingOpenHouses, type OpenHouse } from "../src/config/open-houses";
import { numericInput, principalAndInterest } from "../src/lib/calculator";

test("calculator rejects blank, negative, malformed and out-of-range entries", () => {
  for (const input of ["", "-100", "abc", "1.2.3", "Infinity", "1e30"]) assert.equal(numericInput(input), null);
  assert.equal(numericInput("100.1", 100), null);
  assert.equal(numericInput("31", 30), null);
  assert.equal(numericInput("100", 100), 100);
  assert.equal(numericInput("350,000"), 350000);
  assert.equal(numericInput("0"), 0);
});
test("payment math handles zero rate, cash purchase and standard terms", () => {
  assert.equal(principalAndInterest(360000, 0, 30), 1000);
  assert.equal(principalAndInterest(0, 6.5, 30), 0);
  assert.equal(principalAndInterest(100000, 6.5, 0), 0);
  assert.equal(principalAndInterest(100000, -1, 30), 0);
  assert.ok(Math.abs(principalAndInterest(300000, 6, 30) - 1798.65) < 0.01);
});

test("buyer preference handoff preserves source without inferring lender approval", () => {
  const p = parseBuyerPlan(JSON.stringify({ areas: "Test area", budget: "300k–400k", bedrooms: "3", mustHaves: "Office", readiness: "approval-in-hand", origin: "social" }));
  assert.ok(p);
  const inquiry = planToInquiry(p);
  assert.equal(inquiry.product, "social");
  assert.equal(inquiry.neighborhoods, "Test area");
  assert.equal(inquiry.isPreApproved, undefined);
  assert.match(inquiry.notes!, /self-reported/);
  assert.match(inquiry.notes!, /300k–400k/);
  assert.equal(inquiry.budgetMax, undefined);
  assert.equal(parseBuyerPlan("broken"), null);
  assert.equal(parseBuyerPlan(JSON.stringify({ ...p, readiness: "approved-by-app" })), null);
  assert.equal(parseBuyerPlan(JSON.stringify({ ...p, areas: "x".repeat(501) })), null);
});
test("event catalog exposes only approved valid events that have not ended", () => {
  const event: OpenHouse = { slug: "synthetic", address: "Synthetic test only", startsAt: "2026-10-01T15:00:00-05:00", endsAt: "2026-10-01T17:00:00-05:00", listingUrl: "https://example.com/listing", approved: true, verifiedAt: "2026-09-30T12:00:00Z" };
  const now = new Date("2026-10-01T21:00:00Z");
  assert.equal(upcomingOpenHouses(now, [event]).length, 1);
  assert.equal(upcomingOpenHouses(new Date("2026-10-01T22:00:00Z"), [event]).length, 0);
  for (const invalid of [{ approved: false }, { startsAt: "bad" }, { endsAt: event.startsAt }, { listingUrl: "javascript:alert(1)" }, { verifiedAt: "" }]) {
    assert.equal(upcomingOpenHouses(now, [{ ...event, ...invalid }]).length, 0);
  }
  assert.deepEqual(upcomingOpenHouses(now), []);
});
