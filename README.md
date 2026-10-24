# Hop In Real Estate

Next.js 16, React 19 and Tailwind application for Hop's marketing site, buyer/seller/renter inquiries, educational guides and agent dashboard. The repository also has historical product branches for open-house check-in and standalone home lists. See [deployment inventory](docs/DEPLOYMENT-INVENTORY.md) before choosing a branch to deploy.

## Local setup

Use Node 22 LTS or another supported runtime (Next requires at least Node 20.9).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Configure server-only `SUPABASE_URL` (HTTPS project URL) and `SUPABASE_SERVICE_ROLE_KEY` for an isolated development database. For synthetic local development without a database, explicitly set `LEAD_STORAGE=local`; this only works with `NODE_ENV=development` outside Vercel. Local records are in ignored `data/`. Production and hosted previews never fall back to files.

`ADMIN_USER` and a unique `ADMIN_PASSWORD` of at least 16 characters are required for admin access. There are no default credentials. Basic Auth is an interim single-operator gate; individual identity and MFA remain planned. Do not expose service credentials through `NEXT_PUBLIC_*` variables.

Optional notifications use `RESEND_API_KEY`, `NOTIFY_EMAIL`, and a verified `NOTIFY_FROM`. Missing notification settings do not prevent saving a lead. Notification delivery is best effort with a bounded timeout; it is not yet a guaranteed queue.

## Verification

```sh
npm run check
npm audit
```

`check` runs lint, regression tests and a production build. Tests use synthetic credentials and a mocked Supabase transport; they do not access live accounts. The protected `/api/admin/health` endpoint performs a limited read query and returns readiness without records or configuration values.

## Release

Follow [foundation release gate](docs/FOUNDATION-RELEASE.md). Current production project ownership/settings are unverified. No deployment should be inferred from a successful local build. Private client data, credentials and exports never belong in this public repository.
