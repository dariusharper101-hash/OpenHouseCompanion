// ─── In-memory rate limiter ───────────────────────────────────────────────────
// Sliding window per key (we key on client IP). Free and dependency-free, but
// per-instance: each serverless instance keeps its own counts and they reset
// on cold start. Good enough for a low-volume lead form; if the endpoint is
// abused, escalate to a Vercel Firewall rule or Cloudflare Turnstile.

const buckets = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 1000));
    return { ok: false, retryAfterSec };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Keep memory bounded: occasionally drop keys whose hits have all expired.
  if (buckets.size > 1000) {
    for (const [k, ts] of buckets) {
      if (ts.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return { ok: true, retryAfterSec: 0 };
}
