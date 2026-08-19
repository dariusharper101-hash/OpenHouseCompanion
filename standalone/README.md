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
- **Share** — the builder serializes the list into the URL hash and gives you a
  `/#d=...` client link. No database. Send it by text, email, or social; the client
  sees only the finished presentation.

## Notes
- **The client link stays small and easy to send.** It carries the addresses,
  details, and listing links only — photos you upload from your device are **not**
  embedded in the link (that used to make the URL megabytes long). Uploaded photos
  still show in the builder's live preview so you can pick the best one, and each
  home's **View listing & photos** button opens the full gallery for the client.
  To show a specific image to clients in the link, paste a hosted `http(s)` photo
  URL into the Listing link/photo field — short URLs are kept in the link.
- Prices/beds/baths/sqft/days-on-market start **blank** — enter accurate values from
  your MLS. Nothing unverified is shown to clients.
- The live copy is a split build (index.html + p1..p8.js) for upload-size limits;
  this single file is the source of truth and is functionally identical. Styling uses
  the Tailwind Play CDN + Google Fonts, so it needs internet to render.

The tool also exists as Next.js pages under `src/app/list` (earlier dark design).
