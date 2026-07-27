# Current Status — Sherpacarta

**Version:** main @ goodbye 2026-07-27  
**Last Updated:** 2026-07-27 (session close)  
**Domain:** https://sherpacarta.org  
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)

## Session close summary
Canada pages enhanced · Satohash stamp family client hardened · docs/ref/handoffs aligned · Kimi asked for public LNURL (LNbits + Vault).

## Recent Milestones
- **2026-07-27:** Kimi request LNURL (`ff6c8bf`) — `docs/KIMI-REQUEST-LNURL.md`
- **2026-07-27:** Docs/ref prep package (`3495e4c`) — LEARN-STAMP-FAMILY, PREP-NOW, agent boot
- **2026-07-27:** Stamp handoff harden (`5204c5d`) — `/stamp?hash=&ref=`, API honesty, sc-bundle
- **2026-07-27:** Canada hub + official path — participation / promise / MP tools
- **2026-07-27:** HQ metrics schema gate v3.25 (HQ repo)
- **2026-07-26:** Live CF metrics + Umami + wallets.json v2

## Live surfaces
| Surface | Notes |
|---------|--------|
| Metrics | `https://sherpacarta.org/metrics.json` · `raw.demo: false` preferred |
| Stamp | `satohash.io/stamp?hash=&ref=sherpacarta\|sherpacarta-canada` |
| Verify | `satohash.io/verify/{id}` |
| Canada | `/canada/` · `/canada/official` dual-track honest |
| HQ | wallet id `sherpacarta` · Vault invoice keys only |

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
| **Cam/Grok** | CF live stamp smoke | PREP-NOW |
| **Cam** | MP e-### | CANADA-JOURNEY |
| — | visitors_monthly may be 0 until Umami overlay | HQ |

## Hard rules
- No secrets in git  
- Campaign ≠ Parliamentary e-petition counts  
- pending ≠ Bitcoin confirmed on stamps  
