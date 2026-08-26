/**
 * POST /api/capture
 * Email capture backend for SherpaCarta waitlist + coalition interest.
 *
 * Wires the two previously-dead email inputs (#newsletter-email, #coalition-contact)
 * to a real backend. Privacy-first: stores only what the user submits
 * (email, optional org, timestamp) in PETITION_KV — no IPs, no analytics, no cookies.
 *
 * Bot defense: optional honeypot (_gotcha) + per-IP rate limit (reuses canada _shared).
 * Retrieval: family reads captured entries via CF KV API (see FIXES-LOG 2026-08-26).
 *
 * Body: { kind: 'waitlist' | 'coalition', email: string, org?: string, _gotcha?: string }
 */
import { corsHeaders, json, clientIp, rateLimit } from './canada/_shared.js';

const METHODS = 'POST, OPTIONS';
const KINDS = new Set(['waitlist', 'coalition']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WAITLIST_KEY = 'waitlist:v1';
const COALITION_KEY = 'coalition:v1';
const WAITLIST_CAP = 2000;
const COALITION_CAP = 400;

/** Strip HTML / control chars, cap length. */
function sanitize(raw, max = 200) {
  return String(raw ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>&"'`]/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
}

/** Prepend entry to a KV list, capped. */
async function appendEntry(kv, key, entry, cap) {
  const raw = await kv.get(key);
  const list = raw ? JSON.parse(raw) : [];
  list.unshift(entry);
  await kv.put(key, JSON.stringify(list.slice(0, cap)));
  return list.length;
}

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.PETITION_KV;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request, METHODS) });
  }
  if (request.method !== 'POST') {
    return json(request, { error: 'Method not allowed' }, 405, METHODS);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(request, { error: 'Invalid JSON' }, 400, METHODS);
  }

  // Honeypot: silently accept bots so they don't learn the trap
  if (body._gotcha) {
    return json(request, { ok: true, honey: true }, 200, METHODS);
  }

  const kind = sanitize(body.kind, 16).toLowerCase();
  if (!KINDS.has(kind)) {
    return json(request, { error: 'Invalid kind', allowed: [...KINDS] }, 400, METHODS);
  }

  const email = sanitize(body.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return json(request, { error: 'Invalid email' }, 400, METHODS);
  }

  const org = kind === 'coalition' ? sanitize(body.org, 120) : null;
  if (kind === 'coalition' && org.length < 2) {
    return json(request, { error: 'Organization name required' }, 400, METHODS);
  }

  const ip = clientIp(request);
  if (kv) {
    const rl = await rateLimit(kv, `cap:${ip}`, 10, 3600);
    if (!rl.ok) {
      return json(
        request,
        { error: 'Rate limit exceeded', retryAfterSec: Math.ceil((rl.reset - Date.now()) / 1000) },
        429,
        METHODS
      );
    }
  }

  const entry = { email, org, at: Date.now() };
  let total = 0;
  let deduped = false;

  if (kv) {
    const key = kind === 'waitlist' ? WAITLIST_KEY : COALITION_KEY;
    const raw = await kv.get(key);
    const list = raw ? JSON.parse(raw) : [];
    const existing = list.find((e) => e && e.email === email);
    if (existing) {
      deduped = true;
    } else {
      list.unshift(entry);
      await kv.put(key, JSON.stringify(list.slice(0, kind === 'waitlist' ? WAITLIST_CAP : COALITION_CAP)));
    }
    total = list.length;
  } else {
    return json(
      request,
      { ok: false, error: 'Capture API not configured', hint: 'Bind PETITION_KV in wrangler.toml / Cloudflare Pages settings' },
      503,
      METHODS
    );
  }

  return json(
    request,
    {
      ok: true,
      kind,
      email,
      org: kind === 'coalition' ? org : undefined,
      deduped,
      total,
      track: 'public_capture',
    },
    200,
    METHODS
  );
}
