"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  | "legal"
  | "done";

function getSteps(role: ClientRole): StepId[] {
  if (role === "buying") return ["role", "contact", "buyer-prefs", "qualifiers", "legal"];
  if (role === "selling") return ["role", "contact", "seller-details", "legal"];
  return ["role", "contact", "seller-details", "buyer-prefs", "qualifiers", "legal"];
}

// ─── Label maps ───────────────────────────────────────────────────────────────

const TIMELINE_LABELS: Record<BuyerTimeline, string> = {
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
  { value: "below-580", label: "Below 580", note: "May need credit repair first" },
  { value: "580-619", label: "580 – 619", note: "FHA eligible (10% down)" },
  { value: "620-659", label: "620 – 659", note: "FHA eligible (3.5% down)" },
  { value: "660-699", label: "660 – 699", note: "Most programs open" },
  { value: "700-739", label: "700 – 739", note: "Great rates available" },
  { value: "740+", label: "740+", note: "Best rates & programs" },
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
  timeline: "3-6-months", isPreApproved: false,
  budgetMin: "", budgetMax: "", propertyType: "any",
  bedrooms: "", bathrooms: "", neighborhoods: "",
  purchasePurpose: "primary", ownedHomeLast3Years: false,
  isVeteran: false, employmentType: "w2", creditRange: "660-699",
  investorStrategy: "rental", propertiesOwned: "",
  sellerAddress: "", sellerEstimatedValue: "",
  sellerMortgageStatus: "has-mortgage", sellerReason: "",
  sellerTimeline: "", buyingSimultaneously: false,
  iabsAcknowledged: false, buyerRepAcknowledged: false,
  notes: "", source: "",
};

// ─── UI helpers ──────────────────────────────────────────────────────────────

