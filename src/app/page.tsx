"use client";

import { useState, useEffect, useRef } from "react";
import type { LeadFormData, BuyerTimeline, PropertyType } from "@/types/lead";

const TIMELINE_LABELS: Record<BuyerTimeline, string> = {
  asap: "As soon as possible",
  "1-3-months": "1 – 3 months",
  "3-6-months": "3 – 6 months",
  "6-12-months": "6 – 12 months",
  "just-browsing": "Just browsing",
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
  "Under $200k",
  "$200k – $300k",
  "$300k – $400k",
  "$400k – $500k",
  "$500k – $750k",
  "$750k – $1M",
  "$1M+",
];

const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4", "5+"];
const BATHROOM_OPTIONS = ["1", "1.5", "2", "2.5", "3", "3.5", "4+"];

type Step = "contact" | "intent" | "preferences" | "done";

const STEPS: Step[] = ["contact", "intent", "preferences"];

function getSource() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("src") || params.get("utm_source") || "direct";
}

const empty: LeadFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  timeline: "3-6-months",
  isPreApproved: false,
  budgetMin: "",
  budgetMax: "",
  propertyType: "any",
  bedrooms: "",
  bathrooms: "",
  neighborhoods: "",
  notes: "",
  source: "",
};

function inputCls(error?: string) {
  return [
    "w-full bg-slate-700/60 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all",
    error ? "border-red-500/70" : "border-slate-600",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

export default function LeadCapturePage() {
  const [step, setStep] = useState<Step>("contact");
  const [form, setForm] = useState<LeadFormData>({ ...empty });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setForm((f) => ({ ...f, source: getSource() }));
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  function set<K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateContact(): boolean {
    const e: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateIntent(): boolean {
    const e: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.timeline) e.timeline = "Please select a timeline";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
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
      setStep("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function nextStep() {
    if (step === "contact" && !validateContact()) return;
    if (step === "intent" && !validateIntent()) return;
    if (step === "preferences") {
      handleSubmit();
      return;
    }
    const idx = STEPS.indexOf(step);
    setStep(STEPS[idx + 1]);
  }

  function prevStep() {
    const idx = STEPS.indexOf(step as Step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  const stepIndex = STEPS.indexOf(step as Step);
  const progress =
    step === "done" ? 100 : Math.round(((stepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-start py-10 px-4">
      <div ref={topRef} className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-sm font-medium tracking-wide">
              Open House Companion
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
            Find Your <span className="text-blue-400">Dream Home</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Tell us what you&apos;re looking for and we&apos;ll connect you with the
            right listings and agent in minutes.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
          {step !== "done" && (
            <div className="px-6 pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-medium">
                  Step {stepIndex + 1} of {STEPS.length}
                </span>
                <span className="text-xs text-blue-400 font-semibold">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-700 mb-5">
                <div
                  className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="px-6 pb-6">
            {/* ── STEP 1: Contact ── */}
            {step === "contact" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white mb-1">Your Contact Info</h2>
                <p className="text-slate-400 text-sm mb-4">
                  We&apos;ll use this to send you matching listings and updates.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" error={errors.firstName}>
                    <input
                      type="text"
                      placeholder="Jane"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      className={inputCls(errors.firstName)}
                    />
                  </Field>
                  <Field label="Last Name" error={errors.lastName}>
                    <input
                      type="text"
                      placeholder="Smith"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      className={inputCls(errors.lastName)}
                    />
                  </Field>
                </div>

                <Field label="Email Address" error={errors.email}>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls(errors.email)}
                  />
                </Field>

                <Field label="Phone Number" error={errors.phone}>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputCls(errors.phone)}
                  />
                </Field>
              </div>
            )}

            {/* ── STEP 2: Buyer Intent ── */}
            {step === "intent" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Your Buying Timeline
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  Help us prioritize so we can serve you best.
                </p>

                <Field label="When are you looking to buy?" error={errors.timeline}>
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.entries(TIMELINE_LABELS) as [BuyerTimeline, string][]).map(
                      ([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => set("timeline", val)}
                          className={[
                            "flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all",
                            form.timeline === val
                              ? "bg-blue-600 border-blue-500 text-white"
                              : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-blue-500/60 hover:bg-slate-700",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "w-4 h-4 rounded-full border-2 flex-shrink-0",
                              form.timeline === val
                                ? "bg-white border-white"
                                : "border-slate-500",
                            ].join(" ")}
                          />
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </Field>

                <div className="flex items-center gap-3 bg-slate-700/40 rounded-xl px-4 py-3 border border-slate-600">
                  <input
                    id="preapproved"
                    type="checkbox"
                    checked={form.isPreApproved}
                    onChange={(e) => set("isPreApproved", e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="preapproved"
                    className="text-slate-300 text-sm cursor-pointer"
                  >
                    I&apos;m already{" "}
                    <span className="text-blue-400 font-medium">pre-approved</span> for a
                    mortgage
                  </label>
                </div>
              </div>
            )}

            {/* ── STEP 3: Preferences ── */}
            {step === "preferences" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Property Preferences
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  All fields are optional — share as much or as little as you like.
                </p>

                <Field label="Property Type">
                  <div className="grid grid-cols-3 gap-2">
                    {PROPERTY_TYPES.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("propertyType", value)}
                        className={[
                          "py-2 px-2 rounded-lg border text-xs font-medium transition-all",
                          form.propertyType === value
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-blue-500/60",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Min Budget">
                    <select
                      value={form.budgetMin}
                      onChange={(e) => set("budgetMin", e.target.value)}
                      className={inputCls()}
                    >
                      <option value="">No min</option>
                      {BUDGET_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Max Budget">
                    <select
                      value={form.budgetMax}
                      onChange={(e) => set("budgetMax", e.target.value)}
                      className={inputCls()}
                    >
                      <option value="">No max</option>
                      {BUDGET_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Bedrooms">
                    <select
                      value={form.bedrooms}
                      onChange={(e) => set("bedrooms", e.target.value)}
                      className={inputCls()}
                    >
                      <option value="">Any</option>
                      {BEDROOM_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Bathrooms">
                    <select
                      value={form.bathrooms}
                      onChange={(e) => set("bathrooms", e.target.value)}
                      className={inputCls()}
                    >
                      <option value="">Any</option>
                      {BATHROOM_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Preferred Neighborhoods / Zip Codes">
                  <input
                    type="text"
                    placeholder="e.g. Downtown, Midtown, 30303"
                    value={form.neighborhoods}
                    onChange={(e) => set("neighborhoods", e.target.value)}
                    className={inputCls()}
                  />
                </Field>

                <Field label="Anything else we should know? (optional)">
                  <textarea
                    rows={3}
                    placeholder="School districts, HOA preferences, must-haves…"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    className={inputCls() + " resize-none"}
                  />
                </Field>

                {serverError && (
                  <p className="text-red-400 text-sm text-center">{serverError}</p>
                )}
              </div>
            )}

            {/* ── DONE ── */}
            {step === "done" && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">You&apos;re on the list!</h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Thanks,{" "}
                  <span className="text-white font-medium">{form.firstName}</span>! We&apos;ll
                  review your preferences and reach out via{" "}
                  <span className="text-blue-400">{form.email}</span> shortly with matched
                  listings.
                </p>
                <div className="bg-slate-700/40 border border-slate-600 rounded-xl px-4 py-3 mt-4 text-left text-sm text-slate-300 space-y-1">
                  <p>
                    <span className="text-slate-500">Timeline:</span>{" "}
                    {TIMELINE_LABELS[form.timeline]}
                  </p>
                  {form.budgetMax && (
                    <p>
                      <span className="text-slate-500">Budget:</span>{" "}
                      {form.budgetMin || "—"} – {form.budgetMax}
                    </p>
                  )}
                  {form.propertyType !== "any" && (
                    <p>
                      <span className="text-slate-500">Property:</span>{" "}
                      {PROPERTY_TYPES.find((p) => p.value === form.propertyType)?.label}
                    </p>
                  )}
                  {form.isPreApproved && (
                    <p className="text-green-400">&#10003; Pre-approved</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setForm({ ...empty, source: getSource() });
                    setStep("contact");
                  }}
                  className="mt-4 text-sm text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  Submit another response
                </button>
              </div>
            )}

            {/* Navigation */}
            {step !== "done" && (
              <div className="flex gap-3 mt-6">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700/50 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40"
                >
                  {submitting
                    ? "Submitting…"
                    : step === "preferences"
                    ? "Submit"
                    : "Continue →"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Your information is private and will never be sold.
        </p>
      </div>
    </div>
  );
}
