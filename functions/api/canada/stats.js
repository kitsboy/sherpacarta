/**
 * GET /api/canada/stats
 * Public aggregates for Canada campaign commitments (not Parliamentary counts).
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=30',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (context.request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }
  const { env } = context;

  if (env.PETITION_KV) {
    const statsRaw = await env.PETITION_KV.get('stats:v1');
    const recentRaw = await env.PETITION_KV.get('recent:v1');
    const stats = statsRaw ? JSON.parse(statsRaw) : { total: 0, byProvince: {}, byMethod: {} };
    const recent = (recentRaw ? JSON.parse(recentRaw) : []).filter((r) => {
      const n = (r.displayName || '').toLowerCase();
      if (!n) return false;
      if (/^test|testcam|demo|asdf|xxx|foo\b/.test(n)) return false;
      return true;
    });
    return json({
      track: 'campaign',
      legalNote: 'These are SherpaCarta campaign commitments, not House of Commons e-petition signatures.',
      total: stats.total || 0,
      byProvince: stats.byProvince || {},
      byMethod: stats.byMethod || {},
      paperBatches: stats.paperBatches || 0,
      recent: recent.slice(0, 20),
      updated: stats.updated || null,
      store: 'kv',
    });
  }

  if (env.DB) {
    try {
      const row = await env.DB.prepare('SELECT COUNT(*) as c FROM campaign_sigs').first();
      const byProv = await env.DB.prepare(
        'SELECT province, COUNT(*) as c FROM campaign_sigs GROUP BY province'
      ).all();
      const byMethod = await env.DB.prepare(
        'SELECT method, COUNT(*) as c FROM campaign_sigs GROUP BY method'
      ).all();
      const recent = await env.DB.prepare(
        'SELECT id, display_name as displayName, province, method, ts FROM campaign_sigs ORDER BY created_at DESC LIMIT 20'
      ).all();
      const byProvince = {};
      for (const r of byProv.results || []) {
        if (r.province) byProvince[r.province] = r.c;
      }
      const byMethodMap = {};
      for (const r of byMethod.results || []) {
        byMethodMap[r.method] = r.c;
      }
      return json({
        track: 'campaign',
        legalNote: 'These are SherpaCarta campaign commitments, not House of Commons e-petition signatures.',
        total: row?.c || 0,
        byProvince,
        byMethod: byMethodMap,
        recent: recent.results || [],
        store: 'd1',
      });
    } catch {
      return json({
        track: 'campaign',
        total: 0,
        byProvince: {},
        byMethod: {},
        recent: [],
        store: 'd1-uninitialized',
        message: 'Run first sign to create tables or apply migration',
      });
    }
  }

  return json({
    track: 'campaign',
    total: 0,
    byProvince: {},
    byMethod: {},
    recent: [],
    store: 'none',
    configured: false,
    message: 'Bind PETITION_KV or DB on Cloudflare Pages to enable multi-user campaign totals.',
    legalNote: 'Campaign commitments only — not Parliamentary e-petition signatures.',
  });
}
