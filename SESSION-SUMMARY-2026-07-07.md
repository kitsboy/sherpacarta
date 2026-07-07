# Session Summary — 2026-07-07

**Project:** SherpaCarta  
**Machine:** M3 (Grok)  
**Live:** https://sherpacarta.org  
**BUILD:** 688

---

## Chat Arc (July 7)

1. Complete Sprints 6–8 + 200-item backlog → **BUILD 647**
2. Full 114-article charter + npm packages → **BUILD 667**
3. Canada petition system (BC, Satohash, Nostr) → **BUILD 687**
4. Press section: centered grid → linked cards, icons, marquee → **BUILD 688**

---

## What We Finished

### Sprint 6 — Architecture (BUILD 607)
- [x] Extracted `public/sc-main.css`, `public/sc-core.js`, `public/sc-bundle.js`
- [x] `index.html` reduced 212 KB → ~77 KB
- [x] Lighthouse CI (`lighthouserc.cjs`, GitHub workflow)
- [x] `sc-upgrades-b9.js` features 588–607

### Sprint 7 — Treasury & Security (BUILD 627)
- [x] `treasury.html` live mempool dashboard
- [x] `security.html` bug bounty page
- [x] `sc-upgrades-b10.js` features 608–627

### Sprint 8 — API, SDK, MCP (BUILD 647)
- [x] `embed.js`, `packages/sherpacarta`, `packages/sherpacarta-mcp`
- [x] Per-article API (`/api/v1/articles/`), sitemap 143 URLs
- [x] `sc-upgrades-b11.js` features 628–647
- [x] `IMPROVEMENTS-200.md` backlog

### Full Charter (BUILD 667)
- [x] `data/charter.json` — all 114 articles + preamble
- [x] `scripts/generate-charter.mjs`, `scripts/inject-charter.mjs`
- [x] Chapter-grouped article browser + search in `sc-core.js`
- [x] `sc-upgrades-b12.js` features 648–667

### Canada Petition (BUILD 687)
- [x] `public/canada/` — index, sign, proof, about, bc/
- [x] `public/js/sc-petition-canada.js` — moral sign, passkey, Nostr kind 1978, merkle root, Satohash
- [x] `data/campaign-canada.json`, Satohash template
- [x] `sc-upgrades-b13.js` features 668–687

### Press Section (BUILD 688)
- [x] Centered card grid with outbound links to real outlets
- [x] `public/js/sc-press-outlets.js` — Simple Icons CDN + custom SVG fallbacks
- [x] Mobile infinite marquee (`prefers-reduced-motion` aware)
- [x] Service worker v5.3 caches press script

---

## Architecture (Current)

| Asset | Path |
|-------|------|
| Main HTML | `index.html` |
| Styles | `public/sc-main.css` |
| Core JS | `public/sc-core.js` (CHARTER injected at build) |
| Bundle | `public/sc-bundle.js` (enhancements + b1–b13) |
| Canada | `public/js/sc-petition-canada.js` |
| Press | `public/js/sc-press-outlets.js` |
| Charter source | `data/charter.json` |
| Build | `generate-charter` → `inject-charter` → `generate-campaign` → `bundle-js` → `generate-api` → `generate-sitemap` → `vite build` |

---

## What We Are Still Aiming to Finish

- [ ] Lightning LNURL live wallet (needs Cam)
- [ ] `npm run publish:packages` (needs `npm login`)
- [ ] Official federal e-petition (needs MP sponsor)
- [ ] Satohash template submit to satohash.io/templates/
- [ ] Kimi: sync July 7 work to Obsidian / MASTER-BRAIN

---

## Git State

- Last commit: `0d71baa` — press outlets BUILD 688
- Branch: `main`
- Deployed: sherpacarta.org via `./deploy.sh`

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*