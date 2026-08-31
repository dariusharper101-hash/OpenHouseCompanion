import Link from "next/link";
import { MARKET, type MarketStat } from "@/config/market";

// ─── Sparkline ────────────────────────────────────────────────────────────────
// A single-series trend line: 2px stroke, rounded ends, a subtle area fill, and a
// marker on the latest point. One hue (the brand blue) on the dark card surface.

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
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fill-${id})`} />
      <path
        d={line}
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* latest-point marker with a 2px surface ring so it reads on the fill */}
      <circle cx={lx} cy={ly} r="3.5" fill="#60a5fa" stroke="#1e293b" strokeWidth="2" />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function TrendPill({ stat }: { stat: MarketStat }) {
  const good = stat.trend === "flat" ? null : stat.trend === "up" ? stat.upIsGood : !stat.upIsGood;
  const color =
    good === null
      ? "text-slate-400 bg-slate-700/40"
      : good
      ? "text-emerald-300 bg-emerald-500/15"
      : "text-rose-300 bg-rose-500/15";
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
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">{stat.label}</p>
        <TrendPill stat={stat} />
      </div>
      <p className="text-3xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
      <Sparkline data={stat.history} id={id} />
      <p className="text-slate-500 text-xs leading-relaxed mt-3">{stat.caption}</p>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function MarketPulse() {
  const { stats } = MARKET;
  return (
    <section className="py-20 px-4 bg-slate-800/30 border-y border-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-3 py-1 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 text-xs font-medium">
              {MARKET.area} · Updated {MARKET.lastUpdated}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">The DFW Market Right Now</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            The numbers that actually move your buying or selling decision — tracked and
            explained in plain English, refreshed every month.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard stat={stats.rate} id="rate" />
          <StatCard stat={stats.price} id="price" />
          <StatCard stat={stats.dom} id="dom" />
          <StatCard stat={stats.supply} id="supply" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-slate-600 text-xs max-w-md text-center sm:text-left">
            Figures are indicative metro-wide averages ({MARKET.source}). Your street, price band,
            and program can look very different — ask me for a precise, address-level analysis.
          </p>
          <Link
            href="/tools"
            className="whitespace-nowrap inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Run the numbers on your home →
          </Link>
        </div>
      </div>
    </section>
  );
}
