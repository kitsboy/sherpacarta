/**
 * GET /metrics.json — live gab.product-metrics.v1 for HQ
 * productId: sherpacarta
 *
 * Secret-free. Pulls Canada stats from PETITION_KV (or origin), treasury from mempool.
 * LNbits invoice keys never appear here — HQ Vault wallet id "sherpacarta".
 *
 * Static public/metrics.json remains a build-time fallback if Functions are unbound.
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
    'Cache-Control': 'public, max-age=60',
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

async function loadStats(env, request) {
  if (env.PETITION_KV) {
    const statsRaw = await env.PETITION_KV.get('stats:v1');
    const stats = statsRaw ? JSON.parse(statsRaw) : {};
    return {
      total: Number(stats.total) || 0,
      byProvince: stats.byProvince || {},
      byMethod: stats.byMethod || {},
      paperBatches: Number(stats.paperBatches) || 0,
      paperCount: Number(stats.paperCount) || 0,
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
      store: s.store || 'api',
      updated: s.updated || null,
      ok: true,
    };
  } catch {
    return {
      total: 0,
      byProvince: {},
      byMethod: {},
      paperBatches: 0,
      paperCount: 0,
      store: 'unavailable',
      updated: null,
      ok: false,
    };
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

  const provinceRows = Object.entries(stats.byProvince)
    .map(([id, value]) => ({
      id: String(id).toUpperCase(),
      label: String(id).toUpperCase(),
      value: Number(value) || 0,
    }))
    .sort((a, b) => b.value - a.value);

  const methodRows = Object.entries(stats.byMethod)
    .map(([id, value]) => ({
      id: String(id),
      label: String(id),
      value: Number(value) || 0,
    }))
    .sort((a, b) => b.value - a.value);

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
          ? 'Live CF Function — Canada KV/API + mempool treasury. LN via HQ wallet sherpacarta.'
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
            ? `total=${stats.total} store=${stats.store}`
            : 'stats unavailable',
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
          detail: `website ${UMAMI_ID} · HQ merges visitor KPIs`,
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
        label: 'Signers',
        value: stats.total,
        unit: 'signers',
        format: 'number',
        priority: 1,
        hint: 'Canada campaign commitments — not Parliamentary e-petition counts',
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
    ],
    series: [
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
        id: 'charter_journey',
        label: 'Charter journey',
        steps: [
          { id: 'read', label: 'Read charter', count: 0, hint: 'Umami via HQ' },
          { id: 'sign', label: 'Sign / commit', count: stats.total },
          { id: 'share', label: 'Share', count: 0, hint: 'Umami share_click' },
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
      ...(provinceRows.length
        ? [{ id: 'by_province', label: 'Signers by province', rows: provinceRows }]
        : []),
      ...(methodRows.length
        ? [{ id: 'by_method', label: 'Signers by method', rows: methodRows }]
        : []),
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
        hint: 'Live CF Function',
      },
      {
        id: 'canada_campaign',
        title: 'Canada campaign stats',
        for: ['hq'],
        status: 'live',
        endpoint: 'GET /api/canada/stats',
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
    ],
    links: [
      { label: 'SherpaCarta', url: 'https://sherpacarta.org' },
      { label: 'Canada stats', url: 'https://sherpacarta.org/api/canada/stats' },
      { label: 'Treasury', url: 'https://sherpacarta.org/treasury' },
      {
        label: 'Mempool',
        url: `https://mempool.space/address/${BTC_ADDRESS}`,
      },
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
