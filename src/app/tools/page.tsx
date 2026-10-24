"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { PageIntro, ActionLink } from "@/components/ui";
import { numericInput, principalAndInterest as pAndI } from "@/lib/calculator";

// ─── Formatting helpers ───────────────────────────────────────────────────────

const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usd = (n: number) => (isFinite(n) ? usd0.format(Math.max(0, Math.round(n))) : "—");

function num(v: string): number { return numericInput(v) ?? 0; }

// Texas-typical carrying costs as a share of home value, per year.
const TAX_RATE = 0.018; // ~1.8% property tax
const INS_RATE = 0.006; // ~0.6% homeowners insurance

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function NumberField({
  label, value, onChange, prefix, suffix, hint, max = 100_000_000,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; hint?: string; max?: number;
}) {
  const invalid = numericInput(value, max) === null;
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-muted">{label}</span>
      <span className="flex items-center bg-cream border border-line rounded-[4px] px-3 focus-within:ring-2 focus-within:ring-green/30 focus-within:border-green transition-all">
        {prefix && <span className="text-faint text-sm mr-1">{prefix}</span>}
        <input
          inputMode="decimal"
          aria-label={label}
          aria-invalid={invalid}
          maxLength={24}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-11 bg-transparent py-2.5 text-base text-ink placeholder-faint focus:outline-none"
        />
        {suffix && <span className="text-faint text-sm ml-1">{suffix}</span>}
      </span>
      {invalid && <span className="block text-red-700 text-xs">Enter a number from 0 to {max.toLocaleString("en-US")}.</span>}
      {hint && !invalid && <span className="block text-faint text-xs">{hint}</span>}
    </label>
  );
}

