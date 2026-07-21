# Current Status — Sherpacarta

**Version:** BUILD 732 + suite metrics
**Last Updated:** 2026-07-21
**Domain:** https://sherpacarta.org

## Recent Milestones
- **2026-07-21:** Suite metrics Step 1+2 — `public/metrics.json` (`gab.product-metrics.v1`) + Umami script in `index.html`
- KPIs: articles_total 114 · signers_total 4 (Canada KV) · languages_served 8 · visitors_monthly 0 · donations_btc 0.00012884 (12,884 sats on-chain)
- CSP allows `https://analytics.giveabit.io`; `/metrics.json` CORS + short cache for HQ
- BUILD 732 (organizer, PoW, share, a11y) previously live
- Public JSON API at `/api/v1/`

## Known Issues
- Umami host `analytics.giveabit.io` not reverse-proxied yet (THOR still `127.0.0.1:3002`) — visitors_monthly stays 0
- Metrics file is static — regenerate when campaign totals / treasury change
- SDK packages pending npm publish
- Cam-gated: Lightning, ORGANIZER_TOKEN ops, MP+e-###, BTC custody story

## Next Steps
- Deploy metrics + Umami commit so HQ can fetch `https://sherpacarta.org/metrics.json`
- Kimi/HQ: prefer product-origin metrics over demo envelope; wire `metricsLiveCandidates`
- Public HTTPS for Umami (analytics.giveabit.io → THOR:3002)
- Cam: LNbits invoice key in HQ Vault (Step 3)
