import type { Metadata } from "next";
import Nav from "@/components/nav";
import { AgentAvatar, SocialLinks } from "@/components/agent-card";
import CopyShare from "@/components/copy-share";
import { AGENT } from "@/config/agent";
import {
  HOMES,
  LIST_META,
  groupedHomes,
  formatTextList,
  fullAddress,
  formatPrice,
  domLabel,
  homeSlug,
  publicNote,
  type Home,
} from "@/data/houseList";

export const metadata: Metadata = {
  title: `${LIST_META.name} — ${AGENT.appName}`,
  description: `A curated set of ${HOMES.length} homes across Dallas, organized by area and days on market.`,
};

const STATUS_STYLE: Record<Home["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  "coming-soon": "bg-blue-500/15 text-blue-300 border-blue-400/30",
  sold: "bg-slate-500/15 text-slate-300 border-slate-400/30",
};

const STATUS_LABEL: Record<Home["status"], string> = {
  active: "Active",
  pending: "Pending",
  "coming-soon": "Coming soon",
  sold: "Sold",
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-3 py-1.5">
      <span className="text-white font-semibold text-sm leading-none">{value}</span>
      <span className="text-slate-500 text-[11px] uppercase tracking-wide mt-1">{label}</span>
    </div>
  );
}

function HouseCard({ home }: { home: Home }) {
  const price = formatPrice(home.price);
  const note = publicNote(home);
  const stats: { value: string; label: string }[] = [];
  if (home.beds != null) stats.push({ value: String(home.beds), label: "Beds" });
  if (home.baths != null) stats.push({ value: String(home.baths), label: "Baths" });
  if (home.sqft != null) stats.push({ value: home.sqft.toLocaleString("en-US"), label: "Sq Ft" });

  return (
    <div
      id={homeSlug(home)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 transition-colors print:break-inside-avoid print:border-slate-300"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
        {home.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={home.photo}
            alt={fullAddress(home)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-600">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
            </svg>
            <span className="text-[11px] uppercase tracking-wider">Photo coming soon</span>
          </div>
        )}

        {/* Status + DOM badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${STATUS_STYLE[home.status]}`}>
            {STATUS_LABEL[home.status]}
          </span>
          <span className="rounded-full border border-white/20 bg-slate-900/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {domLabel(home.daysOnMarket)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-white font-semibold leading-tight">{home.street}</h3>
            <p className="text-slate-400 text-sm">
              {home.city}, {home.state} {home.zip}
            </p>
          </div>
          {price && <span className="whitespace-nowrap text-blue-400 font-bold">{price}</span>}
        </div>

        {stats.length > 0 && (
          <div className="mt-3 flex divide-x divide-slate-700 self-start rounded-lg border border-slate-700 bg-slate-900/40">
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        )}

        {note && <p className="mt-3 text-sm text-slate-300">{note}</p>}

        <a
          href={home.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 print:hidden"
        >
          View listing &amp; photos
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
        {/* Printed copies can't click — show the link as text */}
        <span className="mt-2 hidden break-all text-[11px] text-slate-500 print:block">{home.link}</span>
      </div>
    </div>
  );
}

export default function ListPage() {
  const groups = groupedHomes(HOMES);
  const textList = formatTextList(HOMES);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Nav />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-1.5">
            <span className="text-sm font-medium text-blue-300">Curated Home List</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold text-white">{LIST_META.name}</h1>
          <p className="mt-2 text-slate-400">
            {HOMES.length} homes across Dallas · organized by area and days on market · Updated{" "}
            {LIST_META.updatedOn}
          </p>

          <div className="mt-6 print:hidden">
            <CopyShare textList={textList} />
          </div>
        </header>

        {/* Groups */}
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.neighborhood}>
              <div className="mb-4 flex items-center gap-3">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <h2 className="text-xl font-bold text-white">{group.neighborhood}</h2>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                  {group.homes.length} {group.homes.length === 1 ? "home" : "homes"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.homes.map((home) => (
                  <HouseCard key={homeSlug(home)} home={home} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Agent footer */}
        <footer className="mt-16 rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <AgentAvatar size={72} />
            <div className="flex-1">
              <p className="text-lg font-semibold text-white">
                {AGENT.name}
                {AGENT.title && <span className="text-blue-400">, {AGENT.title}</span>}
              </p>
              {AGENT.brokerage && <p className="text-sm text-slate-400">{AGENT.brokerage}</p>}
              <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm sm:justify-start">
                {AGENT.phone && (
                  <a href={`tel:${AGENT.phone.replace(/[^\d+]/g, "")}`} className="text-blue-400 hover:text-blue-300">
                    {AGENT.phone}
                  </a>
                )}
                {AGENT.email && (
                  <a href={`mailto:${AGENT.email}`} className="text-blue-400 hover:text-blue-300">
                    {AGENT.email}
                  </a>
                )}
              </div>
            </div>
            <SocialLinks />
          </div>
          {AGENT.licenseNumber && (
            <p className="mt-4 text-center text-xs text-slate-600 sm:text-left">
              TREC License #{AGENT.licenseNumber}. Information deemed reliable but not guaranteed — verify all
              details independently.
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
