# Current Status — Sherpacarta

**Version:** main @ `2565035` + next-30 working tree
**Last Updated:** 2026-08-26
**Domain:** https://sherpacarta.org
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)
**Site asset bust:** homepage CSS / JS `?v=864`

## Session summary — next-30 UX and trust release

**Implemented:**
- Dedicated `/verify.html` explainer for independent Satohash/Bitcoin proof verification.
- Clear distinction between document integrity, timestamp evidence, pending/confirmed state, and legal validity.
- Homepage Verify navigation now points to the dedicated verifier.
- Local unfinished signing forms restore on the same device with an explicit “nothing was sent” message.
- Article reader receives left/right keyboard navigation when article tabs are available.
- Added proof receipt JSON export helper for hash, stamp ID, status, verification URL, and honest proof limitations.
- Service worker bumped to `v7.0` and pre-caches the verification page and new helper.

**Verification:**
- `npm run build` passed after removing a stale reference to the removed polish stylesheet.
- `node --check public/js/sc-top30.js public/sw.js` passed.
- `git diff --check` passed.
- Build-generated artifacts were reverted before release review.

## Next 40
See `docs/NEXT-40-UX-SECURITY.md` for the complete queue covering onboarding, governance, receipts, endpoint security, accessibility, mobile, offline behavior, and synthetic monitoring.

## Do not regress
- Satohash canonical stamp contract: `/stamp?hash=&ref=`.
- Pending stamps must never be described as Bitcoin-confirmed.
- No nsec, invoice key, organizer token, or other secret in git/client.
- CSP YouTube domains and four Nostr relays.
- Honest campaign metrics and Canada dual-track language.
- Film `max-height:none`, Kokoro VO, and visible section rendering.

## Existing live surfaces
| Surface | Notes |
|---------|-------|
| Verify | `/verify.html` · independent proof explainer |
| Articles | `/#articles` · `#art-114` · body-derived summaries |
| Sign | `/#sign` · local-first commitment + draft recovery |
| Proof | `/#proof` · Satohash handoff and honest status language |
| Stamp | `https://satohash.io/stamp?hash=&ref=sherpacarta` |
| Metrics | `/metrics.json` · `raw.demo: false` |
| Canada | `/canada/sign` · dual-track honesty |
| Discuss | `/nostr` wall (read-only) |
