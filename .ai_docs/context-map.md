# Sherpacarta — Context Map

BUILD: 840 / film bust 841 · Updated: 2026-08-11

## Directory Structure
```
sherpacarta/
  index.html              Main landing (international-first, #film, #articles)
  data/charter.json       114 articles + preamble source of truth
  public/
    sc-main.css           Styles (BUILD 800–840 contrast + film)
    sc-core.js            Core JS (CHARTER injected)
    sc-bundle.js          Enhancements + upgrades (content-visibility off)
    _headers              CSP (YouTube frame-src, media-src self)
    video/
      sherpacarta-2min.mp4   Official film (committed · cache ?v=841)
    js/                   Canada + press scripts
    canada/               Campaign pages
    api/v1/               Public JSON API
  video/sherpacarta-2min/ HyperFrames source project (local media gitignored)
  packages/               SDK + MCP (npm publish pending)
  scripts/                Build generators
  docs/                   Documentation (incl. VIDEO-HERMES-HYPERFRAMES)
  dist/                   Build output (gitignored)
  deploy.sh               Cloudflare Pages deploy
```

## Build Chain
```
npm run build =
  generate-charter → inject-charter → generate-campaign
  → generate-metrics → inject-analytics → bundle-js
  → generate-api → generate-sitemap → generate-charter-txt
  → generate-og-cards → vite build
```

## Stack
Static HTML/JS + Vite build · Cloudflare Pages  
Vanilla JS: `sc-core.js`, `sc-bundle.js`, `js/sc-petition-canada.js`  
Film: HyperFrames (HTML/GSAP) → MP4 · Kokoro TTS on M3 (`.tools/hf-venv311`)

## Ports
Dev: 5173 / Preview: 4173

## Deployment
Production: Cloudflare Pages via `./deploy.sh` (`pages_build_output_dir = dist`)
