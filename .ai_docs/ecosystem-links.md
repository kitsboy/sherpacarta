# Ecosystem Links — Sherpacarta

**Last Updated:** 2026-09-10

## Connections to Other Projects
| Project | Relationship |
|---------|-------------|
| GiveABit (parent) | Family hub; NIP-05 `sherpa@giveabit.io`; brand |
| HQ (hq.giveabit.io) | Live metrics from `sherpacarta.org/metrics.json`; wallet id `sherpacarta`; static fallback `/metrics/sherpacarta.json` |
| Satohash | OTS proof plane — deep-link `/stamp?hash=&ref=sherpacarta`; API `api.satohash.io`; verify `satohash.io/verify/{id}` |
| Umami | Website ID `9b6f05bf-286e-4b21-9094-1d675f9b4442`; collector `analytics.giveabit.io` |
| Katoa | Related suite (creators / Nostr) |
| MotoPass | Related suite (passports / proofs) |

## Shared Infrastructure
- Cloudflare Pages → sherpacarta.org  
- Nostr NIP-05 → giveabit.io/.well-known/nostr.json  
- GitHub → kitsboy/sherpacarta  
- On-chain treasury → `public/data/wallets.json`  
- Lightning public rail → `sherpacarta@breez.tips` (Breez Spark; LNbits retired from public)  
- LNbits / HQ Vault → ops only, not the public donate path  

## Contracts
- Metrics: `gab.product-metrics.v1`  
- Stamp family: `docs/LEARN-STAMP-FAMILY.md`  
- Suite inventory: HQ `docs/ALL-SITE-METRICS.md`  
