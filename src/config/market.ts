// ─── DFW Market Pulse data ────────────────────────────────────────────────────
// The single place to update the market numbers shown on the homepage.
//
// These figures are INDICATIVE and meant to be refreshed regularly (monthly is
// plenty). They are not a live MLS feed — update `lastUpdated` and the numbers
// below whenever you refresh them, and the homepage charts update automatically.
//
// Where to get fresh numbers each month:
//   • Mortgage rate  → Freddie Mac PMMS (freddiemac.com/pmms) or your lender
//   • Median price / days-on-market / months-supply → Texas Realtors / NTREIS
//     DFW market report, or your MLS market stats
//
// `history` arrays run oldest → newest and drive the trend charts. Keep ~6–12
// points. `value` is the headline (latest) number.

export type Trend = "up" | "down" | "flat";

export interface MarketStat {
  /** Latest headline value, preformatted for display (e.g. "$415K", "6.48%"). */
  value: string;
  /** Short label under the value. */
  label: string;
  /** Longer help text / context. */
  caption: string;
  /** Month-over-month direction, for the arrow + color. */
  trend: Trend;
  /** Change vs. previous point, preformatted (e.g. "+0.3%", "-4 days"). */
  change: string;
  /** Whether "up" should read as good (green) or bad (red) for this metric. */
  upIsGood: boolean;
  /** Oldest → newest numeric series for the sparkline. */
  history: number[];
  /** Labels aligned with `history` (e.g. month abbreviations). */
  historyLabels: string[];
}

export const MARKET = {
  area: "Dallas–Fort Worth",
  lastUpdated: "August 2026",
  source: "Freddie Mac PMMS · Texas Realtors / NTREIS (indicative)",

  stats: {
    rate: {
      value: "6.48%",
      label: "30-yr fixed rate",
      caption: "National average conforming rate. Your rate depends on credit, program, and points.",
      trend: "down",
      change: "-0.12%",
      upIsGood: false,
      history: [7.04, 6.91, 6.85, 6.72, 6.6, 6.48],
      historyLabels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    },
    price: {
      value: "$415K",
      label: "Median sale price",
      caption: "Median closed price across the DFW metro. Varies widely by city and neighborhood.",
      trend: "up",
      change: "+1.2%",
      upIsGood: true,
      history: [398, 402, 405, 409, 410, 415],
      historyLabels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    },
    dom: {
      value: "38",
      label: "Median days on market",
      caption: "How long a typical DFW listing takes to go under contract. Lower means a faster market.",
      trend: "down",
      change: "-4 days",
      upIsGood: false,
      history: [52, 49, 46, 43, 42, 38],
      historyLabels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    },
    supply: {
      value: "3.4 mo",
      label: "Months of inventory",
      caption: "Under ~4 months favors sellers; above ~6 favors buyers. DFW is roughly balanced-to-seller.",
      trend: "up",
      change: "+0.2 mo",
      upIsGood: true,
      history: [2.6, 2.8, 3.0, 3.1, 3.2, 3.4],
      historyLabels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    },
  },
} as const satisfies {
  area: string;
  lastUpdated: string;
  source: string;
  stats: Record<string, MarketStat>;
};
