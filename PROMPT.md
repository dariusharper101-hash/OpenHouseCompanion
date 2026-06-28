# Open House Companion — Full Product Prompt

## What This Is

A real estate lead generation and client education web app for a Texas real estate agent.
Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.

## What's Already Built

### Routes
- `/` — Landing page with role-based CTAs (buying / selling / both), education preview grid, client type section
- `/start` — Multi-step lead capture form (dynamic steps based on role)
- `/learn` — Education hub with 8 topic cards
- `/learn/[topic]` — Full topic pages: `process`, `programs`, `taxes`, `insurance`, `warranties`, `inspections`, `contracts`, `selling`
- `/thank-you` — Smart confirmation page that shows qualifying loan programs
- `/api/leads` — POST (save lead) + GET (retrieve leads) using a local JSON file

### Lead Form Steps (Dynamic by Role)
**Buyer flow:** role/client-type → contact → property preferences → program qualifiers → legal disclosures  
**Seller flow:** role → contact → seller property details → legal disclosures  
**Both:** role → contact → seller details → buyer preferences → qualifiers → legal  

### Legal Compliance Built In
- IABS (Information About Brokerage Services) acknowledgment — required by Texas law
- Buyer Representation Agreement acknowledgment — required post-Aug 2024 NAR settlement
- Both are checkbox-gated; API validates IABS acknowledgment before saving

### Types (`src/types/lead.ts`)
```ts
ClientRole: "buying" | "selling" | "both"
ClientType: "first-time-buyer" | "move-up-buyer" | "investor" | "downsizing" | "relocating"
BuyerTimeline: "asap" | "1-3-months" | "3-6-months" | "6-12-months" | "just-browsing"
PropertyType: "house" | "condo" | "townhouse" | "multi-family" | "land" | "any"
PurchasePurpose: "primary" | "second-home" | "investment"
CreditRange: "below-580" | "580-619" | "620-659" | "660-699" | "700-739" | "740+"
EmploymentType: "w2" | "self-employed" | "1099" | "business-owner" | "retired" | "other"
InvestorStrategy: "flip" | "rental" | "brrrr" | "wholesale" | "other"
MortgageStatus: "paid-off" | "has-mortgage" | "underwater"
```

### Program Qualifier Logic (`/thank-you`)
Server-side function `getQualifyingPrograms()` reads URL params from form submission and returns matching programs:
- VA loan (veteran + primary + any credit)
- FHA 3.5% (primary + not owned last 3 yrs + 620+ credit)
- FHA 10% (primary + not owned last 3 yrs + 580-619 credit)
- My First Texas Home / TDHCA (first-time + income limits)
- TSAHC (Texas grant, no repayment required)
- Conventional 97 (primary + 660+ credit)
- Conventional (primary + 740+ best rates)

---

## What Still Needs to Be Built

### Priority 1 — Agent Backend / Lead Dashboard
- Protected `/admin` route (basic auth or magic link)
- Table view of all submitted leads with filters (role, timeline, credit range, date)
- Lead detail view showing all fields, program qualifications, IABS/buyer rep status
- Export to CSV
- Lead status tracking: new → contacted → active → closed

### Priority 2 — Email / Notification
- Send agent a notification email when a new lead submits
- Send client a confirmation email with:
  - Summary of what they told you
  - Which programs they may qualify for
  - IABS document attachment
  - Next steps
- Use Resend, SendGrid, or Nodemailer + SMTP

### Priority 3 — IABS Document Delivery
- Generate or serve the official Texas IABS PDF
- Include agent name, brokerage name, license number, phone, email
- Attach to confirmation email automatically
- Consider e-signature integration (DocuSign, SignNow, or HelloSign)

### Priority 4 — Buyer Rep Agreement Flow
- Present the actual Buyer Representation Agreement for e-signature
- Integrate an e-sign provider (SignNow has a free tier)
- Store signed copy and mark lead as "rep agreement signed"
- This unlocks full fiduciary representation

### Priority 5 — Social Media Integration
- Generate a shareable card/image for each lead type (buyer, seller, investor)
- UTM tracking already wired (`?src=` or `?utm_source=` auto-captures to `lead.source`)
- Add platform-specific landing page variants: `/start?src=instagram`, `/start?src=facebook`
- Open Graph images per page for better social sharing previews

### Priority 6 — Property Tax Lookup
- Add a live county tax rate lookup on `/learn/taxes`
- Texas county appraisal district data is public
- Payment calculator: input home price + county → outputs monthly tax estimate

### Priority 7 — Mortgage Payment Calculator
- Add to landing page or as its own `/calculator` route
- Inputs: home price, down payment, interest rate, loan term, county (for taxes), insurance estimate
- Output: full PITI breakdown (principal, interest, taxes, insurance)
- Show side-by-side for different loan programs (FHA vs conventional vs VA)

### Priority 8 — Investor-Specific Tools
- Cap rate calculator
- Cash-on-cash return calculator
- Rental property analyzer (NOI, expenses, cash flow)
- 1031 exchange explainer with timeline tool

### Priority 9 — Open House Mode
- QR code generator that links to `/start?src=openhouse&property=ADDRESS`
- Mobile-optimized quick capture form (name + phone only, 30 seconds)
- Print-friendly QR sheet for physical open houses

### Priority 10 — SEO / Content
- Static blog/resource pages for organic traffic
- Schema markup (LocalBusiness, RealEstateAgent)
- Sitemap generation
- Meta descriptions per learn topic page

---

## Agent Information to Personalize

The following should be added as environment variables and wired through the app:

```
AGENT_NAME=
AGENT_LICENSE=
BROKERAGE_NAME=
BROKERAGE_LICENSE=
AGENT_PHONE=
AGENT_EMAIL=
AGENT_PHOTO_URL=
```

Currently the app is generic ("Open House Companion"). The agent's name, photo, brokerage, and license number should appear in:
- The nav / header
- The landing page hero
- The IABS disclosure text
- Confirmation emails
- Footer

---

## Tech Stack
- **Framework:** Next.js 16.2.9 (App Router, no Pages Router)
- **React:** 19.2.4
- **Styling:** Tailwind CSS 4 (`@import "tailwindcss"` — no config file)
- **TypeScript:** 5
- **Storage:** Local JSON file (`data/leads.json`) — replace with database for production
- **Fonts:** Geist Sans + Geist Mono (next/font/google)
- **Icons:** Inline SVG only — no icon library installed

## Key Conventions
- Pages default to Server Components; only add `"use client"` when using state/hooks/browser APIs
- `useSearchParams()` must be wrapped in `<Suspense>` (see `/start/page.tsx`)
- `params` in dynamic routes is a `Promise` — must `await props.params`
- Tailwind v4: utility classes work as expected; no `tailwind.config.js` needed
- No `className` prop on Server Components that import client components — pass as children
