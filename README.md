# Open House Companion

A real estate lead capture app with a public-facing social media form and a private admin dashboard.

---

## Run locally (copy & paste this)

```bash
git clone https://github.com/dariusharper101-hash/OpenHouseCompanion.git
cd OpenHouseCompanion
git checkout claude/social-media-lead-form-l2db9o
npm install
npm run dev
```

Open **http://localhost:3000**

---

## What's built

| URL | Description |
|---|---|
| `http://localhost:3000` | Public lead capture form (share this on social media) |
| `http://localhost:3000/admin` | Private leads dashboard — redirects to login |
| `http://localhost:3000/admin/login` | Admin login page |

**Default admin password (local only):** `admin123`

The form collects:
- Contact info (name, email, phone)
- Buying timeline + mortgage pre-approval status
- Budget range, property type, beds/baths, neighborhoods
- Optional notes
- Referral source (auto-detected from `?utm_source=` or `?src=` in the URL)

Leads are saved to `data/leads.json` on your machine.

---

## What's left before going live

- [ ] **Database** — `data/leads.json` won't persist on Vercel (serverless resets the filesystem on each deploy). Swap in Vercel Postgres, Supabase, or Vercel KV before deploying.
- [ ] **Admin password** — Set the `ADMIN_PASSWORD` environment variable in Vercel project settings before deploying. Do not leave it as `admin123` in production.
- [ ] **Custom domain** — Optional, but recommended before sharing the link on social media.
- [ ] **Vercel Deployment Protection** — In Vercel → Project Settings → Deployment Protection, disable "Vercel Authentication" so visitors can reach the form without being asked to log into Vercel.

---

## Env vars

| Variable | Required | Description |
|---|---|---|
| `ADMIN_PASSWORD` | Production only | Password for `/admin`. Defaults to `admin123` in dev. |

Copy `.env.local.example` to `.env.local` to set it locally.
