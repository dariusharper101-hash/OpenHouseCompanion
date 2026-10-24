import Link from "next/link";
import { MARKET } from "@/config/market";

export default function MarketPulse() {
  return <section className="py-16 md:py-24 px-5"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
    <div><p className="text-gold text-xs uppercase tracking-widest">{MARKET.area} · Market context</p><h2 className="font-display text-3xl md:text-4xl mt-4">Start with a dated comparison.</h2><p className="text-muted mt-5 leading-relaxed">Rates, prices, and availability change. Current local figures are not published here yet. Ask for a comparison for your area, property type, and price range before making a decision.</p><Link href="/start?src=market" className="inline-block mt-6 text-green underline underline-offset-4">Ask Hop about my area →</Link></div>
    <div className="bg-paper border border-line rounded-2xl p-6"><h3 className="font-medium text-ink">Check the source and the date</h3><p className="text-muted text-sm mt-3">National mortgage averages and metro reports give context; they are not a quote for your loan or an appraisal of a particular home.</p><ul className="space-y-3 mt-5">{MARKET.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="text-green text-sm underline underline-offset-4">{source.label} ↗</a></li>)}</ul><Link href="/tools" className="inline-block rounded-full bg-green px-5 py-3 text-cream text-sm mt-6">Estimate a payment →</Link></div>
  </div></section>;
}
