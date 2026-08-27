# Current Status — Sherpacarta

**Version:** main @ pending documentation release
**Last Updated:** 2026-08-26
**Domain:** https://sherpacarta.org
**productId:** `sherpacarta`
**User journey:** Start here → Read / Sign / Organize / Verify

## Session summary — documentation overhaul

**Completed:**
- Reconciled README and executive claims with current evidence and release state.
- Added `docs/FORMAL-DOCUMENT-PACKET.md` for letterhead-ready circulation, executive briefing, plain-language summary, technical disclosure, legal qualification, signature block, and formal-document handling.
- Added `docs/LEGAL-TRUTH-GUIDE.md` with mandatory claim vocabulary and legal/status boundaries.
- Added `docs/TECHNICAL-ARCHITECTURE.md` with source hierarchy, data boundaries, build/deploy flow, security invariants, and recovery model.
- Confirmed current onboarding, support, release manifest, browser proof tools, and CI trust checks from the previous release.
- Prepared `docs/NEXT-50-AFTER-THIS.md` for the next engineering wave.

**Documentation rule:** formal presentation, letterhead, signatures, seals, PDFs, and executive language do not create legal force. Keep source links, version, date, proof status, and legal qualification attached.

## Current known gaps

- Full route-aware breadcrumbs and universal error/recovery components remain unfinished.
- Two-step sign review, receipt import UI, QR receipt export, proof polling, and current-release hash comparison remain unfinished.
- Endpoint authorization/CSRF/boundary/privacy tests remain unfinished.
- Automated browser viewport, screen-reader, zoom, contrast, synthetic journey, and release-dashboard checks remain unfinished.
- Formal legal review and jurisdiction-specific validation are still required before external legal submission.

## Next 50
See `docs/NEXT-50-AFTER-THIS.md`.

## Do not regress
- Satohash canonical stamp contract: `/stamp?hash=&ref=`.
- Pending stamps must never be described as Bitcoin-confirmed.
- No nsec, invoice key, organizer token, or other secret in git/client.
- CSP YouTube domains and four Nostr relays.
- Honest campaign metrics and Canada dual-track language.
- Film `max-height:none`, Kokoro VO, and visible section rendering.
