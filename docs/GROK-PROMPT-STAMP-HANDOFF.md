# Stamp handoff — Sherpa task (COMPLETED)

**Status:** ✅ Done · Sherpa `5204c5d` (2026-07-27)  
**Do not re-run as open work** unless live CF is still shipping pre-b2584ae/sc-core without `/stamp?hash=`.

## Outcome

- All stamp handoffs use `https://satohash.io/stamp?hash=&ref=`
- API stamps require `id`, expose `verifyUrl`, never claim Bitcoin confirmed until `status===confirmed`
- Canada uses `ref=sherpacarta-canada`
- `npm run bundle` rebuilt `sc-bundle.js`

## Canonical (forever)

See **`docs/LEARN-STAMP-FAMILY.md`**.

## If live site still looks broken

1. Confirm CF Pages deployed latest `main`  
2. Hard-refresh / bump `?v=` cache on script tags  
3. Smoke: charter Stamp → Satohash prefilled hash → stamp → `/verify/{id}`  

## Historical prompt

Original paste task lived here for M3 Grok. Superseded by LEARN + KIMI-REQUEST resolution log.  
Satohash SPA ownership remains in **satohash** repo; Sherpa is family client only.
