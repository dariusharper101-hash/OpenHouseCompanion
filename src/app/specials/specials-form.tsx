"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AGENT } from "@/config/agent";
import { TCPA_CONSENT } from "@/config/consent";
import { SPECIALS_BUDGETS, MOVE_MONTHS, DFW_AREAS, AREA_NOT_SURE } from "@/config/rental";
import type { Special } from "@/config/specials";
import {
  formatUsPhone,
  validateSpecials,
  type SpecialsErrors,
  type SpecialsField,
} from "@/lib/specials-lead";
import { FullGuide } from "./guide-content";

// ─── /specials form + in-place reveal ────────────────────────────────────────
// One screen: name, phone, move month, budget, areas, optional text consent.
// On success the form swaps in place for the thank-you and the full guide.
// Input is kept on any error so nothing has to be retyped.

type Phase = "form" | "sending" | "done";
type Result = { duplicate: boolean; consented: boolean };

const tel = AGENT.phone ? AGENT.phone.replace(/[^0-9+]/g, "") : "";
const NETWORK_ERROR = "We couldn't send that. Check your connection and try again.";

const FIELD_ORDER: SpecialsField[] = ["name", "phone", "moveMonth", "budget", "areas"];
const FIELD_LABELS: Record<SpecialsField, string> = {
  name: "Your name",
  phone: "Mobile number",
  moveMonth: "Move month",
  budget: "Monthly budget",
  areas: "Areas",
};

