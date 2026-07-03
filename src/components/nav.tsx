import Link from "next/link";
import { AGENT } from "@/config/agent";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <span className="flex flex-col leading-none">
            <span className="text-white font-semibold tracking-tight">{AGENT.appName}</span>
            {AGENT.name && (
              <span className="text-slate-400 text-xs mt-0.5">
                with {AGENT.name}{AGENT.brokerage ? ` · ${AGENT.brokerage}` : ""}
              </span>
            )}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <Link href="/learn" className="hover:text-white transition-colors">Education Hub</Link>
          <Link href="/learn/process" className="hover:text-white transition-colors">The Process</Link>
          <Link href="/learn/programs" className="hover:text-white transition-colors">Loan Programs</Link>
        </div>

        <Link
          href="/start"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-900/40"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
