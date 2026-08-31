import Link from "next/link";
import Nav from "@/components/nav";
import AgentCard, { SocialLinks } from "@/components/agent-card";
import MarketPulse from "@/components/market-pulse";
import { AGENT } from "@/config/agent";

const TOPICS = [
  {
    slug: "programs",
    icon: "💰",
    title: "Loan Programs",
    desc: "FHA, VA, USDA, and Texas-specific programs you may qualify for.",
  },
  {
    slug: "taxes",
    icon: "📋",
    title: "County Property Taxes",
    desc: "How Texas property taxes work and what they mean for your payment.",
  },
  {
    slug: "insurance",
    icon: "🛡️",
    title: "Homeowners Insurance",
    desc: "HO-3, flood, windstorm, and what's actually covered.",
  },
  {
    slug: "warranties",
    icon: "🔧",
    title: "Home Warranties",
    desc: "Builder warranties vs. third-party and what they protect.",
  },
  {
    slug: "inspections",
    icon: "🔍",
    title: "Inspections",
    desc: "Every inspection type, who pays, and how to use findings.",
  },
  {
    slug: "contracts",
    icon: "✍️",
    title: "Contracts & Signing",
    desc: "TREC forms, earnest money, option periods, and closing costs.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">
              Real estate, the way it should be done
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Your Home.{" "}
            <span className="text-blue-400">Your Future.</span>
            <br />
            Your Agent.
          </h1>

          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed">
            Whether you&apos;re buying your first home, selling a property, or growing an investment
            portfolio — you deserve an agent who knows the process cold and will tell you
            everything you need to know before you sign a single line.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/start?role=buying"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all shadow-xl shadow-blue-900/50 hover:shadow-blue-800/60 hover:-translate-y-0.5"
            >
              I&apos;m Buying a Home
            </Link>
            <Link
              href="/start?role=selling"
              className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-semibold text-base transition-all hover:-translate-y-0.5"
            >
              I&apos;m Selling a Home
            </Link>
            <Link
              href="/start?role=both"
              className="px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold text-base transition-all hover:-translate-y-0.5"
            >
              Buying &amp; Selling
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Just exploring?{" "}
            <Link href="/tools" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Try the free payment &amp; affordability calculators →
            </Link>
          </p>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 px-4 border-y border-slate-800">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "All Client Types", sub: "First-time to investor" },
            { label: "Full Transparency", sub: "No surprises, ever" },
            { label: "Legal Compliance", sub: "IABS & buyer rep ready" },
            { label: "Texas Expert", sub: "Every county, every program" },
          ].map(({ label, sub }) => (
            <div key={label} className="space-y-1">
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-slate-500 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live DFW market data */}
      <MarketPulse />

      {/* What you'll learn */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Everything you need to know
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Real estate is full of surprises — most of them avoidable. My job is to make
              sure you&apos;re informed before every decision, not after.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map(({ slug, icon, title, desc }) => (
              <Link
                key={slug}
                href={`/learn/${slug}`}
                className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View all education topics
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Who I work with */}
      <section className="py-20 px-4 bg-slate-800/30 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              I work with every type of client
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              No matter where you are in your real estate journey, I have the knowledge and
              resources to guide you to the right outcome.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                type: "First-Time Buyers",
                desc: "Learn what programs you qualify for, how to get pre-approved, and what every step of the process looks like.",
                href: "/start?type=first-time-buyer",
              },
              {
                type: "Move-Up Buyers",
                desc: "Buying and selling at the same time takes coordination. I'll walk you through the bridge strategy that makes it work.",
                href: "/start?type=move-up-buyer",
              },
              {
                type: "Investors",
                desc: "Whether you flip, hold, or BRRRR — I speak your language. Cap rates, 1031s, cash-on-cash return.",
                href: "/start?type=investor",
              },
              {
                type: "Sellers",
                desc: "Pricing strategy, disclosure requirements, staging, negotiation — I'll position your home to sell at the right price.",
                href: "/start?role=selling",
              },
            ].map(({ type, desc, href }) => (
              <Link
                key={type}
                href={href}
                className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 transition-all"
              >
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {type}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About the agent */}
      <AgentCard />

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-400 mb-8">
            Fill out a quick form and I&apos;ll reach out to walk you through your options —
            no pressure, no obligation.
          </p>
          <Link
            href="/start"
            className="inline-block px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all shadow-xl shadow-blue-900/50 hover:-translate-y-0.5"
          >
            Tell Me About Your Situation →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-4 text-xs text-slate-600">
          {(AGENT.name || AGENT.brokerage || AGENT.licenseNumber) && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-1 md:gap-3 text-center text-slate-500">
              {AGENT.name && (
                <span className="text-slate-400 font-medium">
                  {AGENT.name}{AGENT.title ? `, ${AGENT.title}` : ""}
                </span>
              )}
              {AGENT.licenseNumber && <span>TREC License #{AGENT.licenseNumber}</span>}
              {AGENT.brokerage && (
                <span>
                  {AGENT.brokerage}{AGENT.brokerageLicense ? ` (#${AGENT.brokerageLicense})` : ""}
                </span>
              )}
              {AGENT.phone && <span>{AGENT.phone}</span>}
            </div>
          )}
          <div className="flex justify-center">
            <SocialLinks />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} {AGENT.appName}. All rights reserved.</p>
            <p className="text-center max-w-lg">
              By using this site you acknowledge receipt of the Texas Information About Brokerage
              Services (IABS). This is not a guarantee of representation. A written buyer
              representation agreement is required before agent services begin.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
