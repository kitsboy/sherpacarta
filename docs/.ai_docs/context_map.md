# sherpacarta — Context Map

**BUILD:** 688 · **Updated:** 2026-07-07

## Stack
| Layer | Technology |
|-------|-----------|
| Bundler | Vite 8 |
| Runtime | HTML-first: `index.html` + external CSS/JS |
| Core | `public/sc-core.js` (CHARTER injected at build) |
| Bundle | `public/sc-bundle.js` (enhancements + b1–b13) |
| Legacy src/ | React 19 scaffold — unused in production |
| Hosting | Cloudflare Pages → sherpacarta.org |

## Ports
| Service | Port |
|---------|------|
| Vite dev | 5173 |
| Vite preview | 4173 |

## Content
| Feature | Details |
|---------|---------|
| Articles | 114 + preamble in `data/charter.json` |
| API | `/api/v1/` — 114 article JSON files, hash, OpenAPI |
| Canada | `/canada/` + `sc-petition-canada.js` |
| Press | `sc-press-outlets.js` — icons + mobile marquee |
| Sitemap | 143 URLs |
| License | CC0 Public Domain |
| Tracking | Zero |

## Build Chain
```
data/charter.json
  → generate-charter.mjs
  → inject-charter.mjs (sc-core.js)
  → generate-campaign.mjs
  → bundle-js.mjs (sc-bundle.js)
  → generate-api.mjs
  → generate-sitemap.mjs
  → vite build → dist/
```

## Entry Points
| Path | Purpose |
|------|---------|
| index.html | Main landing page |
| public/canada/ | Canada petition campaign |
| treasury.html | Mempool treasury dashboard |
| security.html | Bug bounty |
| packages/sherpacarta | npm SDK (publish pending) |
| packages/sherpacarta-mcp | MCP server |
| deploy.sh | Build + Cloudflare Pages deploy |

## Key Docs
- `SOURCE-OF-TRUTH.md` — canonical agent state
- `docs/KIMI-HANDOFF.md` — M3→M4 handoff log
- `IMPROVEMENTS-200.md` — backlog
- `SESSION-SUMMARY-2026-07-07.md` — latest session