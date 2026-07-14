# SOURCE-OF-TRUTH.md — sherpacarta

**Project Name:** SherpaCarta  
**Date:** 2026-07-13  
**BUILD:** asset cache v732 · SW **v6.3** · organizer token + PoW + rich share  
**Live:** https://sherpacarta.org  
**GitHub:** https://github.com/kitsboy/sherpacarta.git  
**Last goodbye base:** `17b3336` + goodbye commit  

## Project Overview (Simple Pitch)
SherpaCarta is the Global Digital Magna Carta for the 21st Century — a living charter of 114 articles protecting digital privacy, data sovereignty, freedom of expression, and algorithmic rights. Moral/political declaration (CC0). Canada is the first law-change beachhead; UK & EU are planned next. Bitcoin-funded. Zero tracking. Local-first signing.

This folder (`/Users/cam/projects/sherpacarta/`) is the **canonical single source of truth** on M3.

## Core Files

### Site
- `index.html` — Main landing (hero, Canada first, jurisdictions link, donate, briefings)
- `public/sc-main.css` — Design system (`--text3` AA-friendly)
- `public/sc-core.js` — Core UI + CHARTER inject + safe toast/signers/amendments
- `public/sc-bundle.js` — enhancements + upgrades b1–b14
- `public/js/sc-petition-canada.js` — Canada campaign petition (no private key storage)
- `public/sw.js` — Service worker **v6.3** (network-first HTML; no cache for `/api/canada/*`)
- `public/_headers` — CSP, X-Frame-Options DENY, nosniff
- `public/fonts/` + `public/vendor/fontawesome/` — self-hosted
- `public/canada/*` — hub, sign, join, paper, official, organizer, proof, about, bc/
- `public/jurisdictions.html`, `status.html`, `treasury.html`

### Data & API
- `data/charter.json` — 114 articles + preamble
- `data/campaign-canada.json` — Canada campaign (source → public at build)
- `public/data/wallets.json` — BTC live · LN pending · SP planned
- `public/data/jurisdictions.json` — expansion map
- `public/api/v1/` — charter JSON, hash, OpenAPI
- `functions/api/canada/` — **sign**, **stats**, **batch**, **ping**, **_shared.js**
  - `PETITION_KV` bound in wrangler.toml
  - **Batch requires `ORGANIZER_TOKEN`** (CF secret, set 2026-07-13) — unauthenticated → 503
  - **Sign requires PoW** (`GET /api/canada/pow`) or Turnstile when keys set
  - Sign: rate-limited, method allowlist, sanitized displayName
  - Campaign totals = self-reported + rate-limited (not identity-verified)
- `public/sitemap.xml` — ~156 URLs

### Docs (Kimi)
- `docs/KANBAN.md` — finish-later board
- `docs/KIMI-HANDOFF.md` — session handoffs (newest at top)
- `SESSION-SUMMARY-2026-07-09-security-audit.md` — this audit session
- `SESSION-SUMMARY-2026-07-09.md` — earlier jurisdictions session
- `docs/CANADA-PETITION-LEGAL.md`, `docs/ROADMAP.md`

### Build & Deploy
- `npm run build` → `dist/`
- `./deploy.sh` → Cloudflare Pages project `sherpacarta`
- **Commit function changes before deploy** (wrangler ties Source to git SHA)
- **Never** add `_redirects` rules: `/path  /path.html  200` (308 loops)
- Prefer **extensionless** links (`/canada/sign`)

## Wallets & Identity

| Rail | Status | Where |
|------|--------|--------|
| BTC on-chain | **Live** | `bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad` |
| Lightning | **Pending on SC site** | giveabit LNURL for `kimi@` / `cam@` — Cam picks official |
| Silent Payments | Planned | — |
| NIP-05 | **Live** | `kimi@giveabit.io` on giveabit.io |

## Security posture (post-audit)
- XSS hardened on user/remote HTML surfaces
- CSP + frame deny; restricted CORS on campaign APIs
- Paper batch **locked** without `ORGANIZER_TOKEN`
- Sign still forgeable within rate limits (no captcha yet)
- Do not claim campaign totals are verified people

## Current Gaps (Cam-gated) — see docs/KANBAN.md
1. ~~Set `ORGANIZER_TOKEN`~~ **Done** — see `docs/ORGANIZER-TOKEN.md` + `.organizer-token.local` (M3, gitignored)
2. Choose Lightning Address → wire `wallets.json`
3. Confirm BTC key custody / multi-sig plan
4. Confirm official Nostr pubkey story
5. MP sponsor + e-### + paper field collection
6. UK legal brief → EU pilots
7. Optional: captcha on sign, modal focus trap, npm publish, human i18n

## Mission Alignment (Give A Bit)
Bitcoin sovereignty, privacy, human dignity. Rights only expand (Art. 114).

## Hand-off
- Kimi: `docs/KIMI-HANDOFF.md` + `docs/KANBAN.md` + `SESSION-SUMMARY-2026-07-09-security-audit.md`
- Recovery: `/whatsup` in new chat
- **Do not sync M4 until Cam says go**

— Updated 2026-07-09 goodbye · security audit session (Grok M3)


## Diligence Pack (partner + technical disclosure)
**Self-evolving.** Canonical path in-repo:
- `docs/diligence/README.md` — index
- `docs/diligence/INVESTOR-ONEPAGER.md`
- `docs/diligence/ARCHITECTURE-ONEPAGER.md`
- `docs/diligence/ASK-SHEET.md`
- Portfolio: `giveabit` → `docs/diligence/PORTFOLIO-FAMILY-OF-8.md`

Update rule: material product changes update diligence in the same change-set.
Last pack generation: 2026-07-13
