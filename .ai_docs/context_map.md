# Sherpacarta — Context Map

**BUILD:** 688 · **Updated:** 2026-07-07

## Directory Structure
```
sherpacarta/
├── index.html              # Main landing (~77 KB)
├── data/charter.json       # 114 articles source of truth
├── public/
│   ├── sc-main.css         # Styles
│   ├── sc-core.js          # Core JS (CHARTER injected)
│   ├── sc-bundle.js        # Enhancements + upgrades b1–b13
│   ├── js/                 # Canada + press scripts
│   ├── canada/             # Campaign pages
│   └── api/v1/             # Public JSON API
├── packages/               # SDK + MCP (npm publish pending)
├── scripts/                # Build generators
├── docs/                   # Documentation
├── dist/                   # Build output (gitignored)
└── deploy.sh               # Cloudflare Pages deploy
```

## Build Chain
```
npm run build =
  generate-charter → inject-charter → generate-campaign
  → bundle-js → generate-api → generate-sitemap → vite build
```

## Configuration
- **Vite:** `vite.config.js` — builds `index.html` → `dist/`
- **Wrangler:** `wrangler.toml` — `pages_build_output_dir = "dist"`
- **SW:** `public/sw.js` — cache `sherpacarta-v5.3`

## Ports
- Dev: 5173 · Preview: 4173

## Deployment
- **Production:** Cloudflare Pages — `./deploy.sh`
- **URL:** https://sherpacarta.org
- **Git:** https://github.com/kitsboy/sherpacarta.git

## Agent Docs
See `SOURCE-OF-TRUTH.md` and `docs/KIMI-HANDOFF.md` for canonical state.