# Current Status — Sherpacarta

**Version:** main @ pending next-40 release
**Last Updated:** 2026-08-26
**Domain:** https://sherpacarta.org
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)
**Site asset bust:** homepage CSS / JS `?v=865`; service worker `v7.1`

## Session summary — next-40 trust/reliability release

**Implemented:**
- Extended `/verify.html` with a local browser SHA-256 calculator; document text is never uploaded.
- Added explicit recovery guidance and a proof checklist for ordinary users.
- Added receipt import validation helper for locally downloaded SherpaCarta proof receipts.
- Added stronger receipt fields and honest status/proof limitation language.
- Bumped service-worker cache and kept verification assets in the offline set.
- Audited the previous 40-item queue against existing features rather than duplicating already-shipped glossary, onboarding, diff, and rate-limit work.

**Verification:**
- `npm run build` passed.
- `node --check public/js/sc-top30.js public/sw.js` passed.
- `git diff --check` passed.
- Generated build artifacts were reverted before release review.

## Next 50
Full queue: `docs/NEXT-50-UX-SECURITY.md`

Priorities include onboarding and role-based navigation, release manifests and archives, receipt review/import/integrity, endpoint and privacy tests, secret/dependency scanning, accessibility and viewport checks, offline messaging, retry states, synthetic journey monitoring, and a release dashboard.

## Do not regress
- Satohash canonical stamp contract: `/stamp?hash=&ref=`.
- Pending stamps must never be described as Bitcoin-confirmed.
- No nsec, invoice key, organizer token, or other secret in git/client.
- CSP YouTube domains and four Nostr relays.
- Honest campaign metrics and Canada dual-track language.
- Film `max-height:none`, Kokoro VO, and visible section rendering.
