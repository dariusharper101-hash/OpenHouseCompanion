import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
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
  const description = `Thinking about buying, selling, or leasing in ${n.name} (${n.county})? ${n.tagline} Get local guidance from ${AGENT.name}${AGENT.brokerage ? `, ${AGENT.brokerage}` : ""}.`;
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
    <span className="inline-block bg-green/10 text-green border border-green/20 rounded-full px-3 py-1 text-sm">
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
    <div className="min-h-screen bg-cream">
      <Nav />

      <div className="max-w-4xl mx-auto px-5 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-faint mb-8">
          <Link href="/neighborhoods" className="hover:text-green transition-colors">Neighborhoods</Link>
          <span>/</span>
          <span className="text-muted">{n.name}</span>
        </div>

        {/* Hero */}
        <header className="mb-10">
          <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-3">{n.county} · {AGENT.serviceArea}</p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-ink mb-4 tracking-tight">
            {n.name} Real Estate
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{n.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              href={`/start?role=buying&src=${n.slug}`}
              className="px-7 py-3.5 rounded-full bg-green hover:bg-green-600 text-cream font-medium transition-colors text-center"
            >
              Buy in {n.name}
            </Link>
            <Link
              href={`/start?role=selling&src=${n.slug}`}
              className="px-7 py-3.5 rounded-full border border-line text-ink hover:border-green hover:text-green font-medium transition-colors text-center"
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
            <div key={label} className="bg-paper border border-line rounded-2xl p-4">
              <p className="text-faint text-xs uppercase tracking-wide">{label}</p>
              <p className="text-ink font-medium mt-1 text-sm leading-snug">{value}</p>
              {note && <p className="text-faint text-[11px] mt-0.5">{note} — ask for today&apos;s numbers</p>}
            </div>
          ))}
        </div>

        {/* Intro */}
        <p className="text-muted leading-relaxed mb-10 text-lg">{n.intro}</p>

        {/* Highlights */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-5 tracking-tight">What makes {n.name} stand out</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {n.highlights.map((h) => (
            <div key={h.title} className="bg-paper border border-line rounded-2xl p-5">
              <h3 className="font-display text-lg font-semibold text-ink mb-1.5">{h.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Good for */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-4 tracking-tight">Who {n.name} is great for</h2>
        <div className="flex flex-wrap gap-2 mb-12">
          {n.goodFor.map((g) => <Chip key={g}>{g}</Chip>)}
        </div>

        {/* Market context */}
        <div className="bg-green text-cream rounded-3xl p-8 mb-12">
          <h2 className="font-display text-xl md:text-2xl font-semibold mb-2 tracking-tight">The DFW market backdrop</h2>
          <p className="text-cream/80 text-sm leading-relaxed mb-4">
            Metro-wide, DFW is sitting around a <strong className="text-cream">{MARKET.stats.price.value}</strong> median
            sale price with homes going under contract in about <strong className="text-cream">{MARKET.stats.dom.value} days</strong> and
            roughly <strong className="text-cream">{MARKET.stats.supply.value}</strong> of inventory (as of {MARKET.lastUpdated}).
            {" "}{n.name} runs on its own dynamics inside that — I&apos;ll pull the exact, current {n.name} numbers for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/tools" className="text-cream underline underline-offset-4 hover:text-gold text-sm font-medium">Run the payment calculator →</Link>
            <Link href="/learn" className="text-cream underline underline-offset-4 hover:text-gold text-sm font-medium">Learn the process →</Link>
          </div>
        </div>

        {/* Nearby */}
        {nearby.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-4 tracking-tight">Nearby areas</h2>
            <div className="flex flex-wrap gap-2">
              {nearby.map((x) => (
                <Link
                  key={x.slug}
                  href={`/neighborhoods/${x.slug}`}
                  className="inline-block bg-paper border border-line rounded-full px-4 py-2 text-sm text-ink hover:border-green hover:text-green transition-colors"
                >
                  {x.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center bg-paper border border-line rounded-3xl p-10 shadow-[0_1px_30px_rgba(28,59,48,0.06)]">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-2 tracking-tight">Ready to make a move in {n.name}?</h2>
          <p className="text-muted max-w-lg mx-auto mb-6">
            Whether you&apos;re just starting to look or ready to list, tell me your situation and I&apos;ll map out
            your options in {n.name} — no pressure, no obligation.
          </p>
          <Link
            href={`/start?src=${n.slug}`}
            className="inline-block px-9 py-4 rounded-full bg-green text-cream font-medium hover:bg-green-600 transition-colors"
          >
            Tell me about your {n.name} plans →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
