# Prep now — what we can still update/push (no secrets)

**Date:** 2026-08-11 (session close)  
**After:** BUILD 840 site fixes · Kokoro film VO live · film embed · international-first home

## Already shipped (do not redo)

- Official 2-min film on home `#film` with **Kokoro** VO (`?v=841`)
- CSP YouTube for HRF companion · 16:9 film frame fit · Art. 114 below-fold blank fix
- Canada sign public-mandate rewrite + e-petition upgrade
- Canada join QR landing (federal/BC) polish + sticky CTA
- HQ metrics activity stream on sign + Umami events
- Ambient control removed from home
- Canada hub + official path (promise / tracks / MP tools)  
- Live `/metrics.json` CF Function · `raw.demo: false`  
- Satohash family deep-link + honest API stamp client  
- Nostr sherpa@ NIP-05 (parent giveabit) · bot package (seed local)  
- HQ metrics schema gate (HQ repo)  

## Safe prep now (code/docs — M3 Grok)

| # | Item | Why | Risk |
|---|------|-----|------|
| 1 | **9:16 crop** of 2-min film for Stories/Reels | Social distribution | Low–med (render time) |
| 2 | **Captions re-sync** if VO timeline drifts after future re-renders | Accessibility | Low |
| 3 | **Cache-bust** `?v=` if deploy sticks | Browsers cache old CSS/JS/MP4 | Low |
| 4 | **Press / marketing links** → `/stamp?ref=sherpacarta` | No weak giveabit home links | Low |
| 5 | **Public Lightning LNURL** | Donate UX | **→ Kimi** `docs/KIMI-REQUEST-LNURL.md` |
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
- Replacing production film VO with macOS `say`  

## Cam checklist (human)

1. Hard-refresh sherpacarta.org → `#film` — confirm Kokoro voice (not robotic say)  
2. Confirm HRF companion YouTube plays (not blank)  
3. Open Art. 114 → scroll page below — no missing sections  
4. Stamp charter → lands on satohash `/stamp?hash=…`  
5. When MP ready: e-### → update campaign JSON → redeploy  

## Success signals

| Signal | Where |
|--------|--------|
| Film + VO | `/#film` · MP4 `?v=841` · content-length ~15.6MB · human Kokoro voice |
| Companion | YouTube iframe paints; CSP includes youtube-nocookie |
| Art. 114 | Body + SHERPACARTA EXTENSION visible; timeline/orgs below not blank |
| Stamp deep-link | Live sc-core contains `/stamp?hash` + `satohashStampGuideUrl` |
| Metrics live | `curl sherpacarta.org/metrics.json` → `raw.demo: false` |
