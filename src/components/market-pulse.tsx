import Link from "next/link";
import { MARKET, type MarketStat } from "@/config/market";

// ─── Sparkline ────────────────────────────────────────────────────────────────
// Single-series trend line: 2px stroke, rounded ends, subtle area fill, marker on
// the latest point. One hue (the brand green) on the light card surface.

function Sparkline({ data, id }: { data: readonly number[]; id: string }) {
  const w = 220;
  const h = 56;
  const pad = 6;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });

  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h - pad} L${pts[0][0].toFixed(1)} ${h - pad} Z`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="mt-3 overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c3b30" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#1c3b30" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fill-${id})`} />
      <path d={line} fill="none" stroke="#1c3b30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3.5" fill="#1c3b30" stroke="#fffdf9" strokeWidth="2" />
    </svg>
  );
}

function TrendPill({ stat }: { stat: MarketStat }) {
  const good = stat.trend === "flat" ? null : stat.trend === "up" ? stat.upIsGood : !stat.upIsGood;
  const color =
    good === null
      ? "text-muted bg-line/60"
      : good
      ? "text-green bg-green/10"
      : "text-[#a23b34] bg-[#a23b34]/10";
  const arrow = stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "→";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
      <span aria-hidden="true">{arrow}</span>
      {stat.change}
    </span>
  );
}

function StatCard({ stat, id }: { stat: MarketStat; id: string }) {
  return (
    <div className="bg-paper border border-line rounded-2xl p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted text-xs uppercase tracking-wide font-medium">{stat.label}</p>
        <TrendPill stat={stat} />
      </div>
      <p className="font-display text-3xl font-semibold text-ink mt-2 tracking-tight">{stat.value}</p>
      <Sparkline data={stat.history} id={id} />
      <p className="text-faint text-xs leading-relaxed mt-3">{stat.caption}</p>
    </div>
  );
}

export default function MarketPulse() {
  const { stats } = MARKET;
  return (
    <section className="py-20 md:py-28 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-10">
          <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-3">
            {MARKET.area} · Updated {MARKET.lastUpdated}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">
            The market, in plain English
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            The numbers that actually move your buying, selling, or leasing decision — tracked and
            explained, refreshed every month.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard stat={stats.rate} id="rate" />
          <StatCard stat={stats.price} id="price" />
          <StatCard stat={stats.dom} id="dom" />
          <StatCard stat={stats.supply} id="supply" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-faint text-xs max-w-md text-center sm:text-left">
            Indicative metro-wide averages ({MARKET.source}). Your street, price band, and program can
            look very different — ask me for a precise, address-level analysis.
          </p>
          <Link
            href="/tools"
            className="whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green hover:bg-green-600 text-cream text-sm font-medium transition-colors"
          >
            Run the numbers →
          </Link>
        </div>
      </div>
    </section>
  );
}
