/**
 * GET /api/canada/stats
 * Public aggregates for Canada campaign commitments (not Parliamentary counts).
 */
import { corsHeaders, json } from './_shared.js';

export async function onRequest(context) {
  const { request, env } = context;
  const methods = 'GET, HEAD, OPTIONS';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request, methods) });
  }
  if (request.method === 'HEAD') {
    return new Response(null, {
      status: 200,
      headers: {
        ...corsHeaders(request, methods),
        'Cache-Control': 'public, max-age=30',
      },
    });
  }
  if (request.method !== 'GET') {
    return json(request, { error: 'Method not allowed' }, 405, methods);
  }

  const cacheHeaders = {
    ...corsHeaders(request, methods),
    'Cache-Control': 'public, max-age=30',
  };

  if (env.PETITION_KV) {
    const statsRaw = await env.PETITION_KV.get('stats:v1');
    const recentRaw = await env.PETITION_KV.get('recent:v1');
    const stats = statsRaw ? JSON.parse(statsRaw) : { total: 0, byProvince: {}, byMethod: {} };
    const recent = (recentRaw ? JSON.parse(recentRaw) : [])
      .filter((r) => {
        const n = (r.displayName || '').toLowerCase();
        if (!n) return false;
        if (/^test|testcam|demo|asdf|xxx|foo\b/.test(n)) return false;
        // Never return HTML-looking names
        if (/[<>&]/.test(r.displayName || '')) return false;
        return true;
      })
      .map((r) => ({
        id: r.id,
        displayName: String(r.displayName || '').slice(0, 40),
        province: r.province || null,
        method: r.method || null,
        ts: r.ts || null,
      }));

    return new Response(
      JSON.stringify({
        track: 'campaign',
        legalNote:
          'These are SherpaCarta campaign commitments, not House of Commons e-petition signatures. Totals are self-reported and rate-limited, not identity-verified.',
        total: stats.total || 0,
        byProvince: stats.byProvince || {},
        byMethod: stats.byMethod || {},
        paperBatches: stats.paperBatches || 0,
        paperCount: stats.paperCount || 0,
        recent: recent.slice(0, 20),
        updated: stats.updated || null,
        store: 'kv',
      }),
      { status: 200, headers: cacheHeaders }
    );
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
      return new Response(
        JSON.stringify({
          track: 'campaign',
          legalNote:
            'These are SherpaCarta campaign commitments, not House of Commons e-petition signatures.',
          total: row?.c || 0,
          byProvince,
          byMethod: byMethodMap,
          recent: (recent.results || []).map((r) => ({
            id: r.id,
            displayName: String(r.displayName || '')
              .replace(/[<>&"'`]/g, '')
              .slice(0, 40),
            province: r.province,
            method: r.method,
            ts: r.ts,
          })),
          store: 'd1',
        }),
        { status: 200, headers: cacheHeaders }
      );
    } catch {
      return new Response(
        JSON.stringify({
          track: 'campaign',
          total: 0,
          byProvince: {},
          byMethod: {},
          recent: [],
          store: 'd1-uninitialized',
          message: 'Database not ready',
        }),
        { status: 200, headers: cacheHeaders }
      );
    }
  }

  return new Response(
    JSON.stringify({
      track: 'campaign',
      total: 0,
      byProvince: {},
      byMethod: {},
      recent: [],
      store: 'none',
      configured: false,
      message: 'Bind PETITION_KV or DB on Cloudflare Pages to enable multi-user campaign totals.',
      legalNote: 'Campaign commitments only — not Parliamentary e-petition signatures.',
    }),
    { status: 200, headers: cacheHeaders }
  );
}
