# Next 50 — SherpaCarta product, trust, and security queue

Prepared after the next-40 release. Prioritize user comprehension and verifiable integrity over visual novelty.

## Product and navigation

1. Add route-aware breadcrumbs to all public pages.
2. Add a universal “Start here” onboarding route.
3. Add role-based entry points for citizen, organizer, journalist, and institution.
4. Add a global page-state indicator for active journey stage.
5. Add contextual next-step cards after every primary action.
6. Add a public support/contact triage page.
7. Add a resilient broken-proof recovery route.
8. Add consistent header/footer navigation across every static route.
9. Add route-level canonical and social metadata checks.
10. Add a sitemap reachability test for every generated URL.

## Document governance

11. Publish a signed release manifest for each charter version.
12. Add a public version archive with dates and hashes.
13. Add side-by-side version comparison.
14. Add article-level revision history.
15. Add stable citation metadata and downloadable citations.
16. Add translation review status to each locale.
17. Add amendment lifecycle statuses and timestamps.
18. Add a public governance decision log.
19. Add provenance metadata to TXT, JSON, Markdown, and PDF exports.
20. Add an official release approval checklist.

## Signing, proof, and receipts

21. Add a two-step sign review screen before persistence.
22. Add explicit cancel/reset draft controls.
23. Add duplicate detection explanation with non-sensitive matching reason.
24. Add receipt import UI using the existing import helper.
25. Add receipt integrity verification against the current document hash.
26. Add QR export for receipts.
27. Add visibility choices with plain-language consequences.
28. Add a recovery URL that never exposes private fields by default.
29. Add post-sign receipt download and print actions.
30. Add a proof status refresh action with retry/backoff.

## Security and privacy

31. Add automated authorization tests for every state-changing endpoint.
32. Add CSRF regression tests for browser-originated writes.
33. Add rate-limit contract tests and retry headers.
34. Add boundary tests for every user-controlled field.
35. Add a privacy test ensuring metrics contain no PII.
36. Add secret scanning to CI.
37. Add dependency audit to CI.
38. Add asset integrity checks for external resources.
39. Add a reviewed threat model to `/security.html`.
40. Add a public vulnerability disclosure workflow and SLA.

## Mobile, accessibility, and reliability

41. Add viewport smoke tests at 320, 360, 390, 768, 1024, and 1280px.
42. Add keyboard Read → Sign → Verify journey tests.
43. Add screen-reader landmarks and heading-order tests.
44. Add 200% and 400% zoom checks.
45. Add high-contrast snapshots for all status states.
46. Convert comparison tables into semantic mobile cards.
47. Add explicit offline/read-only messaging to the charter.
48. Add timeout/retry UI for Satohash and campaign APIs.
49. Add synthetic Read → Sign → Receipt → Stamp → Verify monitoring.
50. Add a release dashboard that combines build, accessibility, security, and proof checks.
