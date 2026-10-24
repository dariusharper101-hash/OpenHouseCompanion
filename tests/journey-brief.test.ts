import test from "node:test";
import assert from "node:assert/strict";
import { parseJourneyBrief } from "../src/lib/journey-brief";

test("portable briefs preserve visitor wording without carrying injected approval fields", () => {
  for (const kind of ["renting", "selling", "investing", "relocating"]) {
    const text = "Synthetic plan\nPreferred follow-up date: 2026-10-10\nProposed, not confirmed.";
    assert.deepEqual(parseJourneyBrief(JSON.stringify({kind,text,isPreApproved:true,role:"admin"})), {kind,text});
  }
});
test("unreadable or invalid browser handoffs can be skipped safely", () => {
  for (const raw of [null,"broken","[]",JSON.stringify({kind:"buying",text:"test"}),JSON.stringify({kind:"renting",text:5}),JSON.stringify({kind:"selling",text:""}),JSON.stringify({kind:"relocating",text:"x".repeat(4001)})]) assert.equal(parseJourneyBrief(raw),null);
});
