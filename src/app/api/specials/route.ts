import { NextRequest, NextResponse, after } from "next/server";
import {
  addLead,
  findRecentByPhone,
  getLeadById,
  hasDurableStore,
  leadData,
  updateLeadData,
} from "@/lib/leads";
import { notifyNewLead, notifyConsentChange } from "@/lib/notify";
import { applyConsentChange } from "@/lib/consent";
import { appendTrackerRow } from "@/lib/sheet";
import { rateLimit } from "@/lib/rate-limit";
import { cleanText, normalizeUsPhone, formatUsPhone, validateSpecials } from "@/lib/specials-lead";
import { TCPA_CONSENT } from "@/config/consent";
import { SPECIALS_GUIDE, sampleBlocksLeads, todayInDallas } from "@/config/specials";
import { AGENT } from "@/config/agent";
import { leadsEnabled } from "@/lib/site-mode";
import type { ConsentEvent, Lead, LeadFormData } from "@/types/lead";

// ─── POST /api/specials ───────────────────────────────────────────────────────
// Dedicated endpoint for the DFW specials guide (leaves /api/leads alone).
// Order: spam checks → rate limit → validate → supersede the lead named in
// `replaces` ("Wrong number? Fix it") → 30-day dedupe (records consent
// changes on the existing lead) → Supabase save (must succeed) → email alerts
// + tracker row (best-effort, after the response).
// Nothing here ever talks to NestQuest. No internal error detail is returned.

const PRODUCT = "specials-guide" as const;
const MIN_FILL_MS = 3000;          // faster than this is a bot
const RATE_LIMIT = 5;              // posts per IP...
const RATE_WINDOW_MS = 10 * 60 * 1000; // ...per 10 minutes
const DEDUPE_DAYS = 30;
const REPLACE_WINDOW_MS = 24 * 60 * 60 * 1000; // "Fix it" only within a day
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const tel = AGENT.phone ? AGENT.phone.replace(/[^0-9+]/g, "") : "";

function unavailable() {
  return NextResponse.json(
    {
      error: "We couldn't save your request just now. Please call or text instead.",
      phone: AGENT.phone,
      tel,
    },
    { status: 503 }
  );
}

