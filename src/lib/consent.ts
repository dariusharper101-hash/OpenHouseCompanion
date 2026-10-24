import type { ConsentEvent, LeadConsent } from "@/types/lead";

// ─── Consent history ──────────────────────────────────────────────────────────
// A lead's consent top level is always the CURRENT decision. The first time
// it changes, the original decision is moved into `history` and every change
// after that is appended, so the full trail (opt-in, revocation, superseded
// number...) is kept with the lead.

function asEvent(c: LeadConsent): ConsentEvent {
  return {
    tcpa: c.tcpa,
    at: c.at,
    version: c.version,
    text: c.text,
    ...(c.ip ? { ip: c.ip } : {}),
    ...(c.userAgent ? { userAgent: c.userAgent } : {}),
  };
}

export function applyConsentChange(
  current: LeadConsent | undefined,
  event: ConsentEvent,
  opts: { pageUrl?: string; note?: string } = {}
): LeadConsent {
  const history = current ? current.history ?? [asEvent(current)] : [];
  return {
    ...event,
    pageUrl: opts.pageUrl ?? current?.pageUrl ?? "",
    history: [...history, event],
    ...(opts.note ? { note: opts.note } : {}),
  };
}
