# SOURCE-OF-TRUTH.md — sherpacarta

**Project Name:** SherpaCarta  
**Date:** 2026-09-10 (last updated 2026-09-27 — deploy-process + Vite reality)
**BUILD:** Vite/React app + static `public/` set · SW **v9.8** · asset `v=919` · local sign vs Canada campaign
**Live:** https://sherpacarta.org  **GitHub:** https://github.com/kitsboy/sherpacarta.git  
**Repo-HEAD reference:** see latest confirmed deployed SHA in `LATEST-UPDATE.md` (this doc's
"Last goodbye" line below is historical, superseded by that file).

## Project Overview (Simple Pitch)
SherpaCarta is the Global Digital Magna Carta for the 21st Century — a living charter of 114 articles protecting digital privacy, data sovereignty, freedom of expression, and algorithmic rights. Moral/political declaration (CC0). Canada is the first law-change beachhead; UK & EU are planned next. Bitcoin-funded. Zero tracking. Local-first signing.

This folder (`/Users/cam/projects/sherpacarta/`) is the **canonical single source of truth** on M3.

## BUILD SYSTEM — READ BEFORE DEPLOYING (deploy process, so any LLM can ship cleanly)

**This repo is now a Vite + React app.** Entry `src/main.jsx` → built to `dist/` via `npm run
build`. The classic hand-authored pages in `public/` are also copied into the build and remain
served (dual-layout: React mounts on `/verify` alongside the static pages). Quote the build
string you **personally verified on the served DOM**, never a remembered one.

### How a deploy actually happens (ONE deployer, no token)
The **Cloudflare Pages ↔ GitHub integration** auto-builds and publishes **every push to `main`**.
That is the only normal deployer — there is no `wrangler` step and no deployed credential.
`.github/workflows/deploy.yml` builds the commit and **polls production until the new SHA is live**
(it is a verification guard, NOT the deployer). `.github/workflows/repository-contracts.yml` +
`security-contracts.yml` + `trust-checks.yml` + `lighthouse.yml` run the honesty gates on push.

**Deploy flow (cold, repeatable):**
```bash
cd <checkout> && git pull                     # main, clean
# …make edits, bump SW + v= (Rule 2)…
npm run check:*  &&  npm run lint             # leave nothing red
git add -A && git commit -m "…" && git push origin main   # CF Pages builds + publishes
# verify the NEW build string is served, never trust "action was green":
curl -s https://sherpacarta.org/ | grep -oE "BUILD [0-9]+|v=[0-9]+"
curl -s https://sherpacarta.org/sw.js | grep -oE "sherpacarta-v[0-9.]+"
```

**Version stamps are hand-managed** — `v=919` in the HTML `?v=` query stamps and the SW cache
name `sherpacarta-v9.8` in `public/sw.js`. The `generate-*`/`inject-*` scripts do NOT rewrite the
`v=` stamp (only `inject-analytics` touches `<head>`, not the version). **Bump both together on any
JS/CSS/HTML change** or returning visitors on the old service-worker cache keep the stale bundle.

**Break-glass (manual, `workflow_dispatch` only, never on push):** Deploy workflow → mode
`break-glass-deploy`; needs repo secret `CLOUDFLARE_PAGES_TOKEN` (Pages:Edit) — fallback, do not
make it a habit. `deploy.sh` is a rare local helper (now secret-free, refuses without
`CLOUDFLARE_API_TOKEN`) and `cd ~/projects/sherpacarta` (Mac path) — it is NOT the THOR flow.

**Verify API note:** the "Verify this proof" surface (`src/components/verify/VerifySurface.jsx`)
POSTs the pasted SHA-256 hash to the **hosted family API** `https://api.satohash.io/api/verify`
(no local `/api/verify` function exists). A forged/hit-less hash returns HTTP 404 + a JSON
`{verified:false}` body — the component renders that as **"Not proven"**, never as a network error.

## Core Files

### Site
- `index.html` — First-choice hero (local sign vs Canada campaign), articles, sign, donate
- `public/sc-main.css` — Design system; 390px chrome; `--kb-inset`
- `public/sc-core.js` — CHARTER inject, sign, In brief, visualViewport keyboard
- `public/sc-bundle.js` — curated 7-file minify (~114 KB): enhancements, v2, b1, b3, b4, b14, b15
- `public/js/sc-petition-canada.js` — Canada campaign petition (no private key storage)
- `public/sw.js` — Service worker **v9.8** (network-first HTML; no cache for `/api/canada/*`; proof lifecycle and governance assets cached)
- `public/start.html` — universal onboarding and role paths
- `public/verify.html` — local SHA-256 proof verification guide/tool
- `public/archive.html`, `public/cite.html`, `public/data/releases.json` — release archive and citations
- `public/support.html` — support/security/accessibility/press triage
- `public/release-manifest.json` — machine-readable release claims
- `public/data/release-approvals.json` — explicit technical/legal/endorsement approval boundaries
- `public/amendments.html` — public amendment lifecycle explanation
- `public/js/sc-disclosure.js` — reusable DEMO DATA / action-required / pending / verified disclosure bar
- `public/data/external-gates.json` — machine-readable external evidence gates
- `public/share.html` — platform-ready social sharing copy and evidence links
- `public/data/seo-i18n.json` — multilingual SEO metadata and review states
- `public/data/rights-taxonomy.json` — educational rights categories and article references
- `public/data/seo-i18n.json` — eight-locale SEO metadata and human-review states
- `public/rights.html` — secular plain-language digital-rights education
- `public/js/sc-rights-reader.js` — taxonomy-filtered reader, local progress, provenance, citation, and share context
- `scripts/check-reader-contract.mjs` — reader/data/cache integration contract
- `public/data/rights-taxonomy.json` — educational rights categories and article references
- `docs/VIDEO-ONE-MINUTE-HANDOFF.md` — later civic and technical video scripts
- `docs/VIDEO-SHERPA-ONE-MINUTE-BRIEF.md` — realistic-presenter concept, 60-second script, visual direction, and production gates
- `public/_headers` — CSP, X-Frame-Options DENY, nosniff
- `public/fonts/` + `public/vendor/fontawesome/` — self-hosted
- `public/canada/*` — hub, sign, join, paper, official, organizer, proof, about, bc/
- `public/video/sherpacarta-one-minute-draft.mp4` — first-look one-minute **silent visual draft** (DEMO DATA; temporary geometric presenter; no embedded voiceover or music)
- `public/video/sherpacarta-one-minute-contact-sheet.jpg` — draft review contact sheet
- `public/jurisdictions.html`, `status.html`, `treasury.html`

