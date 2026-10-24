"use client";
import { useState, useSyncExternalStore } from "react";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { PageIntro } from "@/components/ui";
import { AGENT } from "@/config/agent";
import { BUYER_PLAN_KEY, parseBuyerPlan } from "@/lib/buyer-plan";
import { JOURNEY_PLAN_KEY, parseJourneyBrief } from "@/lib/journey-brief";

function readPlan(): string {
  try {
    const b = parseBuyerPlan(sessionStorage.getItem(BUYER_PLAN_KEY));
    if (b) return [`Areas: ${b.areas || "Still exploring"}`, `Budget: ${b.budget || "Still exploring"}`, `Bedrooms: ${b.bedrooms || "Flexible"}`, `Must-haves: ${b.mustHaves || "—"}`].join("\n");
    const j = parseJourneyBrief(sessionStorage.getItem(JOURNEY_PLAN_KEY));
    if (j) return j.text;
  } catch { /* storage unavailable */ }
  return "";
}

// The saved plan lives in sessionStorage, which only exists in the browser.
// Reading it as an external store (server snapshot "") avoids setState in an effect.
const noSubscribe = () => () => {};

export default function ContactHop() {
  const plan = useSyncExternalStore(noSubscribe, readPlan, () => "");
  const [copied, setCopied] = useState(false);
  const tel = AGENT.phone.replace(/[^0-9+]/g, "");
  const intro = `Hi Darius, I found you on the Hop In Real Estate site.`;
  const body = plan ? `${intro}\n\nHere's my plan so far:\n${plan}` : intro;
  const mail = `mailto:${AGENT.email}?subject=${encodeURIComponent("Hello from the Hop site")}&body=${encodeURIComponent(body)}`;
  const sms = `sms:${tel}?&body=${encodeURIComponent(body)}`;
  async function copy() { try { await navigator.clipboard.writeText(plan); setCopied(true); } catch { setCopied(false); } }
  const card = "flex flex-col gap-2 p-6 border border-line bg-cream hover:bg-white transition-colors rounded-[4px]";
  return <><Nav /><main id="main-content" tabIndex={-1} className="hop-wrap">
    <PageIntro eyebrow="Say hello to Hop" title={<>Bring your questions.<br />Let’s talk it through.</>}>
      Reach {AGENT.name} directly. No forms, no pressure. A call, a text or an email is the fastest way to get started.
    </PageIntro>
    <section className="hop-page-section" aria-label="Ways to reach Darius">
      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
        <a className={card} href={`tel:${tel}`}><span className="hop-eyebrow">Call</span><strong className="text-xl">{AGENT.phone}</strong></a>
        <a className={card} href={sms}><span className="hop-eyebrow">Text</span><strong className="text-xl">{AGENT.phone}</strong></a>
        <a className={card} href={mail}><span className="hop-eyebrow">Email</span><strong className="text-xl" style={{ overflowWrap: "anywhere" }}>{AGENT.email}</strong></a>
      </div>
      {plan && <div className="mt-8 p-6 bg-white border border-line rounded-[4px]">
        <p className="hop-eyebrow">Your plan from this visit</p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-base">{plan}</pre>
        <p className="mt-3 text-sm text-muted">Text and email above include this plan automatically. It stays in this browser tab only.</p>
        <button type="button" onClick={copy} className="hop-action hop-action--secondary mt-4">{copied ? "Copied" : "Copy my plan"}</button>
      </div>}
      <p className="mt-8 text-sm text-muted">Please don’t send account numbers or financial documents by text or email.</p>
    </section>
  </main><Footer /></>;
}
