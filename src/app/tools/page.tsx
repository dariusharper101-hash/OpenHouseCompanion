"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import { AGENT } from "@/config/agent";

// ─── Formatting helpers ───────────────────────────────────────────────────────

const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usd = (n: number) => (isFinite(n) ? usd0.format(Math.max(0, Math.round(n))) : "—");

function num(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ""));
  return isFinite(n) ? n : 0;
}

// Monthly principal + interest for a loan.
function pAndI(principal: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (principal <= 0 || n <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Texas-typical carrying costs as a share of home value, per year.
const TAX_RATE = 0.018; // ~1.8% property tax
const INS_RATE = 0.006; // ~0.6% homeowners insurance

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function NumberField({
  label, value, onChange, prefix, suffix, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
      <span className="flex items-center bg-slate-700/60 border border-slate-600 rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500/60 focus-within:border-blue-500/60 transition-all">
        {prefix && <span className="text-slate-400 text-sm mr-1">{prefix}</span>}
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        {suffix && <span className="text-slate-400 text-sm ml-1">{suffix}</span>}
      </span>
      {hint && <span className="block text-slate-500 text-xs">{hint}</span>}
    </label>
  );
}

function Segmented({ options, value, onChange }: {
  options: { label: string; value: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-xl bg-slate-700/60 border border-slate-600 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            value === o.value ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function BreakdownBar({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-slate-700 gap-[2px]">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-slate-400">{s.label}</span>
            <span className="text-xs text-white font-medium ml-auto">{usd(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mortgage payment calculator ──────────────────────────────────────────────

function MortgageCalculator() {
  const [price, setPrice] = useState("415000");
  const [downPct, setDownPct] = useState("10");
  const [rate, setRate] = useState("6.48");
  const [term, setTerm] = useState("30");
  const [hoa, setHoa] = useState("0");

  const r = useMemo(() => {
    const p = num(price);
    const down = p * (num(downPct) / 100);
    const loan = Math.max(0, p - down);
    const pi = pAndI(loan, num(rate), num(term));
    const tax = (p * TAX_RATE) / 12;
    const ins = (p * INS_RATE) / 12;
    const hoaM = num(hoa);
    return { down, loan, pi, tax, ins, hoaM, total: pi + tax + ins + hoaM };
  }, [price, downPct, rate, term, hoa]);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-white mb-1">Monthly Payment Calculator</h2>
      <p className="text-slate-400 text-sm mb-6">
        A realistic all-in estimate — principal, interest, Texas property taxes, and insurance.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Home price" value={price} onChange={setPrice} prefix="$" />
          <NumberField label="Down payment" value={downPct} onChange={setDownPct} suffix="%"
            hint={`${usd(r.down)} down · ${usd(r.loan)} loan`} />
          <NumberField label="Interest rate" value={rate} onChange={setRate} suffix="%" />
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Loan term</span>
            <Segmented value={term} onChange={setTerm}
              options={[{ label: "30 yr", value: "30" }, { label: "15 yr", value: "15" }]} />
          </div>
          <NumberField label="HOA (monthly)" value={hoa} onChange={setHoa} prefix="$" hint="Optional" />
        </div>

        <div className="flex flex-col">
          <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/20 rounded-2xl p-6 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wide">Estimated monthly payment</p>
            <p className="text-4xl md:text-5xl font-bold text-white mt-2 tracking-tight">{usd(r.total)}</p>
            <p className="text-slate-500 text-xs mt-1">per month</p>
          </div>
          <div className="mt-5">
            <BreakdownBar segments={[
              { label: "Principal & interest", value: r.pi, color: "#3b82f6" },
              { label: "Property tax", value: r.tax, color: "#8b5cf6" },
              { label: "Insurance", value: r.ins, color: "#06b6d4" },
              ...(r.hoaM > 0 ? [{ label: "HOA", value: r.hoaM, color: "#64748b" }] : []),
            ]} />
          </div>
          <Link href="/start?role=buying"
            className="mt-6 text-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
            Get pre-approved for this payment →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Affordability calculator ─────────────────────────────────────────────────

function AffordabilityCalculator() {
  const [income, setIncome] = useState("90000");
  const [debts, setDebts] = useState("500");
  const [down, setDown] = useState("30000");
  const [rate, setRate] = useState("6.48");

  const r = useMemo(() => {
    const grossMonthly = num(income) / 12;
    const monthlyDebts = num(debts);
    const downPayment = num(down);
    // Conservative DTI: min of 28% front-end and (36% back-end − existing debts).
    const maxHousing = Math.max(0, Math.min(grossMonthly * 0.28, grossMonthly * 0.36 - monthlyDebts));
    // Solve for the home price whose P&I + tax + ins == maxHousing (binary search).
    let lo = 0, hi = 3_000_000;
    for (let i = 0; i < 40; i++) {
      const price = (lo + hi) / 2;
      const loan = Math.max(0, price - downPayment);
      const monthly = pAndI(loan, num(rate), 30) + (price * (TAX_RATE + INS_RATE)) / 12;
      if (monthly > maxHousing) hi = price; else lo = price;
    }
    const price = (lo + hi) / 2;
    return { maxHousing, price };
  }, [income, debts, down, rate]);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-white mb-1">How Much Home Can I Afford?</h2>
      <p className="text-slate-400 text-sm mb-6">
        Based on the 28/36 debt-to-income guideline lenders use. A starting point — real approval
        depends on credit, program, and documentation.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Annual household income" value={income} onChange={setIncome} prefix="$" />
          <NumberField label="Monthly debt payments" value={debts} onChange={setDebts} prefix="$"
            hint="Car loans, student loans, credit-card minimums" />
          <NumberField label="Cash for down payment" value={down} onChange={setDown} prefix="$" />
          <NumberField label="Interest rate" value={rate} onChange={setRate} suffix="%" />
        </div>

        <div className="flex flex-col">
          <div className="bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wide">You could target homes up to</p>
            <p className="text-4xl md:text-5xl font-bold text-white mt-2 tracking-tight">{usd(r.price)}</p>
            <p className="text-slate-500 text-xs mt-1">~{usd(r.maxHousing)}/mo toward housing</p>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mt-5">
            This keeps you inside the ratios most lenders want to see. Want to stretch it, or find
            down-payment assistance you qualify for? That&apos;s exactly what I help with.
          </p>
          <Link href="/start?role=buying"
            className="mt-6 text-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
            Map out my buying plan →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Nav />
      <section className="pt-28 pb-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Run the <span className="text-blue-400">real numbers</span>
          </h1>
          <p className="text-slate-300 leading-relaxed">
            No sign-up, no email wall — free calculators built on {AGENT.serviceArea} tax and
            insurance realities, so the number you see is the number you&apos;ll actually pay.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <MortgageCalculator />
          <AffordabilityCalculator />

          <div className="text-center bg-slate-800/40 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Curious what your home is worth?</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-6">
              A calculator can&apos;t see your upgrades, your street, or today&apos;s buyer demand. I&apos;ll
              put together a real, address-level valuation for you — free.
            </p>
            <Link href="/start?role=selling"
              className="inline-block px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-xl shadow-blue-900/50">
              Get my free home valuation →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
