# Sherpacarta — Context Map

BUILD: **860** · Updated: 2026-08-11 (goodbye)

## Directory Structure
```
sherpacarta/
  index.html                 Main landing (international-first, #film, #articles)
  data/charter.json          114 articles + preamble source of truth
  public/
    sc-main.css              Styles BUILD 800–860
    sc-core.js               Core JS (CHARTER injected; summaries; film lazy)
    sc-bundle.js             Enhancements + upgrades (content-visibility off)
    _headers                 CSP + NIP-05 JSON + /video MIME
    .well-known/nostr.json   NIP-05 (kimi + sherpa + _ + sherpacarta)
    video/
      sherpacarta-2min.mp4
      sherpacarta-2min-poster.jpg
    js/
      sc-nostr-lib.js        Shared relays / publish / NIP-65 helpers
      sc-nostr-wall.js       Read-only wall
      sc-petition-canada.js  Canada campaign (kind 1978 optional)
    data/
      nostr-sherpa.json      Public agent config (no nsec)
      nostr-nip65-recommended.json
    canada/                  Campaign pages
    api/v1/                  Public JSON API
  video/sherpacarta-2min/    HyperFrames source (local media gitignored)
  packages/                  SDK + MCP + sherpa-nostr-bot
  scripts/                   Build generators
  docs/                      NOSTR.md · VIDEO-HERMES · PREP-NOW · KIMI-HANDOFF
  dist/                      Build output (gitignored)
  deploy.sh                  Cloudflare Pages deploy
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
Static HTML/JS + Vite · Cloudflare Pages  
Vanilla JS · HyperFrames film · Kokoro TTS (M3 `.tools/hf-venv311`)

## Ports
Dev: 5173 / Preview: 4173

## Deployment
`./deploy.sh` → `pages_build_output_dir = dist`
