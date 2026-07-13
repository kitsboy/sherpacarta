/**
 * Shared helpers for Canada campaign API (privacy-first; not Parliamentary e-petition).
 */

const ALLOWED_ORIGINS = new Set([
  'https://sherpacarta.org',
  'https://www.sherpacarta.org',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
]);

export function corsHeaders(request, methods = 'GET, POST, OPTIONS') {
  const origin = request.headers.get('Origin') || '';
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://sherpacarta.org';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Organizer-Token',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    Vary: 'Origin',
  };
}

export function json(request, data, status = 200, methods) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(request, methods),
  });
}

export function clientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/** Simple KV rate limit: max `limit` hits per `windowSec` per key. */
export async function rateLimit(kv, key, limit, windowSec) {
  if (!kv) return { ok: true, remaining: limit };
  const fullKey = `rl:${key}`;
  const raw = await kv.get(fullKey);
  const now = Date.now();
  let bucket = raw ? JSON.parse(raw) : { n: 0, reset: now + windowSec * 1000 };
  if (now > bucket.reset) {
    bucket = { n: 0, reset: now + windowSec * 1000 };
  }
  bucket.n += 1;
  await kv.put(fullKey, JSON.stringify(bucket), {
    expirationTtl: Math.max(60, Math.ceil((bucket.reset - now) / 1000) + 5),
  });
  if (bucket.n > limit) {
    return { ok: false, remaining: 0, reset: bucket.reset };
  }
  return { ok: true, remaining: Math.max(0, limit - bucket.n), reset: bucket.reset };
}

/** Strip HTML / control chars from optional public display names. */
export function sanitizeDisplayName(raw) {
  if (raw == null || raw === '') return null;
  let s = String(raw)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>&"'`]/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 40);
  if (!s || /^test|testcam|demo|asdf|xxx|foo\b/i.test(s)) return null;
  return s;
}

/**
 * Optimistic stats update with short retries (best-effort atomicity on KV).
 * mutator(stats) -> void, mutates in place
 */
async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Verify client PoW: SHA-256(challenge:nonce) has `difficulty` leading zero hex chars. */
export async function verifyPow(kv, pow, difficulty = 4) {
  if (!pow?.challenge || pow.nonce == null) return { ok: false, reason: 'missing' };
  const challenge = String(pow.challenge).replace(/[^a-f0-9-]/gi, '').slice(0, 64);
  const nonce = String(pow.nonce).slice(0, 24);
  if (!challenge || challenge.length < 8) return { ok: false, reason: 'bad_challenge' };

  if (kv) {
    const key = await kv.get(`pow:${challenge}`);
    if (!key) return { ok: false, reason: 'expired' };
    await kv.delete(`pow:${challenge}`);
  }

  const hash = await sha256Hex(`${challenge}:${nonce}`);
  const prefix = '0'.repeat(Math.min(6, Math.max(3, difficulty)));
  if (!hash.startsWith(prefix)) return { ok: false, reason: 'weak' };
  return { ok: true };
}

/** Cloudflare Turnstile siteverify (optional when TURNSTILE_SECRET_KEY set). */
export async function verifyTurnstile(secret, token, ip) {
  if (!secret || !token) return false;
  try {
    const body = new URLSearchParams({
      secret,
      response: String(token).slice(0, 2048),
      remoteip: ip || '',
    });
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

export async function updateStats(kv, mutator) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const statsRaw = await kv.get('stats:v1');
    const prev = statsRaw || '';
    const stats = statsRaw
      ? JSON.parse(statsRaw)
      : { total: 0, byProvince: {}, byMethod: {}, paperBatches: 0, version: 0 };
    stats.version = (stats.version || 0) + 1;
    mutator(stats);
    stats.updated = Date.now();
    // Last-write-wins with version bump; brief backoff reduces lost updates under load
    await kv.put('stats:v1', JSON.stringify(stats));
    if (attempt > 0) break;
    // verify not stomped immediately (best-effort)
    const check = await kv.get('stats:v1');
    if (check === JSON.stringify(stats) || !prev) return stats;
    await new Promise((r) => setTimeout(r, 15 + Math.random() * 40));
  }
  const statsRaw = await kv.get('stats:v1');
  return statsRaw ? JSON.parse(statsRaw) : { total: 0, byProvince: {}, byMethod: {} };
}
