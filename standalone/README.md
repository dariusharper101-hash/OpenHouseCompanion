# Jo's House List — standalone static tool

`jo-house-list.html` is a single self-contained file (no build step) that runs the
whole house-list tool client-side: the client-facing list, the agent builder, and
the URL-hash sharing scheme. It is what's deployed publicly at:

  https://jo-house-list.vercel.app

## Views (hash-routed, so one file serves all three)
- `/`            → client-facing default list (Jo's list)
- `/#builder`    → the agent builder (enter homes, copy a client link)
- `/#d=<data>`   → a client list encoded in the link (what the builder produces)

## How sharing works
The builder serializes the whole list (name + date + homes) into the URL hash and
hands you a `/#d=...` link. The link holds the data — no database. Send that link by
text, email, or social; the recipient sees only the finished presentation.

## Editing / re-deploying
Edit this file directly, then host it anywhere static (Vercel, Netlify, S3, etc.).
The live copy is deployed as a split build (index.html + p1..p10.js) to satisfy
upload-size limits, but this single file is the source of truth and is functionally
identical. Styling uses the Tailwind Play CDN, so it needs internet to render.

The same tool also exists as first-class pages in the Next.js app under
`src/app/list` and `src/app/list/builder`.
