# Jo's House List — standalone static tool (v2)

`jo-house-list.html` is a single self-contained file (no build step) that runs the
whole house-list tool client-side. Deployed publicly at:

  https://jo-house-list.vercel.app   (builder at /#builder)

## What it does
- **Client list** — a light, editorial presentation (Fraunces/Inter, photo-forward
  cards, prominent price, status + days-on-market pills), grouped by area and sorted
  by days on market.
- **Agent builder** (`/#builder`) — **paste your homes straight from Notes or MLS**
  and it auto-extracts each home's price, beds, baths, sq ft, days on market, and
  listing link (anything left over becomes the home's note). Add a photo from your
  phone or computer (resized/compressed in the browser); edit any field; reorder.
  "Add homes from paste" appends; "Replace list with paste" swaps the whole list.
- **Share** — the builder serializes the list into the URL hash and gives you a
  compact `/#c=...` client link. No database. Send it by text, email, or social; the
  client sees only the finished presentation.

## Notes
- **The client link stays short and easy to send.** The list is packed into a
  compact schema (short keys, defaults dropped, just the listing token) and then
  gzip-compressed in the browser (`CompressionStream`) before encoding. The full
  12-home default list is ~700 characters (down from ~4,400 uncompressed). Decoding
  is backward-compatible: `#c=` gzip, `#j=` compact-JSON fallback for older browsers,
  and legacy `#d=` full-JSON links still open.
- Photos you upload from your device are **not** embedded in the link (that used to
  make the URL megabytes long). Uploaded photos still show in the builder's live
  preview so you can pick the best one, and each home's **View listing & photos**
  button opens the full gallery for the client. To show a specific image to clients
  in the link, paste a hosted `http(s)` photo URL — short URLs are kept in the link.
- Prices/beds/baths/sqft/days-on-market start **blank** — enter accurate values from
  your MLS. Nothing unverified is shown to clients.
- The live copy is a split build (index.html + p1..p9.js) for upload-size limits;
  this single file is the source of truth and is functionally identical. Styling uses
  the Tailwind Play CDN + Google Fonts, so it needs internet to render.

The tool also exists as Next.js pages under `src/app/list` (earlier dark design).
