/**
 * GET /metrics.json — live gab.product-metrics.v1 for HQ
 * productId: sherpacarta
 *
 * Secret-free. Pulls Canada mandate stats from PETITION_KV (or origin), treasury from mempool.
 * LNbits invoice keys never appear here — HQ Vault wallet id "sherpacarta".
 *
 * On every public-mandate sign, KV updates totals / province / method / daily / activity.
 * HQ polls this envelope (and Umami events from the browser).
 */
const PRODUCT_ID = 'sherpacarta';
const NAME = 'SherpaCarta';
const UMAMI_ID = '9b6f05bf-286e-4b21-9094-1d675f9b4442';
const HQ_WALLET_ID = 'sherpacarta';
const ARTICLES = 114;
const LANGUAGES = 8;
const LANGUAGE_IDS = ['en', 'zh', 'es', 'ar', 'fr', 'de', 'pt', 'sw'];
const BTC_ADDRESS =
  'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad';

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=30',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors() });
}

function satsToBtc(sats) {
  return Math.round(sats) / 1e8;
}

function window7d(toIso) {
  const end = new Date(toIso);
  const start = new Date(end.getTime() - 7 * 24 * 3600 * 1000);
  return { label: '7d', from: start.toISOString(), to: end.toISOString() };
}

function countActivitySince(activity, sinceMs) {
  if (!Array.isArray(activity)) return 0;
  return activity.filter((e) => e && e.type === 'sign' && !e.duplicate && Number(e.t) >= sinceMs)
    .length;
}

function dailySeriesPoints(daily, days = 14) {
  const map = daily && typeof daily === 'object' ? daily : {};
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    const key = d.toISOString().slice(0, 10);
    out.push({ t: key + 'T12:00:00.000Z', v: Number(map[key]) || 0 });
  }
  return out;
}

async function loadStats(env, request) {
  const empty = {
    total: 0,
    byProvince: {},
    byMethod: {},
    paperBatches: 0,
    paperCount: 0,
    sharedNames: 0,
    lastSignAt: null,
    lastMethod: null,
    lastProvince: null,
    signers24h: 0,
    signers7d: 0,
    daily: {},
    seriesDaily: [],
    activity: [],
    recent: [],
    store: 'unavailable',
    updated: null,
    ok: false,
  };

  if (env.PETITION_KV) {
    const [statsRaw, activityRaw, recentRaw] = await Promise.all([
      env.PETITION_KV.get('stats:v1'),
      env.PETITION_KV.get('activity:v1'),
      env.PETITION_KV.get('recent:v1'),
    ]);
    const stats = statsRaw ? JSON.parse(statsRaw) : {};
    const activity = activityRaw ? JSON.parse(activityRaw) : [];
    const now = Date.now();
    const dayMs = 24 * 3600 * 1000;
    const recent = (recentRaw ? JSON.parse(recentRaw) : [])
      .filter((r) => r && r.displayName && !/[<>&]/.test(r.displayName))
      .slice(0, 12)
      .map((r) => ({
        id: r.id || null,
        displayName: String(r.displayName).slice(0, 40),
        province: r.province || null,
        method: r.method || null,
        ts: r.ts || null,
      }));

    return {
      total: Number(stats.total) || 0,
      byProvince: stats.byProvince || {},
      byMethod: stats.byMethod || {},
      paperBatches: Number(stats.paperBatches) || 0,
      paperCount: Number(stats.paperCount) || 0,
      sharedNames: Number(stats.sharedNames) || 0,
      lastSignAt: stats.lastSignAt || null,
      lastMethod: stats.lastMethod || null,
      lastProvince: stats.lastProvince || null,
      signers24h: countActivitySince(activity, now - dayMs),
      signers7d: countActivitySince(activity, now - 7 * dayMs),
      daily: stats.daily || {},
      seriesDaily: dailySeriesPoints(stats.daily || {}, 14),
      activity: (activity || []).slice(0, 30).map((e) => ({
        t: e.t,
        type: e.type,
        method: e.method,
        province: e.province,
        shared: !!e.shared,
        duplicate: !!e.duplicate,
        id: e.id || null,
      })),
      recent,
      store: 'kv',
      updated: stats.updated || null,
      ok: true,
    };
  }

  try {
    const origin = new URL(request.url).origin;
    const res = await fetch(`${origin}/api/canada/stats`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`stats ${res.status}`);
    const s = await res.json();
    return {
      total: Number(s.total) || 0,
      byProvince: s.byProvince || {},
      byMethod: s.byMethod || {},
      paperBatches: Number(s.paperBatches) || 0,
      paperCount: Number(s.paperCount) || 0,
      sharedNames: Number(s.sharedNames) || 0,
      lastSignAt: s.lastSignAt || null,
      lastMethod: s.lastMethod || null,
      lastProvince: s.lastProvince || null,
      signers24h: Number(s.signers24h) || 0,
      signers7d: Number(s.signers7d) || 0,
      daily: s.daily || {},
      seriesDaily: Array.isArray(s.seriesDaily) ? s.seriesDaily : dailySeriesPoints(s.daily || {}, 14),
      activity: Array.isArray(s.activity) ? s.activity.slice(0, 30) : [],
      recent: Array.isArray(s.recent) ? s.recent.slice(0, 12) : [],
      store: s.store || 'api',
      updated: s.updated || null,
      ok: true,
    };
  } catch {
    return empty;
  }
}

