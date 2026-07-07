# SherpaCarta

**The Global Digital Magna Carta for the 21st Century**

A living charter of **114 articles** protecting privacy, data sovereignty, freedom of expression, and algorithmic rights for every person on Earth.

> Privacy is not a feature. It is a birthright.

**Live site:** [https://sherpacarta.org](https://sherpacarta.org)  
**BUILD:** 688 · **Last commit:** `0d71baa`

---

## What is this?

SherpaCarta v2.0 is a modern successor to the 1215 Magna Carta and the spirit of the 2011 Icelandic constitutional experiment — updated for surveillance capitalism, AI, and platform power.

It is:
- A **moral and political declaration** (not yet legislation)
- **CC0 public domain** — copy, translate, adapt, and build on it freely
- Funded exclusively by Bitcoin donations from citizens (published on-chain)
- 100% open source, zero tracking, zero analytics, zero cookies
- A **living document** — rights may only expand, never contract

---

## Quick Start (Development)

```bash
npm install          # once
npm run dev          # http://localhost:5173
```

### Production build & deploy

```bash
npm run build        # full pipeline → dist/
npm run preview      # test production build locally
./deploy.sh          # build + Cloudflare Pages deploy
```

The build pipeline: `generate-charter` → `inject-charter` → `generate-campaign` → `bundle-js` → `generate-api` → `generate-sitemap` → `vite build`.

---

## Project Structure

```
sherpacarta/
├── index.html                 # Main landing page
├── data/
│   ├── charter.json           # Source of truth: 114 articles + preamble
│   └── campaign-canada.json   # Canada petition campaign
├── public/
│   ├── sc-main.css            # Extracted styles
│   ├── sc-core.js             # Core JS (CHARTER injected at build)
│   ├── sc-bundle.js           # Enhancements + upgrades b1–b13
│   ├── js/
│   │   ├── sc-petition-canada.js
│   │   └── sc-press-outlets.js
│   ├── canada/                # Canada campaign pages
│   ├── api/v1/                # Public JSON API
│   └── sw.js                  # Service worker (v5.3)
├── packages/
│   ├── sherpacarta/           # @giveabit/sherpacarta SDK
│   └── sherpacarta-mcp/       # MCP server
├── scripts/                   # Build generators
├── treasury.html              # Live mempool dashboard
├── security.html              # Bug bounty
├── docs/                      # Full documentation
└── IMPROVEMENTS-200.md        # Prioritized backlog
```

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [Executive Summary](docs/EXECUTIVE_SUMMARY.md) | Problem, solution, pillars, strategy |
| [Mission](docs/MISSION.md) | Purpose, values, audience |
| [Marketing & Press](docs/MARKETING.md) | Voice, templates, press boilerplate |
| [Canada & BC Challenge](docs/CANADA-BC-CHALLENGE.md) | First jurisdiction strategy |
| [Roadmap](docs/ROADMAP.md) | Platform phases (Nostr, API, i18n) |
| [Deployment](docs/DEPLOYMENT.md) | Cloudflare Pages, build, deploy.sh |
| [Features](docs/FEATURES.md) | All enhancements by group (405 + sprints) |
| [Usage](docs/USAGE.md) | How-to guide + video script outline |
| [Source of Truth](SOURCE-OF-TRUTH.md) | Canonical state for all agents |
| [Kimi Handoff](docs/KIMI-HANDOFF.md) | Cross-machine session log |
| [Changelog](CHANGELOG.md) | Version history |
| [Improvements Backlog](IMPROVEMENTS-200.md) | 200 prioritized items |

---

## Key Features (live site)

- Dark/light theme, custom cursor, command palette (⌘K)
- **114-article charter** — chapter browser, search, sign, share, Satohash stamp
- **Canada petition** — moral sign, passkey, Nostr, merkle proof ([/canada/](https://sherpacarta.org/canada/))
- Rights Protection Calculator, historical timeline, adoption heatmap
- **Press section** — linked outlet cards, brand icons, mobile marquee
- Treasury dashboard, bug bounty page, embeddable sign widget
- Public API (`/api/v1/`), MCP server, npm SDK (publish pending)
- Nostr sign-in (NIP-07), amendment proposals, local-first privacy
- Bitcoin donation + PWA service worker, 143-URL sitemap

---

## How to Contribute

1. **Sign the charter** at [sherpacarta.org](https://sherpacarta.org)
2. Open issues or PRs for site improvements
3. Propose amendments (Art. 114 — rights only expand)
4. Translate (see languages grid)
5. Donate Bitcoin (footer / donation section)

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Tech Notes

- HTML-first architecture: external CSS/JS, zero framework at runtime
- Vite for dev server + production bundling to `dist/`
- Charter content in `data/charter.json`, injected into `sc-core.js` at build
- All signatures and prefs in `localStorage` only
- Fonts (Google) and icons (Font Awesome CDN) — intentional for simplicity

---

## License

CC0 1.0 Universal (Public Domain). No rights reserved.

---

## Contact

- Site: https://sherpacarta.org/
- Email: [hello@giveabit.io](mailto:hello@giveabit.io?subject=Sherpacarta)
- X: [@give_bit](https://twitter.com/give_bit)
- GitHub: https://github.com/kitsboy/sherpacarta
- Built by: https://giveabit.io