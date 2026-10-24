import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { AgentAvatar } from "@/components/agent-card";
import { ActionLink } from "@/components/ui";
import { AGENT } from "@/config/agent";
import { leadsEnabled } from "@/lib/site-mode";
import { SPECIALS_GUIDE, MIN_TO_SHOW, activeSpecials, fmtGuideDate, sampleBlocksLeads } from "@/config/specials";
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

// Shown whenever the form is off: guide switched off, too few current
// specials, SAMPLE data in production, or site-wide lead capture off.
function Unavailable() {
  return (
    <main id="main-content" tabIndex={-1} className="hop-wrap py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="hop-eyebrow">DFW move-in specials</p>
        <h1 className="hop-title mt-4">
          The guide isn&apos;t available here right now
        </h1>
        <p className="hop-lead mt-6">
          {tel ? (
            <>I can still walk you through this month&apos;s specials. <a href={`tel:${tel}`} className="underline underline-offset-4">Call or text {AGENT.phone}</a>, or check back soon.</>
          ) : (
            <>Check back soon for this month&apos;s specials.</>
          )}
        </p>
      </div>
    </main>
  );
}

export default function SpecialsPage() {
  const specials = activeSpecials();
  // The form needs lead capture on (NEXT_PUBLIC_HOP_LEADS=1, see site-mode.ts);
  // without it the page shows the call/text state instead of a dead form.
  // SAMPLE data never takes real leads in a production deploy.
  const live = leadsEnabled && SPECIALS_GUIDE.enabled && !sampleBlocksLeads() && specials.length >= MIN_TO_SHOW;

  return (
    <>
      <Nav />

      {!live ? (
        <Unavailable />
      ) : (
        <main id="main-content" tabIndex={-1}>
          {SPECIALS_GUIDE.sample && (
            <p className="bg-[var(--hop-warning-surface)] border-b border-[var(--hop-warning)] text-[var(--hop-warning)] text-sm text-center px-5 py-2.5">
              <strong>Preview with SAMPLE data.</strong> Not real properties or offers. For review only.
            </p>
          )}

          {/* Hero (typographic, no image) */}
          <section className="pt-12 pb-16 md:pt-16">
            <div className="hop-wrap">
              <p className="hop-eyebrow">
                Dallas–Fort Worth · December 2026
              </p>
              <Suspense fallback={<HeadlineFallback />}>
                <Headline />
              </Suspense>
              <p className="hop-lead text-ink mt-6">
                Choose your move month, budget, and preferred area to see a dated snapshot of DFW apartment
                specials.
              </p>
              <p className="hop-lead mt-3">
                Move-in specials from apartment communities across DFW, gathered into one guide by a licensed
                apartment locator. Free to you: apartment communities pay locators, not renters.
              </p>
              <ActionLink href="#guide-form" className="mt-8">Get the DFW Move-In Guide</ActionLink>
              <div className="flex items-center gap-3 mt-8">
                <AgentAvatar size={56} />
                <p className="hop-note leading-snug">
                  <span className="text-ink font-semibold">{AGENT.name}</span>
                  {AGENT.title ? `, ${AGENT.title}` : ""}
                  <br />
                  {AGENT.brokerage} · Updated {fmtGuideDate(SPECIALS_GUIDE.lastUpdated)}
                </p>
              </div>
            </div>
          </section>

          {/* Value props */}
          <section className="pb-16">
            <div className="hop-wrap grid gap-4 md:grid-cols-3">
              {VALUE_PROPS.map((v) => (
                <div key={v.title} className="bg-paper border border-line rounded-[4px] p-6">
                  <h2 className="font-display text-2xl font-semibold text-ink">{v.title}</h2>
                  <p className="text-muted text-sm mt-2 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What's inside + preview */}
          <section className="pb-20">
            <div className="hop-wrap">
              <p className="hop-eyebrow">What&apos;s inside</p>
              <h2 className="hop-title mt-4">
                Four things to help you choose
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
                {INSIDE.map((i) => (
                  <div key={i.n} className="border-t border-ink pt-4">
                    <p className="hop-number">{i.n}</p>
                    <h3 className="font-semibold text-ink mt-1">{i.title}</h3>
                    <p className="text-muted text-sm mt-1 leading-relaxed">{i.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr] mt-12 items-start">
                {specials.slice(0, 2).map((s) => <SpecialCard key={s.id} s={s} />)}
                <ExampleMath />
              </div>
              <p className="hop-note mt-6">
                Specials come from public sources (property websites, listings and leasing offices) and are
                verified on the date shown. {DISCLAIMER} Rent shown is the advertised starting price.
              </p>
            </div>
          </section>

          <SpecialsForm specials={specials} textPromise={SPECIALS_GUIDE.textPromise} />
        </main>
      )}

      <Footer legalLinks />
    </>
  );
}
