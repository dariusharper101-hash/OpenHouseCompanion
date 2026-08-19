"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import HousePresentation, { AgentFooter } from "@/components/house-cards";
import {
  DEFAULT_PAYLOAD,
  blankHome,
  encodePayload,
  formatTextList,
  type Home,
  type HomeStatus,
  type ListPayload,
} from "@/data/houseList";

const STORAGE_KEY = "houseListBuilder.v1";

const STATUS_OPTIONS: { value: HomeStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "coming-soon", label: "Coming soon" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
];

// Parse "416 Mount Auburn Ave, Dallas, TX 75223" into parts. Falls back to
// treating the whole line as the street if it doesn't match.
function parseAddress(line: string): Partial<Home> {
  const m = line.match(/^(.*?),\s*([^,]+),\s*([A-Za-z]{2})\.?\s+(\d{5})/);
  if (m) {
    return { street: m[1].trim(), city: m[2].trim(), state: m[3].toUpperCase(), zip: m[4] };
  }
  return { street: line.trim() };
}

// Turn a pasted "address / link / address / link" block into homes.
function parseBulk(text: string): Home[] {
  const homes: Home[] = [];
  let current: Home | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (/^https?:\/\//i.test(line)) {
      if (current) current.link = line;
      continue;
    }
    current = { ...blankHome(), ...parseAddress(line) };
    homes.push(current);
  }
  return homes;
}

function loadSaved(): ListPayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ListPayload) : null;
  } catch {
    return null;
  }
}

// ─── Small field helpers ──────────────────────────────────────────────────────
const inputBase =
  "w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none";

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      />
    </label>
  );
}

