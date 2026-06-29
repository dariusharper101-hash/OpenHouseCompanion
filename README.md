# Open House Companion

A real-estate lead-generation and client-education web app for buyers, sellers,
and investors. Built with Next.js 16 (App Router), React 19, and Tailwind v4.

## What it does

- **Lead capture** (`/start`) — an adaptive multi-step form that branches for
  buyers, sellers, or both, with client-type, program-qualifier, and legal
  acknowledgment steps (IABS + Buyer Representation).
- **Program matching** (`/thank-you`) — suggests likely loan programs (FHA, VA,
  USDA, Conventional, plus Texas TSAHC/TDHCA) based on the lead's answers.
- **Education hub** (`/learn`) — guides on the buying/selling process, county
  property taxes, insurance, warranties, inspections, and contracts.
- **Agent dashboard** (`/admin`) — stats, search/filter, lead detail, status
  tracking, and CSV export. Protected by HTTP Basic Auth via `src/proxy.ts`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

| Env var          | Purpose                          | Default      |
| ---------------- | -------------------------------- | ------------ |
| `ADMIN_USER`     | Username for the `/admin` gate   | `admin`      |
| `ADMIN_PASSWORD` | Password for the `/admin` gate   | `openhouse`  |

> Leads are stored on disk under `./data` locally, and in `/tmp` on Vercel
> (ephemeral). A durable database is the next step before production use.

## Deployment

Connected to Vercel via Git — every push to the production branch deploys
automatically, and every other branch gets a preview deployment.
