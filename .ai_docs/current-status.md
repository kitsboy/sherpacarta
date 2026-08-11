# Current Status — Sherpacarta

**Version:** main @ a582219 (BUILD 840)  
**Last Updated:** 2026-08-11  
**Domain:** https://sherpacarta.org  
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)

## Session close summary
BUILD 840 live: YouTube HRF companion CSP fixed · official 2-min film 16:9 fit · Art. 114 / post-articles blank fixed (content-visibility off). Film on home `#film`. Canada mandate + honest metrics unchanged.

## Recent Milestones
- **2026-08-11:** BUILD 840 — CSP YouTube, film max-height fix, content-visibility/reveal safety (`a582219`)
- **2026-08-11:** Official 2-min film embedded · `public/video/sherpacarta-2min.mp4`
- **2026-07-27 (close):** Join QR landing polish (`fe374ac`) — federal paper hero, sticky CTA, dual-track language
- **2026-07-27:** Ambient UI removed + CDN/SW cache-bust (`c3ffc2c`–`dbe6884`)
- **2026-07-27:** HQ mandate feed — KV activity/daily + richer `metrics.json` + Umami events
- **2026-07-27:** `/canada/sign` public-mandate rewrite + e-petition upgrade path
- **2026-07-27:** Stamp family smoke PASS; Kimi LNURL request filed earlier

## Live surfaces
| Surface | Notes |
|---------|--------|
| Metrics | `https://sherpacarta.org/metrics.json` · `raw.demo: false` · `raw.canada.*` |
| Canada stats | `GET /api/canada/stats` — total, 24h/7d, daily, activity |
| Sign | `/canada/sign` public mandate + e-petition path |
| Join (QR) | `/canada/join?from=paper&sheet=federal` |
| Stamp | `satohash.io/stamp?hash=&ref=sherpacarta\|sherpacarta-canada` |
| HQ | wallet id `sherpacarta` · Vault only |

## Labels
- productId / LNbits: **`sherpacarta`**
- Umami: `9b6f05bf-286e-4b21-9094-1d675f9b4442`
- Stamp refs: `sherpacarta` · `sherpacarta-canada`
- NIP-05: `sherpa@giveabit.io`

## Open (ops)
| Who | Item | Doc |
|-----|------|-----|
| **Kimi** | Public LNURL/lud16 via LNbits → Vault | `docs/KIMI-REQUEST-LNURL.md` |
| **Kimi** | Nostr bot THOR deploy | `docs/KIMI-REQUEST-SHERPA-BOT.md` |
| **Kimi** | satohash-api `client_id` if null | LEARN-STAMP |
| **Cam** | MP e-### | CANADA-JOURNEY |
| — | visitors_monthly until Umami overlay | HQ |
| — | Legacy KV byProvince empty until new signs | optional backfill |

## Hard rules
- No secrets in git  
- Public mandate ≠ Parliamentary e-petition counts  
- pending ≠ Bitcoin confirmed on stamps  
- HQ metrics: no PII (opt-in wall names only; activity = method/province)