// Tracker row for a consent change (supersede, revocation, re-opt-in), so the
// Darius Lead Tracker never shows a stale "Yes". Best-effort like the
// new-lead row: appendTrackerRow no-ops without its env vars.
function consentChangeRow(lead: Lead, optedIn: boolean, reason: string) {
  return appendTrackerRow({
    Date: todayInDallas(),
    Name: [lead.firstName, lead.lastName].filter(Boolean).join(" "),
    Phone: formatUsPhone(lead.phone),
    Source: "Specials Guide - consent change",
    "Text Consent": optedIn ? "Yes - re-opted in" : "No - REVOKED/SUPERSEDED, do not text",
    Notes: reason,
    "Lead ID": lead.id,
  });
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // Same site-wide switch as /start and /api/leads (src/lib/site-mode.ts):
  // with lead capture off, renters get the call/text fallback.
  if (!leadsEnabled) return unavailable();
  // SAMPLE guide data never takes real leads in production (config/specials.ts).
  if (sampleBlocksLeads()) return unavailable();

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!SPECIALS_GUIDE.enabled) {
    return NextResponse.json({ error: "The guide is being refreshed." }, { status: 503 });
  }

  // Spam: honeypot filled, or the form was submitted in under 3 seconds.
  // Answer like a success so bots learn nothing; save nothing.
  // `elapsedMs` is measured in the browser, so client/server clock skew can't
  // cause false positives.
  const elapsed = Number(body.elapsedMs);
  if ((typeof body.hp === "string" && body.hp.trim() !== "") || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ip = clientIp(req);
  const limit = rateLimit(`specials:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many tries. Please wait a few minutes, or call or text instead.", phone: AGENT.phone, tel },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  const input = {
    name: cleanText(body.name, 200),
    phone: typeof body.phone === "string" ? body.phone.slice(0, 40) : "",
    moveMonth: typeof body.moveMonth === "string" ? body.moveMonth : "",
    budget: typeof body.budget === "string" ? body.budget : "",
    areas: Array.isArray(body.areas) ? body.areas.filter((a): a is string => typeof a === "string").slice(0, 20) : [],
    textConsent: body.textConsent === true,
  };
  const errors = validateSpecials(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fields: errors }, { status: 400 });
  }
  const phone = normalizeUsPhone(input.phone)!;

  // "Wrong number? Fix it": the resubmit names the lead it replaces.
  const replaces = body.replaces ?? null;
  if (replaces !== null && (typeof replaces !== "string" || !UUID_RE.test(replaces))) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Without Supabase (or the explicit local-dev file store) there is nowhere
  // durable to save. Refuse, so the renter sees the call/text fallback.
  if (!hasDurableStore()) {
    console.error("Specials lead not saved: Supabase is not configured");
    return unavailable();
  }

  const src = cleanText(body.src, 40) || "direct";
  const utm = ["utm_source", "utm_medium", "utm_campaign"]
    .map((k) => {
      const v = cleanText(body[k], 60);
      return v ? `${k}=${v}` : "";
    })
    .filter(Boolean);
  const variant = body.variant === "b" ? "B" : "A";
  const now = new Date().toISOString();

  // IP + user agent are proof of an opt-in, so they're kept ONLY when the
  // renter checked the box. Otherwise the IP is used in memory for the rate
  // limit above and then dropped.
  const consentEvent: ConsentEvent = {
    tcpa: input.textConsent,
    at: now,
    version: TCPA_CONSENT.version,
    text: TCPA_CONSENT.text,
    ...(input.textConsent
      ? { ip, userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300) }
      : {}),
  };

  const pageUrl = cleanText(body.pageUrl, 300);
  const alerts: (() => Promise<void>)[] = [];

  try {
    // 1. Supersede the typo'd lead: its number was wrong, so it must never be
    //    texted. Only specials-guide leads, only within a day, only when the
    //    number actually changed.
    if (replaces) {
      const old = await getLeadById(replaces);
      if (old && old.product !== PRODUCT) {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
      }
      if (old && old.phone !== phone && Date.now() - Date.parse(old.createdAt) < REPLACE_WINDOW_MS) {
        const wasOptedIn = old.consent?.tcpa === true;
        const note = "Superseded: renter corrected their number. Do not text this number.";
        const revoke: ConsentEvent = { tcpa: false, at: now, version: TCPA_CONSENT.version, text: TCPA_CONSENT.text };
        const updated: Lead = {
          ...old,
          notes: [old.notes, "SUPERSEDED (number corrected)"].filter(Boolean).join(" · "),
          consent: applyConsentChange(old.consent, revoke, { note }),
        };
        await updateLeadData(old.id, leadData(updated), "lost");
        const reason = "Number corrected with Fix it; this number was a typo.";
        if (wasOptedIn) {
          alerts.push(() => notifyConsentChange(updated, true, false, reason));
        }
        alerts.push(() => consentChangeRow(updated, false, reason));
      }
    }

    // 2. Already on the list (30 days): don't add a second row, but record a
    //    consent change. An unchecked resubmit after an opt-in is a revocation.
    const existing = await findRecentByPhone(phone, PRODUCT, DEDUPE_DAYS);
    if (existing) {
      const before = existing.consent?.tcpa === true;
      if (before !== input.textConsent) {
        const updated: Lead = {
          ...existing,
          consent: applyConsentChange(existing.consent, consentEvent, { pageUrl }),
        };
        await updateLeadData(existing.id, leadData(updated));
        const reason = input.textConsent
          ? "Re-submitted the guide form with the text box checked."
          : "Re-submitted the guide form with the text box unchecked (revocation).";
        alerts.push(() => notifyConsentChange(updated, before, input.textConsent, reason));
        alerts.push(() => consentChangeRow(updated, input.textConsent, reason));
      }
      after(async () => {
        await Promise.allSettled(alerts.map((fn) => fn()));
      });
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }

    const [firstName, ...rest] = input.name.split(" ");
    // Only what the renter actually told us. Buyer/seller-flow answers
    // (credit, employment, veteran, timeline, purpose...) are left unset, not
    // guessed. iabs/buyerRep false is accurate: this form doesn't ask.
    const data: LeadFormData = {
      role: "renting",
      firstName,
      lastName: rest.join(" "),
      email: "",
      phone,
      budgetMin: input.budget,
      budgetMax: "",
      bedrooms: "",
      bathrooms: "",
      neighborhoods: input.areas.join(", "),
      propertiesOwned: "",
      sellerAddress: "",
      sellerEstimatedValue: "",
      sellerReason: "",
      sellerTimeline: "",
      iabsAcknowledged: false,
      buyerRepAcknowledged: false,
      notes: [`src=${src}`, ...utm, `headline=${variant}`].join(" · "),
      source: src,
      product: PRODUCT,
      moveMonth: input.moveMonth,
      consent: {
        ...consentEvent,
        pageUrl,
      },
    };

    const lead = await addLead(data);

    // Best-effort side effects run after the response is sent. Both functions
    // catch their own errors and no-op when their env vars are missing.
    after(async () => {
      await Promise.allSettled([
        ...alerts.map((fn) => fn()),
        notifyNewLead(lead),
        appendTrackerRow({
          Date: todayInDallas(),
          Name: input.name,
          Phone: formatUsPhone(phone),
          Source: "Specials Guide",
          "Move Month": input.moveMonth,
          Budget: input.budget,
          Areas: lead.neighborhoods,
          "Text Consent": input.textConsent ? "Yes" : "No",
          Notes: lead.notes,
          "Lead ID": lead.id,
        }),
      ]);
    });

    // The id lets "Wrong number? Fix it" name this lead as the one it replaces.
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    // Error code/name only: driver messages can echo renter details.
    const code = err && typeof err === "object" && "code" in err && typeof err.code === "string" ? err.code : "";
    console.error("Specials lead save failed:", code || (err instanceof Error ? err.name : "unknown"));
    return unavailable();
  }
}
