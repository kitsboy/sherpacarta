/**
 * @giveabit/sherpacarta — JavaScript SDK
 * @see https://sherpacarta.org/api/v1/openapi.json
 *
 * Also re-exports thin Satohash client helpers for charter timestamping
 * (see ../../src/lib/satohash.js for source of truth in the Vite app).
 */

const DEFAULT_BASE = 'https://sherpacarta.org/api/v1';

export class SherpaCartaClient {
  constructor(baseUrl = DEFAULT_BASE) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async _fetch(path) {
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) throw new Error(`SherpaCarta API ${path}: ${res.status}`);
    return res.json();
  }

  async getCharter() {
    return this._fetch('/charter.json');
  }

  async getArticle(num) {
    const s = String(num).trim();
    const slug = /^\d+$/.test(s)
      ? `art-${s}`
      : s.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
    return this._fetch(`/articles/${slug}.json`);
  }

  async search(query) {
    const data = await this.getCharter();
    const q = String(query).toLowerCase();
    return (data.articles || []).filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        String(a.num).includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  async getHash() {
    return this._fetch('/hash.json');
  }

  async getCatalog() {
    return this._fetch('/index.json');
  }
}

export const SherpaCarta = new SherpaCartaClient();
export default SherpaCarta;

// ─── Thin Satohash timestamp client (no secrets) ─────────────────────────────
// Canonical copy for Vite app: src/lib/satohash.js
// Client id: sherpacarta → X-Satohash-Client header

export const SATOHASH_API = 'https://api.satohash.io';
export const SATOHASH_SITE = 'https://satohash.io';
export const SATOHASH_CLIENT_ID = 'sherpacarta';

const _SH_DEFAULT_TIMEOUT_MS = 12_000;
const _SH_STAMP_TIMEOUT_MS = 35_000;

function _satohashHeaders(extra = {}) {
  return {
    Accept: 'application/json',
    'X-Satohash-Client': SATOHASH_CLIENT_ID,
    ...extra,
  };
}

function _withTimeout(ms, signal) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function' && !signal) {
    return AbortSignal.timeout(ms);
  }
  if (!signal && typeof AbortController !== 'undefined') {
    const c = new AbortController();
    setTimeout(() => c.abort(), ms);
    return c.signal;
  }
  return signal;
}

/** GET https://api.satohash.io/health */
export async function getApiHealth(opts = {}) {
  try {
    const qs = opts.deep ? '?deep=true' : '';
    const res = await fetch(`${SATOHASH_API}/health${qs}`, {
      method: 'GET',
      headers: _satohashHeaders(),
      signal: _withTimeout(opts.timeoutMs ?? _SH_DEFAULT_TIMEOUT_MS, opts.signal),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    const status = data.status ?? 'unknown';
    return {
      ok: status === 'ok' || status === 'degraded',
      status,
      details: data.details,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * POST https://api.satohash.io/api/stamp
 * @param {string} hash 64-char hex SHA-256
 */
export async function stampHash(hash, opts = {}) {
  const clean = String(hash).trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(clean)) {
    throw new Error('Hash must be exactly 64 hex characters (SHA-256)');
  }
  const body = {
    hash: clean,
    filename: opts.filename ?? 'sherpacarta-charter',
  };
  if (opts.email) body.email = opts.email;

  const res = await fetch(`${SATOHASH_API}/api/stamp`, {
    method: 'POST',
    headers: _satohashHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
    signal: _withTimeout(opts.timeoutMs ?? _SH_STAMP_TIMEOUT_MS, opts.signal),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Satohash stamp failed: ${res.status} ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  if (!data.id) throw new Error('Satohash stamp response missing id');
  return {
    id: data.id,
    hash: data.hash ?? clean,
    filename: data.filename,
    status: data.status ?? 'pending',
    created_at: data.created_at,
    ipfs_cid: data.ipfs_cid,
    verifyUrl: `${SATOHASH_SITE}/verify/${data.id}`,
    proofUrl: `${SATOHASH_API}/api/stamps/${data.id}`,
  };
}

export function satohashVerifyUrl(idOrHash) {
  return `${SATOHASH_SITE}/verify/${encodeURIComponent(idOrHash)}`;
}

export function satohashStampGuideUrl(hash) {
  return `${SATOHASH_SITE}/stamp?hash=${encodeURIComponent(hash)}`;
}