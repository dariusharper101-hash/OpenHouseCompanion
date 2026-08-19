# Jo's House List — standalone static tool (v2)

`jo-house-list.html` is a single self-contained file (no build step) that runs the
whole house-list tool client-side. Deployed publicly at:

  https://jo-house-list.vercel.app   (builder at /#builder)

## What it does
- **Client list** — a light, editorial presentation (Fraunces/Inter, photo-forward
  cards, prominent price, status + days-on-market pills), grouped by area and sorted
  by days on market.
- **Agent builder** (`/#builder`) — enter homes; **add a photo from your phone or
  computer** (device upload; images are resized/compressed in the browser); set
  price, days on market, beds/baths/sqft, status, notes; reorder; paste-import.
- **Share** — the builder serializes the whole list into the URL hash and gives you
  a `/#d=...` client link. No database. Send it by text, email, or social; the
  client sees only the finished presentation.

## Notes
- Device photos are embedded in the link. A few photos keep the link small; many
  large photos make it long (the builder shows a live link-size indicator and warns).
  For a fully lightweight link, use hosted photo URLs instead.
- Prices/beds/baths/sqft/days-on-market start **blank** — enter accurate values from
  your MLS. Nothing unverified is shown to clients.
- The live copy is a split build (index.html + p1..p11.js) for upload-size limits;
  this single file is the source of truth and is functionally identical. Styling uses
  the Tailwind Play CDN + Google Fonts, so it needs internet to render.

The tool also exists as Next.js pages under `src/app/list` (earlier dark design).
