# SherpaCarta current status

**Updated:** 2026-08-26 · Buffy M3
**Branch:** `main`
**Latest pushed release:** `9c5bb26` plus current disclosure/evidence packet release pending push

## Delivered this session

- Added reusable high-contrast disclosure bar: `DEMO DATA`, `REQUIRES YOUR ACTION`, `PENDING VERIFICATION`, and `LIVE / REPOSITORY VERIFIED`.
- Added machine-readable `public/data/external-gates.json` covering all eleven external requirements.
- Added legal counsel, security audit, and operations evidence-request packets.
- Updated Treasury, Security, Jurisdictions, Nostr, and homepage surfaces with explicit action-required messaging.


- Batch 1: bounded public Satohash lifecycle polling, explicit pending/confirmed/error states, public stamp-ID validation, copy/download proof evidence actions.
- Batch 2: security/privacy contract checks, CI workflow, and test-boundary matrix.
- Batch 3: accessible route journey context, current-step messaging, offline guidance, and accessibility contracts.
- Batch 4: amendment lifecycle page, machine-readable release approval boundaries, formal release-review gate, and cache coverage.

## Verification

- `npm run check:release` ✅
- `npm run check:public` ✅
- `npm run check:security` ✅
- `npm run check:a11y` ✅
- `npm run build` ✅
- JavaScript syntax checks ✅
- `git diff --check` ✅

## Truth boundaries

Satohash proof status remains distinct from legal validity, government adoption, signer identity verification, and organizational endorsement. Repository checks are not an external security audit, legal review, or production synthetic monitor. No private keys or organizer secrets belong in this repository.

## Still open

The eleven external gates remain uncompleted until evidence is supplied: independent counsel, Canada/UK/EU review, independent audit, authorized deployed testing, formal authority, MP sponsorship/e-###, direct endorsements, custody decision, protected Nostr operations, human translation approval, and independent archive/recovery.



External legal/security review, deployed endpoint authorization/CSRF/rate-limit tests, full browser and screen-reader automation, historical release preservation/signing, formal approval authority, government e-petition sponsorship, treasury custody decisions, protected Nostr operations, human translation review, and independent archival publication.
