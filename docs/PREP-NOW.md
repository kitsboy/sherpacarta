# Prep now — what we can still update/push (no secrets)

**Date:** 2026-07-27  
**After:** stamp handoff harden `5204c5d`, Canada hubs, live metrics

## Already shipped (do not redo)

- Canada hub + official path (promise / tracks / MP tools)  
- Live `/metrics.json` CF Function · `raw.demo: false`  
- Satohash family deep-link + honest API stamp client  
- Nostr sherpa@ NIP-05 (parent giveabit) · bot package (seed local)  
- HQ metrics schema gate (HQ repo v3.25)  

## Safe prep now (code/docs — M3 Grok)

| # | Item | Why | Risk |
|---|------|-----|------|
| 1 | **Docs/ref/handoff truth** (this pass) | Agents stop re-breaking stamp URLs | Low |
| 2 | **Confirm CF deploy** of `5204c5d` | Live site must expose `satohashStampGuideUrl` | Ops check |
| 3 | **Cache-bust** `?v=` on sc-core/sc-bundle if deploy sticks | Browsers cache old JS | Low |
| 4 | **Press / marketing links** → `/stamp?ref=sherpacarta` | No weak giveabit home links | Low |
| 5 | **Public Lightning LNURL** | Donate UX | **→ Kimi list** `docs/KIMI-REQUEST-LNURL.md` — LNbits + HQ Vault; Grok publishes lud16 after handback |
| 6 | **MP e-###** when sponsor exists | Flip `campaign-canada.json` officialChannels | Cam politics |
| 7 | **Nostr bot on THOR** | `docs/KIMI-REQUEST-SHERPA-BOT.md` | Kimi |
| 8 | **Satohash THOR rebuild** for client_id segments | HQ family_share chart | Kimi |
| 9 | **Umami visitors** on metrics | Needs analytics proxy traffic | Suite |
| 10 | **Template** canada-referendum on satohash.io/templates | Soft; don’t dead-end | Later |

## Do not prep by inventing

- Fake signers / stamp volume / demo KPI curves  
- Secrets in git  
- Claiming campaign = House of Commons signatures  
- Rebuilding Satohash SPA from Sherpa  

## Cam checklist (human)

1. Hard-refresh sherpacarta.org → Stamp charter → lands on satohash `/stamp?hash=…`  
2. Complete stamp → save `/verify/{id}`  
3. Paste Kimi: bot deploy + optional satohash-api Docker for client_id  
4. When MP ready: e-### → update campaign JSON → redeploy  

## Success signals

| Signal | Where |
|--------|--------|
| Stamp deep-link | Live sc-core contains `/stamp?hash` + `satohashStampGuideUrl` |
| Metrics live | `curl sherpacarta.org/metrics.json` → `raw.demo: false` |
| HQ card | Live origin preferred over static demo |
| Satohash metrics | `api.satohash.io/metrics.json` · stamps > 0 · demo false |
