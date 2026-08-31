import Link from "next/link";
import { AGENT } from "@/config/agent";

const LINKS = [
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/leasing", label: "Leasing" },
  { href: "/tools", label: "Calculators" },
  { href: "/learn", label: "Guides" },
];

export default function Nav() {
  const tel = AGENT.phone ? AGENT.phone.replace(/[^0-9+]/g, "") : "";
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/85 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-[68px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-cream">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-ink">{AGENT.appName}</span>
            {AGENT.name && (
              <span className="text-faint text-[11px] mt-1 tracking-wide uppercase">
                {AGENT.name}{AGENT.brokerage ? ` · ${AGENT.brokerage}` : ""}
              </span>
            )}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm text-muted">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-green transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {tel && (
            <a href={`tel:${tel}`} className="hidden md:block text-sm text-ink font-medium hover:text-green transition-colors">
              {AGENT.phone}
            </a>
          )}
          <Link
            href="/start"
            className="px-5 py-2.5 rounded-full bg-green hover:bg-green-600 text-cream text-sm font-medium transition-colors"
          >
            Work With Me
          </Link>
        </div>
      </div>
    </nav>
  );
}
