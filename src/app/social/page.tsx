"use client";

import { useState, useEffect } from "react";
import type { LeadFormData, ClientRole, BuyerTimeline } from "@/types/lead";
import { AGENT } from "@/config/agent";

// A deliberately light, single-screen capture funnel for social-media traffic
// (link-in-bio, story swipe-ups, ad clicks). Feeds the SAME database as the
// main app, tagged product: "social" so the dashboard can segment it.

const TIMELINES: { value: BuyerTimeline; label: string }[] = [
  { value: "asap", label: "ASAP" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-12-months", label: "6–12 months" },
  { value: "just-browsing", label: "Just curious" },
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
    notes: "", source: "social", product: "social",
  };
}

const input =
  "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all";

export default function SocialLeadPage() {
  const [role, setRole] = useState<ClientRole>("buying");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timeline, setTimeline] = useState<BuyerTimeline>("3-6-months");
  const [notes, setNotes] = useState("");
  const [iabs, setIabs] = useState(false);
  const [source, setSource] = useState("social");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSource(params.get("src") || params.get("utm_source") || "social");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email.");
    if (!phone.trim()) return setError("Please enter a phone number.");
    if (!iabs) return setError("Please acknowledge the brokerage services notice to continue.");

    setSubmitting(true);
    const payload: LeadFormData = {
      ...baseLead(),
      role, firstName, lastName, email, phone, timeline, notes,
      iabsAcknowledged: iabs, source, product: "social",
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {done ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">You&apos;re in, {firstName}! 🎉</h1>
            <p className="text-white/80 text-sm leading-relaxed">
              Thanks for reaching out. I&apos;ll be in touch shortly at{" "}
              <span className="font-semibold">{phone}</span> to talk through your next move — no pressure, ever.
            </p>
            <a
              href="/learn"
              className="inline-block mt-6 px-6 py-3 rounded-xl bg-white text-purple-700 font-semibold text-sm hover:bg-white/90 transition-all"
            >
              While you wait — explore the guides →
            </a>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white text-sm font-medium">{AGENT.name || AGENT.appName}</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                Let&apos;s find your next move
              </h1>
              <p className="text-white/80 text-sm max-w-xs mx-auto">
                Buying, selling, or just exploring? Drop your info and I&apos;ll reach out personally.
              </p>
            </div>

            <form onSubmit={submit} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 space-y-4">
              {/* Role */}
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: "buying", label: "Buying" },
                  { value: "selling", label: "Selling" },
                  { value: "both", label: "Both" },
                ] as { value: ClientRole; label: string }[]).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={[
                      "py-2.5 rounded-xl border text-sm font-semibold transition-all",
                      role === value
                        ? "bg-white text-purple-700 border-white"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input className={input} placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input className={input} placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className={input} type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

              <div>
                <p className="text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Timeline</p>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTimeline(value)}
                      className={[
                        "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                        timeline === value
                          ? "bg-white text-purple-700 border-white"
                          : "bg-white/10 text-white border-white/20 hover:bg-white/20",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className={input + " resize-none"}
                rows={2}
                placeholder="Anything you want me to know? (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              {/* Compact IABS acknowledgment */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={iabs}
                  onChange={(e) => setIabs(e.target.checked)}
                  className="w-4 h-4 rounded accent-white mt-0.5 flex-shrink-0"
                />
                <span className="text-white/70 text-xs leading-relaxed">
                  I acknowledge I&apos;ve been informed about the Texas <span className="font-semibold text-white">Information About Brokerage Services (IABS)</span>, and understand a full copy will be provided before any representation begins.
                </span>
              </label>

              {error && <p className="text-white bg-red-500/40 border border-red-300/40 rounded-lg px-3 py-2 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-white text-purple-700 font-bold text-base hover:bg-white/90 disabled:opacity-60 transition-all shadow-lg"
              >
                {submitting ? "Sending…" : "Let's Talk →"}
              </button>
            </form>

            <p className="text-center text-white/50 text-xs mt-5">
              Your info is private and will never be sold.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
