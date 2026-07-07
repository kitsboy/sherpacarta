# SOURCE-OF-TRUTH.md — sherpacarta

**Project Name:** SherpaCarta  
**Date:** 2026-07-07  
**BUILD:** 20260707-688  
**Live:** https://sherpacarta.org

## Project Overview (Simple Pitch)
SherpaCarta is the Global Digital Magna Carta for the 21st Century — a living, globally-signed charter of 114 articles protecting digital privacy, data sovereignty, freedom of expression, and algorithmic rights for every person on Earth (all 8 billion).

It is a moral and political declaration and modern successor to the 1215 Magna Carta and the 2011 Icelandic Constitutional Bill. The project includes an interactive single-page site, a Canada/BC petition system, treasury and security pages, a public API, npm SDK + MCP server, and zero-tracking privacy by design. CC0 public domain. Bitcoin-funded only.

This folder (`/Users/cam/projects/sherpacarta/`) is the **canonical single source of truth**.

## Core Files

### Site
- `index.html` — Main landing page (~77 KB; links external CSS/JS)
- `public/sc-main.css` — Extracted styles
- `public/sc-core.js` — Core interactivity; CHARTER array injected at build from `data/charter.json`
- `public/sc-bundle.js` — Concatenated enhancements + `sc-upgrades-b1.js` … `b13.js`
- `public/js/sc-petition-canada.js` — Canada petition (passkey, Nostr, merkle, Satohash)
- `public/js/sc-press-outlets.js` — Press section icons + mobile marquee
- `public/sw.js` — Service worker cache v5.3
- `public/canada/` — Canada campaign pages (index, sign, proof, about, bc/)
- `treasury.html`, `security.html` — Sprint 7 pages
- `embed.js` — Embeddable sign widget

### Data & API
- `data/charter.json` — Source of truth for all 114 articles + preamble
- `data/campaign-canada.json` — Canada petition campaign metadata
- `public/api/v1/` — Charter JSON, per-article files, hash, OpenAPI, index
- `public/sitemap.xml` — 143 URLs (114 articles + pages)
- `public/robots.txt`

### Build Scripts
- `scripts/generate-charter.mjs` — charter.json from source
- `scripts/inject-charter.mjs` — inject CHARTER into sc-core.js
- `scripts/generate-campaign.mjs` — campaign JSON + proof
- `scripts/bundle-js.mjs` — sc-bundle.js
- `scripts/generate-api.mjs` — API article files
- `scripts/generate-sitemap.mjs` — sitemap.xml
- `npm run build` — full pipeline + Vite → `dist/`

### Packages (local, publish pending)
- `packages/sherpacarta` — `@giveabit/sherpacarta` JS SDK
- `packages/sherpacarta-mcp` — MCP server (stdio JSON-RPC)

### Documentation
- `README.md`, `CHANGELOG.md`, `IMPROVEMENTS-200.md`
- `docs/EXECUTIVE_SUMMARY.md`, `docs/MARKETING.md`, `docs/MISSION.md`
- `docs/ROADMAP.md`, `docs/DEPLOYMENT.md`, `docs/FEATURES.md`, `docs/USAGE.md`
- `docs/CANADA-BC-CHALLENGE.md`, `docs/KIMI-HANDOFF.md`
- `docs/SEO.md` + locale `docs/SEO-*.md`
- `deploy.sh` — build + Cloudflare Pages deploy

## Git & Deployment
- **GitHub:** https://github.com/kitsboy/sherpacarta.git
- **Branch:** `main`
- **Last commit:** `0d71baa` (BUILD 688 press outlets)
- **Deploy:** `./deploy.sh` → Cloudflare Pages project `sherpacarta`
- **Dev:** `npm run dev` (http://localhost:5173)
- **Build:** `npm run build` → `dist/`

## Upgrade Module Stack
`sc-enhancements.js` (v1–v6) + `sc-upgrades-b1.js` … `b13.js` → `sc-bundle.js`

| Batch | Features | BUILD |
|-------|----------|-------|
| b9 | 588–607 | 607 (Sprint 6) |
| b10 | 608–627 | 627 (Sprint 7) |
| b11 | 628–647 | 647 (Sprint 8) |
| b12 | 648–667 | 667 (full charter) |
| b13 | 668–687 | 687 (Canada) |
| press | — | 688 (outlets UI, standalone script) |

## Mission Alignment (Give A Bit)
Bitcoin sovereignty, privacy, human dignity. Zero tracking. Local-first signing. OpenTimestamps via Satohash. Nostr for public discourse. Canada/BC as first law-change beachhead.

## Current Gaps & Next Priorities
- **Lightning live wallet** — TEMP placeholder; replace when Cam provides LNURL
- **npm publish** — `npm login && npm run publish:packages`
- **Federal e-petition** — needs MP sponsor + official e-### number
- **Satohash template** — submit `sherpacarta-canada-referendum.json` when ready
- **Full charter i18n** — UI locales exist; 114-article translations mostly sample-only
- **Press kit PDF** — export from MARKETING.md (IMPROVEMENTS #119)
- **Kimi sync** — Obsidian / MASTER-BRAIN from `docs/KIMI-HANDOFF.md`

## Hand-off Notes for Kimi (M4 HERMES)
See latest section in `docs/KIMI-HANDOFF.md` and `SESSION-SUMMARY-2026-07-07.md`. Integrate BUILD 647–688 into vault. This file is the perpetual source of truth — all agents must update it on meaningful changes.

— Updated 2026-07-07 (BUILD 688)