// ─── Darius Lead Tracker sync (Google Sheets via Apps Script) ─────────────────
// Appends one row to the tracker sheet through a small Apps Script web app
// (source + setup: docs/apps-script/lead-tracker.gs). No Google credentials
// leave Google; we only hold the web-app URL and a random shared secret.
//
// Best-effort, like notify.ts: if SHEET_WEBHOOK_URL / SHEET_WEBHOOK_SECRET are
// not set, or the call fails or takes longer than 4s, we log and move on. The
// lead is already saved in Supabase; /admin CSV export can backfill the sheet.

const SHEET_WEBHOOK_URL = process.env.SHEET_WEBHOOK_URL;
const SHEET_WEBHOOK_SECRET = process.env.SHEET_WEBHOOK_SECRET;
const TIMEOUT_MS = 4000;

// Keys must match the tracker's header row (the script matches by header
// name, case-insensitive). Keys with no matching header are ignored.
export type TrackerRow = Record<string, string>;

export async function appendTrackerRow(row: TrackerRow): Promise<void> {
  if (!SHEET_WEBHOOK_URL || !SHEET_WEBHOOK_SECRET) {
    console.warn(
      "Tracker sync skipped — sheet not configured:",
      `SHEET_WEBHOOK_URL=${SHEET_WEBHOOK_URL ? "set" : "MISSING"}`,
      `SHEET_WEBHOOK_SECRET=${SHEET_WEBHOOK_SECRET ? "set" : "MISSING"}`
    );
    return;
  }

  try {
    // Apps Script answers with a 302 to googleusercontent.com; fetch follows
    // it and the final GET returns the script's JSON output.
    const res = await fetch(SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret: SHEET_WEBHOOK_SECRET, row }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: "follow",
    });
    const text = await res.text();
    let ok = res.ok;
    try {
      ok = ok && (JSON.parse(text) as { ok?: boolean }).ok === true;
    } catch {
      ok = false;
    }
    if (!ok) {
      // Status only — never log the row (it contains personal data).
      console.error("Tracker sync failed:", res.status);
    }
  } catch (err) {
    console.error("Tracker sync error:", err instanceof Error ? err.name : "unknown");
  }
}
