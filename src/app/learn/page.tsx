import Link from "next/link";
import Nav from "@/components/nav";

const TOPICS = [
  {
    slug: "process",
    icon: "🗺️",
    title: "The Buying Process",
    desc: "A step-by-step walkthrough from pre-approval to closing day — know exactly what's coming.",
    color: "blue",
  },
  {
    slug: "programs",
    icon: "💰",
    title: "Loan Programs",
    desc: "FHA, VA, USDA, Conventional, and Texas-specific programs including TSAHC and TDHCA.",
    color: "green",
  },
  {
    slug: "taxes",
    icon: "📋",
    title: "County Property Taxes",
    desc: "Texas has no income tax but property taxes can be significant. Know the numbers before you commit.",
    color: "yellow",
  },
  {
    slug: "insurance",
    icon: "🛡️",
    title: "Homeowners Insurance",
    desc: "HO-3 policies, flood insurance, windstorm coverage, and what each policy actually protects.",
    color: "purple",
  },
  {
    slug: "warranties",
    icon: "🔧",
    title: "Home Warranties",
    desc: "Builder warranties vs. third-party plans — what's covered, what's not, and who pays.",
    color: "orange",
  },
  {
    slug: "inspections",
    icon: "🔍",
    title: "Home Inspections",
    desc: "Every inspection type, what inspectors look for, and how to use findings in negotiations.",
    color: "teal",
  },
  {
    slug: "contracts",
    icon: "✍️",
    title: "Contracts & Signing",
    desc: "TREC contracts, earnest money, option periods, contingencies, and closing cost breakdowns.",
    color: "red",
  },
  {
    slug: "selling",
    icon: "🏷️",
    title: "The Selling Process",
    desc: "Pricing strategy, seller disclosures, staging, negotiations, and what to expect at closing.",
    color: "pink",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Nav />

      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-blue-300 text-sm font-medium">Education Hub</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Know
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Real estate is one of the biggest financial decisions of your life. I believe you
            should understand every step, every cost, and every form — before you sign anything.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map(({ slug, icon, title, desc }) => (
            <Link
              key={slug}
              href={`/learn/${slug}`}
              className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h2 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                {title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-blue-400 text-xs font-medium">
                Read guide
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">Have questions after reading? I&apos;m here to help.</p>
          <Link
            href="/start"
            className="inline-block px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40"
          >
            Get in Touch →
          </Link>
        </div>
      </div>
    </div>
  );
}
