# Current Status — Sherpacarta

**Version:** main @ `2565035`
**Last Updated:** 2026-08-26
**Domain:** https://sherpacarta.org  
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)  
**Site asset bust:** homepage CSS / JS **`?v=863`**

## Session close summary (2026-08-26 — TOP-20 UX POLISH)

**Shipped:**
- Reframed primary navigation around the user journey: **Read → Sign → Verify**.
- Added a hero journey rail linking directly to the article browser, signing flow, and proof flow.
- Added an explicit pre-sign trust notice explaining civic status, local storage, optional public actions, and review expectations.
- Added a dedicated independent-verification section explaining Satohash, SHA-256, pending versus confirmed Bitcoin status, and the limits of what a stamp proves.
- Added a compact mobile bottom action bar for Read / Sign / Verify with safe-area spacing.
- Bumped homepage asset cache-busters to `?v=863`.

**Verification:**
- `npm run build` passed.
- `git diff --check` passed.
- `npm run lint` remains blocked by the repository’s existing legacy/global-browser lint debt (1,649 errors across unrelated files); no new lint-specific issue was isolated for this batch.

## Do not regress
- Satohash canonical stamp contract: `/stamp?hash=&ref=`.
- Pending stamps must never be described as Bitcoin-confirmed.
- No nsec, invoice key, organizer token, or other secret in git/client.
- CSP YouTube domains and four Nostr relays.
- Honest campaign metrics and Canada dual-track language.
- Film `max-height:none`, Kokoro VO, and visible section rendering.

## Next 30 queued
1. Add a dedicated `/verify` landing page for nontechnical users.
2. Add a durable document version and release manifest to the hero/proof flow.
3. Add a proof receipt export containing hash, version, status, and canonical URLs.
4. Add stable deep links for every article and chapter.
5. Add visible article table-of-contents progress state.
6. Add previous/next article controls to the reader.
7. Add search-result empty, loading, and keyboard states.
8. Add a first-visit “Start here” onboarding panel.
9. Add a return-user resume-reading control.
10. Add a staged sign review screen before submission.
11. Add explicit duplicate-signature prevention feedback.
12. Add a post-sign receipt recovery path.
13. Add QR export for receipts and proof pages.
14. Add a public/private visibility choice with plain-language consequences.
15. Add server-side validation tests for every state-changing endpoint.
16. Add CSRF coverage for browser state-changing requests.
17. Add route-level abuse/rate-limit regression tests.
18. Add a security event audit schema without PII.
19. Add dependency and asset integrity scanning.
20. Add document/content hash consistency checks in CI.
21. Add mobile tests at 320/360/390px widths.
22. Add keyboard and screen-reader journey tests.
23. Add 200% and 400% zoom visual checks.
24. Add reduced-motion coverage for every new interaction.
25. Add high-contrast visual snapshots for sign/proof states.
26. Convert comparison tables to mobile-safe cards.
27. Add resilient offline/read-only charter behavior.
28. Add API timeout/retry states for Satohash and campaign services.
29. Add synthetic read → sign → receipt → stamp → verify monitoring.
30. Publish a concise trust, privacy, security, and governance explainer.

## Existing live surfaces
| Surface | Notes |
|---------|-------|
| Articles | `/#articles` · `#art-114` · body-derived summaries |
| Sign | `/#sign` · local-first commitment |
| Proof | `/#proof` · Satohash handoff and honest status language |
| Stamp | `https://satohash.io/stamp?hash=&ref=sherpacarta` |
| Metrics | `/metrics.json` · `raw.demo: false` |
| Canada | `/canada/sign` · dual-track honesty |
| Discuss | `/nostr` wall (read-only) |
