import test from "node:test";
import assert from "node:assert/strict";
import { buildHtml } from "../src/lib/notify";
import type { Lead } from "../src/types/lead";

// Synthetic lead only. Builds the alert HTML; nothing is sent.
function lead(overrides: Partial<Lead>): Lead {
  return {
    id: "t1", createdAt: "2026-10-27T21:12:04-05:00", status: "new",
    role: "renting", clientType: "first-time-buyer",
    firstName: "Maya", lastName: "Reyes", email: "maya@example.com", phone: "(214) 555-0142",
    timeline: "1-3-months", isPreApproved: false, budgetMin: "$1,400–$1,600", budgetMax: "",
    propertyType: "any", bedrooms: "2", bathrooms: "", neighborhoods: "Garland, Rowlett",
    purchasePurpose: "primary", ownedHomeLast3Years: false, isVeteran: false,
    employmentType: "w2", creditRange: "not-shared", investorStrategy: "rental", propertiesOwned: "",
    sellerAddress: "", sellerEstimatedValue: "", sellerMortgageStatus: "not-discussed",
    sellerReason: "", sellerTimeline: "", buyingSimultaneously: false,
    iabsAcknowledged: true, buyerRepAcknowledged: false,
    notes: "", source: "instagram", product: "website",
    ...overrides,
  };
}

test("renter alert includes the rental search details", () => {
  const html = buildHtml(lead({}));
  for (const [label, value] of [["Monthly budget", "$1,400–$1,600"], ["Move-in", "1-3-months"], ["Areas", "Garland, Rowlett"], ["Bedrooms", "2"]]) {
    const v = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(html, new RegExp(`${label}</td><td[^>]*>${v}</td>`), `${label} row missing`);
  }
});

test("renter alert leaves out empty rental rows", () => {
  const html = buildHtml(lead({ budgetMin: "", neighborhoods: "", bedrooms: "" }));
  assert.doesNotMatch(html, /Monthly budget|>Areas<|Bedrooms/);
  assert.match(html, /Move-in/);
});

test("buyer alert is unchanged: no renter rows", () => {
  const html = buildHtml(lead({ role: "buying", budgetMin: "300000", budgetMax: "350000" }));
  assert.match(html, /Budget<\/td><td[^>]*>300000 – 350000/);
  assert.doesNotMatch(html, /Monthly budget|Move-in/);
});

test("renter values are HTML-escaped", () => {
  const html = buildHtml(lead({ neighborhoods: "<b>Uptown</b>" }));
  assert.match(html, /&lt;b&gt;Uptown&lt;\/b&gt;/);
});
