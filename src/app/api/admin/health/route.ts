import { createClient } from "@supabase/supabase-js";
import { adminGuard } from "@/lib/admin-auth";
import { storageMode } from "@/lib/storage-config";
export async function GET(req: Request) {
  const denied = adminGuard(req);
  if (denied) return denied;
  try {
    const mode = storageMode();
    if (mode !== "supabase") return Response.json({ ready: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
    const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
    const { error } = await db.from("leads").select("id").limit(1).abortSignal(AbortSignal.timeout(5000));
    if (error) throw error;
    return Response.json({ ready: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ready: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
