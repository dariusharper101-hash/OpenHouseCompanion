import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Lead, LeadFormData, LeadStatus } from "@/types/lead";

// On Vercel the project filesystem is read-only; only /tmp is writable.
// Locally we persist to ./data. Note: /tmp is ephemeral per serverless
// instance, so the hosted preview is for demoing the UI, not durable storage.
const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

export async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

async function writeLeads(leads: Lead[]): Promise<void> {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

export async function addLead(data: LeadFormData): Promise<Lead> {
  const lead: Lead = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  const leads = await readLeads();
  leads.push(lead);
  await writeLeads(leads);
  return lead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead | null> {
  const leads = await readLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  await writeLeads(leads);
  return lead;
}

// ─── CSV export ─────────────────────────────────────────────────────────────

const CSV_COLUMNS: { key: keyof Lead; label: string }[] = [
  { key: "createdAt", label: "Date" },
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
