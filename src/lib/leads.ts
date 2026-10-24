import { storageMode } from "./storage-config";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Lead, LeadFormData, LeadStatus, LeadProduct } from "@/types/lead";

// ─── Backend selection ────────────────────────────────────────────────────────
// Supabase is mandatory outside explicitly opted-in local development.
// Misconfiguration fails before a lead is read or written.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;


const TABLE = "leads";

let _client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// Row shape in the `leads` table: a few promoted columns for filtering/sorting,
// plus the full form payload in a jsonb `data` column (resilient to form changes).
interface LeadRow {
  id: string;
  created_at: string;
  status: LeadStatus;
  product: LeadProduct;
  data: LeadFormData;
}

function rowToLead(row: LeadRow): Lead {
  return {
    ...row.data,
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    product: row.product,
  };
}

// ─── File fallback ────────────────────────────────────────────────────────────
// Explicit development-only storage. Never used by production or Vercel previews.

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function readFileLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeFileLeads(leads: Lead[]): Promise<void> {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function readLeads(): Promise<Lead[]> {
  if (storageMode() === "supabase") {
    const { data, error } = await db()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return (data as LeadRow[]).map(rowToLead);
  }
  const leads = await readFileLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return leads;
}

export async function addLead(input: LeadFormData): Promise<Lead> {
  const product: LeadProduct = input.product ?? "open-house";
  const data: LeadFormData = { ...input, product };
  const lead: Lead = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  if (storageMode() === "supabase") {
    const { error } = await db().from(TABLE).insert({
      id: lead.id,
      created_at: lead.createdAt,
      status: lead.status,
      product,
      data,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
  } else {
    const leads = await readFileLeads();
    leads.push(lead);
    await writeFileLeads(leads);
  }
  return lead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead | null> {
  if (storageMode() === "supabase") {
    const { data, error } = await db()
      .from(TABLE)
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    return data ? rowToLead(data as LeadRow) : null;
  }

  const leads = await readFileLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  await writeFileLeads(leads);
  return lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  if (storageMode() === "supabase") {
    const { data, error } = await db()
      .from(TABLE)
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
    return Boolean(data && data.length > 0);
  }

  const leads = await readFileLeads();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) return false; // nothing removed
  await writeFileLeads(next);
  return true;
}

// Single lead by id, or null.
export async function getLeadById(id: string): Promise<Lead | null> {
  if (storageMode() === "supabase") {
    const { data, error } = await db().from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return data ? rowToLead(data as LeadRow) : null;
  }
  return (await readFileLeads()).find((l) => l.id === id) ?? null;
}

// Replace a lead's stored payload (and optionally its status). Used by the
// specials guide to record consent changes; id/createdAt never change.
export async function updateLeadData(
  id: string,
  data: LeadFormData,
  status?: LeadStatus
): Promise<void> {
  if (storageMode() === "supabase") {
    const { error } = await db()
      .from(TABLE)
      .update({ data, ...(status ? { status } : {}) })
      .eq("id", id);
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    return;
  }
  const leads = await readFileLeads();
  const i = leads.findIndex((l) => l.id === id);
  if (i === -1) return;
  const { id: keepId, createdAt, status: oldStatus } = leads[i];
  leads[i] = { ...data, id: keepId, createdAt, status: status ?? oldStatus };
  await writeFileLeads(leads);
}

// The stored payload of a lead (drops the row-level fields).
export function leadData(lead: Lead): LeadFormData {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, status, ...data } = lead;
  return data;
}

// True when storage is configured: Supabase, or the explicit local-dev file
// store (storageMode() never allows files on Vercel or in production). The
// specials endpoint refuses leads otherwise rather than silently losing them.
export function hasDurableStore(): boolean {
  try {
    storageMode();
    return true;
  } catch {
    return false;
  }
}

// Most recent lead for this product + phone within `days`, or null. Used for
// the specials guide's 30-day dedupe (one person, one tracker row). Leads with
// status "lost" (e.g. superseded typo'd numbers) are skipped, so the real
// owner of that number gets a fresh lead instead of a "duplicate". `phone`
// must already be normalized (+1XXXXXXXXXX), which is how /api/specials stores it.
export async function findRecentByPhone(
  phone: string,
  product: LeadProduct,
  days: number
): Promise<Lead | null> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  if (storageMode() === "supabase") {
    const { data, error } = await db()
      .from(TABLE)
      .select("*")
      .eq("product", product)
      .eq("data->>phone", phone)
      .neq("status", "lost")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(`Supabase lookup failed: ${error.message}`);
    return data ? rowToLead(data as LeadRow) : null;
  }

  const leads = await readFileLeads();
  return (
    leads
      .filter((l) => l.product === product && l.phone === phone && l.status !== "lost" && l.createdAt >= since)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
  );
}

// ─── CSV export ─────────────────────────────────────────────────────────────

// `get` overrides the plain field lookup for derived / nested values.
const CSV_COLUMNS: { key: keyof Lead; label: string; get?: (l: Lead) => unknown }[] = [
  { key: "createdAt", label: "Date" },
  { key: "product", label: "Product" },
  { key: "status", label: "Status" },
  { key: "role", label: "Role" },
  { key: "clientType", label: "Client Type" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "timeline", label: "Buyer Timeline" },
  { key: "isPreApproved", label: "Pre-Approved" },
  { key: "budgetMin", label: "Budget Min" },
  { key: "budgetMax", label: "Budget Max" },
  { key: "propertyType", label: "Property Type" },
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "neighborhoods", label: "Areas" },
  { key: "purchasePurpose", label: "Purchase Purpose" },
  { key: "ownedHomeLast3Years", label: "Owned Last 3 Yrs" },
  { key: "isVeteran", label: "Veteran" },
  { key: "employmentType", label: "Employment" },
  { key: "creditRange", label: "Credit Range" },
  { key: "investorStrategy", label: "Investor Strategy" },
  { key: "propertiesOwned", label: "Properties Owned" },
  { key: "sellerAddress", label: "Seller Address" },
  { key: "sellerEstimatedValue", label: "Seller Est. Value" },
  { key: "sellerMortgageStatus", label: "Seller Mortgage Status" },
  { key: "sellerReason", label: "Seller Reason" },
  { key: "sellerTimeline", label: "Seller Timeline" },
  { key: "buyingSimultaneously", label: "Buying Simultaneously" },
  { key: "iabsAcknowledged", label: "IABS Ack" },
  { key: "buyerRepAcknowledged", label: "Buyer Rep Ack" },
  { key: "notes", label: "Notes" },
  { key: "source", label: "Source" },
  { key: "moveMonth", label: "Move Month" },
  { key: "consent", label: "Text Consent", get: (l) => (l.consent ? (l.consent.tcpa ? "Yes" : "No") : "") },
  { key: "consent", label: "Consent At", get: (l) => l.consent?.at ?? "" },
  { key: "consent", label: "Consent Version", get: (l) => l.consent?.version ?? "" },
];

