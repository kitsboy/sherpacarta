/**
 * POST /api/canada/sign
 * Privacy-first campaign signature intake (NOT Parliamentary e-petition).
 * Env: PETITION_KV (KV namespace) optional — without it returns 503 with clear message.
 */
import {
  corsHeaders,
  json,
  clientIp,
  rateLimit,
  sanitizeDisplayName,
  updateStats,
} from './_shared.js';

const METHODS = new Set(['moral', 'passkey', 'nostr', 'ed25519', 'paper', 'sha256-receipt']);

export async function onRequest(context) {
  const { request, env } = context;
  const methods = 'POST, OPTIONS';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request, methods) });
  }
  if (request.method !== 'POST') {
    return json(request, { error: 'Method not allowed' }, 405, methods);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(request, { error: 'Invalid JSON' }, 400, methods);
  }

  const receiptHash = String(body.receiptHash || '')
    .toLowerCase()
    .replace(/[^a-f0-9]/g, '');
  if (receiptHash.length !== 64) {
    return json(request, { error: 'receiptHash must be 64 hex chars (SHA-256)' }, 400, methods);
  }

  if (body.attestation !== true) {
    return json(request, { error: 'attestation required (Canadian citizen or resident)' }, 400, methods);
  }

  let method = String(body.method || 'moral').slice(0, 32).toLowerCase();
  if (!METHODS.has(method)) {
    return json(request, { error: 'Invalid method', allowed: [...METHODS] }, 400, methods);
  }

  const province = body.province
    ? String(body.province).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) || null
    : null;
  const displayName = sanitizeDisplayName(body.displayName);
  const nostrEventId = body.nostrEventId
    ? String(body.nostrEventId).replace(/[^a-fA-F0-9]/g, '').slice(0, 128) || null
    : null;
  const ts = Number(body.ts) || Date.now();
  const id = receiptHash.slice(0, 16);

  // Rate limit: 12 signs / hour / IP (reduces bot inflation)
  if (env.PETITION_KV) {
    const ip = clientIp(request);
    const rl = await rateLimit(env.PETITION_KV, `sign:${ip}`, 12, 3600);
    if (!rl.ok) {
      return json(
        request,
        { error: 'Rate limit exceeded', retryAfterSec: Math.ceil((rl.reset - Date.now()) / 1000) },
        429,
        methods
      );
    }
  }

  const methodsList = Array.isArray(body.methods)
    ? body.methods
        .slice(0, 6)
        .map((m) => String(m).slice(0, 32).toLowerCase())
        .filter((m) => METHODS.has(m))
    : [method];
  if (!methodsList.length) methodsList.push(method);

  const record = {
    id,
    receiptHash,
    method,
    methods: methodsList,
    province,
    attestation: true,
    displayName,
    nostrEventId,
    track: 'campaign',
    ts,
    createdAt: Date.now(),
  };

  if (env.PETITION_KV) {
    const existing = await env.PETITION_KV.get(`sig:${receiptHash}`);
    if (existing) {
      return json(request, { ok: true, duplicate: true, id, message: 'Already recorded' }, 200, methods);
    }

    // Write signature first (idempotent key)
    await env.PETITION_KV.put(`sig:${receiptHash}`, JSON.stringify(record));

    const stats = await updateStats(env.PETITION_KV, (stats) => {
      stats.total = (stats.total || 0) + 1;
      if (province) stats.byProvince[province] = (stats.byProvince[province] || 0) + 1;
      stats.byMethod[method] = (stats.byMethod[method] || 0) + 1;
    });

    if (displayName) {
      const recentRaw = await env.PETITION_KV.get('recent:v1');
      const recent = recentRaw ? JSON.parse(recentRaw) : [];
      recent.unshift({ id, displayName, province, method, ts });
      await env.PETITION_KV.put('recent:v1', JSON.stringify(recent.slice(0, 50)));
    }

    return json(request, { ok: true, id, remote: true, track: 'campaign', total: stats.total }, 200, methods);
  }

  if (env.DB) {
    try {
      await env.DB.prepare(
        `CREATE TABLE IF NOT EXISTS campaign_sigs (
          receipt_hash TEXT PRIMARY KEY,
          id TEXT,
          method TEXT,
          province TEXT,
          display_name TEXT,
          nostr_event_id TEXT,
          ts INTEGER,
          created_at INTEGER
        )`
      ).run();
      const existing = await env.DB.prepare('SELECT id FROM campaign_sigs WHERE receipt_hash = ?')
        .bind(receiptHash)
        .first();
      if (existing) return json(request, { ok: true, duplicate: true, id: existing.id }, 200, methods);
      await env.DB.prepare(
        `INSERT INTO campaign_sigs (receipt_hash, id, method, province, display_name, nostr_event_id, ts, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(receiptHash, id, method, province, displayName, nostrEventId, ts, Date.now())
        .run();
      return json(request, { ok: true, id, remote: true, track: 'campaign', store: 'd1' }, 200, methods);
    } catch {
      return json(request, { error: 'Database unavailable' }, 500, methods);
    }
  }

  return json(
    request,
    {
      ok: false,
      error: 'Campaign API not configured',
      hint: 'Bind PETITION_KV or D1 DB in wrangler.toml / Cloudflare Pages settings',
      track: 'campaign',
      localOnly: true,
    },
    503,
    methods
  );
}
