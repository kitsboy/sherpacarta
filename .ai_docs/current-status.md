# Current Status — Sherpacarta

**Version:** main @ pending next-50 release
**Last Updated:** 2026-08-26
**User journey:** Start here → Read / Sign / Organize / Verify

## Session summary — next 50 proof/archive batch

**Implemented:**
- Added visible receipt inspection with local structure validation and current-release hash comparison.
- Added redacted proof receipt export that excludes signer/private/local-only fields.
- Added verifier recovery actions for missing, expired, or unavailable proofs.
- Added archive/citation breadcrumb navigation.
- Added mobile-safe comparison-table overflow guidance.
- Added `scripts/check-release-integrity.mjs` and `npm run check:release` as the release metadata integrity gate.
- Corrected service-worker asset-list syntax and bumped cache to `v7.8`.
- Prepared `docs/NEXT-50-AFTER-ANOTHER-50.md` for the following wave.

**Verification:**
- `npm run check:release` passed.
- `npm run build` passed.
- New/changed JavaScript syntax checks passed.
- `git diff --check` passed.
- Generated build artifacts reviewed and excluded from source commit.

## Still outstanding

- Full proof polling/status history, QR receipt rendering, archive diff UI, signed release approvals, article provenance, complete endpoint/browser automation, external legal/security review, official government adoption, formal treasury/Nostr governance, and independent archive publication.
