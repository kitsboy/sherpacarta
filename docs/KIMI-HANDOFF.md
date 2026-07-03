# Kimi Handoff — SherpaCarta

Ongoing handoff log for M3 (Grok) → M4 (Kimi). Append new sessions at the top.

---

## Handoff to Kimi — 2026-07-02

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Full project audit: code, docs, deploy pipeline, live site
- [x] Mobile GUI pass for Pixel-class viewports (touch cursor fix, hamburger nav, hero framing, safe-area insets, donation grid stack)
- [x] Footer Bitcoin + Lightning tabbed donation widget with copy buttons
- [x] hreflang alternates for international SEO
- [x] Fixed broken `deploy.sh` (`CLOUDFLARE_API_TOKEN` export was truncated)
- [x] Filled `docs/MISSION.md`, `docs/SEO.md`, `MARKETING-ONELINER.md`, `CHANGELOG.md`, `LATEST-UPDATE.md`
- [x] Updated `SOURCE-OF-TRUTH.md`, `README.md` doc index
- [x] Corrected footer GitHub links to `kitsboy/sherpacarta`

### Decisions

- Kept single-file `index.html` architecture — no React migration; `src/` remains legacy placeholder
- Lightning address in footer is a **placeholder LNURL** — Cam must replace with live address before public fundraising push
- Bitcoin on-chain address is still the well-known example `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh` — **must be replaced with real treasury address**
- Custom cursor disabled on touch/coarse pointers for usability
- Wrangler `whoami` shows not logged in interactively; deploy relies on token in `deploy.sh` base64 blob

### What's Next

- Generate `public/og-image.png` (1200×630) and `logo.png` for social/JSON-LD
- Replace BTC + Lightning addresses with production wallet/LNURL
- Add `?lang=` URL param support on page load for SEO deep links
- Wire FAQPage JSON-LD from existing FAQ section
- Add `sitemap.xml` + `robots.txt`
- Cam may enter **planning mode** for the "very important doc" (press kit / treaty brief / institutional adoption pack — scope TBD)
- Integrate this handoff + updated SOURCE-OF-TRUTH into Obsidian / MASTER-BRAIN
- Consider pruning unused React deps from `package.json` or document why they remain

### Git State

- Last commit SHA: *(see commit after this session)*
- Branch: `main`
- Unpushed: *(verify after push)*

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*