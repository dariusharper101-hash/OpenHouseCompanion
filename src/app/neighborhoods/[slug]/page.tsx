import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import { AGENT } from "@/config/agent";
import { MARKET } from "@/config/market";
import { NEIGHBORHOODS, neighborhoodSlugs, getNeighborhood } from "@/config/neighborhoods";

// Pre-render every area page at build time (static = fast + SEO-friendly).
export function generateStaticParams() {
  return neighborhoodSlugs.map((slug) => ({ slug }));
}

// Per-page metadata is the core SEO lever — each area gets its own title,
// description, and canonical URL targeting local searches.
export async function generateMetadata(
  props: PageProps<"/neighborhoods/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const n = getNeighborhood(slug);
  if (!n) return {};

  const title = `Homes for Sale in ${n.name}, TX | ${n.name} Real Estate Agent`;
  const description = `Thinking about buying or selling in ${n.name} (${n.county})? ${n.tagline} Get local guidance from ${AGENT.name}${AGENT.brokerage ? `, ${AGENT.brokerage}` : ""}.`;
  const url = `${AGENT.siteUrl}/neighborhoods/${n.slug}`;

  return {
    title,
    description,
    keywords: [
      `homes for sale in ${n.name} TX`,
      `${n.name} real estate agent`,
      `${n.name} realtor`,
      `buy a home in ${n.name}`,
      `sell my home in ${n.name}`,
      `${n.name} ${n.county} homes`,
    ],
    alternates: { canonical: `/neighborhoods/${n.slug}` },
    openGraph: { title, description, url, type: "website" },
  };
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-full px-3 py-1 text-sm">
      {children}
    </span>
  );
}

export default async function NeighborhoodPage(props: PageProps<"/neighborhoods/[slug]">) {
  const { slug } = await props.params;
  const n = getNeighborhood(slug);
  if (!n) notFound();

  // Only link to nearby areas that actually have a page.
  const nearby = n.nearby.map(getNeighborhood).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Nav />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/neighborhoods" className="hover:text-slate-300 transition-colors">Neighborhoods</Link>
          <span>/</span>
          <span className="text-slate-400">{n.name}</span>
        </div>

        {/* Hero */}
        <header className="mb-10">
          <p className="text-blue-400 text-sm font-medium mb-2">{n.county} · {AGENT.serviceArea}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {n.name} Real Estate
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">{n.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <Link
              href={`/start?role=buying&src=${n.slug}`}
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-xl shadow-blue-900/50 hover:-translate-y-0.5 text-center"
            >
              Buy in {n.name}
            </Link>
            <Link
              href={`/start?role=selling&src=${n.slug}`}
              className="px-7 py-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-semibold transition-all hover:-translate-y-0.5 text-center"
            >
              Sell in {n.name}
            </Link>
          </div>
        </header>

        {/* Quick facts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {[
            { label: "County", value: n.county },
            { label: "Schools", value: n.schoolDistrict },
            { label: "Typical prices", value: n.priceBand, note: "indicative" },
          ].map(({ label, value, note }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wide">{label}</p>
              <p className="text-white font-semibold mt-1 text-sm leading-snug">{value}</p>
              {note && <p className="text-slate-600 text-[11px] mt-0.5">{note} — ask for today&apos;s numbers</p>}
            </div>
          ))}
        </div>

        {/* Intro */}
        <p className="text-slate-300 leading-relaxed mb-10">{n.intro}</p>

        {/* Highlights */}
        <h2 className="text-2xl font-bold text-white mb-5">What makes {n.name} stand out</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {n.highlights.map((h) => (
            <div key={h.title} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-1.5">{h.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Good for */}
        <h2 className="text-2xl font-bold text-white mb-4">Who {n.name} is great for</h2>
        <div className="flex flex-wrap gap-2 mb-12">
          {n.goodFor.map((g) => <Chip key={g}>{g}</Chip>)}
        </div>

        {/* Market context */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 mb-12">
          <h2 className="text-xl font-bold text-white mb-2">The DFW market backdrop</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Metro-wide, DFW is sitting around a <strong className="text-slate-200">{MARKET.stats.price.value}</strong> median
            sale price with homes going under contract in about <strong className="text-slate-200">{MARKET.stats.dom.value} days</strong> and
            roughly <strong className="text-slate-200">{MARKET.stats.supply.value}</strong> of inventory (as of {MARKET.lastUpdated}).
            {" "}{n.name} runs on its own dynamics inside that — I&apos;ll pull the exact, current {n.name} numbers for you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools" className="text-blue-400 hover:text-blue-300 text-sm font-medium">Run the payment calculator →</Link>
            <Link href="/learn" className="text-blue-400 hover:text-blue-300 text-sm font-medium">Learn the process →</Link>
          </div>
        </div>

        {/* Nearby */}
        {nearby.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Nearby areas</h2>
            <div className="flex flex-wrap gap-2">
              {nearby.map((x) => (
                <Link
                  key={x.slug}
                  href={`/neighborhoods/${x.slug}`}
                  className="inline-block bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-full px-4 py-2 text-sm text-slate-300 hover:text-white transition-all"
                >
                  {x.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to make a move in {n.name}?</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-6">
            Whether you&apos;re just starting to look or ready to list, tell me your situation and I&apos;ll
            map out your options in {n.name} — no pressure, no obligation.
          </p>
          <Link
            href={`/start?src=${n.slug}`}
            className="inline-block px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-xl shadow-blue-900/50"
          >
            Tell me about your {n.name} plans →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-xs text-slate-600 space-y-2">
          <p className="text-slate-500">
            {AGENT.name}{AGENT.title ? `, ${AGENT.title}` : ""}
            {AGENT.licenseNumber ? ` · TREC #${AGENT.licenseNumber}` : ""}
            {AGENT.brokerage ? ` · ${AGENT.brokerage}` : ""}
          </p>
          <p>© {new Date().getFullYear()} {AGENT.appName}. Serving {AGENT.serviceArea}.</p>
        </div>
      </footer>
    </div>
  );
}
