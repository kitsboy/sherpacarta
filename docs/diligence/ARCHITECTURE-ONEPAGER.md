---
title: Technical Architecture One-Pager
project: SherpaCarta
version: 1.0.0
audience: developers, technical partners
last_updated: 2026-07-13
owner: Kimi (Orchestrator) + Nova (Docs)
self_evolving: true
update_rule: >
  Any material change to product, stack, deploy path, traction, or ask
  MUST update this file in the same PR/commit when possible.
  Weekly freshness target: score >= 7 (see nova-product-management).
tags: [diligence, pitch, mvp, giveabit]
---
# SherpaCarta — Technical Architecture One-Pager

**Live:** https://sherpacarta.org · **Repo:** https://github.com/kitsboy/sherpacarta · **Version:** `0.0.0+`

## Stack
Web SPA · Cloudflare Pages · i18n · Bitcoin donate · zero-tracking ethos

## System map (boxes)
```
[User browser]
     |
     v
[SPA / static app on Cloudflare Pages]
     |
        +--------+--------+
|                 |
        v                 v
[Public APIs / LN / Nostr / OTS]   [Optional M3/M4 services]
```

## Architecture notes
- Interactive charter content (114 articles)
- Signing / community surfaces
- Multi-language content pipeline
- Static deploy; minimal backend
- CC0 public domain licensing

## Deploy path
Build → wrangler pages deploy dist/ --project-name sherpacarta

## Data & privacy posture
Prefer client-side and user-held keys. Minimize PII. Bitcoin rails where payments exist. See project privacy/security docs if present.

## MVP boundary
- **In MVP now:** Live charter site, sign flow, education, donate.
- **Explicitly later:** 40+ languages, chapters, Satohash article proofs, advocacy tooling.

## Dependencies
Community translators; optional Satohash

## How a technical helper starts (15 min)
```bash
git clone https://github.com/kitsboy/sherpacarta.git
cd sherpacarta
# typically:
npm install
npm run dev
```
Read `README.md`, `docs/DEPLOYMENT.md` (or `DEPLOY.md`), and this file.

## Known gaps (full disclosure)
See Investor one-pager risks + project `LATEST-UPDATE.md` / handoffs. Do not claim production hardness without tests/deploy verification.

## Related
- [Investor one-pager](./INVESTOR-ONEPAGER.md)
- [Ask sheet](./ASK-SHEET.md)
- Deeper docs: `docs/ARCHITECTURE.md` (if present), `SOURCE-OF-TRUTH.md`, `docs/.ai_docs/`

---
**Safe Harbour:** Educational / informational only. Not financial, legal, or investment advice.
Bitcoin involves risk. DYOR. Not your keys, not your cheese.
Part of the [Give A Bit](https://giveabit.io) family.
