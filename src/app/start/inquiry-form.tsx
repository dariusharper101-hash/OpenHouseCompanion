"use client";

import { useState, useEffect, useRef, useId, isValidElement, cloneElement, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BrandMasthead } from "@/components/brand";
import { JOURNEY_PLAN_KEY, parseJourneyBrief, journeyToInquiry, type JourneyBrief } from "@/lib/journey-brief";
import { BUYER_PLAN_KEY, parseBuyerPlan, planToInquiry } from "@/lib/buyer-plan";
import { RENT_BUDGETS } from "@/config/rental";
import type {
  LeadFormData,
  ClientRole,
  ClientType,
  BuyerTimeline,
  PropertyType,
  PurchasePurpose,
  CreditRange,
  EmploymentType,
  InvestorStrategy,
  MortgageStatus,
} from "@/types/lead";

// ─── Step definitions ──────────────────────────────────────────────────────────

type StepId =
  | "role"
  | "contact"
  | "buyer-prefs"
  | "qualifiers"
  | "seller-details"
  | "rental-prefs"
  | "legal"
  | "done";

function getSteps(role: ClientRole, knownPlan=false): StepId[] {
  if(knownPlan)return role==="selling"||role==="both"?["contact","seller-details","legal"]:["contact","legal"];
  // Renters skip the buy/sell screen entirely — it doesn't apply to a lease.
  if (role === "renting") return ["contact", "rental-prefs", "legal"];
  if (role === "buying") return ["role", "contact", "buyer-prefs", "qualifiers", "legal"];
  if (role === "selling") return ["role", "contact", "seller-details", "legal"];
  return ["role", "contact", "seller-details", "buyer-prefs", "qualifiers", "legal"];
}

// ─── Label maps ───────────────────────────────────────────────────────────────

const TIMELINE_LABELS: Record<BuyerTimeline, string> = {
  "to-confirm": "To discuss / confirm together",
  asap: "As soon as possible",
  "1-3-months": "1 – 3 months",
  "3-6-months": "3 – 6 months",
  "6-12-months": "6 – 12 months",
  "just-browsing": "Just browsing / researching",
};

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi-family", label: "Multi-Family" },
  { value: "land", label: "Land" },
];

const BUDGET_OPTIONS = [
  "Under $150k", "Under $200k", "$200k – $300k", "$300k – $400k",
  "$400k – $500k", "$500k – $750k", "$750k – $1M", "$1M+",
];

const CREDIT_RANGES: { value: CreditRange; label: string; note?: string }[] = [
  { value: "not-shared", label: "Prefer not to share / not sure" },
  { value: "below-580", label: "Below 580" },
  { value: "580-619", label: "580 – 619" },
  { value: "620-659", label: "620 – 659" },
  { value: "660-699", label: "660 – 699" },
  { value: "700-739", label: "700 – 739" },
  { value: "740+", label: "740+" },
];

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "w2", label: "W-2 Employee" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "1099", label: "1099 / Contract" },
  { value: "business-owner", label: "Business Owner" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
];

const INVESTOR_STRATEGIES: { value: InvestorStrategy; label: string }[] = [
  { value: "flip", label: "Fix & Flip" },
  { value: "rental", label: "Buy & Hold / Rental" },
  { value: "brrrr", label: "BRRRR Strategy" },
  { value: "wholesale", label: "Wholesaling" },
  { value: "other", label: "Other" },
];

const SELLER_TIMELINES = [
  "Within 30 days", "1 – 3 months", "3 – 6 months", "6 – 12 months", "Just exploring"
];

// Rental (leasing) options — reuse the shared Lead fields (budgetMin holds the
// monthly range, timeline holds the move-in window, neighborhoods holds areas).
// RENT_BUDGETS lives in src/config/rental.ts (shared with /specials).

const MOVEIN_LABELS: Record<BuyerTimeline, string> = {
  "to-confirm": "To discuss / confirm together",
  asap: "As soon as possible",
  "1-3-months": "Within 1 – 3 months",
  "3-6-months": "In 3 – 6 months",
  "6-12-months": "In 6 – 12 months",
  "just-browsing": "Just starting to look",
};

