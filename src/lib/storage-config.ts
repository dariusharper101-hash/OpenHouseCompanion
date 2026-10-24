export class StorageConfigurationError extends Error {
  constructor() { super("Durable lead storage is not configured"); this.name = "StorageConfigurationError"; }
}
export function storageMode(): "supabase" | "local" {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (url && key) {
    try { if (new URL(url).protocol === "https:") return "supabase"; } catch { /* fail closed */ }
    throw new StorageConfigurationError();
  }
  // Partially configured databases must never silently divert writes elsewhere.
  if (url || key) throw new StorageConfigurationError();
  if (process.env.LEAD_STORAGE === "local" && process.env.NODE_ENV === "development" && !process.env.VERCEL && !process.env.VERCEL_ENV) return "local";
  throw new StorageConfigurationError();
}
