/**
 * POST /api/canada/batch
 * Organizer paper-batch logging (aggregate counts only — not individual names).
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const count = Math.min(500, Math.max(1, parseInt(body.count, 10) || 0));
  if (!count) return json({ error: 'count required (1–500)' }, 400);
  if (body.attestation !== true) return json({ error: 'attestation required' }, 400);

  const province = body.province ? String(body.province).slice(0, 8).toUpperCase() : null;
  const event = body.event ? String(body.event).slice(0, 80) : null;
  const method = 'paper';

  if (!env.PETITION_KV) {
    return json({ ok: false, error: 'API not configured', localOnly: true }, 503);
  }

  const statsRaw = await env.PETITION_KV.get('stats:v1');
  const stats = statsRaw ? JSON.parse(statsRaw) : { total: 0, byProvince: {}, byMethod: {} };
  stats.total = (stats.total || 0) + count;
  if (province) stats.byProvince[province] = (stats.byProvince[province] || 0) + count;
  stats.byMethod[method] = (stats.byMethod[method] || 0) + count;
  stats.paperBatches = (stats.paperBatches || 0) + 1;
  stats.updated = Date.now();
  await env.PETITION_KV.put('stats:v1', JSON.stringify(stats));

  const batchId = `batch-${Date.now().toString(36)}`;
  await env.PETITION_KV.put(`batch:${batchId}`, JSON.stringify({
    id: batchId, count, province, event, method, ts: Date.now(),
  }));

  return json({
    ok: true,
    id: batchId,
    count,
    total: stats.total,
    track: 'campaign',
    legalNote: 'Paper batch is a campaign log only unless sheets are presented by an MP.',
  });
}
