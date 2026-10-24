# Hop request coverage audit — October 3, 2026

## Finding

The requested experience is incomplete. Passing builds, tests and the three interrupted browser checks established specific implementation behavior; they did not complete the product brief or justify asking the creator for a full design review.

The builder is a browser-local, one-draft list preparation tool. Calling it an agent workspace overstated its scope. Older Next.js admin source contains lead listing, detail, status and export operations, but no integrated, reviewed workflow connecting client plans, shortlists, responses, qualification handoffs and follow-up ownership was delivered.

## Evidence reviewed

- Retrieved the actual user messages from this task, including the House List/Builder intention request, the explicit answer “Both, with distinct experiences,” the detailed guide/process/AI/form-burden feedback, the floating sidebar report and the latest workspace concern.
- Re-read DESIGN-RESET-DISCOVERY-2026-10-02.md, TRANSCRIPT-REVIEW-2026-10-01.md, CONNECTED-JOURNEY-2026-10-03.md and JOURNEY-COVERAGE-2026-10-03.md.
- Revisited the supplied September 30 transcript for Darius's daily work: qualification bottleneck, reaching back out to people, scheduling and attending showings, shortlist preparation and listing-agent/property application handoffs.
- Inspected standalone/jo-house-list.html, standalone/README.md, src/app/admin/page.tsx in ../hop-home-list and the design-system coverage manifest.
- Read the current 3114 Builder tab without typing, reloading or changing its draft.

This covers the messages recovered in this task and the listed project sources. It does not certify that every instruction from every historical session has been recovered.

## Request-by-request coverage

| Request | Actual delivery | Coverage and missing work |
| --- | --- | --- |
| Recover latest Hop work and identify actual surfaces | Separate marketing, visitor and standalone list sources identified; local previews and reports supplied. Frozen published review left untouched. | Partial presentation: the user's open Builder document is older than saved source, so it does not demonstrate the latest changes. |
| Use Impeccable and a coherent system grounded in project context | Supplied artwork, shared tokens/system, component contracts, route coverage and consistency checker; manual Impeccable craft/review guidance applied. | Foundations implemented. No independent design approval or automated Impeccable certification; agent workflow coverage remains weak. Tokens are not proof of a complete experience. |
| Think hard about proper Builder/House List UX for Darius and visitor | Preparation/review/share cues; current edits serialized at share time; chosen order retained; client-facing reasons; hosted photos; private extra paste notes; safer validation. | Partial. These improve a list editor. They do not demonstrate the larger agent-side job or an intentionally designed daily workspace. |
| Both public explorers and clients, with distinct experiences | Public entry provides orientation cards and marketing links. Curated links provide supplied home cards, browser-local saves, comparison and a message draft. | Partial. Public entry is orientation, not a connected home exploration experience. Plans do not generate or connect to an actual shortlist; returning client continuity and agent visibility are missing. |
| Guides should have larger, easily clickable cards rather than list-heavy presentation | Guide index/resource cards, larger spacing and question choices implemented. | Partial. Guide bodies and several other surfaces remain numbered rows, prose and forms. The requested thinking was not applied consistently across all relevant surfaces. |
| Tools should help buyers, sellers, renters and investors through the process | Buyer planning and four other context-specific planning components, proposed action/owner/date and portable briefs. | Partial. Tools shape an initial conversation. They do not support the whole process across visits, property checks, applications, provider progress and confirmed next actions. |
| Assist Darius so he can focus on relationships and move alongside the client | Relationship-centered wording, selection reasons and portable questions/plans. | Missing operational support. No integrated client context, response inbox, next-action queue, confirmed ownership or follow-up tracking. Copying a message does not deliver it to Darius or make it visible in his workspace. |
| Reduce the burden of forms and repeated information | Planning requires no contact information; importing a brief into inquiry is optional and explicit. | Partial. It still adds a planning form before a multi-step intake; overlapping timing, areas and other questions remain. Carrying prose into notes does not remove repeated fields or prove reduced burden. |
| Research how buyers/sellers/renters use AI | Buyer/seller AI survey and existing home-search AI product research; renter digital behavior distinguished from AI-specific findings. | Research begun, not a complete segmented study. No renter AI conclusion should be inferred from general digital-use data. |
| Work with visitors' AI / appear in agentic shopping | Portable list messages and plans can be copied for the user's AI. | Partial interoperability only. No direct agent interface, discoverability implementation or recommendation guarantee. |
| Anchor “A little clarity, first” within its section | Sticky behavior removed; prior rendered desktop verification and mobile checks documented. | Implemented for the reported issue. |
| Finish the work before requesting full design review | Builds, lint, test suites and targeted sample flows passed; date/seller/relocation checks completed after access recovered. | Technical checks completed, product scope incomplete. Prior completion language was too broad. |

