import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { AGENT } from "@/config/agent";
import { NEIGHBORHOODS } from "@/config/neighborhoods";

export const metadata: Metadata = {
  title: `${AGENT.serviceArea} Neighborhood Guides | Where to Buy, Sell & Lease`,
  description: `City-by-city guides to buying, selling, and leasing across ${AGENT.serviceArea} — Dallas, Downtown Dallas, Frisco, Plano, Arlington, Fort Worth and more, with local insight from ${AGENT.name}.`,
  alternates: { canonical: "/neighborhoods" },
};

export default function NeighborhoodsIndex() {
  return (
    <div className="min-h-screen bg-cream">
      <Nav />

      <section className="pt-32 pb-12 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-3">Where I work</p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-ink tracking-tight">
            Explore {AGENT.serviceArea}
          </h1>
          <p className="text-muted leading-relaxed mt-5">
            Every DFW city has its own personality, price point, and school story. Here&apos;s a straight-talk
            guide to the areas I know best — pick one to see what it&apos;s really like to buy, sell, or lease there.
          </p>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NEIGHBORHOODS.map((n) => (
            <Link
              key={n.slug}
              href={`/neighborhoods/${n.slug}`}
              className="group bg-paper border border-line rounded-3xl p-7 hover:shadow-[0_12px_40px_rgba(28,59,48,0.1)] transition-shadow flex flex-col"
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h2 className="font-display text-2xl font-semibold text-ink tracking-tight group-hover:text-green transition-colors">
                  {n.name}
                </h2>
                <span className="text-faint text-xs whitespace-nowrap">{n.county.replace(" County", "")}</span>
              </div>
              <p className="text-muted text-sm leading-relaxed flex-1">{n.tagline}</p>
              <p className="text-faint text-xs mt-5 pt-4 border-t border-line">
                {n.schoolDistrict} · {n.priceBand}
              </p>
            </Link>
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center mt-14">
          <p className="text-muted mb-5">Don&apos;t see your area? I cover the whole Metroplex.</p>
          <Link
            href="/start"
            className="inline-block px-9 py-4 rounded-full bg-green text-cream font-medium hover:bg-green-600 transition-colors"
          >
            Tell me where you&apos;re looking →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
