import Link from "next/link";
import { AGENT } from "@/config/agent";
import { SocialLinks } from "@/components/agent-card";

export default function Footer() {
  const tel = AGENT.phone ? AGENT.phone.replace(/[^0-9+]/g, "") : "";
  return (
    <footer className="bg-green text-cream">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">{AGENT.appName}</p>
            <p className="text-cream/70 text-sm mt-3 max-w-xs leading-relaxed">
              Buying, selling, and leasing across {AGENT.serviceArea} — with an agent who tells you
              everything before you sign.
            </p>
            <div className="mt-5">
              <SocialLinks className="[&_a]:text-cream/70 [&_a:hover]:text-cream" />
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-cream/50 text-xs uppercase tracking-widest mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm text-cream/85">
              <li><Link href="/start?role=buying" className="hover:text-cream transition-colors">Buy a home</Link></li>
              <li><Link href="/start?role=selling" className="hover:text-cream transition-colors">Sell a home</Link></li>
              <li><Link href="/leasing" className="hover:text-cream transition-colors">Lease / apartment locating</Link></li>
              <li><Link href="/neighborhoods" className="hover:text-cream transition-colors">Neighborhoods</Link></li>
              <li><Link href="/tools" className="hover:text-cream transition-colors">Calculators</Link></li>
              <li><Link href="/learn" className="hover:text-cream transition-colors">Guides</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-cream/50 text-xs uppercase tracking-widest mb-4">Get in touch</p>
            <ul className="space-y-2.5 text-sm text-cream/85">
              {AGENT.phone && <li><a href={`tel:${tel}`} className="hover:text-cream transition-colors">{AGENT.phone}</a></li>}
              {AGENT.email && <li><a href={`mailto:${AGENT.email}`} className="hover:text-cream transition-colors">{AGENT.email}</a></li>}
              <li className="text-cream/60">{AGENT.serviceArea}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-cream/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-cream/55">
          <p>
            {AGENT.name}{AGENT.title ? `, ${AGENT.title}` : ""}
            {AGENT.licenseNumber ? ` · TREC #${AGENT.licenseNumber}` : ""}
            {AGENT.brokerage ? ` · ${AGENT.brokerage}` : ""}
          </p>
          <p>© {new Date().getFullYear()} {AGENT.appName}. All rights reserved.</p>
        </div>
        <p className="mt-4 text-[11px] text-cream/45 leading-relaxed max-w-3xl">
          By using this site you acknowledge receipt of the Texas Information About Brokerage Services
          (IABS). This is not a guarantee of representation. A written buyer or tenant representation
          agreement is required before agent services begin.
        </p>
      </div>
    </footer>
  );
}