## What changed in the list source

Agent-side changes: explicit prepare/review/share sequence; serialize the newest edits; readiness feedback; preserve recommendation order; local-only extra pasted material; explicit “Why this home fits” field; portable hosted-image URLs; honest missing/unchecked facts.

Client-side changes: remove builder navigation from shared lists; preserve Hop's selection order; save/unsave; compare supplied price/space/status/reason; scoped local favorites; prepare a message with selected homes and optional question; copy or open a messaging draft without sending; mobile comparison scroll cue.

These changes were verified with synthetic data on isolated origin 3134. They do not add multiple client records, a client workspace, synchronized responses, actual sending, scheduling, listing feed or CRM integration.

## Preview mismatch observed

The existing 3114 document showed “AGENT TOOL · NOT SHOWN TO CLIENTS,” a Builder navigation link, “Anything extra becomes the home's note,” “Live preview — exactly what the client sees,” and an enabled copy control for an empty list. The saved source instead shows “Agent workspace · local draft,” Client entry navigation, local unshared extra paste notes, “Review before sharing,” and share validation.

This establishes that the open document is older than the inspected source. It does not establish a server-root problem. The user's tab and draft were not reloaded or modified.

## Required next design proof

Before full-site design review, demonstrate the two sides of one client relationship with synthetic data:

1. Darius opens the client's context: current goal, preferences already known, readiness questions, current shortlist and next agreed action.
2. He prepares or revises the shortlist inside that context, explains the choices and reviews what the client will receive.
3. The client compares it, expresses preferences/questions and sees which step is proposed versus confirmed.
4. Darius sees the response in context and can prepare the next conversation with a responsible person and follow-up date.
5. Both sides can resume without re-entering the same preferences.

This is a proposed acceptance flow drawn from the user's feedback and transcript, not an approved visual layout or authorization for external integrations. A local synthetic demonstration can prove the interaction before persistent records, access control and actual delivery are selected. Builder becomes a task within that workspace rather than the workspace itself.

The next implementation should address this missing loop and repeated intake, with explicit coverage against the requests above. A full visual review should not be treated as the user's next obligation while these requirements are unresolved.


## Subsequent implementation milestone

The missing local agent/client buying loop is now implemented and browser-verified. See [RELATIONSHIP-WORKSPACE-2026-10-03.md](RELATIONSHIP-WORKSPACE-2026-10-03.md) for route-level coverage, retained state, proof and remaining whole-product gaps. The original audit above records the state before this milestone; it should not be read as saying the new workspace is absent. It also should not be replaced with an assertion that every earlier request is now finished.

## Extended local milestone — October 4 UTC / October 3 Chicago

The local relationship proof now covers buying, renting, selling, investing and relocation. This extends the buying milestone; it does not complete the whole product or certify all historical instructions.

