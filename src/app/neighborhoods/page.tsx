import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/nav";
import { AGENT } from "@/config/agent";
import { NEIGHBORHOODS } from "@/config/neighborhoods";

export const metadata: Metadata = {
  title: `${AGENT.serviceArea} Neighborhood Guides | Where to Buy & Sell`,
  description: `City-by-city guides to buying and selling across ${AGENT.serviceArea} — Frisco, Plano, McKinney, Arlington, Fort Worth and more, with local insight from ${AGENT.name}.`,
  alternates: { canonical: "/neighborhoods" },
};

export default function NeighborhoodsIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Nav />

      <section className="pt-28 pb-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Explore <span className="text-blue-400">{AGENT.serviceArea}</span>
          </h1>
          <p className="text-slate-300 leading-relaxed">
            Every DFW city has its own personality, price point, and school story. Here&apos;s a
            straight-talk guide to the areas I know best — pick one to see what it&apos;s really like
            to buy or sell there.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEIGHBORHOODS.map((n) => (
            <Link
              key={n.slug}
              href={`/neighborhoods/${n.slug}`}
              className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:-translate-y-0.5 flex flex-col"
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h2 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                  {n.name}
                </h2>
                <span className="text-slate-500 text-xs whitespace-nowrap">{n.county.replace(" County", "")}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{n.tagline}</p>
              <p className="text-slate-500 text-xs mt-4 pt-3 border-t border-slate-700/60">
                {n.schoolDistrict} · {n.priceBand}
              </p>
            </Link>
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center mt-12">
          <p className="text-slate-400 mb-5">Don&apos;t see your area? I cover the whole Metroplex.</p>
          <Link
            href="/start"
            className="inline-block px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-xl shadow-blue-900/50"
          >
            Tell me where you&apos;re looking →
          </Link>
        </div>
      </section>
    </div>
  );
}