const SELLER_REASONS = [
  "Upsizing / need more space",
  "Downsizing",
  "Relocating",
  "Investment / cashing out equity",
  "Life change (divorce, estate, etc.)",
  "Other",
];

// ─── Empty form ───────────────────────────────────────────────────────────────

const empty: LeadFormData = {
  role: "buying",
  clientType: "first-time-buyer",
  firstName: "", lastName: "", email: "", phone: "",
  timeline: "to-confirm", isPreApproved: false,
  budgetMin: "", budgetMax: "", propertyType: "any",
  bedrooms: "", bathrooms: "", neighborhoods: "",
  purchasePurpose: "primary", ownedHomeLast3Years: false,
  isVeteran: false, employmentType: "w2", creditRange: "not-shared",
  investorStrategy: "rental", propertiesOwned: "",
  sellerAddress: "", sellerEstimatedValue: "",
  sellerMortgageStatus: "not-discussed", sellerReason: "",
  sellerTimeline: "", buyingSimultaneously: false,
  iabsAcknowledged: false, buyerRepAcknowledged: false,
  notes: "", source: "", product: "website",
};

// ─── UI helpers ──────────────────────────────────────────────────────────────

function cls(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function inputCls(error?: string) {
  return cls(
    "hop-field",
    "",
    error ? "border-red-500/70" : "border-line"
  );
}

function Field({ label, error, children, hint }: {
  label: string; error?: string; children: React.ReactNode; hint?: string;
}) {
  const fieldId = useId();
  const directControl = isValidElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>(children) && ["input", "select", "textarea"].includes(String(children.type));
  return (
    <div className="space-y-1.5" role={directControl ? undefined : "group"} aria-label={directControl ? undefined : label} aria-invalid={!directControl && error ? true : undefined} tabIndex={!directControl && error ? -1 : undefined}>
      <label htmlFor={directControl ? fieldId : undefined} className="hop-label">{label}</label>
      {directControl ? cloneElement(children, { id: fieldId, "aria-describedby": hint || error ? `${fieldId}-hint` : undefined, "aria-invalid": !!error }) : children}
      {hint && !error && <p id={`${fieldId}-hint`} className="text-faint text-xs">{hint}</p>}
      {error && <p id={`${fieldId}-hint`} className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}

function ChoiceButton({ selected, onClick, children, note }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; note?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cls(
        "hop-choice",
        selected
          ? "hop-choice--selected"
          : "hop-choice--default"
      )}
    >
      <span className={cls(
        "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
        selected ? "bg-white border-white" : "border-muted"
      )} />
      <span>
        {children}
        {note && <span className={"block text-sm font-normal mt-1 " + (selected ? "text-cream/85" : "text-muted")}>{note}</span>}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function StartForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState<LeadFormData>(() => ({
    ...empty,
    role: (["buying", "selling", "both", "renting"].includes(searchParams.get("role") || "") ? searchParams.get("role") : "buying") as ClientRole,
    source: searchParams.get("src") || searchParams.get("utm_source") || "direct",
    product: searchParams.get("src") === "social" ? "social" : "website",
    clientType: (["first-time-buyer", "move-up-buyer", "investor", "downsizing", "relocating"].includes(searchParams.get("type") || "") ? searchParams.get("type") : "first-time-buyer") as ClientType,
  }));
  const [planImported, setPlanImported] = useState(false);
  const [planImportError, setPlanImportError] = useState(false);
  function importPlan() {
    let plan = null;
    try { plan = parseBuyerPlan(sessionStorage.getItem(BUYER_PLAN_KEY)); } catch { /* Browser storage may be disabled. */ }
    if (plan) { setForm(f => ({ ...f, ...planToInquiry(plan) })); setPlanImported(true); setPlanImportError(false);setStepIndex(0); }
    else { setPlanImportError(true); }
  }
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [journeyPreview,setJourneyPreview]=useState("");
  const [journeyData,setJourneyData]=useState<JourneyBrief|null>(null);
  const [journeyIncluded,setJourneyIncluded]=useState(false);
  const [journeyError,setJourneyError]=useState("");
  function reviewJourney(){try{const p=parseJourneyBrief(sessionStorage.getItem(JOURNEY_PLAN_KEY));if(!p){setJourneyError("No saved plan was found in this tab. You can continue without it.");return;}setJourneyPreview(p.text);setJourneyData(p);setJourneyError("");}catch{setJourneyError("This browser couldn’t read the plan. You can continue without it.");}}
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusError = useRef(false);


  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepIndex]);

  useEffect(() => {
    if (focusError.current) {
      focusError.current = false;
      topRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [errors]);

  const knownPlan=planImported||(journeyIncluded&&!!journeyData?.context);
  const steps = getSteps(form.role,knownPlan);
  const currentStep = steps[stepIndex] as StepId;
  const isDone = currentStep === "done";
  const progress = isDone ? 100 : Math.round(((stepIndex + 1) / steps.length) * 100);

  function set<K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // ─── Validation per step ──────────────────────────────────────────────────

  function validate(): boolean {
    const e: Record<string, string> = {};

    if (currentStep === "contact") {
      if (!form.firstName.trim()) e.firstName = "Please enter your first name.";
      if (!form.lastName.trim()) e.lastName = "Please enter your last name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter an email address with an @ and domain.";
      if (!form.phone.trim()) e.phone = "Please enter a phone number for follow-up.";
    }

    if (currentStep === "seller-details") {
      if (!form.sellerAddress.trim()) e.sellerAddress = "Property address required";
      if (!form.sellerTimeline) e.sellerTimeline = "Please select a timeline";
    }

    if (currentStep === "legal") {
      if (!form.iabsAcknowledged) e.iabsAcknowledged = "You must acknowledge the IABS";
      if ((form.role === "buying" || form.role === "both") && !form.buyerRepAcknowledged) {
        e.buyerRepAcknowledged = "You must acknowledge the Buyer Representation Agreement";
      }
    }

    focusError.current = Object.keys(e).length > 0;
    setErrors(e);
    return !focusError.current;
  }

  const submissionLock = useRef(false);
  async function submit() {
    if (submissionLock.current) return;
    submissionLock.current = true;
    setSubmitting(true);
    setServerError("");
    if (process.env.NEXT_PUBLIC_HOP_REVIEW_MODE === "1") { router.push("/thank-you"); return; }
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      try { sessionStorage.removeItem(BUYER_PLAN_KEY); } catch { /* Submission succeeded even if storage is unavailable. */ }
      router.push("/thank-you");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      submissionLock.current = false;
      setSubmitting(false);
    }
  }

  function next() {
    if (!validate()) return;
    if (stepIndex === steps.length - 1) {
      submit();
      return;
    }
    setStepIndex(stepIndex + 1);
  }

  function back() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  const stepLabels: Partial<Record<StepId, string>> = {
    role: "Your move, your way",
    contact: "Let’s stay in touch",
    "buyer-prefs": "What makes it feel like home?",
    qualifiers: "Prepare the lender conversation",
    "seller-details": "Tell Hop about the property",
    "rental-prefs": "Shape your rental search",
    legal: "Before we take the next step",
  };

  return (
    <><BrandMasthead /><main id="main-content" tabIndex={-1} className="hop-inquiry min-h-screen bg-cream flex flex-col items-center justify-start py-10 px-4">
      {/* Simple back to home */}
      <div className="w-full max-w-lg mb-4">
        <Link href="/" className="text-faint hover:text-muted text-sm transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </div>

      <div ref={topRef} className="w-full max-w-lg">
        <div className="mb-8">
          <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl text-ink">
            {isDone ? "You're all set!" : (stepLabels[currentStep] ?? "Get Started")}
          </h1>
        </div>

        <div className="hop-inquiry-panel">
          {!isDone && (
            <div className="px-6 pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted">Step {stepIndex + 1} of {steps.length}</span>
                <span className="text-xs text-green font-semibold">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-cream mb-5">
                <div className="h-1.5 rounded-full bg-green transition-transform duration-300" role="progressbar" aria-label="Inquiry progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} style={{ transform: `scaleX(${progress / 100})`, transformOrigin: "left" }} />
              </div>
            </div>
          )}

          <div className="px-6 pb-6 space-y-5">
            {searchParams.get("src")==="journey-plan"&&<section className="hop-status" aria-label="Review your saved plan"><p>Your plan is optional. Review it before choosing to include it.</p>{!journeyPreview&&<button type="button" className="hop-action hop-action--secondary mt-4" onClick={reviewJourney}>Review the plan from this tab</button>}{journeyPreview&&<><label className="hop-label mt-4">Plan to include<textarea className="hop-field w-full mt-3" rows={7} maxLength={4000} value={journeyPreview} onChange={e=>setJourneyPreview(e.target.value)} disabled={journeyIncluded}/></label>{journeyIncluded?<p role="status">Plan included in the inquiry notes. You can review those notes before sending.</p>:<button type="button" className="hop-action hop-action--secondary mt-4" onClick={()=>{setForm(f=>({...f,...(journeyData&&journeyPreview===journeyData.text?journeyToInquiry(journeyData):{}),notes:[f.notes,journeyPreview].filter(Boolean).join("\n\n")}));setJourneyIncluded(true);setStepIndex(0);}}>Include this plan</button>}</>}{journeyError&&<p role="status">{journeyError}</p>}</section>}
            {searchParams.get("src") === "buyer-plan" && <div className="bg-green/5 border border-line rounded-[4px] p-4 text-sm">
              {planImported ? <p>Your buying plan is included. You can review and change the preferences and notes before submitting.</p> : <button type="button" onClick={importPlan} className="underline">Include the buying plan from this tab</button>}
            </div>}

            {planImportError && <p role="alert" className="text-sm text-muted">No valid buying plan was found in this tab. Continue and enter your preferences here, or return to the buying plan.</p>}

            {/* ── STEP: Role ──────────────────────────────────────────────── */}
            {currentStep === "role" && (
              <div className="space-y-5">
                <div>
                  <p className="text-muted text-sm mb-3">What are you looking to do?</p>
                  <p className="text-sm mb-4"><Link href="/leasing" className="underline underline-offset-4">Looking to rent? Start with the rental guide →</Link></p>
                  <div className="space-y-2">
                    {(["buying", "selling", "both"] as ClientRole[]).map((r) => (
                      <ChoiceButton key={r} selected={form.role === r} onClick={() => set("role", r)}>
                        {r === "buying" ? "I'm Buying a Home"
                          : r === "selling" ? "I'm Selling a Home"
                          : "I'm Buying & Selling"}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                {(form.role === "buying" || form.role === "both") && (
                  <div>
                    <p className="text-muted text-sm mb-3">Which best describes you as a buyer?</p>
                    <div className="space-y-2">
                      {([
                        { value: "first-time-buyer", label: "First-Time Buyer", note: "Never owned a home, or haven't in 3+ years" },
                        { value: "move-up-buyer", label: "Move-Up / Upsizing", note: "Selling your current home to buy a larger one" },
                        { value: "investor", label: "Investor", note: "Buying for rental income, flipping, or portfolio growth" },
                        { value: "downsizing", label: "Downsizing", note: "Looking for something smaller" },
                        { value: "relocating", label: "Relocating", note: "Moving from another city or state" },
                      ] as { value: ClientType; label: string; note: string }[]).map(({ value, label, note }) => (
                        <ChoiceButton key={value} selected={form.clientType === value} onClick={() => set("clientType", value)} note={note}>
                          {label}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP: Contact ───────────────────────────────────────────── */}
            {currentStep === "contact" && (
              <div className="space-y-4">
                {knownPlan&&<div className="hop-status"><strong>Your reviewed plan carries the context.</strong><p>No need to repeat preferences or qualification questions here. Hop can clarify any missing details in the conversation.</p></div>}
                <p className="text-muted text-sm">I&apos;ll use this to reach out and match you with the right resources.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" error={errors.firstName}>
                    <input type="text" placeholder="Jane" value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)} className={inputCls(errors.firstName)} />
                  </Field>
                  <Field label="Last Name" error={errors.lastName}>
                    <input type="text" placeholder="Smith" value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)} className={inputCls(errors.lastName)} />
                  </Field>
                </div>
                <Field label="Email Address" error={errors.email}>
                  <input type="email" placeholder="jane@example.com" value={form.email}
                    onChange={(e) => set("email", e.target.value)} className={inputCls(errors.email)} />
                </Field>
                <Field label="Phone Number" error={errors.phone}>
                  <input type="tel" placeholder="(555) 000-0000" value={form.phone}
                    onChange={(e) => set("phone", e.target.value)} className={inputCls(errors.phone)} />
                </Field>
              </div>
            )}

            {/* ── STEP: Rental Preferences ─────────────────────────────────── */}
            {currentStep === "rental-prefs" && (
              <div className="space-y-5">
                <p className="text-muted text-sm">
                  Tell me what you&apos;re after so we can discuss a rental shortlist. Each property sets its
                  own application process and fees; we will confirm the terms before you apply.
                </p>

                <div>
                  <p className="text-muted text-sm mb-3">Monthly budget</p>
                  <div className="grid grid-cols-2 gap-2">
                    {RENT_BUDGETS.map((b) => (
                      <ChoiceButton key={b} selected={form.budgetMin === b} onClick={() => set("budgetMin", b)}>
                        {b}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-muted text-sm mb-3">When do you need to move in?</p>
                  <div className="space-y-2">
                    {(Object.keys(MOVEIN_LABELS) as BuyerTimeline[]).map((t) => (
                      <ChoiceButton key={t} selected={form.timeline === t} onClick={() => set("timeline", t)}>
                        {MOVEIN_LABELS[t]}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                <Field label="Preferred areas / neighborhoods" hint="e.g. Uptown, Downtown, Las Colinas, Frisco">
                  <input type="text" placeholder="Where do you want to live?" value={form.neighborhoods}
                    onChange={(e) => set("neighborhoods", e.target.value)} className={inputCls()} />
                </Field>

                <Field label="Bedrooms">
                  <select value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={inputCls()}>
                    <option value="">Any</option>
                    <option value="Studio">Studio</option>
                    <option value="1">1 bedroom</option>
                    <option value="2">2 bedrooms</option>
                    <option value="3+">3+ bedrooms</option>
                  </select>
                </Field>
              </div>
            )}

            {/* ── STEP: Buyer Preferences ──────────────────────────────────── */}
            {currentStep === "buyer-prefs" && (
              <div className="space-y-4">
                <p className="text-muted text-sm">All fields are optional — share as much as you like.</p>

                <Field label="When are you looking to buy?">
                  <div className="space-y-2">
                    {(Object.entries(TIMELINE_LABELS) as [BuyerTimeline, string][]).map(([val, label]) => (
                      <ChoiceButton key={val} selected={form.timeline === val} onClick={() => set("timeline", val)}>
                        {label}
                      </ChoiceButton>
                    ))}
                  </div>
                </Field>

                <div className="flex items-center gap-3 bg-cream rounded-[4px] px-4 py-3 border border-line">
                  <input id="preapproved" type="checkbox" checked={form.isPreApproved}
                    onChange={(e) => set("isPreApproved", e.target.checked)}
                    className="w-4 h-4 rounded accent-green cursor-pointer" />
                  <label htmlFor="preapproved" className="text-muted text-sm cursor-pointer">
                    I&apos;m already <span className="text-green font-medium">pre-approved</span> for a mortgage
                  </label>
                </div>

                <Field label="Property Type">
                  <div className="grid grid-cols-3 gap-2">
                    {PROPERTY_TYPES.map(({ value, label }) => (
                      <button key={value} type="button" onClick={() => set("propertyType", value)}
                        className={cls(
                          "py-2 px-2 rounded-lg border text-xs font-medium transition-all",
                          form.propertyType === value
                            ? "hop-choice--selected"
                            : "bg-cream border-line text-muted hover:border-green"
                        )}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Min Budget">
                    <select value={form.budgetMin} onChange={(e) => set("budgetMin", e.target.value)} className={inputCls()}>
                      <option value="">No min</option>
                      {BUDGET_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Max Budget">
                    <select value={form.budgetMax} onChange={(e) => set("budgetMax", e.target.value)} className={inputCls()}>
                      <option value="">No max</option>
                      {BUDGET_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Bedrooms">
                    <select value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={inputCls()}>
                      <option value="">Any</option>
                      {["1", "2", "3", "4", "5+"].map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Bathrooms">
                    <select value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={inputCls()}>
                      <option value="">Any</option>
                      {["1", "1.5", "2", "2.5", "3", "3.5", "4+"].map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Preferred Areas / Zip Codes">
                  <input type="text" placeholder="e.g. Dallas, Plano, 75201"
                    value={form.neighborhoods} onChange={(e) => set("neighborhoods", e.target.value)} className={inputCls()} />
                </Field>

                {form.clientType === "investor" && (
                  <>
                    <Field label="Investment Strategy">
                      <div className="space-y-2">
                        {INVESTOR_STRATEGIES.map(({ value, label }) => (
                          <ChoiceButton key={value} selected={form.investorStrategy === value} onClick={() => set("investorStrategy", value as InvestorStrategy)}>
                            {label}
                          </ChoiceButton>
                        ))}
                      </div>
                    </Field>
                    <Field label="How many investment properties do you currently own?">
                      <input type="text" placeholder="e.g. 2" value={form.propertiesOwned}
                        onChange={(e) => set("propertiesOwned", e.target.value)} className={inputCls()} />
                    </Field>
                  </>
                )}
              </div>
            )}

            {/* ── STEP: Qualifiers ─────────────────────────────────────────── */}
            {currentStep === "qualifiers" && (
              <div className="space-y-5">
                <p className="text-muted text-sm">
                  These optional answers prepare a lender conversation. A lender must confirm eligibility, terms and any approval; this inquiry does not determine qualification.
                </p>

                <Field label="How will you use this property?">
                  <div className="space-y-2">
                    {([
                      { value: "primary", label: "Primary Residence", note: "You'll live here full-time" },
                      { value: "second-home", label: "Second / Vacation Home", note: "Seasonal or weekend use" },
                      { value: "investment", label: "Investment / Rental", note: "You won't live here" },
                    ] as { value: PurchasePurpose; label: string; note: string }[]).map(({ value, label, note }) => (
                      <ChoiceButton key={value} selected={form.purchasePurpose === value} onClick={() => set("purchasePurpose", value)} note={note}>
                        {label}
                      </ChoiceButton>
                    ))}
                  </div>
                </Field>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-cream rounded-[4px] px-4 py-3 border border-line">
                    <input id="owned3" type="checkbox" checked={form.ownedHomeLast3Years}
                      onChange={(e) => set("ownedHomeLast3Years", e.target.checked)}
                      className="w-4 h-4 rounded accent-green cursor-pointer" />
                    <label htmlFor="owned3" className="text-muted text-sm cursor-pointer">
                      I&apos;ve owned a home in the <span className="text-ink font-medium">last 3 years</span>
                      <span className="block text-faint text-xs mt-0.5">Affects first-time buyer program eligibility</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 bg-cream rounded-[4px] px-4 py-3 border border-line">
                    <input id="veteran" type="checkbox" checked={form.isVeteran}
                      onChange={(e) => set("isVeteran", e.target.checked)}
                      className="w-4 h-4 rounded accent-green cursor-pointer" />
                    <label htmlFor="veteran" className="text-muted text-sm cursor-pointer">
                      I am a <span className="text-ink font-medium">veteran, active duty, or surviving spouse</span>
                      <span className="block text-faint text-xs mt-0.5">Ask your lender about service-related loan options</span>
                    </label>
                  </div>
                </div>

                <Field label="Employment Type">
                  <div className="grid grid-cols-2 gap-2">
                    {EMPLOYMENT_TYPES.map(({ value, label }) => (
                      <button key={value} type="button" onClick={() => set("employmentType", value as EmploymentType)}
                        className={cls(
                          "py-2.5 px-3 rounded-lg border text-xs font-medium transition-all text-left",
                          form.employmentType === value
                            ? "hop-choice--selected"
                            : "bg-cream border-line text-muted hover:border-green"
                        )}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Approximate Credit Score Range" hint="Optional context for a lender conversation; no credit pull or approval happens here. Choose a range only if you want to share it.">
                  <div className="space-y-2">
                    {CREDIT_RANGES.map(({ value, label, note }) => (
                      <ChoiceButton key={value} selected={form.creditRange === value} onClick={() => set("creditRange", value as CreditRange)} note={note}>
                        {label}
                      </ChoiceButton>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* ── STEP: Seller Details ─────────────────────────────────────── */}
            {currentStep === "seller-details" && (
              <div className="space-y-4">
                <p className="text-muted text-sm">Tell me about the property you&apos;re looking to sell.</p>

                <Field label="Property Address" error={errors.sellerAddress}>
                  <input type="text" placeholder="123 Main St, Houston, TX 77002"
                    value={form.sellerAddress} onChange={(e) => set("sellerAddress", e.target.value)}
                    className={inputCls(errors.sellerAddress)} />
                </Field>

                {!knownPlan&&<><Field label="Estimated Value (your best guess)">
                  <input type="text" placeholder="e.g. $350,000" value={form.sellerEstimatedValue}
                    onChange={(e) => set("sellerEstimatedValue", e.target.value)} className={inputCls()} />
                </Field>

                <Field label="Current Mortgage Status">
                  <div className="space-y-2">
                    {([
                      { value: "not-discussed", label: "Discuss with Hop", note: "Leave this for our conversation" },
                      { value: "paid-off", label: "Paid Off", note: "No mortgage remaining" },
                      { value: "has-mortgage", label: "Active Mortgage", note: "Still making payments" },
                      { value: "underwater", label: "Underwater / Upside Down", note: "Owe more than it's worth" },
                    ] as { value: MortgageStatus; label: string; note: string }[]).map(({ value, label, note }) => (
                      <ChoiceButton key={value} selected={form.sellerMortgageStatus === value} onClick={() => set("sellerMortgageStatus", value)} note={note}>
                        {label}
                      </ChoiceButton>
                    ))}
                  </div>
                </Field>

                <Field label="Primary Reason for Selling">
                  <select value={form.sellerReason} onChange={(e) => set("sellerReason", e.target.value)} className={inputCls()}>
                    <option value="">Select a reason</option>
                    {SELLER_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>

                </>}
                {knownPlan&&<p className="hop-note">Your preparation priorities are already in the plan. Property value, financing and the next move can be discussed with Hop.</p>}
                {journeyIncluded&&journeyData?.context?.timing?<div className="hop-status"><strong>Selling timing from your plan</strong><p>{form.sellerTimeline}</p></div>:<Field label="When do you want to sell?" error={errors.sellerTimeline}>
                  <div className="space-y-2">
                    {SELLER_TIMELINES.map((t) => (
                      <ChoiceButton key={t} selected={form.sellerTimeline === t} onClick={() => set("sellerTimeline", t)}>
                        {t}
                      </ChoiceButton>
                    ))}
                  </div>
                </Field>}

                {!knownPlan && form.role === "selling" && (
                  <div className="flex items-center gap-3 bg-cream rounded-[4px] px-4 py-3 border border-line">
                    <input id="both" type="checkbox" checked={form.buyingSimultaneously}
                      onChange={(e) => set("buyingSimultaneously", e.target.checked)}
                      className="w-4 h-4 rounded accent-green cursor-pointer" />
                    <label htmlFor="both" className="text-muted text-sm cursor-pointer">
                      I also need to <span className="text-green font-medium">buy a new home</span> around the same time
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP: Legal ──────────────────────────────────────────────── */}
            {currentStep === "legal" && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-[4px] px-4 py-3">
                  <p className="text-amber-700 text-xs font-medium mb-1">Before your next step</p>
                  <p className="text-muted text-xs leading-relaxed">
                    Hop will provide the brokerage’s completed disclosures and discuss any applicable written agreement separately.
                    This inquiry does not sign an agreement or establish representation.
                  </p>
                </div>

                {/* IABS */}
                <div className={cls(
                  "rounded-[4px] border p-4 space-y-3",
                  errors.iabsAcknowledged ? "border-red-500/50 bg-red-500/5" : "border-line bg-cream"
                )}>
                  <div>
                    <h3 className="text-ink text-sm font-semibold mb-1">
                      Information About Brokerage Services (IABS)
                    </h3>
                    <p className="text-muted text-xs leading-relaxed">
                      Ask Hop for the brokerage’s completed IABS disclosure and review it with your questions.
                      The information here is an orientation; it does not replace the completed disclosure.
                    </p>
                    <p className="text-faint text-xs mt-2">
                      The full IABS form will be provided to you before our first substantive discussion about real estate.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <input id="iabs" aria-invalid={!!errors.iabsAcknowledged} aria-describedby={errors.iabsAcknowledged ? "iabs-error" : undefined} type="checkbox" checked={form.iabsAcknowledged}
                      onChange={(e) => set("iabsAcknowledged", e.target.checked)}
                      className="w-4 h-4 rounded accent-green cursor-pointer mt-0.5" />
                    <label htmlFor="iabs" className="text-muted text-sm cursor-pointer">
                      I acknowledge that I have been informed about the IABS and understand that a full copy will be
                      provided to me before real estate services begin.
                    </label>
                  </div>
                  {errors.iabsAcknowledged && (
                    <p id="iabs-error" className="text-red-600 text-xs">{errors.iabsAcknowledged}</p>
                  )}
                </div>

                {/* Buyer Rep */}
                {(form.role === "buying" || form.role === "both") && (
                  <div className={cls(
                    "rounded-[4px] border p-4 space-y-3",
                    errors.buyerRepAcknowledged ? "border-red-500/50 bg-red-500/5" : "border-line bg-cream"
                  )}>
                    <div>
                      <h3 className="text-ink text-sm font-semibold mb-1">
                        Buyer Representation Agreement
                      </h3>
                      <p className="text-muted text-xs leading-relaxed">
                        Hop will explain the applicable written agreement, services and compensation before a property
                        showing or representation begins. Review the terms and ask questions before signing through the
                        brokerage’s approved process. This acknowledgment does not sign an agreement or establish representation.
                      </p>
                      <p className="text-faint text-xs mt-2">
                        The written agreement will be reviewed and signed before your first property showing.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <input id="buyerrep" aria-invalid={!!errors.buyerRepAcknowledged} aria-describedby={errors.buyerRepAcknowledged ? "buyerrep-error" : undefined} type="checkbox" checked={form.buyerRepAcknowledged}
                        onChange={(e) => set("buyerRepAcknowledged", e.target.checked)}
                        className="w-4 h-4 rounded accent-green cursor-pointer mt-0.5" />
                      <label htmlFor="buyerrep" className="text-muted text-sm cursor-pointer">
                        I understand that Hop will discuss applicable written agreements before showings and that I must
                        review and sign any agreement separately through the brokerage’s approved process.
                      </label>
                    </div>
                    {errors.buyerRepAcknowledged && (
                      <p id="buyerrep-error" className="text-red-600 text-xs">{errors.buyerRepAcknowledged}</p>
                    )}
                  </div>
                )}

                <Field label="Anything else I should know? (optional)">
                  <textarea rows={3} placeholder="Special circumstances, questions, concerns…"
                    value={form.notes} onChange={(e) => set("notes", e.target.value)}
                    className={inputCls() + " resize-none"} />
                </Field>

                {Object.values(errors).some(Boolean) && <p role="alert" className="text-sm text-red-600">Check the highlighted fields before continuing.</p>}
                {serverError && (
                  <p role="alert" className="text-red-600 text-sm text-center bg-red-500/10 rounded-[4px] px-4 py-2">{serverError}</p>
                )}
              </div>
            )}

            {/* Navigation */}
            {!isDone && (
              <div className="flex gap-3 pt-2">
                {stepIndex > 0 && (
                  <button type="button" onClick={back} disabled={submitting}
                    className="flex-1 py-3 rounded-[4px] border border-line text-muted text-sm font-medium hover:bg-cream transition-all">
                    Back
                  </button>
                )}
                <button type="button" onClick={next} disabled={submitting}
                  className="flex-1 py-3 rounded-[4px] bg-green hover:bg-green-600 disabled:opacity-60 text-cream text-sm font-semibold transition-all ">
                  {submitting ? "Submitting…" : stepIndex === steps.length - 1 ? process.env.NEXT_PUBLIC_HOP_REVIEW_MODE === "1" ? "Complete sample inquiry →" : "Send my inquiry →" : "Continue →"}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-faint text-xs mt-6">
          Use this form for contact details and preferences. Do not send account numbers or financial documents.
        </p>
      </div>
    </main></>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={
      <><BrandMasthead /><main id="main-content" tabIndex={-1} className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-green border-t-transparent animate-spin" />
      </main></>
    }>
      <StartForm />
    </Suspense>
  );
}