| Prior request | Current local delivery | Still outstanding |
| --- | --- | --- |
| Agent workspace beyond Builder | Separate relationship overview and per-client context, recommendation task, response, next-action proposal/agreement/completion, provider-check note and conversation trail. Overview states show response availability and actual next-action state. | Live private accounts, authoritative records, synchronization, actual communications, calendar and provider progress. No claim that this is a complete daily CRM. |
| Public explorers and existing clients are distinct | Explorer can shape a plan without contact details; explicit transition carries the existing context into a retained relationship. Existing client opens recommendations and next action. Both views were exercised with synthetic people. | Verified public inventory and real client identity/access. |
| Builder/list feedback addressed | Prepare/review/share, latest draft serialization, choice order, fit reasons, local private paste notes, favorites, comparison and portable questions remain in the separate utility. The workspace adds retained responses and actions, which the utility lacked. | Standalone drafts are not automatically migrated into workspace records. A rendered 3114 tab may still show older loaded source; original draft is preserved. |
| Practical process help for different intents | Rental costs/application checks; seller preparation choices; investment assumptions/use checks; relocation housing/destinations/visit options. Each supports review, feedback and owned next action. | Full applications, contracts, offer/closing progress and verified provider statuses. Recommendations are illustrative, not supplied listings or professional outcomes. |
| Reduce repeated forms | Existing priorities, timing, proposed action, owner, date and relocation housing choice carry to the relationship with no new contact intake. Explicit structured-plan inclusion skips repeated inquiry preferences/qualifiers. Seller asks only for the property address plus reviewed timing; optional financial and reason questions are deferred. Unreported mortgage status defaults to not discussed. | Old plain-text briefs cannot safely map structured intent, so retain the original intake. A modified imported brief remains notes-only to avoid relying on stale structured context. Unsubmitted contact intake is not promised to survive reload. |
| Card-based guides / readable click targets | Index/resource/question cards and intent planning tools remain implemented. | Several guide bodies still use numbered rows, prose and lists. This feedback is only partly covered. |
| AI research and working with visitor AI | Portable briefs/questions and earlier source-backed initial research. | Complete segmented buyer/seller/renter evidence and an implemented external agent interface/discoverability strategy. No recommendation guarantee. |
| Impeccable and coherent system | Manual skill guidance, supplied art, shared semantic tokens/components, registered relationship pattern and route coverage checks. | Creator approval of the visual language; no automated Impeccable certificate or full Facework protocol run is claimed. |

### Verification added

- Created a new local relationship from each of the four public planners. Original free-text priorities and timing appeared unchanged on both sides; requested action, original responsible person and native follow-up date 2026-10-12 carried forward.
- Darius prepared and explicitly published intent-specific recommendations. Client chose two, compared appropriate facts/checks, added a question, explicitly shared feedback and agreed to the proposed action. Reload retained feedback and agreement. Darius saw the exact question and could mark the agreed action complete for all four intents.
- Rental proof also includes a new agent proposal based on client feedback before agreement. Relocation back/forward navigation and a new tab retained the same record and completed action.
- Structured inquiry inclusion visibly yielded two steps for rental, investor and renting-first relocation; seller yielded contact, property address and disclosure. Investor contact back-navigation retained entered synthetic values. Empty seller address showed validation; supplied timing was not re-asked. No inquiry was sent.
- Empty recommendation response showed “Choose a reaction or add a question first.” Missing-record route offered a useful start-over link. Pure persistence tests exercise unavailable reads, failed writes and unreadable existing data without overwriting it or claiming success.
- Actual 390px client screenshots were saved and inspected for all four intents. Final normal preview measured 1422px with matching document width. A later attempted 320px override measured 1422px, so no new 320px verification is claimed for this extension. Earlier buying-loop 320px checks remain historical proof only.
- Marketing lint, 26 tests, sample-mode webpack build/TypeScript and design-system checks passed before the final overview wording refinement; final lint/build checks are recorded below when completed. Original list utility tests were previously 9/9 and its behavior was unchanged by this extension.

Evidence: local files under /Users/facelessdon/Documents/Codex/2026-10-03/task-2/hop-review-evidence:
relationship-renting-390.png, relationship-selling-390.png, relationship-investing-390.png, relationship-relocating-390.png, relationship-intents-mobile-proof.png, relationship-relocation-agent-1422.png, relationship-overview-final.png.

Review /workspace on local port 3123 for the agent surface. It is distinct from the standalone list preparation utility on port 3134 and the original loaded Builder on 3114. Marketing branch remains codex/transcript-journeys at base HEAD 3e3de7c8e45d86a55904bfaa42f9ba1a4943c830 with saved uncommitted work. No push, deployment, production records or original Builder draft changes.

