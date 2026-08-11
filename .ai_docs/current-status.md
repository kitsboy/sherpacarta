# Current Status — Sherpacarta

**Version:** main @ `0739100` (session close 2026-08-11)  
**Last Updated:** 2026-08-11  
**Domain:** https://sherpacarta.org  
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)  
**Site asset bust:** CSS/JS `?v=840` · film `?v=841`

## Session close summary (2026-08-11)

Home is international-first with official **2-min film** on `#film` (Kokoro VO, not macOS say). HRF YouTube companion embeds via CSP. Art. 114 / below-fold blank fixed (content-visibility off + reveal safety). Canada dual-track + honest metrics unchanged.

## Recent Milestones
- **2026-08-11 (close):** Kokoro `af_nova` film re-render live · `public/video/sherpacarta-2min.mp4?v=841` (`47d0e32`)
- **2026-08-11:** BUILD 840 — CSP YouTube, 16:9 film fit, Art. 114 below-fold blank (`a582219`)
- **2026-08-11:** Official 2-min HyperFrames film embedded on home (`cd7f16f`)
- **2026-08-11:** THOR/Kimi HyperFrames package + final.mp4 source under `video/sherpacarta-2min/`
- **2026-07-27:** Join QR landing polish · ambient removed · HQ metrics · stamp smoke PASS

## Live surfaces
| Surface | Notes |
|---------|--------|
| Home film | `#film` · `/video/sherpacarta-2min.mp4?v=841` · 120s · 1080p30 · Kokoro VO |
| HRF companion | YouTube nocookie embed · CSP allows youtube.com / youtube-nocookie.com |
| Articles | `/#articles` · Art. 114 body + extension · jumpToArticle |
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
- Film project: `video/sherpacarta-2min/` (local mp4/wav gitignored; **public/** mp4 committed)

## Known issues / do-not-regress
| Item | Note |
|------|------|
| CSP frame-src | Must keep YouTube domains or HRF companion blanks again |
| content-visibility | Keep **off** on `.section` — was blanking post–Art. 114 |
| video max-height | `.sc-film-player video { max-height: none }` — global 400px broke 16:9 |
| Film VO | Prefer Kokoro; do **not** re-ship macOS `say` as production |
| Honest metrics | No fake signers / country totals / “127 countries” |

## Open (ops)
| Who | Item | Doc |
|-----|------|-----|
| **Kimi** | Public LNURL/lud16 via LNbits → Vault | `docs/KIMI-REQUEST-LNURL.md` |
| **Kimi** | Nostr bot THOR deploy | `docs/KIMI-REQUEST-SHERPA-BOT.md` |
| **Kimi** | satohash-api `client_id` if null | LEARN-STAMP |
| **Cam** | MP e-### | CANADA-JOURNEY |
| **Optional** | 9:16 crop of film for Stories | VIDEO-HERMES-HYPERFRAMES |
| — | visitors_monthly until Umami overlay | HQ |
| — | Legacy KV byProvince empty until new signs | optional backfill |

## Hard rules
- No secrets in git  
- Public mandate ≠ Parliamentary e-petition counts  
- pending ≠ Bitcoin confirmed on stamps  
- HQ metrics: no PII (opt-in wall names only; activity = method/province)
