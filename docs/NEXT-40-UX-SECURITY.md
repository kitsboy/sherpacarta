# Next 40 — SherpaCarta UX, trust, and security queue

Queued after the `2565035` top-20 release and the follow-up verification/read/sign batch.

## User journey and comprehension

1. Add a first-visit “Start here” drawer with Read, Sign, and Verify choices.
2. Add a persistent route-aware breadcrumb to every public page.
3. Add a “What happens next?” panel after every primary action.
4. Add role-based entry points for citizen, organizer, journalist, and institution.
5. Add a plain-language glossary for legal and Bitcoin terms.
6. Add a one-minute guided tour that respects reduced motion.
7. Add a global “You are here” page-state indicator.
8. Add a recovery page for broken, expired, or incomplete proof links.

## Document quality and governance

9. Publish a signed release manifest for every charter version.
10. Add a public archive browser for all charter versions.
11. Add side-by-side diff viewing between document releases.
12. Add article-level revision history and stable citation metadata.
13. Add an editorial status to every translation.
14. Add an amendment lifecycle view: proposed, reviewed, accepted, rejected.
15. Add a public governance decision log.
16. Add machine-readable provenance metadata to downloads.

## Signing and receipts

17. Add a two-step sign review screen before local persistence.
18. Add a clear cancel/reset draft action.
19. Add duplicate detection that explains exactly what matched.
20. Add receipt import from a downloaded JSON file.
21. Add receipt integrity verification in the browser.
22. Add QR export for local receipts.
23. Add a visibility matrix explaining local, optional public, and campaign-sync states.
24. Add a receipt recovery link that never exposes private fields by default.

## Security engineering

25. Add automated endpoint authorization tests for all state-changing functions.
26. Add CSRF regression tests for browser-originated writes.
27. Add rate-limit and abuse-control contract tests.
28. Add input-boundary tests for names, emails, URLs, and article references.
29. Add a privacy regression test ensuring no PII enters metrics payloads.
30. Add secret scanning and dependency auditing to CI.
31. Add Subresource Integrity where external assets remain necessary.
32. Add a reviewed threat model to the security page.

## Mobile, accessibility, and reliability

33. Add Playwright-style viewport checks at 320, 360, 390, 768, and 1280px.
34. Add keyboard journey checks for Read → Sign → Verify.
35. Add screen-reader landmark and heading-order checks.
36. Add 200% and 400% zoom checks to the release gate.
37. Add high-contrast snapshots for form, error, pending, and confirmed states.
38. Convert wide comparison tables to mobile cards without losing semantics.
39. Add explicit offline/read-only mode messaging for the charter.
40. Add synthetic monitoring for read → sign → receipt → stamp → verify.
