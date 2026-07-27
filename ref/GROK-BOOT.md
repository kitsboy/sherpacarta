# GROK BOOT — READ THIS EVERY SESSION

**This file lives in every repo's ref/ directory.** Every time you open this project, read ref/GROK-BOOT.md first.

## Also read (Sherpa-specific)

1. `GROK-SESSION-PROTOCOL.md` + `AGENTS.md`  
2. `docs/KIMI-HANDOFF.md` (top)  
3. `docs/LEARN-STAMP-FAMILY.md` — stamp deep-link contract (do not regress)  
4. `docs/PREP-NOW.md` — open prep items  
5. `docs/CANADA-JOURNEY.md` if touching Canada pages  

## Analytics + metrics (suite)

**Umami:** live site uses `https://analytics.giveabit.io/script.js` · website id in `public/data/wallets.json` / HQ.  
**Metrics:** origin `https://sherpacarta.org/metrics.json` (`gab.product-metrics.v1`, prefer `raw.demo: false`).  
Generator: `scripts/generate-metrics.mjs` · CF Function: `functions/metrics.json.js`.  
Spec: https://hq.giveabit.io/docs/ALL-SITE-METRICS.md  

## Stamp family (do not break)

- Open: `https://satohash.io/stamp?hash=<64hex>&ref=sherpacarta`  
- Canada: `ref=sherpacarta-canada`  
- API: `POST https://api.satohash.io/api/stamp` + `X-Satohash-Client`  
- Never claim Bitcoin confirmed until `status === confirmed`  
- Never handoff to home-only `satohash.io?hash=`  

## Hard rules

- No secrets in git (nsec, invoice keys, PATs)  
- Campaign totals ≠ Parliamentary e-petition signatures  
- M3 = code + push; THOR/Kimi = Docker/bot/ops  

## Need help?
Ask Kimi on THOR (via Hermes) for bot/Docker; code stays on M3.
