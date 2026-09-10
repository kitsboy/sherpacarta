# Sherpacarta — Context Map

Updated: 2026-09-10 · SW **v9.7** · cache **v=918**

## Directory Structure
```
sherpacarta/
  index.html                 Home: first-choice hero, articles, sign, Canada nudge
  data/charter.json          114 articles + preamble
  public/
    sc-main.css              Design system + 390px chrome + --kb-inset
    sc-core.js               CHARTER inject, sign, In brief, visualViewport
    sc-bundle.js             Curated 7-file minify (not the old 21-file soup)
    sw.js                    sherpacarta-v9.7
    start.html               Role gate (Visitor / Sign / Canadian / Organizer / Verifier / Media)
    verify.html              Pending is not Bitcoin-confirmed
    js/
      sc-share.js            Lazy: click Share
      sc-nostr-lib.js        Lazy: connect / publish
      sc-press-outlets.js    Lazy: near press section
      sc-petition-canada.js  Eager on home (campaign)
      sc-next100.js          Sign draft/review
    canada/                  Dual-track campaign pages
    api/v1/                  Public JSON API
  scripts/
    bundle-js.mjs            KEEP list: enhancements, v2, b1, b3, b4, b14, b15
    check-next100-surface.mjs
    check-sign-flow.mjs
  docs/                      KIMI-HANDOFF · NEXT-100-UX · CANADA-JOURNEY · LEARN-STAMP-FAMILY
```

## Live home JS (eager)
`sc-analytics` · `sc-top30` · `sc-next100` · `sc-disclosure` · `sc-route-ux` · `sc-reliability` · `sc-a11y` · `sc-petition-canada` · `sc-core` · `sc-bundle`

Lazy: share, nostr-lib, press-outlets, QR (cdn on donate click).

Dropped from production bundle (sources remain in `public/`): `sc-enhancements-v3.js`–`v6.js`, `sc-upgrades-b2.js`, `b5`–`b13.js`.

## Build Chain
```
npm run build =
  generate-charter → inject-charter → generate-campaign
  → generate-metrics → inject-analytics → bundle-js
  → generate-api → generate-sitemap → generate-charter-txt
  → generate-og-cards → vite build
```

## Stack
Static HTML/JS + Vite · Cloudflare Pages · vanilla JS

## Ports
Dev 5173 · Preview 4173+

## Deployment
Push `origin/main` → Cloudflare Pages. `./deploy.sh` if a manual Pages publish is needed.
