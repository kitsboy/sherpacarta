# Session Summary — 2026-07-21

**Chat Topic:** Suite-wide metrics for SherpaCarta — publish live `/metrics.json` and wire Umami tracking (HQ Steps 1–2).

## Key Things We Did
- Confirmed `ref/GROK-BOOT.md` is missing; used HQ `ALL-SITE-METRICS.md` + `UMAMI-SETUP.md` / `UMAMI-DEPLOYMENT.md` as the Step 1+2 contract
- Counted real product data: 114 articles, 8 languages, 4 Canada campaign signers (KV), 12,884 sats treasury
- Created `public/metrics.json` (`gab.product-metrics.v1`, `raw.demo: false`)
- Added Umami script to `index.html` (`data-website-id=9b6f05bf-286e-4b21-9094-1d675f9b4442`)
- Updated CSP + `/metrics.json` CORS headers in `public/_headers`

## What We Finished
- [x] Step 1 — static product metrics envelope at origin path `/metrics.json`
- [x] Step 2 — Umami tag + CSP allowlist for `analytics.giveabit.io`
- [x] Session handoff (`.ai_docs`, `docs/KIMI-HANDOFF.md`, `LATEST-UPDATE.md`)

## What We Are Still Aiming to Finish
- [ ] Deploy/push so production serves metrics (CF Pages)
- [ ] Public HTTPS reverse proxy: `analytics.giveabit.io` → THOR Umami `:3002`
- [ ] HQ: prefer `https://sherpacarta.org/metrics.json` over demo envelope; optional `metricsLiveCandidates`
- [ ] Cam Step 3: LNbits invoice key in HQ Vault
- [ ] Regenerate metrics when signers/treasury change (static file today)
- [ ] Cam-gated: Lightning, ORGANIZER_TOKEN ops, campaign field ops

## Update / Status
As of **2026-07-21**, SherpaCarta has a real (non-demo) metrics envelope ready for HQ and an Umami beacon ready once the analytics host is public. Charter KPIs are honest counts, not the old HQ demo numbers (e.g. 264 signers).

## Key Decisions / Notes
- `signers_total` = Canada campaign KV total (4), not localStorage or inflated demo
- `donations_btc` = on-chain balance in BTC (12884 sats)
- `visitors_monthly` = 0 until Umami is internet-reachable
- Analytics host chosen as `https://analytics.giveabit.io` (docs example); not live yet
- Site still privacy-first: first-party Umami only, no ad tech

## Mission Tie-in
Transparent suite ops for Give A Bit without inventing vanity metrics — public charter data, public treasury, privacy-respecting analytics when the host is ready.

## Recovery
Use **/whatsup** in a new chat to load this summary and continue.
