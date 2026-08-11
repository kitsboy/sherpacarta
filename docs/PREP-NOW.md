# Prep now — deferred vs done

**Date:** 2026-08-11  
**Focus:** Technical finish without marketing / MP / Lightning / Nostr bot ops

## Explicitly deferred (Cam)

| Item | When |
|------|------|
| Marketing / social / film distribution | Later (days–weeks) |
| MP e-### / Parliamentary track | Later (Cam politics) |
| Lightning payments polish / LNbits Vault wiring | Later |
| Nostr bot THOR + product key NIP-65 publish | Later (ops nsec) |
| Coalition org name collection | Later |

## Shipped this technical pass (BUILD 860)

- Unified asset cache-bust `?v=860` across HTML pages
- NIP-05 already live (`docs/NOSTR.md`) — copy/status consistent
- Article summaries for **all** articles (body-derived + cornerstone blurbs)
- Hash deep-links `#art-114` / `#articles` / preamble
- Film: poster JPG, lazy source attach near viewport, companion iframe `loading=lazy`
- Mobile film + articles layout CSS
- Relay health button (`checkNostrRelays`)
- Language section **honest** (EN primary, FR briefing, rest roadmap)
- No marketing push, no fake metrics

## Still technical backlog (optional next)

| # | Item | Notes |
|---|------|--------|
| 1 | Thin sc-bundle feature soup | Low risk if done carefully |
| 2 | Umami → metrics visitors_monthly | Suite/proxy traffic |
| 3 | Province stats when signs exist | Data fills itself |
| 4 | Satohash client_id segments | THOR/satohash if null |
| 5 | Full Lighthouse CI watch | After film lazy deploy |

## Do not invent

- Fake signers / country totals  
- nsec in git  
- Campaign = e-petition counts  
- macOS `say` film VO  
