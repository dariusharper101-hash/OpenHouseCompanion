"use client";

import { useState, useEffect } from "react";
import type { LeadFormData, ClientRole, BuyerTimeline } from "@/types/lead";
import { AGENT } from "@/config/agent";

// ─── Open House Companion — visitor sign-in ─────────────────────────────────────
// A distinct product from the Hop In Real Estate lead-gen site: a fast, tablet-
// friendly sign-in sheet for people walking into a physical open house. Feeds the
// SAME shared database (tagged product: "open-house") so every walk-in becomes a
// tracked lead in the same dashboard.

const TIMELINES: { value: BuyerTimeline; label: string }[] = [
  { value: "asap", label: "ASAP" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-12-months", label: "6–12 months" },
  { value: "just-browsing", label: "Just looking" },
];

function baseLead(): LeadFormData {
  return {
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
    notes: "", source: "open-house-signin", product: "open-house",
  };
}

const input =
  "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all";

export default function OpenHouseSignInPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<ClientRole>("buying");
  const [hasAgent, setHasAgent] = useState<null | boolean>(null);
  const [timeline, setTimeline] = useState<BuyerTimeline>("3-6-months");
  const [address, setAddress] = useState("");
  const [iabs, setIabs] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Let the agent pre-fill the property address via ?address=... on the sign-in URL
    const a = params.get("address");
    if (a) setAddress(a);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email.");
    if (!phone.trim()) return setError("Please enter a phone number.");
    if (!iabs) return setError("Please acknowledge the brokerage services notice to continue.");

    setSubmitting(true);
    const notes = [
      hasAgent === true ? "Already working with an agent" : hasAgent === false ? "NOT working with an agent" : "",
      address ? `Open house: ${address}` : "",
    ].filter(Boolean).join(" · ");

    const payload: LeadFormData = {
      ...baseLead(),
      role, firstName, lastName, email, phone, timeline,
      iabsAcknowledged: iabs,
      notes,
      neighborhoods: address,
      source: "open-house-signin",
      product: "open-house",
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error || "Something went wrong");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setRole("buying"); setHasAgent(null); setTimeline("3-6-months");
    setIabs(false); setDone(false); setError("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🏡</div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-200 text-sm font-medium">{AGENT.appName}</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">Welcome — please sign in</h1>
          {address ? (
            <p className="text-emerald-200/80 text-sm mt-2">Open house at <span className="font-semibold">{address}</span></p>
          ) : (
            <p className="text-emerald-200/80 text-sm mt-2">Thanks for stopping by today.</p>
          )}
        </div>

        {done ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Thanks, {firstName}! 👋</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Enjoy the tour. {AGENT.name || "Your agent"} is here if you have any questions —
              and will follow up with anything you need.
            </p>
            <button
              onClick={reset}
              className="mt-6 px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold text-sm hover:bg-white/90 transition-all"
            >
              Sign in the next guest →
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input className={input} placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input className={input} placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={input} type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <div>
              <p className="text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Are you currently working with a real estate agent?</p>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: false, l: "No" }, { v: true, l: "Yes" }].map(({ v, l }) => (
                  <button key={l} type="button" onClick={() => setHasAgent(v)}
                    className={[
                      "py-2.5 rounded-xl border text-sm font-semibold transition-all",
                      hasAgent === v ? "bg-white text-emerald-700 border-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20",
                    ].join(" ")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">What brings you in?</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: "buying", l: "Buying" },
                  { v: "selling", l: "Selling" },
                  { v: "both", l: "Both" },
                ] as { v: ClientRole; l: string }[]).map(({ v, l }) => (
                  <button key={v} type="button" onClick={() => setRole(v)}
                    className={[
                      "py-2.5 rounded-xl border text-sm font-semibold transition-all",
                      role === v ? "bg-white text-emerald-700 border-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20",
                    ].join(" ")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Timeline</p>
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => setTimeline(value)}
                    className={[
                      "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                      timeline === value ? "bg-white text-emerald-700 border-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20",
                    ].join(" ")}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={iabs} onChange={(e) => setIabs(e.target.checked)}
                className="w-4 h-4 rounded accent-white mt-0.5 flex-shrink-0" />
              <span className="text-white/70 text-xs leading-relaxed">
                I acknowledge I&apos;ve been informed about the Texas <span className="font-semibold text-white">Information About Brokerage Services (IABS)</span>, and understand a full copy will be provided before any representation begins.
              </span>
            </label>

            {error && <p className="text-white bg-red-500/40 border border-red-300/40 rounded-lg px-3 py-2 text-sm text-center">{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full py-4 rounded-xl bg-white text-emerald-700 font-bold text-lg hover:bg-white/90 disabled:opacity-60 transition-all shadow-lg">
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}

        <p className="text-center text-white/40 text-xs mt-5">
          Your information is private and will never be sold.
        </p>
      </div>
    </div>
  );
}
