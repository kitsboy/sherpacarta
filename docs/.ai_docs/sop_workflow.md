# sherpacarta — Standard Operating Procedure

**BUILD:** 688 · **Updated:** 2026-07-07

## Build
```bash
cd ~/projects/sherpacarta && npm run build
```
Full pipeline: charter → inject → campaign → bundle → API → sitemap → Vite → `dist/`.

## Dev Server
```bash
cd ~/projects/sherpacarta && npm run dev
```
Vite dev server on port 5173.

## Pre-Deploy Checks
```bash
cd ~/projects/sherpacarta && git status && npm run build && ls dist/index.html dist/js/sc-press-outlets.js
```

## Deploy
```bash
cd ~/projects/sherpacarta && ./deploy.sh
```
Builds and deploys `dist/` to Cloudflare Pages (`sherpacarta` project).

## Post-Deploy Verify
```bash
curl -sI https://sherpacarta.org | head -1
curl -s https://sherpacarta.org/api/v1/hash.json | head -c 200
```

## Charter Content Edits
Edit `data/charter.json`, then `npm run build` — never edit injected CHARTER in `sc-core.js` directly.

## Docs to Update on Meaningful Changes
- `SOURCE-OF-TRUTH.md`
- `LATEST-UPDATE.md`
- `CHANGELOG.md`
- `docs/KIMI-HANDOFF.md` (session end)