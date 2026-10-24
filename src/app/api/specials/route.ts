import { NextRequest, NextResponse, after } from "next/server";
import { addLead, findRecentByPhone, hasDurableStore } from "@/lib/leads";
import { notifyNewLead } from "@/lib/notify";
import { appendTrackerRow } from "@/lib/sheet";
import { rateLimit } from "@/lib/rate-limit";
import { cleanText, normalizeUsPhone, formatUsPhone, validateSpecials } from "@/lib/specials-lead";
import { TCPA_CONSENT } from "@/config/consent";
import { SPECIALS_GUIDE, todayInDallas } from "@/config/specials";
import { AGENT } from "@/config/agent";
import type { LeadFormData } from "@/types/lead";

// ─── POST /api/specials ───────────────────────────────────────────────────────
// Dedicated endpoint for the DFW specials guide (leaves /api/leads alone).
// Order: spam checks → rate limit → validate → 30-day dedupe → Supabase save
// (must succeed) → email alert + tracker row (best-effort, after the response).
// Nothing here ever talks to NestQuest. No internal error detail is returned.

const PRODUCT = "specials-guide" as const;
const MIN_FILL_MS = 3000;          // faster than this is a bot
const RATE_LIMIT = 5;              // posts per IP...
const RATE_WINDOW_MS = 10 * 60 * 1000; // ...per 10 minutes
const DEDUPE_DAYS = 30;

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

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
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

  try {
    if (await findRecentByPhone(phone, PRODUCT, DEDUPE_DAYS)) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }

    const [firstName, ...rest] = input.name.split(" ");
    const data: LeadFormData = {
      role: "renting",
      clientType: "relocating",
      firstName,
      lastName: rest.join(" "),
      email: "",
      phone,
      timeline: "1-3-months",
      isPreApproved: false,
      budgetMin: input.budget,
      budgetMax: "",
      propertyType: "any",
      bedrooms: "",
      bathrooms: "",
      neighborhoods: input.areas.join(", "),
      purchasePurpose: "primary",
      ownedHomeLast3Years: false,
      isVeteran: false,
      employmentType: "other",
      creditRange: "660-699",
      investorStrategy: "other",
      propertiesOwned: "",
      sellerAddress: "",
      sellerEstimatedValue: "",
      sellerMortgageStatus: "has-mortgage",
      sellerReason: "",
      sellerTimeline: "",
      buyingSimultaneously: false,
      iabsAcknowledged: false,
      buyerRepAcknowledged: false,
      notes: [`src=${src}`, ...utm, `headline=${variant}`].join(" · "),
      source: src,
      product: PRODUCT,
      moveMonth: input.moveMonth,
      consent: {
        tcpa: input.textConsent,
        at: now,
        version: TCPA_CONSENT.version,
        text: TCPA_CONSENT.text,
        ip,
        userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300),
        pageUrl: cleanText(body.pageUrl, 300),
      },
    };

    const lead = await addLead(data);

    // Best-effort side effects run after the response is sent. Both functions
    // catch their own errors and no-op when their env vars are missing.
    after(async () => {
      await Promise.allSettled([
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

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    // Message only (no payload) so renter details stay out of the logs.
    console.error("Specials lead save failed:", err instanceof Error ? err.message : "unknown");
    return unavailable();
  }
}
