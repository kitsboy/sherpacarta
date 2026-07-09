/**
 * POST /api/canada/sign
 * Privacy-first campaign signature intake (NOT Parliamentary e-petition).
 * Env: PETITION_KV (KV namespace) optional — without it returns 503 with clear message.
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const METHODS = new Set(['moral', 'passkey', 'nostr', 'ed25519', 'paper', 'sha256-receipt']);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const receiptHash = String(body.receiptHash || '').toLowerCase().replace(/[^a-f0-9]/g, '');
  if (receiptHash.length !== 64) {
    return json({ error: 'receiptHash must be 64 hex chars (SHA-256)' }, 400);
  }

  if (body.attestation !== true) {
    return json({ error: 'attestation required (Canadian citizen or resident)' }, 400);
  }

  const method = String(body.method || 'moral').slice(0, 32);
  if (!METHODS.has(method) && method !== 'moral') {
    // allow known primary methods
  }

  const province = body.province ? String(body.province).slice(0, 8).toUpperCase() : null;
  const displayName = body.displayName ? String(body.displayName).slice(0, 40) : null;
  const nostrEventId = body.nostrEventId ? String(body.nostrEventId).slice(0, 128) : null;
  const ts = Number(body.ts) || Date.now();
  const id = receiptHash.slice(0, 16);

  const record = {
    id,
    receiptHash,
    method,
    methods: Array.isArray(body.methods) ? body.methods.slice(0, 6).map(String) : [method],
    province,
    attestation: true,
    displayName,
    nostrEventId,
    track: 'campaign',
    ts,
    createdAt: Date.now(),
  };

  // KV preferred
  if (env.PETITION_KV) {
    const existing = await env.PETITION_KV.get(`sig:${receiptHash}`);
    if (existing) {
      return json({ ok: true, duplicate: true, id, message: 'Already recorded' });
    }
    await env.PETITION_KV.put(`sig:${receiptHash}`, JSON.stringify(record));

    // maintain aggregate
    const statsRaw = await env.PETITION_KV.get('stats:v1');
    const stats = statsRaw ? JSON.parse(statsRaw) : { total: 0, byProvince: {}, byMethod: {} };
    stats.total = (stats.total || 0) + 1;
    if (province) stats.byProvince[province] = (stats.byProvince[province] || 0) + 1;
    stats.byMethod[method] = (stats.byMethod[method] || 0) + 1;
    stats.updated = Date.now();
    await env.PETITION_KV.put('stats:v1', JSON.stringify(stats));

    // optional recent list (no PII beyond optional displayName)
    if (displayName) {
      const recentRaw = await env.PETITION_KV.get('recent:v1');
      const recent = recentRaw ? JSON.parse(recentRaw) : [];
      recent.unshift({ id, displayName, province, method, ts });
      await env.PETITION_KV.put('recent:v1', JSON.stringify(recent.slice(0, 50)));
    }

    return json({ ok: true, id, remote: true, track: 'campaign' });
  }

  // D1 fallback
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
      const existing = await env.DB.prepare('SELECT id FROM campaign_sigs WHERE receipt_hash = ?').bind(receiptHash).first();
      if (existing) return json({ ok: true, duplicate: true, id: existing.id });
      await env.DB.prepare(
        `INSERT INTO campaign_sigs (receipt_hash, id, method, province, display_name, nostr_event_id, ts, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(receiptHash, id, method, province, displayName, nostrEventId, ts, Date.now()).run();
      return json({ ok: true, id, remote: true, track: 'campaign', store: 'd1' });
    } catch (e) {
      return json({ error: 'DB error', detail: String(e.message || e) }, 500);
    }
  }

  return json({
    ok: false,
    error: 'Campaign API not configured',
    hint: 'Bind PETITION_KV or D1 DB in wrangler.toml / Cloudflare Pages settings',
    track: 'campaign',
    localOnly: true,
  }, 503);
}
