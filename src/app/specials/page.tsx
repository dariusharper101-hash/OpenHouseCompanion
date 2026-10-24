import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { AgentAvatar } from "@/components/agent-card";
import { AGENT } from "@/config/agent";
import { SPECIALS_GUIDE, MIN_TO_SHOW, activeSpecials, fmtGuideDate } from "@/config/specials";
import Headline, { HeadlineFallback } from "./headline";
import SpecialsForm from "./specials-form";
import { SpecialCard, ExampleMath, DISCLAIMER } from "./guide-content";

// ─── /specials — DFW December move-in specials guide ─────────────────────────
// One-screen lead page (PLAN: agent-hub/builds/dfw-specials-guide/PLAN.md).
// Static, re-rendered hourly so expired specials drop off without a deploy.
// Kept out of search (noindex, and not in sitemap/robots) until the ship step.

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `DFW December Move-In Specials Guide | ${AGENT.appName}`,
  description:
    "A dated snapshot of apartment move-in specials across Dallas–Fort Worth, gathered by a licensed apartment locator. Free to renters; apartment communities pay locators.",
  alternates: { canonical: "/specials" },
  // TODO(ship step): remove once the broker has approved the page in writing.
  robots: { index: false, follow: false },
};

const tel = AGENT.phone ? AGENT.phone.replace(/[^0-9+]/g, "") : "";

const VALUE_PROPS = [
  { title: "Free to you", desc: "The guide and my help cost you nothing. Apartment communities pay locators, not renters." },
  { title: "Specials with a date on them", desc: "Every special shows the day it was verified. Expired ones come off automatically." },
  { title: "A real person on the other end", desc: "Questions go to me, a licensed apartment locator, not a bot." },
];

const INSIDE = [
  { n: "01", title: "Specials by area", desc: "Grouped by the parts of DFW you pick." },
  { n: "02", title: "What each special is worth", desc: "Free weeks turned into a per-month number." },
  { n: "03", title: "Questions to ask", desc: "What to confirm with the leasing office before you apply." },
  { n: "04", title: "A December timeline", desc: "When to tour, apply and give notice." },
];

function Refreshing() {
  return (
    <section className="px-5 pt-36 pb-24">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-green text-xs uppercase tracking-[0.2em] font-medium">DFW move-in specials</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink tracking-tight mt-3">
          Guide being refreshed
        </h1>
        <p className="text-muted mt-5 leading-relaxed">
          I&apos;m re-checking this month&apos;s specials so everything in the guide is current. Check back
          soon{tel ? <>, or <a href={`tel:${tel}`} className="text-green underline">call or text {AGENT.phone}</a></> : null}.
        </p>
      </div>
    </section>
  );
}

export default function SpecialsPage() {
  const specials = activeSpecials();
  const live = SPECIALS_GUIDE.enabled && specials.length >= MIN_TO_SHOW;

  return (
    <div className="min-h-screen bg-cream">
      <Nav />

      {!live ? (
        <Refreshing />
      ) : (
        <main>
          {SPECIALS_GUIDE.sample && (
            <div className="pt-[68px]">
              <p className="bg-gold/20 border-b border-gold/40 text-ink text-sm text-center px-5 py-2.5">
                <strong>Preview with SAMPLE data.</strong> Not real properties or offers. For review only.
              </p>
            </div>
          )}

          {/* Hero (typographic, no image) */}
          <section className={SPECIALS_GUIDE.sample ? "px-5 pt-14 pb-16 md:pt-20" : "px-5 pt-32 pb-16 md:pt-36"}>
            <div className="max-w-6xl mx-auto">
              <p className="text-muted text-xs md:text-sm uppercase tracking-[0.25em] mb-5 font-medium">
                Dallas–Fort Worth · December 2026
              </p>
              <Suspense fallback={<HeadlineFallback />}>
                <Headline />
              </Suspense>
              <p className="text-ink text-lg md:text-xl mt-6 max-w-xl leading-relaxed">
                Choose your move month, budget, and preferred area to see a dated snapshot of DFW apartment
                specials.
              </p>
              <p className="text-muted mt-3 max-w-xl leading-relaxed">
                Move-in specials from apartment communities across DFW, gathered into one guide by a licensed
                apartment locator. Free to you: apartment communities pay locators, not renters.
              </p>
              <a
                href="#guide-form"
                className="inline-flex items-center justify-center min-h-[52px] mt-8 px-8 rounded-lg bg-green text-cream font-semibold hover:bg-green-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                Get the DFW Move-In Guide
              </a>
              <div className="flex items-center gap-3 mt-8">
                <AgentAvatar size={56} />
                <p className="text-sm text-muted leading-snug">
                  <span className="text-ink font-semibold">{AGENT.name}</span>
                  {AGENT.title ? `, ${AGENT.title}` : ""}
                  <br />
                  {AGENT.brokerage} · Updated {fmtGuideDate(SPECIALS_GUIDE.lastUpdated)}
                </p>
              </div>
            </div>
          </section>

          {/* Value props */}
          <section className="px-5 pb-16">
            <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-3">
              {VALUE_PROPS.map((v) => (
                <div key={v.title} className="bg-paper border border-line rounded-lg p-6">
                  <h2 className="font-display text-xl font-semibold text-ink tracking-tight">{v.title}</h2>
                  <p className="text-muted text-sm mt-2 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What's inside + preview */}
          <section className="px-5 pb-20">
            <div className="max-w-6xl mx-auto">
              <p className="text-green text-xs uppercase tracking-[0.2em] font-medium">What&apos;s inside</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight mt-2">
                Four things to help you choose
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
                {INSIDE.map((i) => (
                  <div key={i.n} className="border-t-2 border-gold pt-4">
                    <p className="font-display text-2xl text-green font-semibold">{i.n}</p>
                    <h3 className="font-semibold text-ink mt-1">{i.title}</h3>
                    <p className="text-muted text-sm mt-1 leading-relaxed">{i.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr] mt-12 items-start">
                {specials.slice(0, 2).map((s) => <SpecialCard key={s.id} s={s} />)}
                <ExampleMath />
              </div>
              <p className="text-muted text-sm mt-6 max-w-3xl leading-relaxed">
                Specials come from public sources (property websites, listings and leasing offices) and are
                verified on the date shown. {DISCLAIMER} Rent shown is the advertised starting price.
              </p>
            </div>
          </section>

          <SpecialsForm specials={specials} textPromise={SPECIALS_GUIDE.textPromise} />
        </main>
      )}

      <Footer />
    </div>
  );
}
