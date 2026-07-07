# Session Summary — 2026-07-07

**Project:** SherpaCarta  
**Machine:** M3 (Grok)  
**Live:** https://sherpacarta.org  
**BUILD:** 647

---

## Chat Topic

User asked to complete Sprints 6, 7, and 8 without further input, then receive a 200-item improvement backlog.

---

## What We Finished

- [x] **Sprint 6** — Split `index.html`: `sc-main.css` (64 KB), `sc-core.js` (75 KB), `sc-bundle.js` (352 KB, 17 files)
- [x] `index.html` reduced from 212 KB → 72 KB (gzip 17 KB)
- [x] Lighthouse CI: `lighthouserc.cjs`, `.github/workflows/lighthouse.yml`, `@lhci/cli`
- [x] `sc-upgrades-b9.js` features 588–607, BUILD 607
- [x] **Sprint 7** — `treasury.html` live dashboard, donate widget, `security.html` bug bounty
- [x] `sc-upgrades-b10.js` features 608–627, BUILD 627
- [x] Updated `security.txt` policy URL
- [x] **Sprint 8** — `embed.js`, `@giveabit/sherpacarta` SDK, `@giveabit/sherpacarta-mcp` server
- [x] `sc-upgrades-b11.js` features 628–647, BUILD 647
- [x] API: per-article JSON, `index.json` catalog, mcp.json v3.0
- [x] Service worker v5.0, `_headers` cache rules
- [x] `IMPROVEMENTS-200.md` backlog
- [x] Build + seo-audit + i18n-audit passed

---

## What We Are Still Aiming to Finish

- [ ] Deploy BUILD 647 to sherpacarta.org
- [ ] Publish npm packages to registry
- [ ] Replace Lightning TEMP with live LNURL (needs Cam)
- [ ] Add remaining 100 charter articles (only 14 in CHARTER — see IMPROVEMENTS #1)
- [ ] Kimi: sync Sprints 6–8 to Obsidian

---

## Key Decisions

- Kept HTML-first architecture; extraction + bundle rather than full Vite SPA migration
- Treasury uses live mempool.space API (client-side, no backend)
- Bug bounty is recognition-based until fund established
- MCP server uses stdio JSON-RPC (MCP-compatible)

---

## Recovery

Use `/whatsup` to continue. See `IMPROVEMENTS-200.md` for prioritized backlog.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*