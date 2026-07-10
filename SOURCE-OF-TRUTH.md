# SOURCE-OF-TRUTH.md — sherpacarta

**Project Name:** SherpaCarta  
**Date:** 2026-07-09  
**BUILD:** asset cache v731 · SW v6.2 · post-redirect-fix  
**Live:** https://sherpacarta.org  
**GitHub:** https://github.com/kitsboy/sherpacarta.git  
**Last commit (goodbye):** `e4fc7eb`

## Project Overview (Simple Pitch)
SherpaCarta is the Global Digital Magna Carta for the 21st Century — a living charter of 114 articles protecting digital privacy, data sovereignty, freedom of expression, and algorithmic rights. Moral/political declaration (CC0). Canada is the first law-change beachhead; UK & EU are planned next. Bitcoin-funded. Zero tracking. Local-first signing.

This folder (`/Users/cam/projects/sherpacarta/`) is the **canonical single source of truth** on M3.

## Core Files

### Site
- `index.html` — Main landing (hero, Canada first, jurisdictions link, donate, briefings)
- `public/sc-main.css` — Design system
- `public/sc-core.js` — Core UI + CHARTER inject + wallets hydrate from `/data/wallets.json`
- `public/sc-bundle.js` — enhancements + upgrades b1–b14
- `public/js/sc-petition-canada.js` — Canada campaign petition
- `public/sw.js` — Service worker **v6.2**
- `public/fonts/` + `public/vendor/fontawesome/` — self-hosted (no Google Fonts CDN)
- `public/briefing.html`, `briefing-fr.html`, `leave-behind.html`
- `public/canada/*` — hub, sign, join, paper, official, organizer, proof, about, bc/
- `public/jurisdictions.html` — CA live · UK/EU planned map
- `public/status.html` — live browser probes
- `public/treasury.html` — on-chain treasury + funding rails honesty
- `public/og/*.png` — social cards

### Data & API
- `data/charter.json` — 114 articles + preamble
- `data/campaign-canada.json` — Canada campaign (source → public at build)
- `public/data/wallets.json` — **public funding registry** (BTC live · LN pending · SP planned)
- `public/data/jurisdictions.json` — expansion map
- `public/api/v1/` — charter JSON, hash, OpenAPI
- `functions/api/canada/` — sign, stats, batch (PETITION_KV)
- `public/sitemap.xml` — ~156 URLs

### Docs (Kimi)
- `docs/KANBAN.md` — **finish-later board** (money, Nostr, Canada MP, UK/EU, security)
- `docs/KIMI-HANDOFF.md` — session handoffs
- `docs/ROADMAP.md`, `docs/CANADA-PETITION-LEGAL.md`, `docs/CANADA-BC-CHALLENGE.md`
- `SESSION-SUMMARY-2026-07-09.md` — this session goodbye summary

### Build & Deploy
- `npm run build` → `dist/`
- `./deploy.sh` → Cloudflare Pages project `sherpacarta`
- **Never** add `_redirects` rules: `/path  /path.html  200` (causes 308 loops with pretty URLs)
- Prefer **extensionless** links (`/canada/sign`)

## Wallets & Identity (as of goodbye)

| Rail | Status | Where |
|------|--------|--------|
| BTC on-chain | **Live** | `bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad` |
| Lightning | **Pending on SC site** | giveabit already has LNURL-pay for `kimi@` / `cam@` — Cam must pick official |
| Silent Payments | Planned | — |
| NIP-05 | **Live** | `kimi@giveabit.io` on giveabit.io (not sherpacarta.org) |

## Current Gaps (Cam-gated) — see docs/KANBAN.md
1. Choose Lightning Address → wire `wallets.json` + remove TEMP UI
2. Confirm BTC key custody / multi-sig plan
3. Confirm official Nostr pubkey story
4. MP sponsor + e-### + paper field collection
5. UK legal brief → EU pilots
6. Optional: npm publish, human i18n, Silent Payments

## Mission Alignment (Give A Bit)
Bitcoin sovereignty, privacy, human dignity. Rights only expand (Art. 114).

## Hand-off
- Kimi: `docs/KIMI-HANDOFF.md` + `docs/KANBAN.md` + `SESSION-SUMMARY-2026-07-09.md`
- Recovery: `/whatsup` in new chat
- **Do not sync M4 until Cam says go**

— Updated 2026-07-09 goodbye (Grok M3)
