# Local journey completion — October 3, 2026

## Scope and implementation

Renting, selling, investing and relocation now have useful planning before contact intake. They expose three context-specific actions, people who need to confirm the next step, an optional preferred follow-up date, and a portable brief. Actions remain explicitly proposed. Nothing is scheduled, approved or sent by the planner. Briefs can be copied for Hop, a provider or the visitor’s own AI. A sessionStorage handoff is optional: the visitor reviews and edits the exact brief, then explicitly includes it in inquiry notes. Missing or malformed storage can be skipped. Investment is discoverable through the move selector, menu and footer. Relocation can route to buying or renting first.

The visitor sign-in app remains distinct. Its guide conversation links now reach the marketing inquiry instead of inadvertently starting visitor sign-in. Its selling question path reaches the marketing selling planner.

React startup is guarded so the form does not accept typing before its handlers are ready. The planner shares existing tokens, heading/field/action styles and responsive question-choice cards.

## Official-provider content audit

The inherited program copy contained unsupported superiority/qualification claims, an incorrect conventional PMI automatic-cancellation threshold, and a blanket Texas assistance forgiveness claim. Replaced with qualified orientation and provider verification. Corrected the outdated school-district residence homestead exemption amount and the instruction to wait until the year after purchase.

- [VA purchase loans](https://www.va.gov/housing-assistance/home-loans/loan-types/purchase-loan/): eligibility requires COE, lender review and occupancy; no PMI, conditional no-down-payment benefit. Removed “best loan”/“best rates” guarantees.
- [VA funding fees](https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/): loan/use/down-payment factors and exemptions; removed universal fee comparison with PMI.
- [HUD FHA overview](https://www.hud.gov/helping-americans/loans): down payments as low as 3.5%; removed unverified fixed credit/rate/MIP-duration assertions and directs specific terms to the lender.
- [Fannie Mae HomeReady](https://yourhome.fanniemae.com/buy/homeready): conditional down payment as low as 3%; no blanket 740-score “best rate” claim.
- [CFPB PMI cancellation](https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/): request at 80% original value subject to conditions; automatic termination generally at scheduled 78% while current, not automatic at 20% equity.
- [USDA guaranteed program](https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-guaranteed-loan-program): specific address, primary residence, income and approved-lender review; financing does not imply no closing costs.
- [TDHCA programs](https://welcomehome.tdhca.texas.gov/programs) and official December 2025 brochure: up-to-5% assistance, approved loan officer and education; removed universal three-year forgiveness and directs the actual assistance structure to lender documents.
- [TSAHC Home Sweet Texas](https://www.tsahc.org/program/home-sweet-texas-homes/): eligibility conditions, grant versus second lien and sale/refinance conditions. Canonical page direct fetch was unavailable; indexed official content supplied the reviewed summary. No qualification is inferred.
- [Texas Comptroller exemptions](https://comptroller.texas.gov/taxes/property-tax/exemptions/): current $140,000 school-district residence homestead exemption; appraisal district determines qualification and timing.

This is a bounded audit of program and exemption claims, not a transaction-specific legal or financial review of every guide.

## Architecture decisions that remain

1. Shared progress: choose the record owner, client identity/access model, consent, storage/retention, synchronization and notification rules before adding a shared dashboard. Current proposals and browser-local drafts are not synchronized records.
2. Listing import: choose an authorized provider and permitted use, fields, provenance and freshness rules before importing property details. Current lists are supplied snapshots.
3. Direct AI integration: choose supported read-only discovery versus authorized write actions, user consent and provider interface. Copied briefs work now; no ranking/recommendation guarantee or live agent integration is implemented.
4. Release: creator visual review and deployment are separate. No push or deployment is part of this iteration.

## Terminal and browser verification

Final marketing lint and sample-mode production build passed after the startup guard and relocation branch changes. Eighteen marketing tests pass, including malformed/oversized handoff rejection and preservation of visitor wording without injected approval fields. Visitor lint, twelve tests and sample-mode production build passed. Original artwork/shared-token infrastructure checker passes.

Verified rental planner copy, explicit review/inclusion, correct rental questions, final notes and sample-only completion with synthetic data. Investor brief copy and investor inquiry URL verified at 390px. Browser access recovered on the next user-authorized continuation: the fresh inventory had native apps and no lock error, and a new in-app QA tab loaded the local preview. The prior lock report is no longer a blocker.

Completed the three interrupted checks at a measured 390px viewport. Seller priorities, preparation action and native keyboard date entry updated the portable brief; the selected 2026-10-11 date survived clipboard copy, optional review/inclusion and final inquiry notes. Automated date fill changed the DOM input without firing the React update; native ArrowUp and Tab updated both input and brief, so no application patch was required. Seller-specific questions and sample-only completion passed. Relocation renting-first choice, proposed visit action, clipboard copy, correct role=renting&type=relocating route, explicit inclusion, rental-specific questions, final notes and sample-only completion passed. Both sample completions visibly stated that no lead was sent and no follow-up was scheduled. No horizontal page overflow was present at 390px. Screenshots of the seller final review and relocation plan were inspected. These targeted checks do not imply every new planner was tested at every device width.

Evidence: /Users/facelessdon/Documents/Codex/2026-10-03/task-2/hop-review-evidence/seller-final-review-390.png, relocation-plan-390-final.png and relocation-sample-complete-390.png. Marketing sample preview runs on 3123. No production lead, schedule, push or deployment was created.
