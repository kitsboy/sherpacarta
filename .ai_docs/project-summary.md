# Project Summary — Sherpacarta

**What:** Global Digital Magna Carta — 114-article charter, international-first home, Canada dual-track petition, public metrics, Satohash proof handoff, official 2-min film.  
**Domain:** https://sherpacarta.org  
**Last Updated:** 2026-08-11  

## One-Liner
SherpaCarta is a living digital rights charter (CC0): international first; Canada is a live national offering (campaign signs + federal paper now; Commons e-### when an MP sponsors). Proof plane via Satohash (`/stamp?hash=&ref=`). Official 2-minute film on home.

## Core Features
- 114-article charter (`data/charter.json`) + interactive browser (`/#articles`)
- International-first home · Canada as offering under `/canada/`
- Official 2-min film `#film` · companion HRF YouTube embed
- Canada hub + official path (honest dual-track)
- Campaign sign, paper sheets, organizer kits
- Live metrics: CF Function `GET /metrics.json` (`gab.product-metrics.v1`)
- Satohash family stamp client (deep-link + optional API)
- Nostr wall + sherpa@ NIP-05 (parent giveabit)
- Public API under `public/api/v1/` · SDK packages (npm publish pending)

## Tech Stack
Static HTML/JS + Vite + Cloudflare Pages · Workers/Functions for Canada stats + metrics  
Vanilla JS: `sc-core.js`, `sc-bundle.js`, `js/sc-petition-canada.js`  
Film pipeline: HyperFrames + Kokoro TTS → `public/video/sherpacarta-2min.mp4`

## Integrations
- **Satohash** — stamp/verify (`docs/LEARN-STAMP-FAMILY.md`)
- **HQ** — metrics envelope + LNbits wallet id `sherpacarta`
- **Umami** — first-party analytics
- **Nostr** — public discussion / bot package
- **LNbits** — balances via HQ Vault only
- **Human Rights Foundation** — companion YouTube (external)

## Agent docs
- `docs/PREP-NOW.md` — what to prep next  
- `docs/LEARN-STAMP-FAMILY.md` — stamp contract  
- `docs/CANADA-JOURNEY.md` — petition journey  
- `docs/VIDEO-HERMES-HYPERFRAMES.md` — film package  
- `docs/KIMI-HANDOFF.md` — session log  
