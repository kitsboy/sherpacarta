---
title: Changelog
project: sherpacarta
version_history:
  - version: 4.3.0
    date: 2026-07-07
    summary: Press outlets — linked cards, icons, mobile marquee (BUILD 688)
  - version: 4.2.0
    date: 2026-07-07
    summary: Canada petition system (BUILD 687)
  - version: 4.1.0
    date: 2026-07-07
    summary: Full 114-article charter + API (BUILD 667)
  - version: 4.0.0
    date: 2026-07-07
    summary: Sprints 6–8 architecture, treasury, MCP/SDK (BUILD 647)
  - version: 2.0.1
    date: 2026-07-02
    summary: Mobile polish, footer pay tabs, docs audit
  - version: 2.0.0
    date: 2026-06-10
    summary: Full single-page charter site, marketing docs
audience: devs
last_updated: 2026-07-07
owner: Cam / Give A Bit
---

# Changelog

All notable changes to this project are documented here.

## [4.3.0] — 2026-07-07

### Press Outlets (BUILD 688)
- "As Discussed In" section: centered card grid with real outbound links
- `public/js/sc-press-outlets.js` — Simple Icons CDN (Guardian, HN) + custom SVG fallbacks
- Mobile infinite marquee; respects `prefers-reduced-motion`
- Service worker v5.3 caches press script
- Commit `0d71baa`, deployed to sherpacarta.org

## [4.2.0] — 2026-07-07

### Canada Petition (BUILD 687)
- `public/canada/` — index, sign, proof, about, bc/
- `public/js/sc-petition-canada.js` — auto-Canadian moral sign, passkey, Nostr kind 1978, merkle root, Satohash stamp
- `data/campaign-canada.json`, Satohash template, `scripts/generate-campaign.mjs`
- `sc-upgrades-b13.js` features 668–687
- Main site Canada section; sign defaults to Canada / BC

## [4.1.0] — 2026-07-07

### Full Charter (BUILD 667)
- `data/charter.json` — all 114 articles + preamble (100 new)
- `scripts/generate-charter.mjs`, `scripts/inject-charter.mjs`
- Chapter-grouped article browser + search in `sc-core.js`
- API: 114 per-article JSON files; sitemap 143 URLs
- `sc-upgrades-b12.js` features 648–667
- npm packages ready (`npm run publish:packages` pending login)

## [4.0.0] — 2026-07-07

### Sprints 6–8 (BUILD 647)
- **Sprint 6:** Split CSS/JS; `index.html` 212 KB → ~77 KB; Lighthouse CI; `sc-upgrades-b9.js`
- **Sprint 7:** `treasury.html`, `security.html`, mempool widgets; `sc-upgrades-b10.js`
- **Sprint 8:** `embed.js`, `@giveabit/sherpacarta` SDK, MCP server, per-article API; `sc-upgrades-b11.js`
- `IMPROVEMENTS-200.md` backlog; SW v5.0; `_headers` cache rules

## [3.3.0] — 2026-07-02

### UI Dock Fixes + 30 Features
- Left dock: BC Challenge tab above pinned a11y toolbar (no overlap)
- Status dock: BUILD + Online visible bottom-left (not behind header)
- Features 376–405, BUILD 20260703-405

## [3.2.0] — 2026-07-02

### Footer Center + 50 Features
- giveaBit.io parent logo 2× (44px), centered in copyright row
- Features 326–375 (`sc-enhancements-v5.js`)
- BUILD 20260703-375

## [3.1.0] — 2026-07-02

### Visual + Parent Brand
- Copyright footer: giveaBit.io parent logo → giveabit.io
- Dynamic wave background motion at 36% opacity
- Features 301–325 (`sc-enhancements-v4.js`)
- BUILD 20260703-325

## [3.0.0] — 2026-07-02

### 100 New Features (201–300)
- Group 9: Onboarding & Help (usage guide, checklist, video CTA)
- Group 10: Charter Depth (search, flashcards, resume reading)
- Group 11: Personalization (dashboard, prefs export, themes)
- Group 12: Distribution (QR, press release, campaign links)
- `docs/USAGE.md` — full how-to guide + video script outline
- BUILD 20260703-300

## [2.3.2] — 2026-07-02

### Polish
- Hero + donation strips use official socials only (@give_bit, Nostr NIP-05, GitHub)
- Footer dead links wired (CHANGELOG, I18N, orgs, legal, privacy anchors)
- Twitter meta + JSON-LD publisher → Give A Bit / @give_bit
- og-image.png generated for social crawlers
- BUILD 20260703-202

## [2.3.1] — 2026-07-03

### Changed
- Give A Bit orange brush logo in header + footer (`giveabit-logo.png`)
- Official socials only: Twitter @give_bit, Nostr NIP-05 kimi@giveabit.io, GitHub
- Contact email: hello@giveabit.io (subject: Sherpacarta)
- Footer contact line, GitHub links wired, press kit onclick

## [2.3.0] — 2026-07-03

### Added
- **Features 101–200** via `public/sc-enhancements-v2.js`
- Performance: content-visibility, battery saver, particle reduction, idle defer
- Engagement: article stars, calculator presets, legislative brief, MLA template
- UX: section dots, zen/sepia/dyslexia modes, achievements, tag cloud
- Marketing: Reddit/Bluesky/Nostr share, social card PNG, JSON/RSS feeds
- `public/mcp.json` MCP tool descriptor
- Give A Bit footer logo **+50%** (33px)

## [2.2.0] — 2026-07-02

### Added
- **100 features** via `public/sc-enhancements.js` (4 groups × 25)
- QR modal fix: backdrop click, close button, Escape, img fallback
- PWA manifest, service worker, robots.txt, sitemap.xml
- Accessibility toolbar (font size, reading mode, contrast)
- Charter TOC, export JSON/Markdown, press kit download
- Confetti + signature certificate on sign
- Keyboard shortcuts (G/H/D/C/T), shortcuts modal
- Click BUILD badge for full feature list
- docs/FEATURES.md

### Fixed
- QR code not rendering (library load + fallback API)
- QR popup could not close on mobile

## [2.0.1] — 2026-07-02

### Added
- Footer Bitcoin + Lightning tabbed donation widget with copy buttons
- hreflang alternates for international SEO (en, es, fr, de, zh, pt, sw, ar)
- Mobile hamburger navigation for narrow viewports
- `docs/MISSION.md`, `docs/DEPLOYMENT.md`, `docs/KIMI-HANDOFF.md` (filled)
- Filled `docs/SEO.md`, `MARKETING-ONELINER.md`, `LATEST-UPDATE.md`

### Changed
- Hero and layout tuned for Pixel-class mobile (safe-area, touch cursor, stacked CTAs)
- `SOURCE-OF-TRUTH.md` and `README.md` doc index updated
- Footer GitHub links → `kitsboy/sherpacarta`

### Fixed
- `deploy.sh` broken `CLOUDFLARE_API_TOKEN` export line
- Donation section grid stacks on mobile
- Custom cursor disabled on touch devices

## [2.0.0] — 2026-06-10

### Added
- Full self-contained `index.html` charter experience (114 articles)
- `docs/EXECUTIVE_SUMMARY.md`, `docs/MARKETING.md`
- Cloudflare Pages deployment via Vite build