function numToInput(n: number | null): string {
  return n == null ? "" : String(n);
}
function inputToNum(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function ListBuilder() {
  const [payload, setPayload] = useState<ListPayload>(DEFAULT_PAYLOAD);
  const [bulk, setBulk] = useState("");
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string>("");

  // Restore any in-progress list from the browser on first load.
  useEffect(() => {
    const saved = loadSaved();
    // Restore browser-saved draft after mount (localStorage is client-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved && Array.isArray(saved.homes)) setPayload(saved);
    setOrigin(window.location.origin);
  }, []);

  // Autosave to the browser whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota errors */
    }
  }, [payload]);

  const clientLink = useMemo(
    () => `${origin}/list#d=${encodeURIComponent(encodePayload(payload))}`,
    [origin, payload],
  );
  const textList = useMemo(() => formatTextList(payload.homes, payload), [payload]);

  // ── mutations ──
  function setMeta(patch: Partial<ListPayload>) {
    setPayload((p) => ({ ...p, ...patch }));
  }
  function updateHome(i: number, patch: Partial<Home>) {
    setPayload((p) => ({
      ...p,
      homes: p.homes.map((h, idx) => (idx === i ? { ...h, ...patch } : h)),
    }));
  }
  function addHome() {
    setPayload((p) => ({ ...p, homes: [...p.homes, blankHome()] }));
  }
  function removeHome(i: number) {
    setPayload((p) => ({ ...p, homes: p.homes.filter((_, idx) => idx !== i) }));
  }
  function moveHome(i: number, dir: -1 | 1) {
    setPayload((p) => {
      const homes = [...p.homes];
      const j = i + dir;
      if (j < 0 || j >= homes.length) return p;
      [homes[i], homes[j]] = [homes[j], homes[i]];
      return { ...p, homes };
    });
  }
  function importBulk() {
    const parsed = parseBulk(bulk);
    if (parsed.length === 0) return;
    setPayload((p) => ({ ...p, homes: [...p.homes, ...parsed] }));
    setBulk("");
  }
  function resetToDefault() {
    if (confirm("Replace the current list with Jo's default list?")) setPayload(DEFAULT_PAYLOAD);
  }
  function clearAll() {
    if (confirm("Remove all homes and start blank?"))
      setPayload({ name: "My House List", updatedOn: todayLabel(), homes: [] });
  }

  async function copy(text: string, tag: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(tag);
    setTimeout(() => setCopied(""), 1800);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28">
      {/* Intro */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-1.5">
          <span className="text-sm font-medium text-blue-300">Agent Tool · not shown to clients</span>
        </div>
        <h1 className="mt-5 text-3xl font-bold text-white">House List Builder</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Enter your homes below, then copy the <strong className="text-slate-200">client link</strong> and send it
          by text, email, or social. The client opens the link and sees only the finished presentation — grouped
          by area and sorted by days on market. Your work saves automatically in this browser.
        </p>
      </header>

      {/* Action bar */}
      <div className="sticky top-16 z-40 mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/90 p-3 backdrop-blur">
        <button
          onClick={() => copy(clientLink, "link")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500"
        >
          {copied === "link" ? "✓ Client link copied!" : "Copy client link"}
        </button>
        <button
          onClick={() => copy(textList, "text")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700"
        >
          {copied === "text" ? "✓ Text copied!" : "Copy text version"}
        </button>
        <a
          href={clientLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700"
        >
          Preview client view ↗
        </a>
        <div className="ml-auto flex gap-2">
          <button onClick={resetToDefault} className="rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white">
            Reset to Jo&apos;s list
          </button>
          <button onClick={clearAll} className="rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-red-300">
            Clear all
          </button>
        </div>
      </div>

      {/* List meta */}
      <section className="mb-8 grid gap-4 rounded-2xl border border-slate-700 bg-slate-800/40 p-5 sm:grid-cols-2">
        <TextField label="List name" value={payload.name} onChange={(v) => setMeta({ name: v })} placeholder="Jo's House List" />
        <TextField label="Updated date (shown to client)" value={payload.updatedOn} onChange={(v) => setMeta({ updatedOn: v })} placeholder="August 19, 2026" />
      </section>

      {/* Bulk import */}
      <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/40 p-5">
        <h2 className="text-sm font-semibold text-white">Quick add — paste a list</h2>
        <p className="mt-1 text-xs text-slate-500">
          Paste address + link pairs (one per line, like the list you already have). Each address becomes a home.
          You can fill in price, photos, and days on market afterward.
        </p>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          rows={5}
          placeholder={"416 Mount Auburn Ave, Dallas, TX 75223\nhttps://us-east.prospects.com/prospects/m.do?tk=...\n\n1904 McBroom St, Dallas, TX 75212\nhttps://us-east.prospects.com/prospects/m.do?tk=..."}
          className={`${inputBase} mt-3 font-mono text-xs`}
        />
        <button
          onClick={importBulk}
          className="mt-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700"
        >
          Add pasted homes
        </button>
      </section>

      {/* Homes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Homes <span className="text-sm font-normal text-slate-500">({payload.homes.length})</span>
          </h2>
          <button onClick={addHome} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            + Add home
          </button>
        </div>

        {payload.homes.map((home, i) => (
          <div key={i} className="rounded-2xl border border-slate-700 bg-slate-800/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white">
                {i + 1}. {home.street || "New home"}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => moveHome(i, -1)} disabled={i === 0} className="rounded px-2 py-1 text-slate-400 hover:text-white disabled:opacity-30" title="Move up">↑</button>
                <button onClick={() => moveHome(i, 1)} disabled={i === payload.homes.length - 1} className="rounded px-2 py-1 text-slate-400 hover:text-white disabled:opacity-30" title="Move down">↓</button>
                <button onClick={() => removeHome(i)} className="rounded px-2 py-1 text-slate-500 hover:text-red-300" title="Remove">✕</button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2 lg:col-span-4">
                <TextField label="Street address" value={home.street} onChange={(v) => updateHome(i, { street: v })} placeholder="416 Mount Auburn Ave" />
              </div>
              <TextField label="City" value={home.city} onChange={(v) => updateHome(i, { city: v })} />
              <TextField label="State" value={home.state} onChange={(v) => updateHome(i, { state: v })} />
              <TextField label="ZIP (sets the area group)" value={home.zip} onChange={(v) => updateHome(i, { zip: v })} placeholder="75223" />
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">Status</span>
                <select value={home.status} onChange={(e) => updateHome(i, { status: e.target.value as HomeStatus })} className={inputBase}>
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>

              <div className="sm:col-span-2 lg:col-span-4">
                <TextField label="Listing link" value={home.link} onChange={(v) => updateHome(i, { link: v })} placeholder="https://…" />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <TextField label="Best photo URL (or /listings/file.jpg)" value={home.photo} onChange={(v) => updateHome(i, { photo: v })} placeholder="https://… or leave blank" />
              </div>

              <TextField label="Price ($)" type="number" value={numToInput(home.price)} onChange={(v) => updateHome(i, { price: inputToNum(v) })} placeholder="510000" />
              <TextField label="Days on market" type="number" value={numToInput(home.daysOnMarket)} onChange={(v) => updateHome(i, { daysOnMarket: inputToNum(v) })} placeholder="7" />
              <TextField label="Beds" type="number" value={numToInput(home.beds)} onChange={(v) => updateHome(i, { beds: inputToNum(v) })} placeholder="4" />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Baths" type="number" value={numToInput(home.baths)} onChange={(v) => updateHome(i, { baths: inputToNum(v) })} placeholder="3.5" />
                <TextField label="Sq ft" type="number" value={numToInput(home.sqft)} onChange={(v) => updateHome(i, { sqft: inputToNum(v) })} placeholder="2701" />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <TextField label="Highlight note (optional)" value={home.note} onChange={(v) => updateHome(i, { note: v })} placeholder="New construction · corner lot" />
              </div>
            </div>
          </div>
        ))}

        {payload.homes.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
            No homes yet — paste a list above or click “Add home”.
          </p>
        )}
      </section>

      {/* Live preview */}
      <section className="mt-14">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Live preview</h2>
          <span className="text-xs text-slate-500">— exactly what the client sees</span>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 sm:p-6">
          <h3 className="text-2xl font-bold text-white">{payload.name}</h3>
          <p className="mb-6 mt-1 text-sm text-slate-400">
            {payload.homes.length} {payload.homes.length === 1 ? "home" : "homes"} · Updated {payload.updatedOn}
          </p>
          <HousePresentation homes={payload.homes} />
          <AgentFooter />
        </div>
      </section>

      <p className="mt-8 text-center">
        <Link href="/list" className="text-xs text-slate-600 hover:text-slate-400">
          ← Back to default list
        </Link>
      </p>
    </div>
  );
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
