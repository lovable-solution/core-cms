/**
 * In-memory rolling-window rate limiter.
 * Good enough for single-region deployments; swap for Upstash/Redis in multi-region.
 */

type Entry = { hits: number[] };
const store = new Map<string, Entry>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const entry = store.get(key) ?? { hits: [] };
  entry.hits = entry.hits.filter((t) => t > cutoff);

  if (entry.hits.length >= limit) {
    const retryAfterMs = entry.hits[0] + windowMs - now;
    store.set(key, entry);
    return { ok: false, remaining: 0, retryAfterMs };
  }

  entry.hits.push(now);
  store.set(key, entry);

  // Opportunistic GC: if store grows, prune stale entries
  if (store.size > 5000) {
    for (const [k, v] of store.entries()) {
      v.hits = v.hits.filter((t) => t > cutoff);
      if (v.hits.length === 0) store.delete(k);
    }
  }

  return { ok: true, remaining: limit - entry.hits.length, retryAfterMs: 0 };
}
