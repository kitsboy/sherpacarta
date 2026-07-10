/**
 * POST /api/canada/batch
 * Organizer paper-batch logging (aggregate counts only — not individual names).
 *
 * Abuse controls:
 * - Optional ORGANIZER_TOKEN (env): when set, requires Authorization: Bearer <token>
 *   or X-Organizer-Token header.
 * - Always rate-limited per IP (3 / hour).
 * - Count capped at 100 per request.
 * - Paper counts track separately; still add to campaign total (documented as unverified).
 */
import {
  corsHeaders,
  json,
  clientIp,
  rateLimit,
  updateStats,
} from './_shared.js';

function authorize(request, env) {
  const required = env.ORGANIZER_TOKEN;
  // Always require a configured organizer secret — open batch logging is too easy to abuse
  if (!required) return { ok: false, reason: 'not_configured' };
  const auth = request.headers.get('Authorization') || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const header = request.headers.get('X-Organizer-Token') || '';
  if (bearer === required || header === required) return { ok: true, mode: 'token' };
  return { ok: false, reason: 'unauthorized' };
}

export async function onRequest(context) {
  const { request, env } = context;
  const methods = 'POST, OPTIONS';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request, methods) });
  }
  if (request.method !== 'POST') {
    return json(request, { error: 'Method not allowed' }, 405, methods);
  }

  // Hard gate: require ORGANIZER_TOKEN secret (Cloudflare Pages → Settings → Environment variables)
  const auth = authorize(request, env);
  if (!auth.ok) {
    const status = auth.reason === 'not_configured' ? 503 : 401;
    return json(
      request,
      {
        ok: false,
        error:
          auth.reason === 'not_configured'
            ? 'Paper batch API locked — set ORGANIZER_TOKEN in Cloudflare Pages secrets, then retry with X-Organizer-Token'
            : 'Unauthorized — send X-Organizer-Token or Authorization: Bearer <ORGANIZER_TOKEN>',
        localOnly: true,
        apiVersion: 'batch-v3-locked',
      },
      status,
      methods
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(request, { error: 'Invalid JSON' }, 400, methods);
  }

  const count = Math.min(100, Math.max(1, parseInt(body.count, 10) || 0));
  if (!count) return json(request, { error: 'count required (1–100)' }, 400, methods);
  if (body.attestation !== true) return json(request, { error: 'attestation required' }, 400, methods);

  const province = body.province
    ? String(body.province).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) || null
    : null;
  const event = body.event
    ? String(body.event)
        .replace(/[<>&"'`]/g, '')
        .replace(/[\u0000-\u001f\u007f]/g, '')
        .slice(0, 80)
    : null;
  const method = 'paper';

  if (!env.PETITION_KV) {
    return json(request, { ok: false, error: 'API not configured', localOnly: true }, 503, methods);
  }

  const ip = clientIp(request);
  const rl = await rateLimit(env.PETITION_KV, `batch:${ip}`, 3, 3600);
  if (!rl.ok) {
    return json(
      request,
      { error: 'Rate limit exceeded', retryAfterSec: Math.ceil((rl.reset - Date.now()) / 1000) },
      429,
      methods
    );
  }

  // Daily paper-volume cap per IP (anti-inflation)
  const dayKey = new Date().toISOString().slice(0, 10);
  const volKey = `batchvol:${ip}:${dayKey}`;
  const volRaw = await env.PETITION_KV.get(volKey);
  const vol = volRaw ? parseInt(volRaw, 10) || 0 : 0;
  if (vol + count > 500) {
    return json(
      request,
      { error: 'Daily paper log limit reached for this network (500). Contact organizers if legitimate.' },
      429,
      methods
    );
  }
  await env.PETITION_KV.put(volKey, String(vol + count), { expirationTtl: 90000 });

  const stats = await updateStats(env.PETITION_KV, (stats) => {
    stats.total = (stats.total || 0) + count;
    if (province) stats.byProvince[province] = (stats.byProvince[province] || 0) + count;
    stats.byMethod[method] = (stats.byMethod[method] || 0) + count;
    stats.paperBatches = (stats.paperBatches || 0) + 1;
    stats.paperCount = (stats.paperCount || 0) + count;
    stats.unverifiedPaper = true;
  });

  const batchId = `batch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await env.PETITION_KV.put(
    `batch:${batchId}`,
    JSON.stringify({
      id: batchId,
      count,
      province,
      event,
      method,
      ts: Date.now(),
      authMode: auth.mode,
    })
  );

  return json(
    request,
    {
      ok: true,
      id: batchId,
      count,
      total: stats.total,
      track: 'campaign',
      legalNote:
        'Paper batch is a campaign log only unless sheets are presented by an MP. Totals include unverified organizer reports.',
    },
    200,
    methods
  );
}
