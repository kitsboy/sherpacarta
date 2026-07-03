# sherpacarta — Standard Operating Procedure

## Build
```bash
cd ~/projects/sherpacarta && npm run build
```
Outputs to `dist/`. Note: React `src/` is legacy. The production site is a self-contained 160 KB `index.html` with inline vanilla JS/CSS.

## Dev Server
```bash
cd ~/projects/sherpacarta && npm run dev
```
Vite dev server on port 5173.

## Pre-Deploy Checks
```bash
cd ~/projects/sherpacarta && git status && npm run build && ls dist/index.html
```

## Deploy (Manual — from M4 only)
```bash
# On M4:
cd ~/projects/sherpacarta && ./deploy.sh
```
The `deploy.sh` script contains base64-encoded CF API token (M4 only).
Alternative: `npx wrangler pages deploy dist/ --project-name sherpacarta`

## Post-Deploy Verify
```bash
curl -sI https://sherpacarta.org | grep -q '200'
```

## Sync dist from M3 to M4
```bash
rsync -avz --delete ~/projects/sherpacarta/dist/ m4:~/tmp-sherpacarta-dist/
```