function Segmented({ options, value, onChange }: {
  options: { label: string; value: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-[4px] bg-cream border border-line p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`px-4 min-h-11 py-2 rounded-[4px] text-sm font-medium transition-all ${
            value === o.value ? "bg-green text-cream" : "text-muted hover:text-ink"
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
      <div className="flex h-3 rounded-full overflow-hidden bg-line gap-[2px]">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 mt-4">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-sm text-muted">{s.label}</span>
            <span className="text-sm text-ink font-medium ml-auto tabular-nums">{usd(s.value)}</span>
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
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [hoa, setHoa] = useState("0");

  const invalid = numericInput(price) === null || numericInput(downPct, 100) === null || numericInput(rate, 30) === null || numericInput(hoa) === null;
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
    <div className="hop-calculator">
      <h2 className="font-display text-2xl font-semibold text-ink mb-1 tracking-tight">Monthly Payment Calculator</h2>
      <p className="text-muted text-sm mb-6">
        Estimate principal and interest, property tax, insurance, and optional HOA dues.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Home price" value={price} onChange={setPrice} prefix="$" />
          <NumberField label="Down payment" value={downPct} onChange={setDownPct} suffix="%" max={100}
            hint={`${usd(r.down)} down · ${usd(r.loan)} loan`} />
          <NumberField label="Interest rate" value={rate} onChange={setRate} suffix="%" max={30} />
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-muted">Loan term</span>
            <Segmented value={term} onChange={setTerm}
              options={[{ label: "30 yr", value: "30" }, { label: "15 yr", value: "15" }]} />
          </div>
          <NumberField label="HOA (monthly)" value={hoa} onChange={setHoa} prefix="$" hint="Optional" />
        </div>

        <div className="flex flex-col">
          <div className="bg-green rounded-2xl p-6 text-center text-cream">
            <p className="text-cream/70 text-xs uppercase tracking-wide">Estimated monthly payment</p>
            <p className="font-display text-4xl md:text-5xl font-semibold mt-2 tracking-tight">{invalid ? "—" : usd(r.total)}</p>
            <p className="text-cream/80 text-sm mt-1">{invalid ? "Correct the highlighted inputs to see an estimate." : "per month"}</p>
          </div>
          <p className="mt-4 text-sm text-muted">Example rate; 1.8% annual tax and 0.6% insurance assumptions. Excludes mortgage insurance, closing costs, maintenance and utilities. Review the full assumptions above.</p>
          <div className="mt-5">
            {!invalid && <BreakdownBar segments={[
              { label: "Principal & interest", value: r.pi, color: "var(--hop-ink)" },
              { label: "Property tax", value: r.tax, color: "var(--hop-accent)" },
              { label: "Insurance", value: r.ins, color: "var(--hop-secondary)" },
              ...(r.hoaM > 0 ? [{ label: "HOA", value: r.hoaM, color: "var(--hop-line)" }] : []),
            ]} />}
          </div>
          <Link href="/start?role=buying"
            className="mt-6 text-center px-5 py-3 rounded-full bg-green hover:bg-green-600 text-cream text-sm font-medium transition-colors">
            Discuss this payment scenario →
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
  const [rate, setRate] = useState("6.5");

  const invalid = [income, debts, down].some(v => numericInput(v) === null) || numericInput(rate, 30) === null;
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
    <div className="hop-calculator">
      <h2 className="font-display text-2xl font-semibold text-ink mb-1 tracking-tight">How Much Home Can I Afford?</h2>
      <p className="text-muted text-sm mb-6">
        An illustrative 28% housing / 36% total-debt scenario. Lender limits vary by loan program and individual circumstances. This does not determine eligibility.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberField label="Annual household income" value={income} onChange={setIncome} prefix="$" />
          <NumberField label="Monthly debt payments" value={debts} onChange={setDebts} prefix="$"
            hint="Car loans, student loans, credit-card minimums" />
          <NumberField label="Cash for down payment" value={down} onChange={setDown} prefix="$" />
          <NumberField label="Interest rate" value={rate} onChange={setRate} suffix="%" max={30} />
        </div>

        <div className="flex flex-col">
          <div className="bg-green rounded-2xl p-6 text-center text-cream">
            <p className="text-cream/70 text-xs uppercase tracking-wide">Illustrative price ceiling</p>
            <p className="font-display text-4xl md:text-5xl font-semibold mt-2 tracking-tight">{invalid ? "—" : usd(r.price)}</p>
            <p className="text-cream/80 text-sm mt-1">{invalid ? "Correct the highlighted inputs." : `~${usd(r.maxHousing)}/mo toward housing`}</p>
          </div>
          <p className="text-muted text-sm leading-relaxed mt-5">
            This is a planning range under the assumptions shown, capped at $3 million. A lender must review your circumstances and confirm any financing or assistance options.
          </p>
          <Link href="/start?role=buying"
            className="mt-6 text-center px-5 py-3 rounded-full bg-green hover:bg-green-600 text-cream text-sm font-medium transition-colors">
            Map out my buying plan →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolsPage(){return <><Nav/><main id="main-content" tabIndex={-1} className="hop-wrap"><PageIntro eyebrow="Explore the numbers" title={<>A monthly cost<br/>you can live with.</>}>Work through a scenario before the lender conversation. No signup needed. Every result is an estimate, with assumptions and excluded costs shown.</PageIntro><div className="hop-tools-layout"><MortgageCalculator/><AffordabilityCalculator/></div><details className="hop-calculator-assumptions"><summary>Review assumptions and excluded costs <span aria-hidden="true">+</span></summary><p>Example inputs are not current market rates. Property tax is assumed at 1.8% of price per year and insurance at 0.6%. Actual bills vary. Mortgage insurance, closing costs, maintenance, utilities and other fees are excluded. Add HOA dues in the payment calculator. Confirm a full payment estimate with your lender.</p><p>Calculator entries stay on this page and are not submitted to Hop.</p></details><section className="hop-page-section hop-explore-grid"><div><p className="hop-eyebrow">Keep the numbers in context</p><h2 className="hop-title mt-4">A scenario.<br/>Then a conversation.</h2></div><div><p className="hop-lead">An estimate helps you ask better questions. It doesn’t determine loan approval, eligibility or a property’s value. Confirm actual costs and terms with the relevant provider.</p><ActionLink href="/buy" className="mt-6">Shape my buying plan</ActionLink></div></section></main><Footer/></>;}
