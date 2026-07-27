# KIMI REQUEST — Satohash product upgrade (Sherpa + family)

**From:** Grok (M3) · SherpaCarta session 2026-07-27  
**To:** Kimi (THOR) + next Grok pass on `~/projects/satohash`  
**Priority:** High — Cam: *“Satohash is not fully working; upgrade further”*  
**Context:** Cam clicked **Stamp it** on Sherpa and landed on a weak handoff:

`https://satohash.io/?ref=sherpacarta&hash=9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b`

API health was OK (`api.satohash.io` v4.1.0-ELITE). The **UX + deep-link + stamp completion path** is the gap.

---

## Goal (definition of done)

A user (or family product) can:

1. Arrive with a prefilled **SHA-256** (+ optional `ref` / `source` / `label` / `campaign`)
2. See a **clear stamp screen** (not a generic homepage that ignores query params)
3. Complete **one obvious action**: Stamp on Bitcoin (OTS)
4. Get **status** pending → confirmed, with **verify URL + proof download**
5. Return to the origin product (Sherpa) with a shareable proof link

No secrets in SPA. No “looks stamped” without real API stamp id.

---

## What is broken / incomplete today

| Issue | Evidence |
|-------|----------|
| Deep-link lands on **home** `/?hash=…&ref=…` | Sherpa `public/sc-core.js` → `satohash.io?ref=sherpacarta&hash=` |
| Canonical client expects **`/stamp?hash=`** | `src/lib/satohash.js` → `satohashStampGuideUrl` |
| **Dual host drift** | Charter → `satohash.io`; Canada sign → `satohash.giveabit.io?ref=sherpacarta-canada` |
| Hash may not auto-fill / auto-route | Cam experience: stamp flow “not fully working” |
| Family docs promise `/stamp?hash=` | Satohash Integrations page + Motopass example |
| Template path still soft | Canada referendum JSON → `satohash.io/templates/` (beta) |

---

## Requirements for Satohash (complete checklist)

### A. Deep-link contract (must implement in SPA)

**Canonical stamp entry (prefer this for all family clients):**

```
https://satohash.io/stamp?hash=<64hex>&ref=<productId>[&source=<productId>][&label=<text>][&campaign=<id>][&filename=<name>]
```

**Also accept (redirect 302/client to `/stamp`):**

```
https://satohash.io/?hash=<64hex>&ref=…
https://satohash.giveabit.io/stamp?hash=…   # same app, same behaviour
https://satohash.giveabit.io/?hash=…
```

| Param | Required | Notes |
|-------|----------|--------|
| `hash` | yes for auto-stamp UI | Exactly 64 lowercase hex; reject/normalize UI if bad |
| `ref` or `source` | recommended | Product id: `sherpacarta`, `sherpacarta-canada`, `motopass`, `giveabit`, … |
| `label` | optional | Human filename/label shown on stamp card |
| `campaign` | optional | e.g. `sherpacarta-canada-v1` |
| `filename` | optional | Passed through to `POST /api/stamp` |

**On load of `/stamp` (or redirected home with hash):**

1. Validate hash → show inline error if invalid  
2. Prefill hash field (read-only if from trusted ref optional)  
3. Prefill label/filename from query  
4. Show product chip: “From SherpaCarta” when `ref` matches known family  
5. Primary CTA: **Stamp on Bitcoin** (one click; no scavenger hunt)  
6. Optional secondary: copy hash, verify existing stamps for this hash  

### B. Stamp lifecycle (API + UI)

| Step | Need |
|------|------|
| Create | `POST https://api.satohash.io/api/stamp` body `{ hash, filename?, email? }` |
| Client header | Accept `X-Satohash-Client: sherpacarta` (and other family ids) for metrics |
| Response | Always return durable `id` + `status` + hash |
| Poll | UI polls stamp status until `confirmed` or terminal fail |
| Verify | Public `/verify/:id` and/or `/verify/:hash` — works cold load, shareable |
| Proof | Download OTS / proof JSON; link to `api/stamps/:id` |
| Errors | Paywall / rate limit / OTS backend down → **human** message + retry |

**Cam bar:** “Stamp it” must not dead-end on a marketing homepage.

