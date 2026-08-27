# Current Status — Sherpacarta

**Version:** main @ pending proof-integrity release
**Last Updated:** 2026-08-26
**Domain:** https://sherpacarta.org
**User journey:** Start here → Read / Sign / Organize / Verify

## Session summary — another 50

**Implemented:**
- Added `npm run check:release` and `scripts/check-release-integrity.mjs`.
- Validated release manifest, release index, hash algorithm, article count, and honest pending/confirmed claims.
- Updated `/verify.html` to compare a locally calculated hash with the current public release hash.
- Updated verifier analytics/cache-busting and service-worker cache to `v7.7`.
- Prepared `docs/NEXT-50-AFTER-ANOTHER-50.md`.

**Verification:**
- `npm run check:release` passed.
- `npm run build` passed.
- Node syntax checks passed.
- `git diff --check` passed.
- Generated outputs reviewed and excluded from the source release.

## Still outstanding

Full receipt redaction/QR/polling UI, full endpoint and browser automation suites, formal release signatures, external legal/security review, official government adoption, treasury governance, protected Nostr operations, and independent archival publication remain open.
