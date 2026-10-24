import { adminGuard } from "@/lib/admin-auth";
import { readLeads, leadsToCsv } from "@/lib/leads";

export async function GET(req: Request) {
  const denied = adminGuard(req);
  if (denied) return denied;
  const leads = await readLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const csv = leadsToCsv(leads);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
    },
  });
}
