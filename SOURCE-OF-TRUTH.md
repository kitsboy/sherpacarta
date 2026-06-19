# SOURCE-OF-TRUTH.md — sherpacarta

**Project Name:** SherpaCarta  
**Date:** 2026-06-10  
**BUILD:** 20260610-001

## Project Overview (Simple Pitch)
SherpaCarta is the Global Digital Magna Carta for the 21st Century — a living, globally-signed charter of 114 articles protecting digital privacy, data sovereignty, freedom of expression, and algorithmic rights for every person on Earth (all 8 billion). 

It is a moral and political declaration and modern successor to the 1215 Magna Carta and the 2011 Icelandic Constitutional Bill (the first crowdsourced constitution). It explicitly binds both states *and* powerful private corporations/algorithms whose reach now exceeds most nations. 

The project includes a stunning, fully self-contained, interactive single-page website (custom cursor, command palette ⌘K, article browser with local signing, Rights Protection Calculator, historical timeline, donation via Bitcoin, rich social sharing, multi-language support, print/read-aloud/download features, and more). Everything is published under CC0 (public domain). The site practices what it preaches: zero tracking, zero cookies, zero analytics. Funded exclusively by voluntary Bitcoin donations (published on-chain). Privacy is a birthright, not a feature.

This folder (`/Users/cam/projects/sherpacarta/`) is the **canonical single source of truth**. Everything lives here so both Goose (M3) and Kimi (M4 HERMES) always know the latest state.

## Core Files
- `index.html` — The complete, beautiful, self-contained SherpaCarta experience (the heart of the project). All CSS, JS interactivity, charter data (114 articles), modals, tools, and SEO/OG meta live here. Designed to be hosted as a single file or via Vite build.
- `README.md` — Professional usage guide, quick start for `npm run dev`, project structure, key features, and contribution info.
- `docs/EXECUTIVE_SUMMARY.md` — High-level problem/solution, four core pillars, strategic positioning, current momentum, call to action (for leaders, partners, press).
- `docs/MARKETING.md` — Brand voice, key messages, one-pagers, social templates, press boilerplate, common objections & rebuttals, visual identity notes.
- `public/` — Static assets (favicon.svg, icons.svg).
- `package.json` + `vite.config.js` — Vite setup for excellent local dev (`npm run dev` with HMR) and production builds (`npm run build` → `dist/`).
- `src/` — Legacy React + Tailwind placeholder files from the original Vite template (currently unused; the runtime site is pure HTML/JS in root index.html).

## Git & Deployment
- **GitHub (source of truth):** https://github.com/kitsboy/sherpacarta.git
- Remote is configured. Recent work: cleanup, professional README, .gitignore updates, and integration of the full site experience.
- **Deployment:** Pure static. Run `npm run build` (outputs to `dist/`). Deploy `dist/` (or the single `index.html` for ultimate simplicity) to:
  - Cloudflare Pages (recommended)
  - Vercel / Netlify / GitHub Pages
  - Any static host, IPFS, or even a simple web server.
- Build command: `npm run build`
- Dev command: `npm run dev` (opens at http://localhost:5173 by default)
- The site has excellent built-in SEO (Open Graph, Twitter Cards, JSON-LD, canonical, theme-color, etc.) pointing to https://sherpacarta.org/

## Mission Alignment (Give A Bit)
Directly advances Bitcoin sovereignty, privacy, and human dignity in the digital age. The charter itself and the website embody Give A Bit values: privacy by design (zero data collection), user sovereignty (local-only signatures + CC0), approachable tools for normal people to assert rights, and resistance to surveillance capitalism and centralized control. Future potential: Lightning donations, Nostr integration for amendments/discussion, on-chain signature anchoring, Safe Harbour legal templates for adopters. Ties beautifully into the broader Give A Bit mission of private, feel-good, empowering tools.

## Current Gaps & Next Priorities
- Real deployment to https://sherpacarta.org/ (Cloudflare Pages or equivalent) + proper og-image.png and any final asset polish.
- Optional: Add a real GitHub Pages / custom domain setup and update meta URLs if needed.
- Populate more real signatories or integrate a lightweight backend/ledger for public signatures (while keeping the zero-tracking spirit for the default local experience).
- Community translation workflow and amendment proposal UI (currently the charter is "living" in principle via Art. 114).
- Press kit distribution and outreach using the new MARKETING.md.
- Consider pruning legacy React dependencies from package.json since the delivered experience is vanilla + Vite for convenience.
- Full hand-off to Kimi on M4 for Obsidian integration, MASTER-BRAIN updates, and continued strategy.

## Hand-off Notes for Kimi (M4 HERMES)
See the latest `KIMI-HANDOFF-sherpacarta-*.md`. Please integrate the SOURCE-OF-TRUTH, the two new docs in `/docs/`, the updated README, and key details into your Obsidian vault under the SherpaCarta project. Update MASTER-BRAIN.md and Kanban. Educate yourself and Hermes on the full vision: this is not "just a website" — it is the living digital rights charter and movement tool for the age of AI and surveillance. The single `index.html` + docs are the current source of truth. Use the EXECUTIVE_SUMMARY and MARKETING docs as canonical references for any future work or outreach. Maintain BUILD numbers on meaningful changes and always keep this SOURCE-OF-TRUTH.md updated.

**This file is the perpetual source of truth. All agents must respect and update it.**

— Generated as part of update-kimi sherpacarta on 2026-06-10 (following giveabit-project-handoff skill)