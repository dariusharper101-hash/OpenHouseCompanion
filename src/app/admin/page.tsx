import fs from "fs/promises";
import path from "path";
import type { Lead, BuyerTimeline } from "@/types/lead";
import LogoutButton from "./LogoutButton";

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

async function getLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    const leads = JSON.parse(raw) as Lead[];
    return leads.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

const TIMELINE_LABELS: Record<BuyerTimeline, string> = {
  asap: "ASAP",
  "1-3-months": "1–3 mo",
  "3-6-months": "3–6 mo",
  "6-12-months": "6–12 mo",
  "just-browsing": "Browsing",
};

const TIMELINE_COLORS: Record<BuyerTimeline, string> = {
  asap: "bg-green-500/20 text-green-300 border-green-500/30",
  "1-3-months": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "3-6-months": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "6-12-months": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "just-browsing": "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl px-5 py-4">
      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const leads = await getLeads();

  const preApproved = leads.filter((l) => l.isPreApproved).length;
  const hotLeads = leads.filter((l) =>
    ["asap", "1-3-months"].includes(l.timeline)
  ).length;
  const sources = [...new Set(leads.map((l) => l.source).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-blue-300 text-xs font-medium tracking-wide">
                Open House Companion
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">Leads Dashboard</h1>
          </div>
          <LogoutButton />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Leads" value={leads.length} />
          <StatCard label="Hot Leads" value={hotLeads} />
          <StatCard label="Pre-Approved" value={preApproved} />
          <StatCard label="Sources" value={sources.length || "—"} />
        </div>

        {/* Table */}
        {leads.length === 0 ? (
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-sm">No leads yet. Share your form link on social media to start collecting leads.</p>
          </div>
        ) : (
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60">
                    {["Name", "Contact", "Timeline", "Budget", "Preferences", "Source", "Date"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      {/* Name */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-white">
                          {lead.firstName} {lead.lastName}
                        </div>
                        {lead.isPreApproved && (
                          <span className="text-xs text-green-400">✓ Pre-approved</span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <div className="text-slate-300">{lead.email}</div>
                        <div className="text-slate-500 text-xs">{lead.phone}</div>
                      </td>

                      {/* Timeline */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-xs font-medium ${TIMELINE_COLORS[lead.timeline]}`}
                        >
                          {TIMELINE_LABELS[lead.timeline]}
                        </span>
                      </td>

                      {/* Budget */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-300 text-xs">
                        {lead.budgetMin || lead.budgetMax
                          ? `${lead.budgetMin || "—"} → ${lead.budgetMax || "—"}`
                          : <span className="text-slate-600">—</span>}
                      </td>

                      {/* Preferences */}
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px]">
                        <div className="space-y-0.5">
                          {lead.propertyType !== "any" && (
                            <div className="capitalize">{lead.propertyType}</div>
                          )}
                          {(lead.bedrooms || lead.bathrooms) && (
                            <div>
                              {lead.bedrooms && `${lead.bedrooms} bd`}
                              {lead.bedrooms && lead.bathrooms && " · "}
                              {lead.bathrooms && `${lead.bathrooms} ba`}
                            </div>
                          )}
                          {lead.neighborhoods && (
                            <div className="truncate text-slate-500" title={lead.neighborhoods}>
                              {lead.neighborhoods}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-400 capitalize">
                          {lead.source || "direct"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes drawer — only show leads that left notes */}
        {leads.some((l) => l.notes) && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Notes from Leads
            </h2>
            {leads
              .filter((l) => l.notes)
              .map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      {lead.firstName} {lead.lastName}
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(lead.createdAt)}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{lead.notes}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
