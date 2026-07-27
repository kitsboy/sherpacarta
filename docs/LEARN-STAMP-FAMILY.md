# Learn — Satohash family stamp contract (SherpaCarta)

**Updated:** 2026-07-27 · Sherpa `5204c5d` · Satohash SPA fixed separately  

## One-line truth

Family products open **`/stamp?hash=&ref=`** → SPA posts to **`api.satohash.io`** → durable **`id`** → **`/verify/{id}`**.  
Metrics stay real (`raw.demo: false`). Pending ≠ Bitcoin confirmed.

## Canonical URLs

| Use | URL |
|-----|-----|
| Stamp entry | `https://satohash.io/stamp?hash=<64hex>&ref=<productId>` |
| Optional params | `source`, `label`, `campaign`, `filename` |
| Verify | `https://satohash.io/verify/{id}` |
| API stamp | `POST https://api.satohash.io/api/stamp` |
| Metrics | `GET https://api.satohash.io/metrics.json` |
| Home redirect | `/?hash=&ref=` → `/stamp?...` (Satohash SPA) |

**Refs from Sherpa:**

- Charter → `ref=sherpacarta`
- Canada campaign → `ref=sherpacarta-canada` + `campaign=sherpacarta-canada-v1` (or live campaign id)

**Never:** `https://satohash.io?ref=…&hash=` as the primary handoff (home-only).  
**Prefer host:** `satohash.io` (giveabit.io alias is secondary).

## Sherpa client surface

| Symbol | File | Role |
|--------|------|------|
| `satohashStampGuideUrl(hash, opts)` | `public/sc-core.js`, `src/lib/satohash.js` | Build deep-link |
| `satohashStampHash(hash, opts)` | same | API stamp; require `id`; honest status |
| `satohashVerifyUrl(id)` | same | Shareable proof page |
| `stampCharterOnBitcoin()` | `sc-core.js` | Hash charter → open `/stamp` |
| `stampCharterViaApi()` | `sc-core.js` | Optional in-app API + copy verify |
| `SHERPA_PETITION.stampOnSatohash()` | `public/js/sc-petition-canada.js` | Merkle/petition hash → Canada ref |

Header on all API calls: **`X-Satohash-Client: sherpacarta`** (or `sherpacarta-canada` when opts.clientId set).

## Honesty rules

1. Require stamp **`id`** — throw if missing.  
2. **`status === 'confirmed'`** only → “Bitcoin confirmed”.  
3. Pending → “Submitted — pending confirmation” + verify link.  
4. No secrets in git (nsec, invoice keys, PATs).  
5. Campaign totals ≠ Parliamentary e-petition counts (Canada dual-track).

## What is live vs remaining

| Layer | Status |
|-------|--------|
| Satohash SPA deep-link + API base URL | Done (satohash main) |
| Sherpa deep-links + API honesty + bundle | Done (`5204c5d`) |
| CF Pages deploy of latest Sherpa | Confirm live `sc-core` has `satohashStampGuideUrl` |
| THOR Docker: `client_id` on stamps for HQ segments | Kimi when needed |
| Canada e-### MP sponsor | Cam / politics — not code |
| Template gallery publish | Soft / later |

## Related

- `docs/GROK-PROMPT-STAMP-HANDOFF.md` (historical task — **done**)  
- `docs/KIMI-REQUEST-SATOHASH.md` (ops remaining)  
- Satohash: `docs/LEARN-STAMP-FAMILY.md` (canonical suite learn if present)  
