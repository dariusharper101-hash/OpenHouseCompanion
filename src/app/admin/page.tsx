"use client";

import { useState, useEffect, useMemo } from "react";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/types/lead";

// ─── Display helpers ──────────────────────────────────────────────────────────

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  contacted: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  active: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  closed: "bg-green-500/20 text-green-300 border-green-500/40",
  lost: "bg-slate-600/30 text-slate-400 border-slate-600",
};

const ROLE_LABELS: Record<string, string> = {
  buying: "Buying",
  selling: "Selling",
  both: "Buying & Selling",
};

const CLIENT_TYPE_LABELS: Record<string, string> = {
  "first-time-buyer": "First-Time Buyer",
  "move-up-buyer": "Move-Up Buyer",
  investor: "Investor",
  downsizing: "Downsizing",
  relocating: "Relocating",
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function cls(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

// ─── Detail drawer ────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value?: string | boolean | null }) {
  if (value === "" || value === null || value === undefined) return null;
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-700/60">
      <span className="text-slate-500 text-xs uppercase tracking-wide">{label}</span>
      <span className="text-slate-200 text-sm text-right">{display}</span>
    </div>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onStatusChange,
}: {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
}) {
  const isBuyer = lead.role === "buying" || lead.role === "both";
  const isSeller = lead.role === "selling" || lead.role === "both";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-800 border-l border-slate-700 h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">
              {lead.firstName} {lead.lastName}
            </h2>
            <p className="text-slate-500 text-xs">{fmtDate(lead.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status control */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(lead.id, s)}
                  className={cls(
                    "px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all",
                    lead.status === s
                      ? STATUS_STYLES[s]
                      : "bg-slate-700/40 text-slate-400 border-slate-600 hover:border-slate-500"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">Contact</h3>
            <div className="space-y-0">
              <DetailRow label="Email" value={lead.email} />
              <DetailRow label="Phone" value={lead.phone} />
              <DetailRow label="Source" value={lead.source} />
            </div>
            <div className="flex gap-2 mt-3">
              <a
                href={`mailto:${lead.email}`}
                className="flex-1 text-center py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                Email
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="flex-1 text-center py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
              >
                Call
              </a>
            </div>
          </div>

          {/* Situation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">Situation</h3>
            <div className="space-y-0">
              <DetailRow label="Role" value={ROLE_LABELS[lead.role]} />
              {isBuyer && <DetailRow label="Client Type" value={CLIENT_TYPE_LABELS[lead.clientType]} />}
            </div>
          </div>

          {/* Buyer details */}
          {isBuyer && (
            <div>
              <h3 className="text-white font-semibold text-sm mb-2">Buyer Details</h3>
              <div className="space-y-0">
                <DetailRow label="Timeline" value={lead.timeline} />
                <DetailRow label="Pre-Approved" value={lead.isPreApproved} />
                <DetailRow label="Budget" value={[lead.budgetMin, lead.budgetMax].filter(Boolean).join(" – ")} />
                <DetailRow label="Property Type" value={lead.propertyType !== "any" ? lead.propertyType : ""} />
                <DetailRow label="Bedrooms" value={lead.bedrooms} />
                <DetailRow label="Bathrooms" value={lead.bathrooms} />
                <DetailRow label="Areas" value={lead.neighborhoods} />
                <DetailRow label="Purchase Purpose" value={lead.purchasePurpose} />
                <DetailRow label="Owned Last 3 Yrs" value={lead.ownedHomeLast3Years} />
                <DetailRow label="Veteran" value={lead.isVeteran} />
                <DetailRow label="Employment" value={lead.employmentType} />
                <DetailRow label="Credit Range" value={lead.creditRange} />
                {lead.clientType === "investor" && (
                  <>
                    <DetailRow label="Investor Strategy" value={lead.investorStrategy} />
                    <DetailRow label="Properties Owned" value={lead.propertiesOwned} />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Seller details */}
          {isSeller && (
            <div>
              <h3 className="text-white font-semibold text-sm mb-2">Seller Details</h3>
              <div className="space-y-0">
                <DetailRow label="Address" value={lead.sellerAddress} />
                <DetailRow label="Est. Value" value={lead.sellerEstimatedValue} />
                <DetailRow label="Mortgage Status" value={lead.sellerMortgageStatus} />
                <DetailRow label="Reason" value={lead.sellerReason} />
                <DetailRow label="Timeline" value={lead.sellerTimeline} />
                <DetailRow label="Buying Too" value={lead.buyingSimultaneously} />
              </div>
            </div>
          )}

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">Legal Acknowledgments</h3>
            <div className="space-y-0">
              <DetailRow label="IABS" value={lead.iabsAcknowledged} />
              <DetailRow label="Buyer Rep" value={lead.buyerRepAcknowledged} />
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div>
              <h3 className="text-white font-semibold text-sm mb-2">Notes</h3>
              <p className="text-slate-300 text-sm bg-slate-700/40 rounded-lg p-3 leading-relaxed">
                {lead.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads");
      if (!res.ok) throw new Error("Failed to load leads");
      setLeads(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: LeadStatus) {
    // Optimistic update
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      loadLeads();
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (roleFilter !== "all" && l.role !== roleFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (q) {
        const hay = `${l.firstName} ${l.lastName} ${l.email} ${l.phone} ${l.neighborhoods} ${l.sellerAddress}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      active: leads.filter((l) => l.status === "active").length,
      closed: leads.filter((l) => l.status === "closed").length,
    };
  }, [leads]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Lead Dashboard</h1>
            <p className="text-slate-500 text-sm">Open House Companion — agent view</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadLeads}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Refresh
            </button>
            <a
              href="/api/admin/export"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
            >
              Export CSV
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Leads", value: stats.total, color: "text-white" },
            { label: "New", value: stats.new, color: "text-blue-400" },
            { label: "Active", value: stats.active, color: "text-purple-400" },
            { label: "Closed", value: stats.closed, color: "text-green-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className={cls("text-3xl font-bold", color)}>{value}</p>
              <p className="text-slate-500 text-xs uppercase tracking-wide mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search name, email, phone, area…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            <option value="all">All Roles</option>
            <option value="buying">Buying</option>
            <option value="selling">Selling</option>
            <option value="both">Both</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white capitalize focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            <option value="all">All Statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">Loading leads…</div>
          ) : error ? (
            <div className="py-16 text-center text-red-400 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              {leads.length === 0 ? "No leads yet. They'll show up here as they come in." : "No leads match your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-xs text-slate-500 uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Contact</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Timeline</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelected(lead)}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{lead.firstName} {lead.lastName}</p>
                        {(lead.role === "buying" || lead.role === "both") && (
                          <p className="text-slate-500 text-xs">{CLIENT_TYPE_LABELS[lead.clientType]}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{ROLE_LABELS[lead.role]}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-slate-300">{lead.email}</p>
                        <p className="text-slate-500 text-xs">{lead.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">
                        {lead.role === "selling" ? lead.sellerTimeline : lead.timeline}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cls(
                          "inline-block px-2.5 py-1 rounded-full border text-xs font-medium capitalize",
                          STATUS_STYLES[lead.status]
                        )}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell whitespace-nowrap">
                        {fmtDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && filtered.length > 0 && (
          <p className="text-slate-600 text-xs mt-3">
            Showing {filtered.length} of {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </p>
        )}
      </div>

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onStatusChange={changeStatus}
        />
      )}
    </div>
  );
}
