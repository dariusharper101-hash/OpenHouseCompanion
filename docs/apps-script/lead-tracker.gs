/**
 * Darius Lead Tracker — append-row web app for hopinrealestate.com/specials
 * ===========================================================================
 * Receives one lead per POST from /api/specials (src/lib/sheet.ts) and appends
 * it to the tracker sheet, matching columns BY HEADER NAME (so column order
 * doesn't matter and extra columns are left alone).
 *
 * No secret is stored in this file. The shared secret lives in Script
 * Properties and is compared on every request.
 *
 * SETUP (Darius only; agents never see the secret or the URL)
 * ------------------------------------------------------------
 * 1. Open the "Darius Lead Tracker" Google Sheet → Extensions → Apps Script.
 * 2. Replace the editor contents with this file. Save.
 * 3. Make sure row 1 of the tab has these headers (any order, any extra
 *    columns are fine):
 *      Date | Name | Phone | Source | Move Month | Budget | Areas |
 *      Text Consent | Notes | Lead ID
 *    Headers that don't exist are skipped, nothing else breaks.
 * 4. Project Settings (gear) → Script Properties → Add:
 *      SHEET_WEBHOOK_SECRET = <a long random string, e.g. 40+ characters
 *                              from a password generator>
 *      SHEET_TAB_NAME       = <optional; tab name. Default: first tab>
 * 5. Deploy → New deployment → type "Web app":
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Authorize when prompted. Copy the Web app URL (ends in /exec).
 *    NEVER paste the /exec URL anywhere public (posts, chats, docs, code,
 *    commits). Treat it like a password; it only belongs in Vercel env vars.
 * 6. In Vercel → project "open-house-companion" → Settings → Environment
 *    Variables (Preview + Production), add:
 *      SHEET_WEBHOOK_URL    = <the /exec URL>
 *      SHEET_WEBHOOK_SECRET = <the same secret as step 4>
 *    Redeploy for the variables to take effect.
 * 7. Test on the PREVIEW deploy with your own number, check the row appears,
 *    then delete the test row (and the test lead in /admin).
 *
 * Rotating the secret: change it in Script Properties AND Vercel, redeploy.
 * Editing this code later: Deploy → Manage deployments → edit → New version
 * (the /exec URL stays the same).
 *
 * "Anyone" access is required for a server-to-server call; the secret is what
 * keeps strangers out. Wrong or missing secret → {"ok":false}, nothing written.
 */

var ALLOWED_KEYS = [
  'Date', 'Name', 'Phone', 'Source', 'Move Month', 'Budget', 'Areas',
  'Text Consent', 'Notes', 'Lead ID'
];

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'bad-json' });
  }

  var expected = PropertiesService.getScriptProperties().getProperty('SHEET_WEBHOOK_SECRET');
  if (!expected || !safeEqual_(String(body.secret || ''), expected)) {
    return json_({ ok: false, error: 'unauthorized' });
  }

  var row = body.row;
  if (!row || typeof row !== 'object') {
    return json_({ ok: false, error: 'no-row' });
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tabName = PropertiesService.getScriptProperties().getProperty('SHEET_TAB_NAME');
    var sheet = tabName ? ss.getSheetByName(tabName) : ss.getSheets()[0];
    if (!sheet) return json_({ ok: false, error: 'no-tab' });

    var lastCol = sheet.getLastColumn();
    if (lastCol < 1) return json_({ ok: false, error: 'no-headers' });
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Normalized lookup of the incoming values, limited to known keys.
    var values = {};
    ALLOWED_KEYS.forEach(function (k) {
      if (row[k] !== undefined && row[k] !== null) values[norm_(k)] = clean_(row[k]);
    });

    var out = headers.map(function (h) {
      var v = values[norm_(h)];
      return v === undefined ? '' : v;
    });
    sheet.appendRow(out);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'write-failed' });
  } finally {
    lock.releaseLock();
  }
}

function norm_(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ');
}

// Plain text only, capped, and neutralize spreadsheet formula injection
// (a value starting with = + - @, tab or CR would otherwise run as a formula).
function clean_(v) {
  var s = String(v).slice(0, 500);
  // Same rule as the /admin CSV export (src/lib/leads.ts csvEscape).
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(s) || /^[\t\r\n]/.test(s)) s = "'" + s;
  return s;
}

// Length-independent comparison so timing doesn't leak the secret.
function safeEqual_(a, b) {
  var len = Math.max(a.length, b.length);
  var diff = a.length ^ b.length;
  for (var i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
