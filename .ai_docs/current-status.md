# Current Status — Sherpacarta

**Version:** BUILD 733 + live metrics pipeline  
**Last Updated:** 2026-07-26  
**Domain:** https://sherpacarta.org  
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)

## Recent Milestones
- **2026-07-26:** End-to-end real metrics for HQ
  - Live CF Function `GET /metrics.json` (`functions/metrics.json.js`) — Canada KV + mempool, `raw.demo: false`
  - Build-time generator `scripts/generate-metrics.mjs` + `npm run metrics`
  - Site-wide first-party Umami + `public/js/sc-analytics.js` (29 HTML pages)
  - `wallets.json` v2: `productId`, `hqWalletId: sherpacarta`, metrics pointers
  - Deploy workflow runs metrics + analytics inject before vite
- **2026-07-21:** Initial metrics.json + Umami on index
- BUILD 732: organizer, PoW, share, a11y

## Live KPIs (regenerated 2026-07-26)
| KPI | Value | Source |
|-----|-------|--------|
| articles_total | 114 | charter.json |
| signers_total | 4 | /api/canada/stats KV |
| donations_sats | 12884 | mempool.space |
| donations_btc | 0.00012884 | derived |
| languages_served | 8 | UI locales |
| visitors_monthly | 0 placeholder | HQ overlays Umami |

## Labels (suite contract)
- productId / metricsKey / LNbits wallet: **`sherpacarta`**
- Umami website: `9b6f05bf-286e-4b21-9094-1d675f9b4442`
- Metrics URL: `https://sherpacarta.org/metrics.json`
- Invoice keys: **HQ Vault only** — never in this repo

## Known Issues
- Public LNURL/lud16 not published — Lightning receive still pending on site; balance on HQ Money via wallet `sherpacarta`
- visitors_monthly stays 0 on origin envelope (no Umami API token on product) — HQ should merge
- HQ fallback `/metrics/sherpacarta.json` may still be demo until Kimi deletes/replaces it
- SDK packages pending npm publish
- Cam-gated: ORGANIZER_TOKEN ops, MP+e-###, custody story

## Next Steps
- Kimi: prefer live origin when `raw.demo===false`; kill demo envelope; Money tab wallet `sherpacarta`
- Optional: publish public LNURL into wallets.json when ready
- Confirm Umami pageviews after deploy