function csvEscape(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  // CSV quoting alone does not stop spreadsheet formula evaluation. Preserve
  // stored values; mark potentially executable export cells as literal text.
  const str = /^[\s\u0000-\u001f]*[=+@-]/u.test(raw) || /^[\t\r\n]/u.test(raw)
    ? `'${raw}`
    : raw;
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Columns the specials guide never asks about. Blank for those rows so the
// export never shows an answer the renter didn't give.
const NOT_ASKED_BY_SPECIALS = new Set<keyof Lead>([
  "clientType", "timeline", "isPreApproved", "budgetMax", "propertyType",
  "bedrooms", "bathrooms", "purchasePurpose", "ownedHomeLast3Years", "isVeteran",
  "employmentType", "creditRange", "investorStrategy", "propertiesOwned",
  "sellerAddress", "sellerEstimatedValue", "sellerMortgageStatus", "sellerReason",
  "sellerTimeline", "buyingSimultaneously", "iabsAcknowledged", "buyerRepAcknowledged",
  "email",
]);

function csvCell(lead: Lead, c: (typeof CSV_COLUMNS)[number]): unknown {
  if (lead.product === "specials-guide" && NOT_ASKED_BY_SPECIALS.has(c.key)) return "";
  return c.get ? c.get(lead) : lead[c.key];
}

export function leadsToCsv(leads: Lead[]): string {
  const header = CSV_COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const rows = leads.map((lead) =>
    CSV_COLUMNS.map((c) => csvEscape(csvCell(lead, c))).join(",")
  );
  return [header, ...rows].join("\r\n");
}
