import { DFW_AREAS } from "@/config/rental";
import { fmtGuideDate, monthlyValue, type Special } from "@/config/specials";

// ─── Guide building blocks ───────────────────────────────────────────────────
// Hook-free so they render on the server (preview) and inside the client form
// (full guide after submit). Wording rules: "starting at", "subject to change",
// "Verified as of <date>" on every card; no commission or fee figures.

export const DISCLAIMER =
  "Subject to change and availability. Verify with the property before applying.";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export function SpecialCard({ s }: { s: Special }) {
  const value = monthlyValue(s);
  return (
    <article className="bg-paper border border-line rounded-lg p-5 flex flex-col">
      <p className="text-muted text-xs uppercase tracking-widest">{s.area}</p>
      <h4 className="font-display text-lg font-semibold text-ink tracking-tight mt-1.5">{s.property}</h4>
      <p className="text-green text-xl font-semibold mt-3">{s.special}</p>
      <p className="text-muted text-sm mt-1 leading-relaxed">{s.conditions}</p>
      <dl className="mt-4 space-y-1 text-sm">
        {s.startingAt ? (
          <div className="flex gap-1.5">
            <dt className="text-muted">Rent starting at</dt>
            <dd className="text-ink font-medium">{usd(s.startingAt)}/mo</dd>
          </div>
        ) : null}
        {value ? (
          <div className="flex gap-1.5">
            <dt className="text-muted">Worth about</dt>
            <dd className="text-ink font-medium">{usd(value)}/mo over the lease</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-4 pt-3 border-t border-line text-xs text-muted leading-relaxed">
        <span className="font-semibold text-ink">Verified as of {fmtGuideDate(s.verifiedOn)}</span>
        {" · "}Source: {s.source}. {DISCLAIMER}
      </p>
    </article>
  );
}

// The full guide, shown in place after the form is submitted. Areas the renter
// picked are listed first; every other area follows in the usual order.
export function FullGuide({ specials, picked }: { specials: Special[]; picked: string[] }) {
  const order = [
    ...picked.filter((a) => (DFW_AREAS as readonly string[]).includes(a)),
    ...DFW_AREAS.filter((a) => !picked.includes(a)),
  ];
  const groups = order
    .map((area) => ({ area, items: specials.filter((s) => s.area === area) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-14">
      <section aria-labelledby="g-specials">
        <p className="font-display text-green text-2xl font-semibold">01</p>
        <h3 id="g-specials" className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight mt-1">
          Specials by area
        </h3>
        <div className="mt-6 space-y-10">
          {groups.map((g) => (
            <div key={g.area}>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-muted mb-3">{g.area}</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {g.items.map((s) => <SpecialCard key={s.id} s={s} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="g-worth">
        <p className="font-display text-green text-2xl font-semibold">02</p>
        <h3 id="g-worth" className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight mt-1">
          What a special is worth per month
        </h3>
        <p className="text-muted mt-3 leading-relaxed max-w-2xl">
          Free weeks are spread across the whole lease. Divide the free rent by the number of months
          on the lease to compare offers on the same footing.
        </p>
        <div className="mt-5"><ExampleMath /></div>
      </section>

      <section aria-labelledby="g-questions">
        <p className="font-display text-green text-2xl font-semibold">03</p>
        <h3 id="g-questions" className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight mt-1">
          Questions to ask the leasing office
        </h3>
        <ol className="mt-5 space-y-3 list-decimal pl-5 text-ink leading-relaxed max-w-2xl">
          <li>Is this special still available for my move date? Can I get it in writing?</li>
          <li>Which floor plans and lease lengths does it apply to?</li>
          <li>Is the free rent taken off up front or spread across the lease?</li>
          <li>What is due at application and at move-in?</li>
          <li>What happens to the special if I end the lease early?</li>
        </ol>
      </section>

      <section aria-labelledby="g-timeline">
        <p className="font-display text-green text-2xl font-semibold">04</p>
        <h3 id="g-timeline" className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight mt-1">
          A December move-in timeline
        </h3>
        <ol className="mt-5 space-y-4 max-w-2xl">
          {[
            ["Early November", "Set your budget, pick your areas and shortlist specials."],
            ["Mid November", "Tour your shortlist and ask the questions above."],
            ["30+ days before you move", "Apply, and give notice at your current place (check your lease for the notice period)."],
            ["1–2 weeks before", "Set up utilities and renter's insurance if the property requires it. Confirm your move-in date."],
            ["Move-in day", "Do the walk-through and photograph the condition of the home."],
          ].map(([when, what]) => (
            <li key={when} className="border-l-2 border-gold pl-4">
              <p className="text-sm font-semibold text-ink">{when}</p>
              <p className="text-muted text-sm leading-relaxed mt-0.5">{what}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export function ExampleMath() {
  return (
    <div className="bg-paper border-2 border-dashed border-line-strong rounded-lg p-5 max-w-xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink">Example math, not a listing</p>
      <p className="text-ink mt-3 leading-relaxed">
        Rent starting at $1,500/mo with 1 month free on a 12-month lease:
      </p>
      <p className="font-display text-xl text-ink mt-2">$1,500 ÷ 12 = $125/mo</p>
      <p className="text-muted text-sm mt-2 leading-relaxed">
        So it works out to about $1,375/mo over the lease. Real rent, fees and terms vary by property.
      </p>
    </div>
  );
}