async function loadMempool(address) {
  try {
    const res = await fetch(`https://mempool.space/api/address/${address}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`mempool ${res.status}`);
    const m = await res.json();
    const funded =
      (Number(m.chain_stats?.funded_txo_sum) || 0) +
      (Number(m.mempool_stats?.funded_txo_sum) || 0);
    const spent =
      (Number(m.chain_stats?.spent_txo_sum) || 0) +
      (Number(m.mempool_stats?.spent_txo_sum) || 0);
    const txCount = Number(m.chain_stats?.tx_count) || 0;
    return {
      balanceSats: Math.max(0, funded - spent),
      txCount,
      ok: true,
    };
  } catch {
    return { balanceSats: 0, txCount: 0, ok: false };
  }
}

function buildEnvelope({ stats, treasury, updatedAt, latencyMs }) {
  const balanceSats = treasury.balanceSats;
  const donationsBtc = satsToBtc(balanceSats);
  const day = updatedAt.slice(0, 10) + 'T00:00:00.000Z';
  const healthStatus =
    stats.ok && treasury.ok ? 'green' : stats.ok || treasury.ok ? 'amber' : 'red';

  const provinceRows = Object.entries(stats.byProvince || {})
    .map(([id, value]) => ({
      id: String(id).toUpperCase(),
      label: String(id).toUpperCase(),
      value: Number(value) || 0,
    }))
    .sort((a, b) => b.value - a.value);

  const methodRows = Object.entries(stats.byMethod || {})
    .map(([id, value]) => ({
      id: String(id),
      label: String(id),
      value: Number(value) || 0,
    }))
    .sort((a, b) => b.value - a.value);

  const seriesDaily =
    Array.isArray(stats.seriesDaily) && stats.seriesDaily.length
      ? stats.seriesDaily
      : dailySeriesPoints(stats.daily || {}, 14);

  const lastSignIso = stats.lastSignAt
    ? new Date(stats.lastSignAt).toISOString()
    : null;
  const minutesSinceSign =
    stats.lastSignAt != null
      ? Math.max(0, Math.round((Date.now() - Number(stats.lastSignAt)) / 60000))
      : null;

  return {
    schema: 'gab.product-metrics.v1',
    productId: PRODUCT_ID,
    name: NAME,
    updatedAt,
    window: window7d(updatedAt),
    health: {
      status: healthStatus,
      message:
        stats.ok && treasury.ok
          ? `Live CF Function — mandate total=${stats.total} · 24h=${stats.signers24h} · store=${stats.store}. LN via HQ wallet ${HQ_WALLET_ID}.`
          : `Partial: stats=${stats.ok} mempool=${treasury.ok}`,
      latencyMs,
      uptimePct24h: null,
      dependencies: [
        {
          id: 'charter-data',
          status: 'green',
          detail: `charter · ${ARTICLES} articles`,
        },
        {
          id: 'canada-stats',
          status: stats.ok ? 'green' : 'red',
          detail: stats.ok
            ? `total=${stats.total} 24h=${stats.signers24h} 7d=${stats.signers7d} store=${stats.store}`
            : 'stats unavailable',
        },
        {
          id: 'canada-activity',
          status: stats.ok ? 'green' : 'amber',
          detail: stats.ok
            ? `activity=${(stats.activity || []).length} last=${lastSignIso || 'none'}`
            : 'no activity stream',
        },
        {
          id: 'on-chain-treasury',
          status: treasury.ok ? 'green' : 'red',
          detail: treasury.ok
            ? `${balanceSats} sats · ${treasury.txCount} txs`
            : 'mempool unavailable',
        },
        {
          id: 'lightning',
          status: 'amber',
          detail: `HQ LNbits wallet id "${HQ_WALLET_ID}" (invoice key in Vault only)`,
        },
        {
          id: 'umami',
          status: 'green',
          detail: `website ${UMAMI_ID} · sign events: canada_mandate_sign`,
        },
      ],
    },
    kpis: [
      {
        key: 'articles_total',
        label: 'Articles',
        value: ARTICLES,
        unit: 'articles',
        format: 'number',
        priority: 1,
      },
      {
        key: 'signers_total',
        label: 'Public mandate signers',
        value: stats.total,
        unit: 'signers',
        format: 'number',
        priority: 1,
        hint: 'Canada public mandate — not Parliamentary e-petition counts',
      },
      {
        key: 'signers_24h',
        label: 'Signers 24h',
        value: stats.signers24h || 0,
        unit: 'signers',
        format: 'number',
        priority: 1,
        hint: 'New public-mandate signs in last 24h (activity stream)',
      },
      {
        key: 'signers_7d',
        label: 'Signers 7d',
        value: stats.signers7d || 0,
        unit: 'signers',
        format: 'number',
        priority: 1,
        hint: 'New public-mandate signs in last 7 days',
      },
      {
        key: 'donations_btc',
        label: 'Donations (BTC on-chain)',
        value: donationsBtc,
        unit: 'BTC',
        format: 'number',
        priority: 1,
      },
      {
        key: 'donations_sats',
        label: 'Treasury sats (on-chain)',
        value: balanceSats,
        unit: 'sats',
        format: 'number',
        priority: 1,
      },
      {
        key: 'languages_served',
        label: 'Languages',
        value: LANGUAGES,
        unit: 'languages',
        format: 'number',
        priority: 2,
      },
      {
        key: 'visitors_monthly',
        label: 'Visitors / month',
        value: 0,
        unit: 'visitors',
        format: 'number',
        priority: 2,
        hint: 'Placeholder — HQ overlays Umami for productId sherpacarta',
      },
      {
        key: 'shared_names',
        label: 'Public wall names',
        value: stats.sharedNames || 0,
        unit: 'names',
        format: 'number',
        priority: 3,
        hint: 'Opt-in display names only',
      },
      {
        key: 'paper_batches',
        label: 'Paper batches',
        value: stats.paperBatches,
        unit: 'batches',
        format: 'number',
        priority: 3,
      },
      {
        key: 'paper_signers',
        label: 'Paper signers',
        value: stats.paperCount,
        unit: 'signers',
        format: 'number',
        priority: 3,
      },
      {
        key: 'treasury_txs',
        label: 'Treasury txs',
        value: treasury.txCount,
        unit: 'txs',
        format: 'number',
        priority: 3,
      },
      {
        key: 'minutes_since_last_sign',
        label: 'Minutes since last sign',
        value: minutesSinceSign == null ? -1 : minutesSinceSign,
        unit: 'min',
        format: 'number',
        priority: 4,
        hint: '-1 means no sign recorded yet in activity-enriched stats',
      },
    ],
    series: [
      {
        key: 'signers_daily',
        label: 'Mandate signs / day',
        unit: 'signers',
        color: '#10b981',
        points: seriesDaily,
      },
      {
        key: 'signers_snapshot',
        label: 'Signers (snapshot)',
        unit: 'signers',
        color: '#c45f00',
        points: [{ t: day, v: stats.total }],
      },
      {
        key: 'treasury_sats_snapshot',
        label: 'Treasury sats (snapshot)',
        unit: 'sats',
        color: '#f7931a',
        points: [{ t: day, v: balanceSats }],
      },
    ],
    funnels: [
      {
        id: 'canada_mandate_journey',
        label: 'Canada mandate journey',
        steps: [
          {
            id: 'sign_page',
            label: 'Sign page views',
            count: 0,
            hint: 'Umami: sign_page_view / canada_sign_page',
          },
          {
            id: 'sign',
            label: 'Public mandate sign',
            count: stats.total,
            hint: 'Synced via POST /api/canada/sign',
          },
          {
            id: 'share_wall',
            label: 'Opt-in public name',
            count: stats.sharedNames || 0,
          },
          {
            id: 'paper',
            label: 'Paper signers reported',
            count: stats.paperCount || 0,
            hint: 'Organizer paper batches',
          },
        ],
      },
      {
        id: 'charter_journey',
        label: 'Charter journey',
        steps: [
          { id: 'read', label: 'Read charter', count: 0, hint: 'Umami via HQ' },
          { id: 'sign', label: 'Sign / commit', count: stats.total },
          { id: 'share', label: 'Share', count: 0, hint: 'Umami share_click / canada_share' },
        ],
      },
    ],
    segments: [
      {
        id: 'by_language',
        label: 'Languages served',
        rows: LANGUAGE_IDS.map((id) => ({
          id,
          label: id,
          value: 1,
        })),
      },
      {
        id: 'by_province',
        label: 'Signers by province',
        rows: provinceRows.length
          ? provinceRows
          : [{ id: 'none', label: 'No province data yet', value: 0 }],
      },
      {
        id: 'by_method',
        label: 'Signers by method',
        rows: methodRows.length
          ? methodRows
          : [{ id: 'none', label: 'No method data yet', value: 0 }],
      },
      {
        id: 'treasury_rails',
        label: 'Treasury rails',
        rows: [
          {
            id: 'onchain',
            label: 'On-chain BTC',
            value: balanceSats,
            meta: { unit: 'sats', status: 'live' },
          },
          {
            id: 'lightning',
            label: 'Lightning',
            value: 0,
            meta: {
              status: 'hq_vault',
              hqWalletId: HQ_WALLET_ID,
              note: 'Balance on HQ Money — not origin',
            },
          },
        ],
      },
    ],
    offers: [
      {
        id: 'metrics_v1',
        title: 'Product metrics v1',
        for: ['hq'],
        status: 'live',
        endpoint: 'GET /metrics.json',
        hint: 'Live CF Function — poll for HQ cards',
      },
      {
        id: 'canada_stats',
        title: 'Canada mandate stats + activity',
        for: ['hq'],
        status: 'live',
        endpoint: 'GET /api/canada/stats',
        hint: 'Totals, daily series, activity stream, recent wall',
      },
      {
        id: 'canada_sign',
        title: 'Canada mandate sign intake',
        for: ['hq'],
        status: 'live',
        endpoint: 'POST /api/canada/sign',
        hint: 'Privacy-first; updates KV stats for this envelope',
      },
    ],
    education: [
      {
        id: 'mold_ln_hq',
        title: 'Lightning on HQ',
        body: `Wallet id "${HQ_WALLET_ID}" · invoice key only in Vault/Worker`,
        action: 'Money tab filter productId sherpacarta',
        opportunity: 'info',
      },
      {
        id: 'mold_mandate_vs_parliament',
        title: 'Mandate ≠ Parliament',
        body: 'signers_total is public mandate only. Never label as House of Commons e-petition count.',
        action: 'Keep dual-track copy on HQ card tooltips',
        opportunity: 'risk',
      },
      {
        id: 'mold_activity',
        title: 'Live sign feed',
        body: 'raw.canada.activity lists recent signs (method + province, no private names).',
        action: 'Surface last sign age + daily series on flagship card',
        opportunity: 'plan',
      },
    ],
    links: [
      { label: 'SherpaCarta', url: 'https://sherpacarta.org' },
      { label: 'Sign mandate', url: 'https://sherpacarta.org/canada/sign' },
      { label: 'Canada stats', url: 'https://sherpacarta.org/api/canada/stats' },
      { label: 'Official e-petition path', url: 'https://sherpacarta.org/canada/official' },
      { label: 'Treasury', url: 'https://sherpacarta.org/treasury' },
      {
        label: 'Mempool',
        url: `https://mempool.space/address/${BTC_ADDRESS}`,
      },
      { label: 'HQ glass', url: 'https://hq.giveabit.io' },
    ],
    raw: {
      demo: false,
      source: 'functions/metrics.json.js',
      productId: PRODUCT_ID,
      hqWalletId: HQ_WALLET_ID,
      donations_sats: balanceSats,
      donations_btc: donationsBtc,
      treasury_address: BTC_ADDRESS,
      umami_website_id: UMAMI_ID,
      note: 'Secret-free live envelope. Prefer this over any HQ demo fallback when raw.demo===false.',
      canada: {
        track: 'public_mandate',
        total: stats.total,
        signers24h: stats.signers24h || 0,
        signers7d: stats.signers7d || 0,
        sharedNames: stats.sharedNames || 0,
        paperBatches: stats.paperBatches || 0,
        paperCount: stats.paperCount || 0,
        byProvince: stats.byProvince || {},
        byMethod: stats.byMethod || {},
        lastSignAt: lastSignIso,
        lastMethod: stats.lastMethod || null,
        lastProvince: stats.lastProvince || null,
        minutesSinceLastSign: minutesSinceSign,
        daily: stats.daily || {},
        activity: stats.activity || [],
        recentPublicWall: stats.recent || [],
        store: stats.store,
        updated: stats.updated || null,
        legalNote:
          'Public mandate only — not House of Commons e-petition signatures.',
      },
    },
  };
}

export async function onRequest(context) {
  const { request, env } = context;
  const t0 = Date.now();

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() });
  }
  if (request.method === 'HEAD') {
    return new Response(null, { status: 200, headers: cors() });
  }
  if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const [stats, treasury] = await Promise.all([
    loadStats(env, request),
    loadMempool(BTC_ADDRESS),
  ]);

  const updatedAt = new Date().toISOString();
  const envelope = buildEnvelope({
    stats,
    treasury,
    updatedAt,
    latencyMs: Date.now() - t0,
  });

  return json(envelope);
}
