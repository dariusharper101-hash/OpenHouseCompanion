import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { AGENT } from "@/config/agent";
import { PageIntro, ActionLink, RouteRow } from "@/components/ui";
import { neighborhoodSlugs, getNeighborhood } from "@/config/neighborhoods";

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

export default async function AreaPage(props:PageProps<"/neighborhoods/[slug]">){const {slug}=await props.params;const n=getNeighborhood(slug);if(!n)notFound();const nearby=n.nearby.map(getNeighborhood).filter((x):x is NonNullable<typeof x>=>Boolean(x));return <><Nav/><main id="main-content" tabIndex={-1} className="hop-wrap"><nav aria-label="Breadcrumb" className="hop-breadcrumb"><Link href="/neighborhoods">Explore DFW</Link><span aria-hidden="true">/</span><span>{n.name}</span></nav><PageIntro eyebrow={`${n.county} / Dallas–Fort Worth`} title={<>Your day-to-day<br/>in {n.name}.</>} actions={<><ActionLink href={`/buy?area=${encodeURIComponent(n.name)}&src=${n.slug}`}>Shape a search in {n.name}</ActionLink><ActionLink href={`/start?role=selling&src=${n.slug}`} variant="quiet">Selling here?</ActionLink></>}>{n.tagline}</PageIntro><dl className="hop-area-facts"><div><dt>County</dt><dd>{n.county}</dd></div><div><dt>School district orientation</dt><dd>{n.schoolDistrict}</dd><p>Confirm the property’s actual boundaries with the district.</p></div><div><dt>Indicative price orientation</dt><dd>{n.priceBand}</dd><p>No verification date supplied. Ask for a current comparison.</p></div></dl><section className="hop-page-section hop-explore-grid"><div><p className="hop-eyebrow">Get a feel for the area</p><h2 className="hop-title mt-4">Life beyond<br/>the address.</h2><p className="hop-lead mt-6">{n.intro}</p></div><div>{n.highlights.map((h,i)=><article key={h.title} className="hop-step"><span className="hop-number">0{i+1}</span><div><h3>{h.title}</h3><p>{h.desc}</p></div></article>)}</div></section><section className="hop-area-context"><p className="hop-eyebrow">Bring your own priorities</p><h2 className="hop-title mt-4">Does it fit your life?</h2><p className="hop-lead mt-5">Start with the commute, space and monthly costs that matter to you. An area description is general context, not a recommendation for a particular person or a current market valuation.</p><ActionLink href="/tools" variant="quiet">Explore a payment scenario</ActionLink></section>{nearby.length>0&&<section className="hop-page-section"><p className="hop-eyebrow">Keep narrowing the map</p><h2 className="hop-title mt-4">Nearby areas.</h2><div className="hop-reading-index mt-8">{nearby.map((x,i)=><RouteRow key={x.slug} href={`/neighborhoods/${x.slug}`} title={x.name} number={String(i+1).padStart(2,"0")}>{x.tagline}</RouteRow>)}</div></section>}</main><Footer/></>;}
