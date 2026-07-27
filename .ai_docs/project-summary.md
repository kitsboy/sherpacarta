# Project Summary — Sherpacarta

**What:** Global Digital Magna Carta — 114-article charter, Canada dual-track petition, public metrics, Satohash proof handoff.  
**Domain:** https://sherpacarta.org  
**Last Updated:** 2026-07-27  

## One-Liner
SherpaCarta is a living digital rights charter (CC0) with a Canada-first campaign: campaign signs + federal paper now; official Commons e-petition when an MP sponsors e-###. Proof plane via Satohash (`/stamp?hash=&ref=`).

## Core Features
- 114-article charter (`data/charter.json`)
- Canada hub `/canada/` + official path `/canada/official` (honest dual-track)
- Campaign sign, paper sheets, organizer kits
- Live metrics: CF Function `GET /metrics.json` (`gab.product-metrics.v1`)
- Satohash family stamp client (deep-link + optional API)
- Nostr wall + sherpa@ NIP-05 (parent giveabit)
- Public API under `public/api/v1/` · SDK packages (npm publish pending)

## Tech Stack
Static HTML/JS + Vite + Cloudflare Pages · Workers/Functions for Canada stats + metrics  
Vanilla JS: `sc-core.js`, `sc-bundle.js`, `js/sc-petition-canada.js`

## Integrations
- **Satohash** — stamp/verify (`docs/LEARN-STAMP-FAMILY.md`)
- **HQ** — metrics envelope + LNbits wallet id `sherpacarta`
- **Umami** — first-party analytics
- **Nostr** — public discussion / bot package
- **LNbits** — balances via HQ Vault only

## Agent docs
- `docs/PREP-NOW.md` — what to prep next  
- `docs/LEARN-STAMP-FAMILY.md` — stamp contract  
- `docs/CANADA-JOURNEY.md` — petition journey  
- `docs/KIMI-HANDOFF.md` — session log  
