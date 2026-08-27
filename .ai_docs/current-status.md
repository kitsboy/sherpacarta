# Current Status — Sherpacarta

**Version:** main @ pending current-50 release
**Last Updated:** 2026-08-26
**Domain:** https://sherpacarta.org
**productId:** `sherpacarta`
**Site asset bust:** homepage `?v=865`; service worker `v7.2`

## Session summary — current 50 trust/onboarding release

**Implemented:**
- Added `/start.html`, a universal onboarding page with Citizen, Participant, Organizer, and Verifier paths.
- Added `/support.html` contact triage for security, accessibility, press, organizing, and general support.
- Added `/release-manifest.json` with document version, hash endpoint, proof provider, honest-status claims, and secret-handling assertions.
- Extended `/verify.html` with local SHA-256 verification and proof/recovery links.
- Added receipt import validation helper and retained local-only behavior.
- Added `trust-checks.yml` for syntax, private-key pattern rejection, proof-language assertions, and build verification.
- Added service-worker coverage for onboarding/support/manifest and bumped cache to `v7.2`.
- Prepared the next 50-item queue in `docs/NEXT-50-AFTER-THIS.md`.

**Verification:**
- `npm run build` passed.
- `node --check public/js/sc-top30.js public/sw.js` passed.
- `git diff --check` passed.
- Generated build artifacts are reviewed separately and must not be committed unless intentionally regenerated.

## Do not regress
- Satohash canonical stamp contract: `/stamp?hash=&ref=`.
- Pending stamps must never be described as Bitcoin-confirmed.
- No nsec, invoice key, organizer token, or other secret in git/client.
- CSP YouTube domains and four Nostr relays.
- Honest campaign metrics and Canada dual-track language.
- Film `max-height:none`, Kokoro VO, and visible section rendering.
