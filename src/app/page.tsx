import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Photo from "@/components/photo";
import AgentCard from "@/components/agent-card";
import MarketPulse from "@/components/market-pulse";
import { AGENT } from "@/config/agent";
import { IMAGES } from "@/config/images";
import { NEIGHBORHOODS } from "@/config/neighborhoods";

const SERVICES = [
  {
    eyebrow: "Buy",
    title: "Find the right home",
    desc: "From first-time buyers to investors — programs you qualify for, neighborhoods that fit, and an agent who explains every step before you sign.",
    href: "/start?role=buying",
    cta: "Start your search",
    photo: IMAGES.luxuryHome,
  },
  {
    eyebrow: "Sell",
    title: "List for what it's worth",
    desc: "Pricing strategy, staging, disclosure, and negotiation — positioned to sell at the right price with none of the guesswork.",
    href: "/start?role=selling",
    cta: "Get a home valuation",
    photo: IMAGES.interior,
  },
  {
    eyebrow: "Lease · 100% free to you",
    title: "Apartment locating, Dallas",
    desc: "Uptown and Downtown high-rises to suburban leases — I find your next apartment and handle the search. Free, because the communities pay me, not you.",
    href: "/leasing",
    cta: "Find my apartment",
    photo: IMAGES.highrise,
  },
];

export default function HomePage() {
  const featured = NEIGHBORHOODS.filter((n) => n.slug === "dallas" || n.slug === "downtown-dallas");
  const rest = NEIGHBORHOODS.filter((n) => n.slug !== "dallas" && n.slug !== "downtown-dallas");

  return (
    <div className="min-h-screen bg-cream">
      <Nav />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-end">
        <div className="absolute inset-0">
          <Photo
            src={IMAGES.heroSkyline}
            alt={`Downtown Dallas skyline — ${AGENT.serviceArea} real estate`}
            className="h-full w-full"
            overlay
            gradient="linear-gradient(135deg, #26503f 0%, #1c3b30 60%, #14342b 100%)"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/25" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 pb-16 md:pb-24 pt-32 text-cream">
          <p className="text-cream/80 text-xs md:text-sm uppercase tracking-[0.25em] mb-5">
            {AGENT.serviceArea} · Buy · Sell · Lease
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.03] tracking-tight max-w-3xl">
            Find your place in Dallas.
          </h1>
          <p className="text-cream/85 text-lg md:text-xl mt-6 max-w-xl leading-relaxed">
            Whether you&apos;re buying, selling, or leasing an apartment downtown — work with an agent who
            tells you everything before you sign a single line.
          </p>

          <div className="flex flex-wrap gap-3 mt-9">
            <Link href="/start?role=buying" className="px-7 py-3.5 rounded-full bg-cream text-green font-medium hover:bg-white transition-colors">
              I&apos;m Buying
            </Link>
            <Link href="/start?role=selling" className="px-7 py-3.5 rounded-full bg-green/20 backdrop-blur border border-cream/40 text-cream font-medium hover:bg-green/40 transition-colors">
              I&apos;m Selling
            </Link>
            <Link href="/leasing" className="px-7 py-3.5 rounded-full bg-green/20 backdrop-blur border border-cream/40 text-cream font-medium hover:bg-green/40 transition-colors">
              I&apos;m Leasing
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trust strip ──────────────────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: "Every client type", v: "First-time to investor" },
            { k: "Free apartment locating", v: "Paid by communities, not you" },
            { k: "Full transparency", v: "No surprises, ever" },
            { k: "Texas expert", v: "Every county, every program" },
          ].map(({ k, v }) => (
            <div key={k}>
              <p className="font-display text-ink font-semibold">{k}</p>
              <p className="text-faint text-xs mt-1">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Services ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-3">How I help</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">
              Three ways to move — one agent who knows them cold
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <Link key={s.title} href={s.href} className="group bg-paper border border-line rounded-3xl overflow-hidden hover:shadow-[0_12px_40px_rgba(28,59,48,0.12)] transition-shadow">
                <Photo src={s.photo} alt={s.title} className="h-52 w-full" />
                <div className="p-7">
                  <p className="text-gold text-xs uppercase tracking-[0.15em] font-medium mb-2">{s.eyebrow}</p>
                  <h3 className="font-display text-2xl font-semibold text-ink tracking-tight">{s.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mt-3">{s.desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-5 text-green font-medium text-sm group-hover:gap-2.5 transition-all">
                    {s.cta}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Market pulse (light) ─────────────────────────────────────────── */}
      <div className="bg-paper border-y border-line">
        <MarketPulse />
      </div>

      {/* ─── Areas ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-3">Where I work</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">
              From Downtown Dallas to the far north suburbs
            </h2>
            <p className="text-muted mt-4 leading-relaxed">
              Local knowledge is the whole point. Start with a straight-talk guide to the area you&apos;re
              considering — buying, selling, or leasing.
            </p>
          </div>

          {/* Featured Dallas + Downtown */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {featured.map((n, i) => (
              <Link key={n.slug} href={`/neighborhoods/${n.slug}`} className="group relative rounded-3xl overflow-hidden min-h-[220px] flex items-end">
                <Photo
                  src={i === 0 ? IMAGES.neighborhood : IMAGES.highrise}
                  alt={n.name}
                  className="absolute inset-0 h-full w-full"
                  overlay
                />
                <div className="relative z-10 p-7 text-cream">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{n.name}</h3>
                  <p className="text-cream/85 text-sm mt-1 max-w-md">{n.tagline}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining areas as chips */}
          <div className="flex flex-wrap gap-2.5">
            {rest.map((n) => (
              <Link key={n.slug} href={`/neighborhoods/${n.slug}`} className="bg-paper border border-line rounded-full px-5 py-2.5 text-sm text-ink hover:border-green hover:text-green transition-colors">
                {n.name}
              </Link>
            ))}
            <Link href="/neighborhoods" className="rounded-full px-5 py-2.5 text-sm text-green font-medium hover:text-green-600 transition-colors">
              All neighborhood guides →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Education teaser ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 px-5 bg-green text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-4">Know before you sign</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Real estate is full of surprises — most of them avoidable
          </h2>
          <p className="text-cream/80 mt-5 leading-relaxed max-w-xl mx-auto">
            Loan programs, property taxes, inspections, contracts, closing costs — I keep a plain-English
            guide to all of it, so you&apos;re informed before every decision, not after.
          </p>
          <Link href="/learn" className="inline-block mt-8 px-8 py-3.5 rounded-full bg-cream text-green font-medium hover:bg-white transition-colors">
            Explore the guides
          </Link>
        </div>
      </section>

      {/* ─── About the agent ──────────────────────────────────────────────── */}
      <AgentCard />

      {/* ─── Final CTA ────────────────────────────────────────────────────── */}
      <section className="pb-24 px-5">
        <div className="max-w-4xl mx-auto rounded-3xl bg-paper border border-line p-10 md:p-16 text-center shadow-[0_1px_30px_rgba(28,59,48,0.06)]">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink tracking-tight">
            Let&apos;s find your next place.
          </h2>
          <p className="text-muted mt-5 max-w-lg mx-auto leading-relaxed">
            Tell me your situation and I&apos;ll walk you through your options — buying, selling, or leasing.
            No pressure, no obligation.
          </p>
          <Link href="/start" className="inline-block mt-8 px-10 py-4 rounded-full bg-green text-cream font-medium hover:bg-green-600 transition-colors">
            Tell me about your situation →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
