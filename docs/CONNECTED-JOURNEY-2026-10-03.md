# Connected journey local iteration — October 3, 2026

User direction: serve public explorers and existing clients through distinct experiences; make guides useful without requiring more intake forms; preserve Darius’s relationship role.

## Implemented

Public House List entry now offers orientation to planning, areas and renting. Curated client links have no builder navigation. Darius’s browser-local builder preserves recommendation order, previews shared content, and serializes current typed edits when copying or previewing. Extra pasted text is held in an unshared review note. Explicit reasons explain why each home was included. Hosted image URLs replace device-only upload controls. Sharing validates completeness, URLs and numeric values without inventing availability.

Clients can save homes, compare factual supplied details and prepare a message containing their picks plus one optional question. Copy, SMS and email prepare a handoff; they do not book or send automatically. Saved choices are scoped to the list identity in the browser.

Guide detail pages in marketing and visitor apps include selectable questions and a portable brief for Hop, a provider or the visitor’s own AI. No contact intake is required. The guide card’s inherited section-padding conflict was corrected after pixel review.

## Verification

House List: nine regression tests pass, including current-field serialization, private import-note exclusion, safe sharing, recommendation order and selected-home message content. Both Next apps passed lint and review-mode builds during this iteration; final CSS-only spacing correction passed lint and browser rendering. Desktop synthetic flow verified latest price, order, public reasons, save, comparison and clipboard success. Guide selection and actual copy success verified. A narrow viewport measured 433px with no document horizontal overflow and 22px question-card padding. Full fresh mobile journey review remains incomplete; no certification claim.

Evidence: task-2/hop-review-evidence/client-comparison.jpg, client-next-step.jpg, guide-question-plan.jpg. Synthetic QA used isolated origin 3134; user’s working draft on 3114 was not overwritten. Main review website: 3123. Visitor: 3125.

## Remaining product decisions

This is a local pilot. The builder has one local draft and no authentication, CRM, live inventory or synchronized client workspace. Sent links are frozen snapshots. The guides’ existing financial/program assertions still need a separate provider-source content audit before publication; this iteration does not establish their current accuracy. An AI-compatible copied brief is implemented, not an agentic discovery integration or a recommendation guarantee. Next design proof should address Darius’s follow-up ownership and client progress across visits, then verify the entire phone flow.

No push, deployment, lead submission or external messaging occurred.

## Mobile verification follow-up

Verified measured CSS viewport widths 320, 390 and 768 (the browser override inputs were adjusted for the current browser zoom; assertions use actual innerWidth). Builder at 320 and 390 had no page overflow. At 390, editing the first price to $431,234 and the list title followed by Copy client link and Preview carried current values, preserved Plano-before-Dallas order and excluded the private import reminder. Saving/unsaving, comparison, optional question and real clipboard-copy status passed. The generated message included both saved homes and the question, while explicitly requesting confirmation rather than claiming a booked tour. At 320 the table remained confined to a horizontal scroll region and ArrowRight moved it; saved actions measured 140px wide and at least 52px tall. Added a visible sideways-scroll cue. At 768 both supplied homes fit the comparison with no document overflow.

Guide selected-question copy passed at 320 and 390; no page overflow at 320, 390 or 768. Normal viewport restored afterward. In-app screenshot capture became blank on the narrow guide viewport despite visible DOM measurements and working controls; do not treat those blank viewport images as pixel approval. The earlier corrected desktop guide image remains usable. Client comparison and next-step phone pixels were captured successfully.

Additional evidence: client-comparison-390.jpg, client-next-step-390.jpg, client-comparison-320.jpg, builder-320.jpg, client-comparison-tablet.jpg in task-2/hop-review-evidence. Nine list regression tests still pass after the scroll cue.

## Next bounded requirements, grounded in the Sept 30 conversation

Before adding backend access, define a client progress record with the next action, responsible person, follow-up date and visitor-confirmed preferences. Let the visitor review any transfer to Darius. Qualification progress should record whether a lender conversation or secure provider step is pending, without collecting financial documents or claiming eligibility. Prove the visitor and Darius views with synthetic records first.

To reduce manual listing entry, the concrete next requirement is: paste one permitted listing URL or address, retrieve only authorized property details, show provenance/freshness and let Darius review them before adding his reason. Selecting an authorized data provider and its permitted use is necessary before connector setup; current parsing does not retrieve live details. Dallas relocation, sellers, investors and renters are relevant audience context, not grounds for a silent broad build. Historical repository-access issue concerned Stedmon’s expired access, not Darius’s GitHub permissions. No claim that the Sept 30 meeting was a Hop-specific protocol run.

## Narrow-guide capture resolved

A fresh 320px page reload still produced clipped/blank viewport snapshots, while a supported full-page screenshot rendered the full guide, question choices and copied brief. Ancestor styles had visible content, opacity 1, no transforms, no clipping, and visible overflow. The full-page pixels substantiate the card’s mobile appearance; the issue is confined to the in-app viewport capture path. Extracted the actual card pixels without rescaling from guide-full-320.png to guide-card-320.png. Card text wraps within its container; choices and copy action are readable; copied brief is scrollable. Corrected singular copy label (“Copy my 1 question”) in both apps. Narrow visual blocker is resolved for the inspected card; the capture limitation itself remains. No app CSS change was needed for that issue.
