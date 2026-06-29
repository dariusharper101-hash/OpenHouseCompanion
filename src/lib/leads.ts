import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Lead, LeadFormData, LeadStatus, LeadProduct } from "@/types/lead";

// ─── Backend selection ────────────────────────────────────────────────────────
// If Supabase credentials are present we use the shared database (the real
// store that both products write to). Otherwise we fall back to local file
// storage so the app keeps working in dev / preview before Supabase is wired up.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

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
// On Vercel only /tmp is writable; locally we persist to ./data. /tmp is
// ephemeral, so this path is for dev/preview only — Supabase is the real store.

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function readFileLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

async function writeFileLeads(leads: Lead[]): Promise<void> {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function readLeads(): Promise<Lead[]> {
  if (useSupabase) {
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

  if (useSupabase) {
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
  if (useSupabase) {
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

// ─── CSV export ─────────────────────────────────────────────────────────────

const CSV_COLUMNS: { key: keyof Lead; label: string }[] = [
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
];

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function leadsToCsv(leads: Lead[]): string {
  const header = CSV_COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const rows = leads.map((lead) =>
    CSV_COLUMNS.map((c) => csvEscape(lead[c.key])).join(",")
  );
  return [header, ...rows].join("\r\n");
}
