# Current Status — Sherpacarta

**Version:** main @ pending next-100 release
**Last Updated:** 2026-08-26
**Domain:** https://sherpacarta.org
**User journey:** Start here → Read / Sign / Organize / Verify

## Session summary — next 100 staged completion

**Implemented:**
- Batch 1: onboarding/offline/sign-review/reset/receipt inspection foundations.
- Batch 2: public release archive, machine-readable release records, citation generator, and navigation/cache coverage.
- Batch 3: security audit workflow, secret-pattern checks, dependency audit, and threat model link.
- Batch 4: reliability helper, offline/retry documentation, and QA release gate.
- Documentation now includes `docs/NEXT-100-COMPLETION.md` and `docs/NEXT-100-REMAINING.md`.
- Current product documentation remains plain-language, executive, technical, legal-safe, and formal-document ready.

**Verification:**
- `npm run build` passed.
- Node syntax checks passed for new/changed scripts.
- `git diff --check` passed.
- Stale-claim scan passed.
- Generated artifacts reviewed and excluded unless intentionally sourced.

## Still outstanding

- Full receipt import UI/current hash comparison/QR export/proof polling.
- Complete endpoint authorization, CSRF, boundary, rate-limit, and PII test suites.
- Automated browser viewport, screen-reader, zoom, contrast, synthetic journey, and release-dashboard checks.
- External legal review, external security audit, official government adoption, formal approval authority, and historical release preservation.

See `docs/NEXT-100-REMAINING.md` for the full inventory.

## Do not regress

- Satohash canonical stamp contract: `/stamp?hash=&ref=`.
- Pending stamps must never be described as Bitcoin-confirmed.
- No nsec, invoice key, organizer token, or other secret in git/client.
- CSP YouTube domains and four Nostr relays.
- Honest campaign metrics and Canada dual-track language.
- Formal documents must retain source, version, date, proof status, and legal qualification.
