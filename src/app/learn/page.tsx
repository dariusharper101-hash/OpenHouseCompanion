import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Link from "next/link";
import { PageIntro, ActionLink } from "@/components/ui";
const TOPICS = [
  {
    slug: "process",
    title: "The Buying Process",
    desc: "A step-by-step walkthrough from pre-approval to closing day — know exactly what's coming.",
  },
  {
    slug: "programs",
    title: "Loan Programs",
    desc: "FHA, VA, USDA, Conventional, and Texas-specific programs including TSAHC and TDHCA.",
  },
  {
    slug: "taxes",
    title: "County Property Taxes",
    desc: "Texas has no income tax but property taxes can be significant. Know the numbers before you commit.",
  },
  {
    slug: "insurance",
    title: "Homeowners Insurance",
    desc: "HO-3 policies, flood insurance, windstorm coverage, and what each policy actually protects.",
  },
  {
    slug: "warranties",
    title: "Home Warranties",
    desc: "Builder warranties vs. third-party plans — what's covered, what's not, and who pays.",
  },
  {
    slug: "inspections",
    title: "Home Inspections",
    desc: "Every inspection type, what inspectors look for, and how to use findings in negotiations.",
  },
  {
    slug: "contracts",
    title: "Contracts & Signing",
    desc: "TREC contracts, earnest money, option periods, contingencies, and closing cost breakdowns.",
  },
  {
    slug: "selling",
    title: "The Selling Process",
    desc: "Pricing strategy, seller disclosures, staging, negotiations, and what to expect at closing.",
  },
];

export default function LearnPage(){return <><Nav/><main id="main-content" tabIndex={-1} className="hop-wrap"><PageIntro eyebrow="Get answers / The Hop field guide" title={<>Come curious.<br/>Leave clearer.</>} actions={<ActionLink href="/start?src=guides" variant="quiet">Bring a question to Hop</ActionLink>}>Costs, steps, paperwork and the questions you didn’t know to ask. Read what matters to your move, at your pace.</PageIntro><div className="hop-guide-cards">{TOPICS.map(t=><Link className="hop-guide-card" key={t.slug} href={`/learn/${t.slug}`}><h2>{t.title}</h2><p>{t.desc}</p><span>Explore this guide <span aria-hidden="true">↗</span></span></Link>)}</div><p className="hop-note py-10">Educational orientation. Confirm current terms with your provider and review transaction-specific forms with the brokerage.</p></main><Footer/></>;}
