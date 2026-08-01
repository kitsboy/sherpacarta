#!/usr/bin/env node
/**
 * Generate public/metrics.json (gab.product-metrics.v1) from real public sources.
 * Secret-free. Never embeds LNbits invoice keys (those live in HQ Vault only).
 *
 * Sources:
 *  - data/charter.json (articles)
 *  - public/locales + UI language set (languages)
 *  - GET https://sherpacarta.org/api/canada/stats (signers)
 *  - mempool.space address balance (on-chain treasury)
 *  - public/data/wallets.json (address + lightning status)
 *
 * LN balance is reported on HQ Money tab via wallet id "sherpacarta" — not here.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PRODUCT_ID = 'sherpacarta';
const NAME = 'SherpaCarta';
const UMAMI_ID = '9b6f05bf-286e-4b21-9094-1d675f9b4442';
const ORIGIN = process.env.SC_ORIGIN || 'https://sherpacarta.org';
const HQ_WALLET_ID = 'sherpacarta';

const UI_LANGS = [
  { id: 'en', label: 'English', source: 'full charter' },
  { id: 'zh', label: 'Chinese', source: 'UI' },
  { id: 'es', label: 'Spanish', source: 'UI + community charter' },
  { id: 'ar', label: 'Arabic', source: 'UI + RTL' },
  { id: 'fr', label: 'French', source: 'UI + key articles' },
  { id: 'de', label: 'German', source: 'UI' },
  { id: 'pt', label: 'Portuguese', source: 'UI' },
  { id: 'sw', label: 'Swahili', source: 'UI pilot' },
];

async function fetchJson(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json', 'User-Agent': 'sherpacarta-metrics-generator/1.0' },
    });
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function loadWallets() {
  const p = join(root, 'public/data/wallets.json');
  return JSON.parse(readFileSync(p, 'utf8'));
}

function loadCharter() {
  const p = join(root, 'data/charter.json');
  return JSON.parse(readFileSync(p, 'utf8'));
}

function countLocaleFiles() {
  const dir = join(root, 'public/locales');
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith('.json')).length;
}

function satsToBtc(sats) {
  return Math.round(sats) / 1e8;
}

function nowIso() {
  return new Date().toISOString();
}

function window7d(to = new Date()) {
  const end = new Date(to);
  const start = new Date(end.getTime() - 7 * 24 * 3600 * 1000);
  return {
    label: '7d',
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

async function main() {
  const t0 = Date.now();
  const charter = loadCharter();
  const wallets = loadWallets();
  const articles = Number(charter.articleCount) || (charter.chapters ? null : 0) || 114;
  const languages = UI_LANGS.length;
  const localeFiles = countLocaleFiles();
  const address = wallets.bitcoin?.address;
  if (!address) throw new Error('wallets.json missing bitcoin.address');

  let stats = {
    total: 0,
    byProvince: {},
    byMethod: {},
    paperBatches: 0,
    paperCount: 0,
    store: 'unknown',
    updated: null,
  };
  let statsOk = false;
  let statsErr = null;
  try {
    const s = await fetchJson(`${ORIGIN}/api/canada/stats`);
    stats = {
      total: Number(s.total) || 0,
      byProvince: s.byProvince || {},
      byMethod: s.byMethod || {},
      paperBatches: Number(s.paperBatches) || 0,
      paperCount: Number(s.paperCount) || 0,
      store: s.store || 'unknown',
      updated: s.updated || null,
    };
    statsOk = true;
  } catch (e) {
    statsErr = String(e.message || e);
    console.warn('canada stats fetch failed:', statsErr);
  }

  let fundedSats = 0;
  let spentSats = 0;
  let txCount = 0;
  let mempoolOk = false;
  let mempoolErr = null;
  try {
    const m = await fetchJson(`https://mempool.space/api/address/${address}`);
    fundedSats = Number(m.chain_stats?.funded_txo_sum) || 0;
    spentSats = Number(m.chain_stats?.spent_txo_sum) || 0;
    txCount = Number(m.chain_stats?.tx_count) || 0;
    const memFunded = Number(m.mempool_stats?.funded_txo_sum) || 0;
    const memSpent = Number(m.mempool_stats?.spent_txo_sum) || 0;
    fundedSats += memFunded;
    spentSats += memSpent;
    mempoolOk = true;
  } catch (e) {
    mempoolErr = String(e.message || e);
    console.warn('mempool fetch failed:', mempoolErr);
  }

  const balanceSats = Math.max(0, fundedSats - spentSats);
  const donationsBtc = satsToBtc(balanceSats);
  const lnStatus = wallets.lightning?.status || 'pending';
  const updatedAt = nowIso();
  const latencyMs = Date.now() - t0;

  const healthStatus =
    statsOk && mempoolOk ? 'green' : statsOk || mempoolOk ? 'amber' : 'red';

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

  const day = updatedAt.slice(0, 10) + 'T00:00:00.000Z';

  const envelope = {
    schema: 'gab.product-metrics.v1',
    productId: PRODUCT_ID,
    name: NAME,
    updatedAt,
    window: window7d(new Date(updatedAt)),
    health: {
      status: healthStatus,
      message: statsOk && mempoolOk
        ? 'Live public sources — Canada campaign KV, on-chain treasury, charter data. LN balance via HQ wallet id sherpacarta.'
        : `Partial metrics: stats=${statsOk ? 'ok' : 'fail'} mempool=${mempoolOk ? 'ok' : 'fail'}`,
      latencyMs,
      uptimePct24h: null,
      dependencies: [
        {
          id: 'charter-data',
          status: 'green',
          detail: `data/charter.json · ${articles} articles`,
        },
        {
          id: 'canada-stats',
          status: statsOk ? 'green' : 'red',
          detail: statsOk
            ? `GET /api/canada/stats total=${stats.total} store=${stats.store}`
            : statsErr || 'fetch failed',
        },
        {
          id: 'on-chain-treasury',
          status: mempoolOk ? 'green' : 'red',
          detail: mempoolOk
            ? `mempool.space · ${balanceSats} sats · ${txCount} txs`
            : mempoolErr || 'fetch failed',
        },
        {
          id: 'lightning',
          status: lnStatus === 'live' ? 'green' : 'amber',
          detail:
            lnStatus === 'live'
              ? 'Public LNURL/lud16 published in wallets.json'
              : `Public LN pending · HQ LNbits wallet id "${HQ_WALLET_ID}" (invoice key in Vault only)`,
        },
        {
          id: 'umami',
          status: 'green',
          detail: `analytics.giveabit.io · website ${UMAMI_ID} · visitors filled by HQ/Umami (not origin-side)`,
        },
      ],
    },
    kpis: [
      {
        key: 'articles_total',
        label: 'Articles',
        value: articles,
        unit: 'articles',
        format: 'number',
        priority: 1,
        hint: 'Living charter articles from data/charter.json.',
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
        key: 'donations_btc',
        label: 'Donations (BTC on-chain)',
        value: donationsBtc,
        unit: 'BTC',
        format: 'number',
        priority: 1,
        hint: `On-chain treasury balance (${balanceSats} sats). LN sats on HQ Money tab (wallet ${HQ_WALLET_ID}).`,
      },
      {
        key: 'donations_sats',
        label: 'Treasury sats (on-chain)',
        value: balanceSats,
        unit: 'sats',
        format: 'number',
        priority: 1,
        hint: 'mempool.space UTXO sum for public treasury address.',
      },
      {
        key: 'languages_served',
        label: 'Languages',
        value: languages,
        unit: 'languages',
        format: 'number',
        priority: 2,
        hint: 'UI locales: en, zh, es, ar, fr, de, pt, sw.',
      },
      {
        key: 'visitors_monthly',
        label: 'Visitors / month',
        value: 0,
        unit: 'visitors',
        format: 'number',
        priority: 2,
        hint: `Umami ${UMAMI_ID}. HQ should overlay live Umami stats; origin does not hold analytics API token.`,
      },
      {
        key: 'paper_batches',
        label: 'Paper batches',
        value: stats.paperBatches,
        unit: 'batches',
        format: 'number',
        priority: 3,
        hint: 'Organizer paper batches (requires ORGANIZER_TOKEN).',
      },
      {
        key: 'paper_signers',
        label: 'Paper signers',
        value: stats.paperCount,
        unit: 'signers',
        format: 'number',
        priority: 3,
        hint: 'Paper commitment count logged via organizer API.',
      },
      {
        key: 'treasury_txs',
        label: 'Treasury txs',
        value: txCount,
        unit: 'txs',
        format: 'number',
        priority: 3,
        hint: 'On-chain transaction count for treasury address.',
      },
      {
        key: 'locale_files',
        label: 'Locale files',
        value: localeFiles,
        unit: 'files',
        format: 'number',
        priority: 4,
        hint: 'JSON locale / charter translation files under public/locales.',
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
          {
            id: 'read',
            label: 'Read charter',
            count: 0,
            hint: 'Umami pageviews — HQ overlays when available',
          },
          {
            id: 'sign',
            label: 'Sign / commit',
            count: stats.total,
            hint: 'Canada campaign commitments (KV)',
          },
          {
            id: 'share',
            label: 'Share',
            count: 0,
            hint: 'Umami event share_click when instrumented',
          },
        ],
      },
    ],
    segments: [
      {
        id: 'by_language',
        label: 'Languages served',
        rows: UI_LANGS.map((l) => ({
          id: l.id,
          label: l.label,
          value: 1,
          meta: { source: l.source },
        })),
      },
      ...(provinceRows.length
        ? [
            {
              id: 'by_province',
              label: 'Signers by province',
              rows: provinceRows,
            },
          ]
        : []),
      ...(methodRows.length
        ? [
            {
              id: 'by_method',
              label: 'Signers by method',
              rows: methodRows,
            },
          ]
        : []),
      {
        id: 'treasury_rails',
        label: 'Treasury rails',
        rows: [
          {
            id: 'onchain',
            label: 'On-chain BTC',
            value: balanceSats,
            meta: { status: wallets.bitcoin?.status || 'live', unit: 'sats' },
          },
          {
            id: 'lightning',
            label: 'Lightning (public receive)',
            value: 0,
            meta: {
              status: lnStatus,
              hqWalletId: HQ_WALLET_ID,
              note: 'Balance via HQ LNbits — not embedded in origin metrics',
            },
          },
        ],
      },
    ],
    offers: [
      {
        id: 'digital_magna_carta',
        title: 'Digital Magna Carta (CC0)',
        for: ['giveabit', 'motopass', 'katoa', 'hq'],
        status: 'ga',
        endpoint: 'https://sherpacarta.org/',
        hint: `${articles}-article living charter`,
      },
      {
        id: 'public_api',
        title: 'Charter JSON API',
        for: ['*'],
        status: 'ga',
        endpoint: 'GET /api/v1/charter.json',
        hint: 'Machine-readable articles + hash',
      },
      {
        id: 'canada_campaign',
        title: 'Canada campaign stats',
        for: ['hq'],
        status: 'live',
        endpoint: 'GET /api/canada/stats',
        hint: 'Honest campaign totals (not e-petition)',
      },
      {
        id: 'metrics_v1',
        title: 'Product metrics v1',
        for: ['hq'],
        status: 'live',
        endpoint: 'GET /metrics.json',
        hint: 'gab.product-metrics.v1 — live CF Function + static fallback',
      },
    ],
    education: [
      {
        id: 'mold_signers',
        title: 'Signers = legitimacy',
        body: 'signers_total is campaign commitments from KV — never inflate with demo counts. Local browser signatures stay local unless Nostr-published.',
        action: 'HQ: prefer live origin metrics when raw.demo === false',
        opportunity: 'info',
      },
      {
        id: 'mold_donations',
        title: 'On-chain is the books',
        body: 'donations_sats / donations_btc are public UTXO sums. Anyone re-verifies via mempool.space.',
        action: 'Show chain + LN as separate rails; sum only when both live',
        opportunity: 'opportunity',
      },
      {
        id: 'mold_ln_hq',
        title: 'Lightning lives in HQ Vault',
        body: `LNbits invoice key for wallet id "${HQ_WALLET_ID}" stays in HQ Vault / Worker — never in this JSON or git.`,
        action: 'Money tab: label wallet sherpacarta · productId sherpacarta',
        opportunity: 'plan',
      },
      {
        id: 'mold_visitors',
        title: 'Visitors from Umami',
        body: 'Origin publishes visitors_monthly=0 placeholder. HQ should merge Umami website stats for this productId.',
        action: `Umami website ${UMAMI_ID}`,
        opportunity: 'plan',
      },
    ],
    links: [
      { label: 'SherpaCarta', url: 'https://sherpacarta.org' },
      { label: 'Canada stats', url: 'https://sherpacarta.org/api/canada/stats' },
      { label: 'Treasury', url: 'https://sherpacarta.org/treasury' },
      { label: 'Wallets registry', url: 'https://sherpacarta.org/data/wallets.json' },
      { label: 'Mempool', url: wallets.bitcoin?.explorer || `https://mempool.space/address/${address}` },
      { label: 'HQ schema', url: 'https://hq.giveabit.io/schemas/product-metrics.v1.schema.json' },
    ],
    raw: {
      demo: false,
      source: 'generate-metrics.mjs + public APIs',
      productId: PRODUCT_ID,
      hqWalletId: HQ_WALLET_ID,
      articles_source: `data/charter.json articleCount=${articles}`,
      signers_source: statsOk
        ? `${ORIGIN}/api/canada/stats total=${stats.total} store=${stats.store}`
        : `unavailable: ${statsErr}`,
      languages: UI_LANGS.map((l) => l.id),
      donations_sats: balanceSats,
      donations_btc: donationsBtc,
      treasury_address: address,
      treasury_tx_count: txCount,
      lightning_public_status: lnStatus,
      umami_website_id: UMAMI_ID,
      umami_host: 'https://analytics.giveabit.io',
      note: 'Secret-free envelope. LN sats via HQ LNbits wallet sherpacarta. Visitors via HQ Umami merge. Regenerate on build or serve live via CF Function /metrics.json.',
    },
  };

  const outPath = join(root, 'public/metrics.json');
  writeFileSync(outPath, JSON.stringify(envelope, null, 2) + '\n');
  console.log(
    `metrics.json written · productId=${PRODUCT_ID} · signers=${stats.total} · sats=${balanceSats} · articles=${articles} · health=${healthStatus} · ${latencyMs}ms`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
