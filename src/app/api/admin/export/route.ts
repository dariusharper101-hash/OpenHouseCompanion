import { readLeads, leadsToCsv } from "@/lib/leads";

export async function GET() {
  const leads = await readLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const csv = leadsToCsv(leads);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
    },
  });
}