Final overview refinement verified: lint, sample-mode webpack build/TypeScript and design-system checks passed. The 26-test suite passed immediately before the wording-only overview refinement.

## Bounded requirement split — original feedback versus later ambitions

Reference: user feedback in turn 01a103d4-984c-7475-aa3e-dd8f5ffadabf of this task, October 3, beginning “I'm looking at the guides.” Subsequent “Lets keep working” / “Lets finish the work” authorized continued local implementation.

Actual partial original requests:
1. “the guides could be more of instead of this, like, list” and “cool cards and containers ... easily clickable.” Index/resource cards and question controls exist, but the bodies of /learn/process and /learn/programs and other topic guides still present numbered reading sections, bullets and prose. The remaining local application is bounded to those guide bodies, not an open-ended redesign of every surface.
2. “make this more interactive, apply and learn” and “really assist them ... through the process.” Five intent planners and the relationship loop now deliver an actionable local outcome. GuideQuestionPlan itself only selects/copies questions, says they stay until you leave, and links to a planner without carrying the selection. A useful remaining local interaction is an explicit carry-over of the selected guide questions into the existing plan/relationship, without another intake. The user did not specify a lender application simulator or require a separate wizard for every topic.
3. “I would be interested to see what kind of research about how buyers, sellers, renters and all that are using AI.” The assistant explicitly committed to research home-search AI. Initial work was reported, but no complete audience-specific synthesis was delivered. This is a genuine unfinished research request.

Precise bounded research question:
How are buyers, sellers and renters using AI during discovery, comparison and process preparation; what do they trust it to do versus a human agent; and what findings should shape Hop's portable information, relationship handoff and presence in an agent-assisted search? Include investors/relocation only where evidence supports distinct behavior. Keep adoption evidence separate from a vendor announcing a capability; do not infer renter AI adoption from generic online-search behavior.

Recovered source work from the original response:
- Realtor.com AI and Housing Survey 2025: https://www.realtor.com/research/ai-and-housing-survey-2025/ — reported sample was 1,000 interested/recent buyers and sellers, not a renter or general-population sample. Re-read methodology before using numbers.
- Realtor.com March 30, 2026 ChatGPT app announcement: https://mediaroom.realtor.com/2026-03-30-Search-Homes-and-See-What-You-Can-Afford-with-the-New-Realtor-com-R-App-in-ChatGPT — capability and agent handoff example, not independent adoption evidence.
- Search calls covered Zillow buyer/renter research and Redfin AI surveys. No additional exact renter-AI source or standalone research report was recovered from the saved docs. Do not present those searches as verified findings.

Exploratory direction, not a specified integration deliverable:
The user said “maybe some of our answers could be there” in working with their AI or showing up in an agentic experience. Portable briefs are implemented. Research-informed recommendations for interoperability/discoverability remain appropriate; a live external agent interface was not explicitly specified as the required implementation.

Later full-service scope, not additional blockers to local design review:
Authenticated multi-user accounts, cross-device synchronization, MLS/listing feeds, CRM/calendar/message integrations, actual lender/property applications, contracts/closing tracking and automated agent recommendations. These are possible service implementation decisions, not all unfinished local requests. The complete five-intent local relationship flow is ready for design review, with the narrow guide/research gaps above visible. No service integration was started by this clarification.

## Handoff research update — October 3, 2026

The previously unfinished AI research is now complete as a separate AI-RESEARCH-SUPPLEMENT.md at the package root. Earlier unfinished-research statements above are historical. The supplement covers U.S. buyer/owner evidence, pooled buyer/seller research, Canadian renter AI use, U.S. renter automation willingness, capability examples and explicit design inferences. It does not establish seller-only/investor adoption or a U.S. renter GenAI adoption rate. These are evidence limits, not a claim that all populations were measured. The source sets are not directly comparable.

Frozen code still only partially applies card treatment inside guide bodies and does not carry selected guide questions into the relationship. Direct AI integration, live accounts and full transaction workflows were not added. Application source is unchanged for this handoff; this audit appendix and research supplement are packaging documentation.
