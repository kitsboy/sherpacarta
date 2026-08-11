# Current Status — Sherpacarta

**Version:** main @ `bbc38e6` (goodbye 2026-08-11)  
**Last Updated:** 2026-08-11  
**Domain:** https://sherpacarta.org  
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)  
**Site asset bust:** CSS / JS / film / poster **`?v=860`**

## Session close summary (2026-08-11 — GOODBYE)

**Shipped this session (technical only):**
- Official 2-min film on `#film` (Kokoro VO; poster + lazy load)
- BUILD 840: YouTube CSP, 16:9 film fit, Art. 114 below-fold blank fixed
- Nostr NIP-05 live on **sherpacarta.org** (`kimi` + `sherpa` + `_` + `sherpacarta`)
- `sc-nostr-lib.js` multi-relay fan-out + NIP-65 helpers (product key signing deferred)
- BUILD 860: cache-bust unify, full article summaries, hash jumps, relay health, i18n honesty

**Explicitly deferred by Cam (do not start without ask):**
- Marketing / social / 9:16 film push  
- MP e-###  
- Lightning payments setup  
- Nostr bot THOR + product nsec NIP-65 publish  

Canada dual-track + honest metrics unchanged. Zero tracking ethos preserved.

## Recent Milestones
- **2026-08-11 goodbye:** BUILD 860 technical finish (`5602f11`+) · video MIME headers (`10d2801`)
- **2026-08-11:** Nostr NIP-05 on domain · `docs/NOSTR.md` (`66204a6`)
- **2026-08-11:** Kokoro film VO re-render · live MP4 (`47d0e32`)
- **2026-08-11:** BUILD 840 CSP/film/Art.114 (`a582219`)
- **2026-08-11:** Film embedded on home (`cd7f16f`)
- **2026-07-27:** Canada join/sign polish · HQ metrics · stamp smoke

## Live surfaces
| Surface | Notes |
|---------|--------|
| Home film | `#film` · `/video/sherpacarta-2min.mp4?v=860` · poster JPG · Kokoro · lazy source |
| HRF companion | YouTube nocookie · CSP frame-src |
| NIP-05 | `https://sherpacarta.org/.well-known/nostr.json` · JSON + CORS |
| Product NIP-05 | `sherpa@sherpacarta.org` (primary `_` / sherpacarta names) |
| Ops NIP-05 | `kimi@sherpacarta.org` |
| Articles | `/#articles` · `#art-114` · body-derived summaries all articles |
| Metrics | `/metrics.json` · `raw.demo: false` |
| Canada | `/canada/sign` mandate · dual-track honesty |
| Stamp | `satohash.io/stamp?hash=&ref=sherpacarta` |
| Discuss | `/nostr` wall (read-only) |

## Labels
- productId / LNbits: **`sherpacarta`**
- Umami: `9b6f05bf-286e-4b21-9094-1d675f9b4442`
- Stamp refs: `sherpacarta` · `sherpacarta-canada`
- NIP-05 product: `sherpa@sherpacarta.org` · ops: `kimi@sherpacarta.org`
- Film: `public/video/sherpacarta-2min.mp4` (+ poster); source `video/sherpacarta-2min/` gitignored media

## Do not regress
| Item | Note |
|------|------|
| CSP frame-src | YouTube domains required for HRF companion |
| CSP connect-src | Keep 4 Nostr relays |
| content-visibility | Stay **visible** on sections |
| Film CSS | `.sc-film-player video { max-height: none }` |
| Film VO | Kokoro only — never macOS `say` |
| NIP-05 | `/.well-known/nostr.json` must stay `application/json` |
| Honest metrics | No fake signers / “127 countries” |
| nsec | Never in git or client |

## Open (later — not this session)
| Who | Item | Doc |
|-----|------|-----|
| **Cam / Kimi** | Lightning payments polish | KIMI-REQUEST-LNURL |
| **Kimi** | Nostr bot THOR + seed | GOAL-SHERPA-NOSTR-BUZZ · KIMI-REQUEST-SHERPA-BOT |
| **Cam/Kimi** | Product NIP-65 kind 10002 sign | `data/nostr-nip65-recommended.json` |
| **Cam** | MP e-### when ready | CANADA-JOURNEY |
| **Later** | Marketing / 9:16 social | VIDEO-HERMES |
| — | Umami visitors_monthly | HQ |
| Optional | Thin sc-bundle feature soup | code |

## Hard rules
- No secrets in git  
- Public mandate ≠ Parliamentary e-petition counts  
- pending ≠ Bitcoin confirmed on stamps  
- HQ metrics: no PII  
