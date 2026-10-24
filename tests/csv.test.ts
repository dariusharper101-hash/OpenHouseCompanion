import test from "node:test";
import assert from "node:assert/strict";
import { leadsToCsv } from "../src/lib/leads";
import type { Lead } from "../src/types/lead";

// Decode CSV independently so embedded commas/quotes/newlines cannot conceal
// a second cell. These fixtures never read or write a lead database.
function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (c === '"') {
      if (quoted && csv[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && (c === "," || c === "\r")) {
      row.push(cell); cell = "";
      if (c === "\r") { assert.equal(csv[++i], "\n"); rows.push(row); row = []; }
    } else cell += c;
  }
  assert.equal(quoted, false);
  row.push(cell); rows.push(row);
  return rows;
}

function exportedNotes(notes: string) {
  const lead = { id: "synthetic", notes } as Lead;
  const [header, row] = parseCsv(leadsToCsv([lead]));
  assert.equal(row.length, header.length);
  assert.equal(lead.notes, notes);
  return row[header.indexOf("Notes")];
}

test("CSV exports neutralize formula prefixes including leading whitespace and controls", () => {
  for (const value of ['=1+1', '+15550100', '-1+2', '@SUM(1,2)', '  =1+1', '\t=1+1', '\r=1+1', '\n=1+1', '\u0000=1+1', '\ufeff=1+1', '\tplain']) {
    assert.equal(exportedNotes(value), `'${value}`);
  }
});

test("CSV preserves ordinary text and contains quotes, delimiters and newlines in one cell", () => {
  for (const value of ['', 'Dallas', 'José Harper', 'a,b', 'a"b', 'line one\nline two', 'text,\"=1+1', 'text = 1', "'literal"]) {
    assert.equal(exportedNotes(value), value);
  }
});
