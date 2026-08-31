import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Photo from "@/components/photo";
import { AGENT } from "@/config/agent";
import { IMAGES } from "@/config/images";

export const metadata: Metadata = {
  title: `Dallas Apartment Locator — Free Apartment Finder | ${AGENT.appName}`,
  description: `Free apartment locating across Dallas — Uptown, Downtown, and DFW high-rises. ${AGENT.name} finds your next lease at no cost to you, because the communities pay the locator, not the renter.`,
  alternates: { canonical: "/leasing" },
  keywords: [
    "Dallas apartment locator",
    "free apartment finder Dallas",
    "Uptown Dallas apartments",
    "Downtown Dallas apartments",
    "DFW apartment locating service",
    "luxury high-rise apartments Dallas",
  ],
};

const tel = AGENT.phone ? AGENT.phone.replace(/[^0-9+]/g, "") : "";

const STEPS = [
  { n: "01", title: "Tell me what you want", desc: "Budget, neighborhoods, move-in date, must-haves. Five minutes by phone, text, or form." },
  { n: "02", title: "I build your shortlist", desc: "I pull matching communities — pricing, specials, and availability — and send you a curated list, not 200 links." },
  { n: "03", title: "We tour the best", desc: "I set up tours (or self-guided visits) at the ones worth your time and come with the questions to ask." },
  { n: "04", title: "I handle the paperwork", desc: "Application, lease review, and move-in details — I stay with you through signing." },
];

export default function LeasingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Nav />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end">
        <div className="absolute inset-0">
          <Photo src={IMAGES.highrise} alt="Uptown Dallas high-rise apartments" className="h-full w-full" overlay />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/25" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 pb-16 pt-32 text-cream">
          <p className="text-cream/80 text-xs md:text-sm uppercase tracking-[0.25em] mb-5">Dallas apartment locating</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.03] tracking-tight max-w-3xl">
            Your next apartment. On the house.
          </h1>
          <p className="text-cream/85 text-lg md:text-xl mt-6 max-w-xl leading-relaxed">
            I find your Dallas apartment — Uptown high-rise, Downtown loft, or suburban lease — and it costs
            you nothing. The communities pay me a locator fee, so my service is 100% free to you.
          </p>
          <div className="flex flex-wrap gap-3 mt-9">
            <Link href="/start?role=buying&src=leasing" className="px-7 py-3.5 rounded-full bg-cream text-green font-medium hover:bg-white transition-colors">
              Find my apartment
            </Link>
            {tel && (
              <a href={`tel:${tel}`} className="px-7 py-3.5 rounded-full bg-green/20 backdrop-blur border border-cream/40 text-cream font-medium hover:bg-green/40 transition-colors">
                Call or text {AGENT.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Why free */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-3">Why it&apos;s free</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">
            You don&apos;t pay me — the apartment community does
          </h2>
          <p className="text-muted mt-5 leading-relaxed">
            Apartment communities budget a referral fee to fill their units. When I bring you to them, they
            pay me that fee — so you get a professional in your corner at zero cost, and often a smoother
            application on top. No catch, no markup on your rent.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-8 md:pb-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-paper border border-line rounded-3xl p-7">
                <p className="font-display text-3xl text-gold font-semibold">{s.n}</p>
                <h3 className="font-display text-xl font-semibold text-ink mt-3 tracking-tight">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where */}
      <section className="py-20 md:py-24 px-5 bg-green text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-4">Where I search</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Uptown, Downtown, and everywhere in between
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {["Uptown", "Downtown Dallas", "Deep Ellum", "Victory Park", "Las Colinas", "Frisco", "Plano", "The Colony", "Addison", "Arlington"].map((a) => (
              <span key={a} className="rounded-full border border-cream/25 px-4 py-2 text-sm text-cream/90">{a}</span>
            ))}
          </div>
          <p className="text-cream/70 text-sm mt-8 max-w-lg mx-auto">
            High-rises, mid-rises, garden communities, and luxury leases — if it&apos;s in the Metroplex, I can
            help you find it.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto rounded-3xl bg-paper border border-line p-10 md:p-16 text-center shadow-[0_1px_30px_rgba(28,59,48,0.06)]">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink tracking-tight">
            Tell me what you&apos;re looking for
          </h2>
          <p className="text-muted mt-5 max-w-lg mx-auto leading-relaxed">
            Share your budget, timing, and neighborhoods, and I&apos;ll have a shortlist back to you fast —
            completely free.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/start?role=buying&src=leasing" className="px-9 py-4 rounded-full bg-green text-cream font-medium hover:bg-green-600 transition-colors">
              Find my apartment →
            </Link>
            {tel && (
              <a href={`tel:${tel}`} className="px-9 py-4 rounded-full border border-line text-ink font-medium hover:border-green hover:text-green transition-colors">
                Call or text {AGENT.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
