# SherpaCarta — Deployment

## Stack

- **Runtime:** Static HTML/CSS/JS (`index.html` → Vite build → `dist/`)
- **Host:** Cloudflare Pages (`sherpacarta` project)
- **Domain:** https://sherpacarta.org
- **Config:** `wrangler.toml` → `pages_build_output_dir = "dist"`

## Commands

```bash
npm install          # once
npm run dev          # local dev (http://localhost:5173)
npm run build        # output to dist/
npm run preview      # test production build locally
./deploy.sh          # build + wrangler pages deploy
```

## Deploy Script

`deploy.sh` builds and deploys `dist/` via `npx wrangler pages deploy dist/ --project-name sherpacarta`.

**Note:** Interactive `wrangler login` may show "not authenticated" on M3; the script uses a base64-encoded API token. If deploy fails, regenerate token in Cloudflare dashboard and update the blob in `deploy.sh`.

## Git

- **Remote:** https://github.com/kitsboy/sherpacarta.git
- **Branch:** `main`
- Push triggers no auto-deploy unless Cloudflare Git integration is wired; current flow is manual `./deploy.sh`.

## Pre-deploy Checklist

- [ ] `npm run build` succeeds
- [ ] BTC + Lightning addresses are production values
- [ ] `public/og-image.png` exists (social previews)
- [ ] `public/_headers` and `public/_redirects` copied to dist (Vite public dir)

---

*Part of the [Give A Bit](https://giveabit.io) family.*