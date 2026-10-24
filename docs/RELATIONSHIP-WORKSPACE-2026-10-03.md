# Connected relationship milestone — October 3, 2026

## Delivered local behavior

A relationship workspace exists separately from the standalone list editor. Client context comes before the task. The record contains existing goal/preferences, a working shortlist, a separately published shortlist version, client reactions and a question, a proposed/agreed/completed next action with owner and follow-up date, a provider step to check, and a conversation trail. Working notes are excluded from the client-facing projection. This is visual role separation in a synthetic demo, not authenticated isolation.

Routes (marketing source, sample review mode):
- /workspace — relationship overview with people, context, response state and next responsibility.
- /workspace?client=sample-buyer — agent context, response, progressive shortlist editing/review and next-action proposal.
- /client-review?client=sample-buyer — existing-client context, shared homes, reasons, reactions, comparison, question and explicit next-action agreement.
- /relationship-demo — distinct public explorer and existing-client entrances.
- /buy?src=relationship-demo — existing plan fields; optional explicit transition reuses preferences without an additional contact form.

The new routes return notFound outside NEXT_PUBLIC_HOP_REVIEW_MODE=1 and have noindex metadata. This condition keeps the demonstration outside normal production mode; it is not an access-control system.

## Architecture

src/lib/relationship-demo.ts defines the synthetic domain and state transitions. src/lib/relationship-store.ts uses the separate localStorage key hop-relationship-demo-v1, stable external-store snapshots and browser storage events. Changes persist across reloads and role navigation in this browser/origin. No backend, credentials, new permissions, external synchronization or notification channel was added.

Publishing copies the current draft into a separate version. Later draft edits do not alter that version until explicit publication. Responses identify the shortlist version and exclude homes outside the currently shared list. An agent proposal resets agreement; only the client-side agreement action permits the demo's completion transition. Neither state books a tour or makes an approval decision.

The standalone houseListBuilder.v2 draft and client favorites keys were not imported, replaced or reset. The user's 3114 Builder tab was not reloaded. Current standalone source was opened on the isolated synthetic origin 3134, whose static server was restored. Its scope label is now “List preparation tool · local draft,” not a claim that the utility is the full workspace.

## Actual request coverage at this milestone

| Requested outcome | Current proof | Remaining scope |
| --- | --- | --- |
| Darius has a workspace beyond Builder | Overview, client context, response, provider-step preparation, shortlist task, next owner/date/state and history. | Synthetic local data; no authoritative CRM or private identity. |
| Builder belongs in relationship flow | Workspace shortlist task uses known preferences, fit reasons and progressive fact editing. | Separate legacy list drafts are retained as a utility, not automatically merged. |
| Client response reaches Darius | Retained reactions/question, explicit demo response, visible in agent context after role navigation. | No real messaging or cross-device synchronization. |
| Public explorer and existing client differ | Distinct entry cards; explorer carries an existing plan; client reviews a supplied shortlist. | Public inventory discovery needs a verified provider, not invented listings. |
| Reduce repeated intake | Carried explorer preferences are shown on both sides without new contact fields; facts edit only on disclosure. | Other inquiry routes and journeys still contain repetition to reconcile. |
| Assist actual progress | Proposed → client-agreed → completed next action, responsible person/date and provider step to check. | This is one buying relationship loop, not every transaction or property application workflow. |
| Consistent design system | Shared artwork, semantic tokens, action/field components, fixed task type scale, readable cards and state labels; coverage manifest/catalog updated. | Creator design approval remains distinct from code checks. |

## Verification performed

- Read actual prior messages and request coverage audit before implementation; revisited .impeccable.md, actual Impeccable instructions, the supplied transcript and Facework protocol context. No full protocol certification is claimed.
- Darius opened sample-buyer context, edited a fit reason and private working note, reviewed exact client-facing homes, then explicitly shared version 1.
- Client view showed current shared reason and known preferences, without the private note in its rendered content. Chose two homes; comparison contained their actual supplied sample facts.
- Client question and reactions survived reload. Explicitly recorded response appeared in agent context with matching shortlist version and exact question.
- Agent proposed action, owner Hop and native date 2026-10-12. Client saw the proposal, agreed, and agent could then mark complete. Completed state appeared in the client view.
- Unpublished label change remained absent from the client view. Restored the working label afterwards.
- Same reaction can be cleared. Incomplete shortlist publication displays a useful error. Domain tests reject a response containing only removed homes and prevent completion before agreement.
- Public entry → existing buying planner → explicit relationship transition preserved areas, budget and three-bedroom/yard preferences. Client had zero contact textboxes. Reload preserved context; agent view showed the same values.
- Measured agent/client phone widths 390 and 320. Fixed the agent task grid's 9px narrow overflow, then verified document width equals 320. At 390 reactions measure approximately 48px high; comparison overflow is contained in its own focusable region. ArrowRight moved the comparison. Inspected actual saved screenshots. A later tablet override did not change the already-open QA tab; no new tablet verification is claimed.
- Responsive QA tab was closed after reset attempts and a clean normal-size workspace tab opened, verified at innerWidth 1422 with no document overflow. Original user tabs remain.
- Final marketing lint, 22 tests, sample-mode webpack build/TypeScript and design-system consistency check passed. Standalone 9 regression tests passed from its own repository directory. First list-test invocation used the marketing directory and failed to locate the fixture; corrected invocation passed. Visitor source was unchanged by this milestone.

## Evidence

/Users/facelessdon/Documents/Codex/2026-10-03/task-2/hop-review-evidence/
- workspace-final-normal.png and workspace-final-detail.png — final actual 1422px agent workspace, response, owner/date/completed state and progressive shortlist task.
- workspace-relationship-390.png — agent context/response and task at 390px before progressive fact disclosure refinement.
- client-relationship-390.png — actual client context, sample homes, reaction controls, comparison and response at 390px.
- earlier workspace-relationship-desktop.png — agreed-state checkpoint, before marking the next action complete.

Marketing source: /Users/facelessdon/Documents/Codex/2026-10-01/task-3/hop-real-estate, branch codex/transcript-journeys, base HEAD 3e3de7c8e45d86a55904bfaa42f9ba1a4943c830 plus saved uncommitted work. No commit, push or deployment occurred. Local marketing preview is 3123; isolated current-source list preview is 3134.

## Still not a completed whole-product brief

This milestone closes the absence of a connected local agent/client buying proof. It does not establish complete renter, seller, investor and relocation transaction workflows, remove every repeated intake, redesign every list-like guide body or complete every audience's AI research. Those remain explicit coverage work.

Real private multi-user records require identity, record ownership, authorization, consent/retention and synchronization decisions. Real listing imports require an authorized provider and provenance/freshness rules. Actual tours, lender or property approvals, messaging and external AI interfaces require their own real connections and confirmations. These were not simulated as completed real actions. Design-system checks do not replace creator judgment.

## Extended milestone

The retained local relationship loop now covers all five intents, with structured plan reuse and reduced inquiry steps. The buying-only statements above document the first milestone. See the extended local milestone in REQUEST-COVERAGE-AUDIT-2026-10-03.md for current coverage, per-intent browser proof, failure checks and whole-product gaps.