function cls(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function inputCls(error?: string) {
  return cls(
    "w-full bg-slate-700/60 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all",
    error ? "border-red-500/70" : "border-slate-600"
  );
}

function Field({ label, error, children, hint }: {
  label: string; error?: string; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      {children}
      {hint && !error && <p className="text-slate-500 text-xs">{hint}</p>}
      {error && <p className="text-red-400 text-xs">{error}</p>}
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
      className={cls(
        "flex items-start gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all w-full",
        selected
          ? "bg-blue-600 border-blue-500 text-white"
          : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-blue-500/60 hover:bg-slate-700"
      )}
    >
      <span className={cls(
        "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
        selected ? "bg-white border-white" : "border-slate-500"
      )} />
      <span>
        {children}
        {note && <span className="block text-xs font-normal mt-0.5 opacity-70">{note}</span>}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function StartForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<LeadFormData>({ ...empty });
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const role = (searchParams.get("role") as ClientRole) || "buying";
    const clientType = (searchParams.get("type") as ClientType) || "first-time-buyer";
    const src = searchParams.get("src") || searchParams.get("utm_source") || "direct";
    setForm((f) => ({ ...f, role, clientType, source: src }));
  }, [searchParams]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stepIndex]);

  const steps = getSteps(form.role);
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
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
      if (!form.phone.trim()) e.phone = "Required";
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

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      const params = new URLSearchParams({
        name: form.firstName,
        role: form.role,
        credit: form.creditRange,
        veteran: String(form.isVeteran),
        owned: String(form.ownedHomeLast3Years),
        purpose: form.purchasePurpose,
      });
      window.location.href = `/thank-you?${params.toString()}`;
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  function next() {
    if (!validate()) return;
    if (stepIndex === steps.length - 1) {
      submit();
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function back() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  const stepLabels: Partial<Record<StepId, string>> = {
    role: "Your Situation",
    contact: "Contact Info",
    "buyer-prefs": "Property Preferences",
    qualifiers: "Program Qualifiers",
    "seller-details": "About Your Property",
    legal: "Legal Disclosures",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-start py-10 px-4 pt-24">
      {/* Simple back to home */}
      <div className="w-full max-w-lg mb-4">
        <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </div>

      <div ref={topRef} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">Open House Companion</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isDone ? "You're all set!" : (stepLabels[currentStep] ?? "Get Started")}
          </h1>
        </div>

        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
          {!isDone && (
            <div className="px-6 pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Step {stepIndex + 1} of {steps.length}</span>
                <span className="text-xs text-blue-400 font-semibold">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-700 mb-5">
                <div className="h-1.5 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="px-6 pb-6 space-y-5">

            {/* ── STEP: Role ──────────────────────────────────────────────── */}
            {currentStep === "role" && (
              <div className="space-y-5">
                <div>
                  <p className="text-slate-400 text-sm mb-3">What are you looking to do?</p>
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
                    <p className="text-slate-400 text-sm mb-3">Which best describes you as a buyer?</p>
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
                <p className="text-slate-400 text-sm">I&apos;ll use this to reach out and match you with the right resources.</p>
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

            {/* ── STEP: Buyer Preferences ──────────────────────────────────── */}
            {currentStep === "buyer-prefs" && (
              <div className="space-y-4">
                <p className="text-slate-400 text-sm">All fields are optional — share as much as you like.</p>

                <Field label="When are you looking to buy?">
                  <div className="space-y-2">
                    {(Object.entries(TIMELINE_LABELS) as [BuyerTimeline, string][]).map(([val, label]) => (
                      <ChoiceButton key={val} selected={form.timeline === val} onClick={() => set("timeline", val)}>
                        {label}
                      </ChoiceButton>
                    ))}
                  </div>
                </Field>

                <div className="flex items-center gap-3 bg-slate-700/40 rounded-xl px-4 py-3 border border-slate-600">
                  <input id="preapproved" type="checkbox" checked={form.isPreApproved}
                    onChange={(e) => set("isPreApproved", e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                  <label htmlFor="preapproved" className="text-slate-300 text-sm cursor-pointer">
                    I&apos;m already <span className="text-blue-400 font-medium">pre-approved</span> for a mortgage
                  </label>
                </div>

                <Field label="Property Type">
                  <div className="grid grid-cols-3 gap-2">
                    {PROPERTY_TYPES.map(({ value, label }) => (
                      <button key={value} type="button" onClick={() => set("propertyType", value)}
                        className={cls(
                          "py-2 px-2 rounded-lg border text-xs font-medium transition-all",
                          form.propertyType === value
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-blue-500/60"
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
                  <input type="text" placeholder="e.g. Katy, Sugar Land, 77494"
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
                <p className="text-slate-400 text-sm">
                  These answers help me identify which loan programs you qualify for — including ones most agents never mention.
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
                  <div className="flex items-center gap-3 bg-slate-700/40 rounded-xl px-4 py-3 border border-slate-600">
                    <input id="owned3" type="checkbox" checked={form.ownedHomeLast3Years}
                      onChange={(e) => set("ownedHomeLast3Years", e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                    <label htmlFor="owned3" className="text-slate-300 text-sm cursor-pointer">
                      I&apos;ve owned a home in the <span className="text-white font-medium">last 3 years</span>
                      <span className="block text-slate-500 text-xs mt-0.5">Affects first-time buyer program eligibility</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-700/40 rounded-xl px-4 py-3 border border-slate-600">
                    <input id="veteran" type="checkbox" checked={form.isVeteran}
                      onChange={(e) => set("isVeteran", e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                    <label htmlFor="veteran" className="text-slate-300 text-sm cursor-pointer">
                      I am a <span className="text-white font-medium">veteran, active duty, or surviving spouse</span>
                      <span className="block text-slate-500 text-xs mt-0.5">May qualify for VA loan — 0% down, no PMI</span>
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
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-blue-500/60"
                        )}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Approximate Credit Score Range" hint="This is self-reported — no credit pull happens here.">
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
                <p className="text-slate-400 text-sm">Tell me about the property you&apos;re looking to sell.</p>

                <Field label="Property Address" error={errors.sellerAddress}>
                  <input type="text" placeholder="123 Main St, Houston, TX 77002"
                    value={form.sellerAddress} onChange={(e) => set("sellerAddress", e.target.value)}
                    className={inputCls(errors.sellerAddress)} />
                </Field>

                <Field label="Estimated Value (your best guess)">
                  <input type="text" placeholder="e.g. $350,000" value={form.sellerEstimatedValue}
                    onChange={(e) => set("sellerEstimatedValue", e.target.value)} className={inputCls()} />
                </Field>

                <Field label="Current Mortgage Status">
                  <div className="space-y-2">
                    {([
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

                <Field label="When do you want to sell?" error={errors.sellerTimeline}>
                  <div className="space-y-2">
                    {SELLER_TIMELINES.map((t) => (
                      <ChoiceButton key={t} selected={form.sellerTimeline === t} onClick={() => set("sellerTimeline", t)}>
                        {t}
                      </ChoiceButton>
                    ))}
                  </div>
                </Field>

                {form.role === "selling" && (
                  <div className="flex items-center gap-3 bg-slate-700/40 rounded-xl px-4 py-3 border border-slate-600">
                    <input id="both" type="checkbox" checked={form.buyingSimultaneously}
                      onChange={(e) => set("buyingSimultaneously", e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                    <label htmlFor="both" className="text-slate-300 text-sm cursor-pointer">
                      I also need to <span className="text-blue-400 font-medium">buy a new home</span> around the same time
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP: Legal ──────────────────────────────────────────────── */}
            {currentStep === "legal" && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                  <p className="text-amber-300 text-xs font-medium mb-1">Required Before We Begin</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Texas law requires that I present these disclosures before providing real estate services.
                    Please read and acknowledge each one below.
                  </p>
                </div>

                {/* IABS */}
                <div className={cls(
                  "rounded-xl border p-4 space-y-3",
                  errors.iabsAcknowledged ? "border-red-500/50 bg-red-500/5" : "border-slate-600 bg-slate-700/30"
                )}>
                  <div>
                    <h3 className="text-white text-sm font-semibold mb-1">
                      Information About Brokerage Services (IABS)
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Texas law requires all real estate license holders to give the following information about
                      brokerage services to prospective buyers, tenants, sellers and landlords. As a licensed agent, I
                      work on your behalf but I must disclose my brokerage relationship to you. The IABS form details
                      your rights, the agent&apos;s obligations, and how agency relationships work in Texas.
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      The full IABS form will be provided to you before our first substantive discussion about real estate.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <input id="iabs" type="checkbox" checked={form.iabsAcknowledged}
                      onChange={(e) => set("iabsAcknowledged", e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer mt-0.5" />
                    <label htmlFor="iabs" className="text-slate-300 text-sm cursor-pointer">
                      I acknowledge that I have been informed about the IABS and understand that a full copy will be
                      provided to me before real estate services begin.
                    </label>
                  </div>
                  {errors.iabsAcknowledged && (
                    <p className="text-red-400 text-xs">{errors.iabsAcknowledged}</p>
                  )}
                </div>

                {/* Buyer Rep */}
                {(form.role === "buying" || form.role === "both") && (
                  <div className={cls(
                    "rounded-xl border p-4 space-y-3",
                    errors.buyerRepAcknowledged ? "border-red-500/50 bg-red-500/5" : "border-slate-600 bg-slate-700/30"
                  )}>
                    <div>
                      <h3 className="text-white text-sm font-semibold mb-1">
                        Buyer Representation Agreement
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Effective August 17, 2024, as part of the NAR settlement, a written Buyer Representation
                        Agreement must be signed before an agent can show you properties or negotiate on your behalf.
                        This agreement establishes the agent-client relationship, clarifies compensation, and gives you
                        fiduciary protections — meaning I am legally obligated to act in your best interest.
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        The written agreement will be reviewed and signed before your first property showing.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <input id="buyerrep" type="checkbox" checked={form.buyerRepAcknowledged}
                        onChange={(e) => set("buyerRepAcknowledged", e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-500 cursor-pointer mt-0.5" />
                      <label htmlFor="buyerrep" className="text-slate-300 text-sm cursor-pointer">
                        I understand that a written Buyer Representation Agreement must be signed before my agent can
                        show me homes or provide full representation services.
                      </label>
                    </div>
                    {errors.buyerRepAcknowledged && (
                      <p className="text-red-400 text-xs">{errors.buyerRepAcknowledged}</p>
                    )}
                  </div>
                )}

                <Field label="Anything else I should know? (optional)">
                  <textarea rows={3} placeholder="Special circumstances, questions, concerns…"
                    value={form.notes} onChange={(e) => set("notes", e.target.value)}
                    className={inputCls() + " resize-none"} />
                </Field>

                {serverError && (
                  <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl px-4 py-2">{serverError}</p>
                )}
              </div>
            )}

            {/* Navigation */}
            {!isDone && (
              <div className="flex gap-3 pt-2">
                {stepIndex > 0 && (
                  <button type="button" onClick={back}
                    className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700/50 transition-all">
                    Back
                  </button>
                )}
                <button type="button" onClick={next} disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40">
                  {submitting ? "Submitting…" : stepIndex === steps.length - 1 ? "Submit →" : "Continue →"}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Your information is private and will never be shared or sold.
        </p>
      </div>
    </div>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
      </div>
    }>
      <StartForm />
    </Suspense>
  );
}
