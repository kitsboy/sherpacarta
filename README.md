# SherpaCarta

**The Global Digital Magna Carta for the 21st Century**

A living charter of **114 articles** protecting privacy, data sovereignty, freedom of expression, and algorithmic rights for every person on Earth.

> Privacy is not a feature. It is a birthright.

**Live site:** [https://sherpacarta.org](https://sherpacarta.org)

---

## What is this?

SherpaCarta v2.0 is a modern successor to the 1215 Magna Carta and the spirit of the 2011 Icelandic constitutional experiment — updated for surveillance capitalism, AI, and platform power.

It is:
- A **moral and political declaration** (not yet legislation)
- **CC0 public domain** — copy, translate, adapt, and build on it freely
- Funded exclusively by Bitcoin donations from citizens (published on-chain)
- 100% open source, zero tracking, zero analytics, zero cookies
- A **living document** — rights may only expand, never contract

This repository contains the complete, beautiful, self-contained single-page experience (HTML + CSS + JS) plus supporting documentation.

---

## Quick Start (Development)

This project uses **Vite** for an excellent local development experience (fast refresh, even for a mostly static site).

```bash
# Install (only needed once)
npm install

# Run the site locally with hot reload
npm run dev
```

Open the URL printed in the terminal (usually **http://localhost:5173**).

The beautiful custom cursor, command palette (⌘K or ?), interactive articles browser, rights calculator, signing wall, and everything else will work immediately.

### Production build

```bash
npm run build
npm run preview   # locally test the production build
```

The output goes to `dist/` and is ready to deploy anywhere (Netlify, Vercel, GitHub Pages, static hosting, even as a single `index.html` file).

---

## Project Structure

```
/Users/cam/projects/sherpacarta
├── index.html          # The complete, self-contained SherpaCarta experience (the main thing)
├── src/                # (Legacy React placeholder — currently unused; safe to ignore or remove)
├── docs/
│   ├── EXECUTIVE_SUMMARY.md   # High-level overview for leaders, funders, partners
│   └── MARKETING.md           # Brand voice, messaging, press kit, social templates, objections
├── public/             # Static assets (favicon, etc.)
├── package.json
└── vite.config.js
```

The site is intentionally a single rich `index.html` (with all critical CSS/JS inline) because:
- It matches the "living public document" philosophy
- It can be hosted or shared as a single file
- It has zero build-step complexity for the core experience

---

## Documentation

- [Executive Summary](docs/EXECUTIVE_SUMMARY.md) — Problem, solution, pillars, current state, strategy
- [Mission](docs/MISSION.md) — Purpose, values, who we serve
- [Marketing & Press Guide](docs/MARKETING.md) — Voice, key messages, one-pagers, social templates, FAQs for press
- [Marketing One-Liner](MARKETING-ONELINER.md) — Tagline, pitch, CTA
- [SEO Strategy](docs/SEO.md) — Keywords, meta audit, i18n SEO index (+ locale files `SEO-*.md`)
- [I18N Reference](docs/I18N.md) — Translation system
- [Deployment](docs/DEPLOYMENT.md) — Cloudflare Pages, build, deploy.sh
- [Source of Truth](SOURCE-OF-TRUTH.md) — Canonical project state for all agents
- [Kimi Handoff](docs/KIMI-HANDOFF.md) — Cross-machine session log
- [Platform Roadmap](docs/ROADMAP.md) — Nostr, Satohash, API, i18n phases
- [Canada & BC Challenge](docs/CANADA-BC-CHALLENGE.md) — First jurisdiction law-change strategy
- The full 114-article charter is interactive inside the site (open the "Charter" button or use ⌘K)

---

## Key Features (in the live site)

- Stunning dark (default) / light theme with custom cursor and reading progress
- Interactive 114-article browser with local signing, sharing, and "AI" summaries
- Historical timeline + comparison table (1215 / 2011 / 2026)
- Rights Protection Calculator (country + usage + encryption)
- Global signatory wall + live counter (persisted locally + simulated momentum)
- Command palette (⌘K) for everything
- Full charter modal with print, download .txt, read-aloud, search, and "make editable"
- Multi-language UI switcher (top 5 + 40+ community translations grid)
- Bitcoin donation card + rich social sharing (X, WhatsApp, Telegram, LinkedIn, FB, copy)
- Ambient visual mode, quote rotator, FAQ, newsletter (local only), press mentions bar
- Excellent SEO / Open Graph / Twitter Card / JSON-LD structured data
- Fully keyboard accessible + print-optimized + reduced-motion aware

---

## How to Contribute (Movement, not just code)

1. **Sign the charter** on the live site
2. Open issues or PRs for improvements to this site/experience
3. Propose new articles or amendments (see the living charter process in Art. 114)
4. Translate (see the languages grid)
5. Start or join a local chapter
6. Donate Bitcoin (address in the site footer / donation section)

All code changes are welcome. The spirit of the charter applies to the project itself: expand rights and access, never restrict.

---

## Tech Notes

- Pure modern HTML5 + CSS + vanilla JS (no framework required at runtime)
- Vite for dev server + production bundling (you still get HMR and a great `dist/`)
- External dependencies only for fonts (Google) and icons (Font Awesome CDN) — intentional for zero-build simplicity
- All signatures, preferences, and state are stored in `localStorage` only (exactly as the charter preaches)

If you want to evolve this into a more componentized app later (e.g. React/TS for the admin or translation tooling), the current Vite setup makes that straightforward.

---

## License

The charter content and this site are published under **CC0 1.0 Universal** (Public Domain Dedication).  
No rights reserved. Copy freely.

See the legal footer in the site for the full statement.

---

## Contact & Movement

- Site: https://sherpacarta.org/
- X: @SherpaCarta
- "SHERPACARTA IS A GLOBAL MOVEMENT, NOT A CORPORATION. BUILT WITH ❤ BY VOLUNTEERS IN 24 COUNTRIES. POWERED BY BITCOIN. GUIDED BY CONSCIENCE."

---

*This README and the docs/ folder were added as part of the initial public release preparation.*
