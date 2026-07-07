# SherpaCarta — Deployment

**BUILD:** 688 · **Last deploy:** 2026-07-07

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Static HTML/CSS/JS |
| Build | Node scripts + Vite 8 → `dist/` |
| Host | Cloudflare Pages (`sherpacarta` project) |
| Domain | https://sherpacarta.org |
| Config | `wrangler.toml` → `pages_build_output_dir = "dist"` |
| SW cache | `sherpacarta-v5.3` |

## Commands

```bash
npm install          # once
npm run dev          # local dev (http://localhost:5173)
npm run build        # full pipeline → dist/
npm run preview      # test production build locally
./deploy.sh          # build + wrangler pages deploy
npm run publish:packages   # npm SDK + MCP (needs npm login)
npm run lighthouse:ci      # Lighthouse CI
npm run seo-audit          # SEO audit script
npm run i18n-audit         # i18n completeness audit
```

## Build Pipeline

`npm run build` runs in order:

1. `scripts/generate-charter.mjs` — `data/charter.json`
2. `scripts/inject-charter.mjs` — inject CHARTER into `public/sc-core.js`
3. `scripts/generate-campaign.mjs` — Canada campaign + proof JSON
4. `scripts/bundle-js.mjs` — concatenate → `public/sc-bundle.js`
5. `scripts/generate-api.mjs` — `/api/v1/articles/*.json` (114 files)
6. `scripts/generate-sitemap.mjs` — `public/sitemap.xml` (143 URLs)
7. `vite build` — copy `public/` + `index.html` → `dist/`

## Deploy Script

`deploy.sh` builds and deploys `dist/` via `npx wrangler pages deploy dist/ --project-name sherpacarta`.

**Note:** Interactive `wrangler login` may show "not authenticated" on M3; the script uses a base64-encoded API token. If deploy fails, regenerate token in Cloudflare dashboard and update the blob in `deploy.sh`.

## Git

- **Remote:** https://github.com/kitsboy/sherpacarta.git
- **Branch:** `main`
- Push does not auto-deploy; current flow is manual `./deploy.sh`.

## Pre-deploy Checklist

- [ ] `npm run build` succeeds
- [ ] BTC address is production value; Lightning still TEMP until LNURL live
- [ ] `public/og-image.png` exists (social previews)
- [ ] `public/_headers` and `public/_redirects` present in dist (Vite public dir)
- [ ] Hard-refresh sherpacarta.org after deploy (SW cache bump if assets changed)

## Key Assets in dist/

- `index.html`, `sc-main.css`, `sc-core.js`, `sc-bundle.js`
- `js/sc-petition-canada.js`, `js/sc-press-outlets.js`
- `canada/`, `api/v1/`, `treasury.html`, `security.html`
- `sw.js`, `sitemap.xml`, `robots.txt`

---

*Part of the [Give A Bit](https://giveabit.io) family.*