# Hop / Big move. Real talk. Hop in.

Implementation direction authorized October 3: develop from existing evidence without another discovery hold. This is a concrete local design proposal, not a claim of final aesthetic approval or a completed Facework protocol run.

## Evidence and center
September 30 transcript: social first touch, trust, outgoing/engaging experience, useful information before capture, relocation discovery and property-specific rental handoff. Darius's earlier launch blueprint (`projects/Hop In Real Estate/Hop In Real Estate - Markdown Files.md`, DaReal Estate Launch Blueprint) supplies “luxury vibes + real energy + lifestyle,” city/suburban/value contexts, and real photography. Historical luxury aspiration does not establish current inventory or credentials. Original supplied white icon and wordmark are the immutable anchors.

The accessible Hop repositories and Facework branch inventories did not expose the claimed Hop protocol-run package. Its exact contents remain unreconciled. Reviewed Facework Coherence Design principles and Protocol section 11: actual tokens, components, evaluator and examples are required in addition to a written contract. No new protocol certification is claimed.

## Design brief
Audience: people arriving from social or a search, planning a DFW move, with different levels of readiness. Primary outcome: choose the relevant move and leave with useful next steps before sharing contact details. Voice: candid, spirited, personal. Discovery foregrounds Hop and the user's life; task mode reduces expressive composition to clear steps, legible controls and calm feedback.

Sign-like Barlow Condensed is paired with Public Sans for labels and reading. Catalogs reviewed: https://fonts.google.com/specimen/Barlow+Condensed and https://fonts.google.com/specimen/Public+Sans. The wordmark retains its original artwork. Brick is a proposed action color: earthy enough to sit beside homes, strong enough to carry the outgoing energy. Charcoal belongs to identity and selected choices; chalk supports daytime reading; clay groups supporting guidance. This palette is a proposal with a documented purpose, not a historic approved brand palette.

Art direction: actual supplied portrait leads; illustrative housing photography supports lifestyle questions without pretending to be local listings. Never invent a face, endorsement, location, property availability or testimonial. Image failure retains identity and the next action.

Hierarchy: one move selector, one action for that selection, three optional questions. Avoid the prior repeating audience/navigation card grid. Desktop places voice beside Hop; mobile moves the actionable selector directly after the message, then the portrait. A complete buyer plan precedes optional inquiry; explicitly importing preferences is preserved.

States: default, selected, hover, focus, active, disabled, loading, empty, image failure, invalid fields, storage failure and completion. Reduced motion removes spatial transitions; keyboard focus and text state descriptions remain. Body and form text use readable fixed sizes; display headings scale fluidly. Principal controls are at least 48px.

## Implementation
Shared token source: public/brand/tokens.css. Shared CSS patterns: public/brand/system.css. Typed React primitives: src/components/ui.tsx. Concrete first-touch behavior: move-picker.tsx. Asset fallback: portrait.tsx. Buyer plan keeps the existing BuyerPlan storage contract. Review builds set NEXT_PUBLIC_HOP_REVIEW_MODE=1, show a persistent sample notice and simulate client submission; backend safety/storage code remains unchanged.

## Evaluation rules
A page passes only if its promise matches implemented capability, the next action is clear at desktop and phone sizes, the original artwork is intact, its state feedback is readable without color alone, and source/data claims are qualified at the point of use. Visual browser evidence is required; build/tests alone do not establish design quality. See the live local /design-system catalog as it is extended.
