# Project Summary — Sherpacarta

**What:** A charter-based governance and navigation platform — featuring a 114-article charter, Canada campaign pages, and public APIs.
**Domain:** sherpacarta.giveabit.io
**Version:** BUILD 732
**Last Updated:** 2026-07-16

## One-Liner
Sherpacarta is a digital charter and governance platform that publishes and manages articles of sovereignty, campaign pages, and SDK packages — all built as a static HTML/JS site with a public JSON API.

## Core Features
- 114-article charter (data/charter.json) — source of truth for governance content
- Canada campaign pages for regional outreach
- Public JSON API at public/api/v1/
- SDK packages (npm publish pending) for third-party integration
- PWA with service worker (sherpacarta-v5.3)
- Build chain: generate-charter, inject-charter, generate-campaign, bundle-js, generate-api, generate-sitemap
- Self-evolving diligence packs (investor, architecture, ask)

## Tech Stack
Static HTML/JS + Vite build + Cloudflare Pages
No React/framework — vanilla JS (sc-core.js, sc-bundle.js)

## Planned Integrations
- Satohash timestamping for charter articles and campaign docs
- LNbits Lightning for donations/tipping

