# Current Status — Sherpacarta

**Version:** main @ HQ mandate feed + sign upgrade 2026-07-27  
**Last Updated:** 2026-07-27  
**Domain:** https://sherpacarta.org  
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)

## Session summary
Canada **sign page** rebuilt as public mandate + e-petition upgrade. Every sign feeds **HQ** via richer `/metrics.json`, `/api/canada/stats` activity stream, and Umami events (`canada_mandate_sign`). Stamp smoke PASS. CSP allows `api.satohash.io`.

## Recent Milestones
- **2026-07-27:** HQ mandate feed — KV activity + daily series + Umami events on sign
- **2026-07-27:** `/canada/sign` major upgrade (public mandate, how change works, e-petition path)
- **2026-07-27:** Stamp family smoke PASS (live sc-core has `satohashStampGuideUrl`)
- **2026-07-27:** Kimi request LNURL (`ff6c8bf`) — `docs/KIMI-REQUEST-LNURL.md`
- **2026-07-27:** Docs/ref prep package — LEARN-STAMP-FAMILY, PREP-NOW, agent boot

## Live surfaces
| Surface | Notes |
|---------|--------|
| Metrics | `https://sherpacarta.org/metrics.json` · `raw.demo: false` · `raw.canada.*` for HQ |
| Canada stats | `GET /api/canada/stats` — total, 24h/7d, daily, activity, recent wall |
| Sign | `/canada/sign` public mandate + e-petition upgrade |
| Stamp | `satohash.io/stamp?hash=&ref=sherpacarta\|sherpacarta-canada` |
| HQ | wallet id `sherpacarta` · Vault invoice keys only · polls metrics |

## Labels
- productId / LNbits: **`sherpacarta`**
- Umami: `9b6f05bf-286e-4b21-9094-1d675f9b4442`
- Stamp refs: `sherpacarta` · `sherpacarta-canada`
- NIP-05: `sherpa@giveabit.io` (live on parent)

## Open (ops)
| Who | Item | Doc |
|-----|------|-----|
| **Kimi** | Public LNURL/lud16 via LNbits → Vault → hand public details | `docs/KIMI-REQUEST-LNURL.md` |
| **Kimi** | Nostr bot THOR deploy | `docs/KIMI-REQUEST-SHERPA-BOT.md` |
| **Kimi** | satohash-api client_id if null | LEARN-STAMP / KIMI-REQUEST-SATOHASH |
| **Cam** | MP e-### | CANADA-JOURNEY |
| — | visitors_monthly may be 0 until Umami overlay | HQ |
| — | Legacy KV may have total without byProvince until new signs | backfill optional |

## Hard rules
- No secrets in git  
- Public mandate ≠ Parliamentary e-petition counts  
- pending ≠ Bitcoin confirmed on stamps  
- HQ metrics: no PII (names only if opt-in wall; activity is method/province only)
