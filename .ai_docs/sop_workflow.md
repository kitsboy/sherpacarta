# Sherpacarta — Standard Operating Procedure

**BUILD:** 688 · **Updated:** 2026-07-07

## Build
```bash
cd ~/projects/sherpacarta && npm run build
```

## Dev
```bash
npm run dev    # port 5173
```

## Deploy
```bash
./deploy.sh    # build + Cloudflare Pages
```

## Key Paths
- Charter source: `data/charter.json`
- Core JS: `public/sc-core.js` (injected at build)
- Bundle: `public/sc-bundle.js`
- Canada: `public/js/sc-petition-canada.js`
- Press: `public/js/sc-press-outlets.js`

## Agent Canonical State
`SOURCE-OF-TRUTH.md` · `docs/KIMI-HANDOFF.md`