### C. Host & routing parity

- `satohash.io` and `satohash.giveabit.io` must run the **same SPA routes** (`/stamp`, `/verify/:id`, templates)
- CF Pages: SPA fallback so deep links never 404
- CORS: browser clients from `https://sherpacarta.org`, `https://*.giveabit.io` can call public stamp/verify APIs as designed

### D. Family product integration (Sherpa-facing — after Satohash SPA fixed)

Grok will align Sherpa later; Satohash should support this first:

| Client | Desired URL |
|--------|-------------|
| Charter stamp (`sc-core.js`) | `/stamp?hash=…&ref=sherpacarta&label=SherpaCarta+charter` |
| Canada campaign stamp | `/stamp?hash=…&ref=sherpacarta-canada&campaign=sherpacarta-canada-v1` |
| ESM helper | Already: `satohashStampGuideUrl(hash)` → `/stamp?hash=` — **make that route real** |
| Optional API path | In-page stamp via `stampHash()` without leaving Sherpa, then show `verifyUrl` |

Also later on Sherpa: one host preference (pick **canonical** `https://satohash.io` or document both as aliases).

### E. Templates & referendum (Canada)

- Publish / polish template at `/templates` for  
  `sherpacarta-canada-referendum-v1`  
  source: `sherpacarta` repo  
  `data/satohash-templates/sherpacarta-canada-referendum.json`
- Template stamp should reuse same deep-link + verify UX

### F. Metrics & HQ

- Keep `https://api.satohash.io/metrics.json` (`gab.product-metrics.v1`) healthy  
- Attribute stamps by `X-Satohash-Client` / `ref` so HQ can show Sherpa vs Motopass vs other  
- Umami: collection still blocked until analytics host is public (prior handoff) — secondary to stamp UX

### G. Acceptance tests (Kimi / Grok)

1. Open  
   `https://satohash.io/stamp?hash=9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b&ref=sherpacarta`  
   → hash prefilled, CTA visible  
2. Open same query on **homepage** `/?hash=…&ref=…` → auto-redirect to `/stamp?...`  
3. Stamp → get `id` → `/verify/{id}` loads after hard refresh  
4. `curl -s https://api.satohash.io/health` → ok  
5. `POST /api/stamp` with test hash → id returned (or clear paywall response)  
6. `satohash.giveabit.io` same as (1)–(3)  
7. From Sherpa: Stamp it → lands on working stamp UI (after Sherpa URL fix)

---

## Ops notes (THOR / Kimi)

- API runtime: THOR Docker (existing)  
- SPA: CF Pages on push to `satohash` main  
- Do **not** put invoice keys / nsec / PATs in git  
- Prefer fixing **SPA deep-link + verify** first (highest Cam-visible pain), then template gallery, then metrics attribution  

---

## Suggested split

| Owner | Work |
|-------|------|
| **Grok (M3)** `satohash` repo | SPA routes `/stamp` query handling, home→stamp redirect, verify polish, Integrations docs match reality |
| **Grok (M3)** `sherpacarta` | After Satohash ships: unify stamp URLs to `/stamp?hash=&ref=`; optional in-app `stampHash()` |
| **Kimi (THOR)** | API stamp reliability, OTS backend, paywall messages, metrics attribution, CF/DNS for both hosts, Umami proxy when ready |

---

## Related Sherpa files (do not fix until Satohash route works — or fix both in one pass)

- `public/sc-core.js` — `stampCharterOnBitcoin` → `/?ref=sherpacarta&hash=`
- `public/js/sc-petition-canada.js` — `stampOnSatohash` → `satohash.giveabit.io?ref=…`
- `src/lib/satohash.js` — correct `/stamp?hash=` helper + API client
- `public/canada/sign.html` — Stamp Bitcoin button
- `docs/CANADA-JOURNEY.md` — proof layer is not Parliamentary

---

## One-line for Cam / pulse

**Satohash:** deep-link stamp handoff incomplete (home ignores hash); need full `/stamp?hash=&ref=` + verify lifecycle + host parity so Sherpa “Stamp it” actually completes on Bitcoin.

— Grok · M3 · 2026-07-27 · Sherpa SHA `71ef9b1` (context)