function cls(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const inputCls = (error?: string) =>
  cls(
    "w-full min-h-12 bg-paper border-2 rounded-lg px-4 py-3 text-base text-ink placeholder-muted",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
    error ? "border-red-700" : "border-line-strong"
  );

// A native radio/checkbox styled as a 48px chip: keyboard and screen-reader
// behaviour come for free.
function Chip({
  type, name, value, checked, onChange,
}: {
  type: "radio" | "checkbox"; name: string; value: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className="relative cursor-pointer">
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cls(
          "min-h-12 px-4 py-2.5 rounded-lg border-2 text-[15px] flex items-center gap-2 select-none",
          "motion-safe:transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-green peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream",
          checked ? "border-green bg-green/10 text-ink font-semibold" : "border-line-strong bg-paper text-ink"
        )}
      >
        {checked && (
          <svg className="w-4 h-4 flex-shrink-0 text-green" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z" clipRule="evenodd" />
          </svg>
        )}
        {value}
      </span>
    </label>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return <p id={id} className="text-red-700 text-sm font-medium mt-2">{msg}</p>;
}

// Renders the consent text exactly as stored, with the two page names linked.
function ConsentText() {
  return (
    <>
      {TCPA_CONSENT.text.split(/(SMS Terms|Privacy Policy)/).map((part, i) =>
        part === "SMS Terms" ? (
          <Link key={i} href="/sms-terms" target="_blank" className="underline text-green">SMS Terms</Link>
        ) : part === "Privacy Policy" ? (
          <Link key={i} href="/privacy" target="_blank" className="underline text-green">Privacy Policy</Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function SpecialsForm({
  specials,
  textPromise,
}: {
  specials: Special[];
  textPromise: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [moveMonth, setMoveMonth] = useState("");
  const [budget, setBudget] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [textConsent, setTextConsent] = useState(false);
  const [hp, setHp] = useState("");

  const [errors, setErrors] = useState<SpecialsErrors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [formInView, setFormInView] = useState(false);
  // Id of the lead just saved, and (after "Fix it") the lead the next submit
  // replaces, so the server can stop the typo'd number from being texted.
  const [leadId, setLeadId] = useState<string | null>(null);
  const [replacesId, setReplacesId] = useState<string | null>(null);

  const mountedAt = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // Sticky bar hides while the form section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase === "done") {
      doneRef.current?.focus({ preventScroll: true });
      sectionRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
  }, [phase]);

  const firstName = name.trim().split(/\s+/)[0] || "";
  const values = () => ({ name, phone, moveMonth, budget, areas, textConsent });

  // Inline validation on blur, for one field.
  function blurCheck(field: SpecialsField) {
    const all = validateSpecials(values());
    setErrors((e) => ({ ...e, [field]: all[field] }));
  }

  function clearError(field: SpecialsField) {
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function toggleArea(a: string) {
    clearError("areas");
    setAreas((prev) => {
      if (prev.includes(a)) return prev.filter((x) => x !== a);
      if (a === AREA_NOT_SURE) return [AREA_NOT_SURE];
      return [...prev.filter((x) => x !== AREA_NOT_SURE), a];
    });
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError("");
    const errs = validateSpecials(values());
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setPhase("sending");

    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch("/api/specials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values(),
          hp,
          elapsedMs: mountedAt.current ? Date.now() - mountedAt.current : 0,
          src: params.get("src") || params.get("utm_source") || "direct",
          utm_source: params.get("utm_source") || "",
          utm_medium: params.get("utm_medium") || "",
          utm_campaign: params.get("utm_campaign") || "",
          variant: params.get("v") === "b" ? "b" : "a",
          pageUrl: window.location.href,
          ...(replacesId ? { replaces: replacesId } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean; id?: string; duplicate?: boolean; error?: string; fields?: SpecialsErrors;
      };
      if (!res.ok || !data.ok) {
        if (res.status === 400 && data.fields) {
          setErrors(data.fields);
          setShowSummary(true);
          setPhase("form");
          requestAnimationFrame(() => summaryRef.current?.focus());
          return;
        }
        // Server answered with an error (rate limit, save failed): show its
        // plain-language message, which comes with the call/text fallback.
        setServerError(data.error || NETWORK_ERROR);
        setPhase("form");
        return;
      }
      setLeadId(data.id ?? null);
      setReplacesId(null);
      setResult({ duplicate: Boolean(data.duplicate), consented: textConsent });
      setPhase("done");
    } catch {
      // fetch threw: offline or dropped connection ("Load failed" on iOS Safari).
      setServerError(NETWORK_ERROR);
      setPhase("form");
    }
  }

  function fixNumber() {
    setReplacesId(leadId);
    setResult(null);
    setPhase("form");
    requestAnimationFrame(() => document.getElementById("sp-phone")?.focus());
  }

  const errorList = FIELD_ORDER.filter((f) => errors[f]);
  const showSticky = phase !== "done" && !formInView;

  return (
    <>
      <section ref={sectionRef} id="guide-form" className="scroll-mt-20 px-5 py-16 md:py-24 bg-paper border-y border-line">
        <div className="max-w-2xl mx-auto">
          {phase === "done" && result ? (
            <div role="status">
              <ThankYou
                headingRef={doneRef}
                firstName={firstName}
                phone={formatUsPhone(phone)}
                result={result}
                textPromise={textPromise}
                onFix={fixNumber}
                onRead={() => guideRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" })}
              />
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-8">
              <div>
                <p className="text-green text-xs uppercase tracking-[0.2em] font-medium">Free guide</p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight mt-2">
                  Where should I send it?
                </h2>
                <p className="text-muted mt-3 leading-relaxed">
                  The guide opens right here as soon as you send this.
                </p>
              </div>

              {showSummary && errorList.length > 0 && (
                <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-lg border-2 border-red-700 bg-red-50 p-4 focus:outline-none">
                  <p className="font-semibold text-red-800">Please fix {errorList.length === 1 ? "this" : "these"}:</p>
                  <ul className="mt-2 space-y-1 list-disc pl-5 text-red-800 text-sm">
                    {errorList.map((f) => (
                      <li key={f}><a href={`#sp-${f}`} className="underline">{FIELD_LABELS[f]}: {errors[f]}</a></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Honeypot: hidden from people and screen readers, bots fill it. */}
              <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label>
                  Company
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                </label>
              </div>

              <div>
                <label htmlFor="sp-name" className="block text-sm font-semibold text-ink mb-2">Your name</label>
                <input
                  id="sp-name" type="text" autoComplete="name" maxLength={80}
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError("name"); }}
                  onBlur={() => name && blurCheck("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "sp-name-err" : undefined}
                  className={inputCls(errors.name)}
                />
                <FieldError id="sp-name-err" msg={errors.name} />
              </div>

              <div>
                <label htmlFor="sp-phone" className="block text-sm font-semibold text-ink mb-2">Mobile number</label>
                <input
                  id="sp-phone" type="tel" inputMode="tel" autoComplete="tel-national"
                  placeholder="(214) 555-0123"
                  value={phone}
                  onChange={(e) => { setPhone(formatUsPhone(e.target.value)); clearError("phone"); }}
                  onBlur={() => phone && blurCheck("phone")}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "sp-phone-err" : undefined}
                  className={inputCls(errors.phone)}
                />
                <FieldError id="sp-phone-err" msg={errors.phone} />
              </div>

              <fieldset id="sp-moveMonth" aria-describedby={errors.moveMonth ? "sp-moveMonth-err" : undefined}>
                <legend className="text-sm font-semibold text-ink mb-3">When do you want to move?</legend>
                <div className="flex flex-wrap gap-2.5">
                  {MOVE_MONTHS.map((m) => (
                    <Chip key={m} type="radio" name="moveMonth" value={m} checked={moveMonth === m}
                      onChange={() => { setMoveMonth(m); clearError("moveMonth"); }} />
                  ))}
                </div>
                <FieldError id="sp-moveMonth-err" msg={errors.moveMonth} />
              </fieldset>

              <fieldset id="sp-budget" aria-describedby={errors.budget ? "sp-budget-err" : undefined}>
                <legend className="text-sm font-semibold text-ink mb-3">Monthly rent budget</legend>
                <div className="flex flex-wrap gap-2.5">
                  {SPECIALS_BUDGETS.map((b) => (
                    <Chip key={b} type="radio" name="budget" value={b} checked={budget === b}
                      onChange={() => { setBudget(b); clearError("budget"); }} />
                  ))}
                </div>
                <FieldError id="sp-budget-err" msg={errors.budget} />
              </fieldset>

              <fieldset id="sp-areas" aria-describedby={errors.areas ? "sp-areas-err" : "sp-areas-hint"}>
                <legend className="text-sm font-semibold text-ink mb-1">Areas you&apos;re considering</legend>
                <p id="sp-areas-hint" className="text-muted text-sm mb-3">Pick as many as you like.</p>
                <div className="flex flex-wrap gap-2.5">
                  {DFW_AREAS.map((a) => (
                    <Chip key={a} type="checkbox" name="areas" value={a} checked={areas.includes(a)} onChange={() => toggleArea(a)} />
                  ))}
                </div>
                <FieldError id="sp-areas-err" msg={errors.areas} />
              </fieldset>

              <div className="rounded-lg border border-line bg-cream p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox" checked={textConsent} onChange={(e) => setTextConsent(e.target.checked)}
                    className="mt-0.5 w-6 h-6 flex-shrink-0 accent-[var(--green)] focus-visible:ring-2 focus-visible:ring-green"
                  />
                  <span className="text-sm text-ink leading-relaxed">
                    <span className="font-semibold">Optional.</span> <ConsentText />
                  </span>
                </label>
              </div>

              {serverError && (
                <div role="alert" className="rounded-lg border-2 border-red-700 bg-red-50 p-4 text-sm text-red-800">
                  <p className="font-semibold">{serverError}</p>
                  {tel && (
                    <p className="mt-2">
                      Your answers are still here. You can try again, or{" "}
                      <a href={`tel:${tel}`} className="underline font-semibold">call or text {AGENT.phone}</a>.
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={phase === "sending"}
                className="w-full min-h-[52px] rounded-lg bg-green text-cream text-base font-semibold hover:bg-green-600 disabled:opacity-70 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                {phase === "sending" ? "Sending…" : "Send me the guide"}
              </button>
              <p className="text-muted text-xs leading-relaxed">
                Free to you: apartment communities pay locators, not renters. No questions about your
                household or credit, just what you need to see the right specials.
              </p>
            </form>
          )}
        </div>
      </section>

      {phase === "done" && (
        <section className="px-5 py-16 md:py-24" aria-label="Your DFW move-in specials guide">
          <div ref={guideRef} className="max-w-4xl mx-auto scroll-mt-24">
            <FullGuide specials={specials} picked={areas} />
          </div>
        </section>
      )}

      {/* Sticky mobile CTA: hidden while the form is visible and after submit. */}
      <div
        className={cls(
          "md:hidden fixed inset-x-0 bottom-0 z-40 bg-cream/95 backdrop-blur border-t border-line px-4 pt-3",
          "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
          showSticky ? "" : "hidden"
        )}
      >
        <a
          href="#guide-form"
          className="flex items-center justify-center min-h-12 rounded-lg bg-green text-cream font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2"
        >
          Get the guide
        </a>
      </div>
    </>
  );
}

function ThankYou({
  headingRef, firstName, phone, result, textPromise, onFix, onRead,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  firstName: string;
  phone: string;
  result: Result;
  textPromise: string;
  onFix: () => void;
  onRead: () => void;
}) {
  const who = firstName ? `, ${firstName}` : "";
  return (
    <div>
      <p className="text-green text-xs uppercase tracking-[0.2em] font-medium">
        {result.duplicate ? "Welcome back" : "Done"}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight mt-2 focus:outline-none">
        {result.duplicate
          ? "You're already on my list."
          : result.consented
            ? `You're on the list${who}.`
            : `Your guide is ready${who}.`}
      </h2>

      {result.consented ? (
        <>
          <p className="text-ink mt-4 leading-relaxed">
            {result.duplicate
              ? "Your guide is below, updated with the latest specials."
              : <>I&apos;ll send a personal text to <strong className="whitespace-nowrap">{phone}</strong> {textPromise}.</>}{" "}
            No spam. You can opt out of texts anytime by replying STOP.
          </p>
          <ol className="mt-6 space-y-2 list-decimal pl-5 text-ink leading-relaxed">
            <li>Read your guide below and note the specials you like.</li>
            <li>Save my contact so my text doesn&apos;t get lost.</li>
            <li>Reply to my text with any questions, or to set up tours.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/specials/contact.vcf" className="inline-flex items-center justify-center min-h-12 px-6 rounded-lg bg-green text-cream font-semibold hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2">
              Save {AGENT.name.split(" ")[0]}&apos;s contact
            </a>
            <button type="button" onClick={onRead} className="inline-flex items-center justify-center min-h-12 px-6 rounded-lg border-2 border-line-strong text-ink font-semibold hover:border-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2">
              Read the guide
            </button>
          </div>
          <p className="mt-4 text-sm">
            <button type="button" onClick={onFix} className="min-h-12 underline text-green font-medium">
              Wrong number? Fix it
            </button>
          </p>
        </>
      ) : (
        <>
          <p className="text-ink mt-4 leading-relaxed">
            You didn&apos;t opt in to texts, so I won&apos;t text you. If you want help comparing options,
            you can reach out anytime{AGENT.phone ? <> at <a href={`tel:${tel}`} className="underline text-green">{AGENT.phone}</a></> : null}.
          </p>
          <div className="mt-6">
            <button type="button" onClick={onRead} className="inline-flex items-center justify-center min-h-12 px-6 rounded-lg bg-green text-cream font-semibold hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2">
              Read the guide
            </button>
          </div>
        </>
      )}
      <p className="mt-8 text-sm text-muted">{AGENT.name} · {AGENT.brokerage}</p>
    </div>
  );
}
