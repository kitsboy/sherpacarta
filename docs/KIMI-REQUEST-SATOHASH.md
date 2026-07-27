# KIMI REQUEST — Satohash (family + THOR)

**Updated:** 2026-07-27 · Resolution log  
**From:** Grok M3 (Sherpa + prior Satohash notes)

---

## Resolution status

| Item | Owner | Status |
|------|-------|--------|
| SPA posts to `api.satohash.io` (not same-origin) | Satohash | **Done** (satohash main) |
| `/stamp?hash=&ref=` + home redirect | Satohash | **Done** |
| Honest pending vs confirmed | Satohash + Sherpa | **Done** |
| Sherpa weak `/?hash=` handoffs | Sherpa | **Done** (`5204c5d`) |
| `X-Satohash-Client` + require stamp `id` | Sherpa | **Done** |
| Verify cold-load `/verify/{id}` | Satohash | **Done** (smoke OK) |
| THOR Docker: persist `client_id` for HQ segments | **Kimi** | **Open** if metrics show null client |
| Family free / REQUIRE_LIGHTNING if 402 | **Kimi** | **Open** if paywall hits suite |
| Umami public collector | Suite | Secondary |

**Cam original pain:** Stamp it landed on home without working stamp UX.  
**Fix path:** Satohash SPA API URL + deep-link; Sherpa client hygiene.

---

## Still for Kimi (THOR)

1. If HQ/Satohash segments show `client_id: null` after family stamps → rebuild/restart **satohash-api** Docker so header is stored.  
2. Confirm family-free path for `X-Satohash-Client: sherpacarta` (no surprise 402).  
3. Do **not** redo metrics.json plane; keep `raw.demo: false` with real stamp counts.  
4. Optional: Umami reverse proxy if not already public.

## Canonical contract (do not regress)

```
https://satohash.io/stamp?hash=<64hex>&ref=sherpacarta|sherpacarta-canada&label=…
POST https://api.satohash.io/api/stamp  + X-Satohash-Client
GET  https://satohash.io/verify/{id}
GET  https://api.satohash.io/metrics.json  → gab.product-metrics.v1
```

## Sherpa files (reference)

- `docs/LEARN-STAMP-FAMILY.md`  
- `docs/GROK-PROMPT-STAMP-HANDOFF.md` (task **completed**)  
- `public/sc-core.js`, `public/js/sc-petition-canada.js`, `src/lib/satohash.js`

## Not for Kimi

- Customer CRM data  
- Canada MP e-### politics  
- Secrets in git  
