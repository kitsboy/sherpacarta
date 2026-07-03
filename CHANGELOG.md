---
title: Changelog
project: sherpacarta
version_history:
  - version: 2.0.1
    date: 2026-07-02
    summary: Mobile polish, footer pay tabs, docs audit
  - version: 2.0.0
    date: 2026-06-10
    summary: Full single-page charter site, marketing docs
audience: devs
last_updated: 2026-07-02
owner: Cam / Give A Bit
---

# Changelog

All notable changes to this project are documented here.

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