### Data & API
- `data/charter.json` — 114 articles + preamble
- `data/campaign-canada.json` — Canada campaign (source → public at build)
- `public/data/wallets.json` — BTC live · LN live (LNURL/lud16) · SP planned
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
- `docs/FORMAL-DOCUMENT-PACKET.md`, `docs/LEGAL-TRUTH-GUIDE.md`, `docs/TECHNICAL-ARCHITECTURE.md`
- `docs/THREAT-MODEL.md`, `docs/QA-RELEASE-GATE.md`, `docs/RELEASE-REVIEW-GATE.md`, `docs/SECURITY-TEST-MATRIX.md`, `docs/NEXT-100-FULL-EXECUTION.md`, `docs/IMPLEMENTATION-MAP.md`, `docs/EXTERNAL-GATES-PACKET.md`, `docs/LEGAL-COUNSEL-REQUEST-TEMPLATE.md`, `docs/SECURITY-AUDIT-RFP.md`, `docs/OPERATIONS-EVIDENCE-PACKET.md`, `docs/SOCIAL-PRESS-SYSTEM.md`, `docs/DEMO-DATA-CATALOG.md`, `docs/DEEP-GAP-REGISTER.md`, `docs/DEMO-SHOWCASE-CHECKLIST.md`, `docs/SEO-I18N-MATRIX.md`, `docs/SEO-IMPLEMENTATION-PLAN.md`, `docs/VIDEO-ONE-MINUTE-HANDOFF.md`, `docs/DEMO-DATA-CATALOG.md``

### Build & Deploy
- `npm run build` → `dist/`
- `./deploy.sh` → Cloudflare Pages project `sherpacarta`
- **Commit function changes before deploy** (wrangler ties Source to git SHA)
- **Never** add `_redirects` rules: `/path  /path.html  200` (308 loops)
- Prefer **extensionless** links (`/canada/sign`)

## Wallets & Identity

| Rail | Status | Where |
|------|--------|--------|
| BTC on-chain | **Live** | `bc1p2e4c0pnyvkm5dx4c22zkve3f5wtnwhyx496k95a2vwjhy04wg4ds8nj5xq` |
| Lightning | **Live** | `sherpacarta@breez.tips` (Breez Spark, Config A) |
| Silent Payments | Planned | — |
| NIP-05 | **Live** | `sherpa@sherpacarta.org` + `kimi@sherpacarta.org` on `/.well-known/nostr.json` (aliases on giveabit.io) |

## Security posture (post-audit)
- XSS hardened on user/remote HTML surfaces
- CSP + frame deny; restricted CORS on campaign APIs
- Paper batch **locked** without `ORGANIZER_TOKEN`
- Sign still forgeable within rate limits (no captcha yet)
- Do not claim campaign totals are verified people

## Current Gaps (Cam-gated) — see docs/KANBAN.md
1. ~~Set `ORGANIZER_TOKEN`~~ **Done** — see `docs/ORGANIZER-TOKEN.md` + `.organizer-token.local` (M3, gitignored)
2. ~~Choose Lightning Address → wire `wallets.json`~~ **Live** `sherpacarta@breez.tips` — custody/backup still Cam
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

— Updated 2026-08-27 · published one-minute asset corrected to silent visual draft; voiceover/music remain pending; article reader taxonomy integration, metadata safeguards, external-gate disclosure system, evidence packets, contract checks, and handoff map


## Diligence Pack (partner + technical disclosure)
**Self-evolving.** Canonical path in-repo:
- `docs/diligence/README.md` — index
- `docs/diligence/INVESTOR-ONEPAGER.md`
- `docs/diligence/ARCHITECTURE-ONEPAGER.md`
- `docs/diligence/ASK-SHEET.md`
- Portfolio: `giveabit` → `docs/diligence/PORTFOLIO-FAMILY-OF-8.md`

Update rule: material product changes update diligence in the same change-set.
Last pack generation: 2026-07-13
