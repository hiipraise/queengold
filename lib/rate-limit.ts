/**
 * Rate limiter for the /verify endpoint.
 * Uses in-memory store by default; swap in Redis for production.
 *
 * Limits: 10 verify attempts per IP per 60 seconds.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

export function rateLimitVerify(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  let bucket = store.get(ip);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    store.set(ip, bucket);
  }

  bucket.count += 1;

  // Cleanup old entries periodically
  if (store.size > 5_000) {
    for (const [key, val] of Array.from(store.entries())) {
      if (now > val.resetAt) store.delete(key);
    }
  }

  const allowed = bucket.count <= MAX_REQUESTS;
  return {
    allowed,
    remaining: Math.max(0, MAX_REQUESTS - bucket.count),
    resetAt: bucket.resetAt,
  };
}
