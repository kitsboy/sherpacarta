# Next 100 — remaining work after staged execution

The request was executed in four bounded workstreams. The following items are still not fully implemented and require dedicated code, external validation, or Cam/Kimi decisions.

## Still requiring code

1. Full route-aware breadcrumbs across every static route.
2. Contextual next-step cards for every completion state.
3. Persistent journey-stage indicator.
4. Full receipt import UI with current-release hash comparison.
5. QR rendering/export for local receipts.
6. Proof polling with bounded backoff and status history.
7. Receipt redaction before sharing.
8. Version archive with historical source preservation.
9. Side-by-side article diff UI.
10. Article-level revision/provenance UI.
11. Amendment lifecycle/moderation UI.
12. Browser viewport automation.
13. Screen-reader and heading-order automation.
14. Zoom and contrast snapshot automation.
15. Full endpoint authorization tests.
16. CSRF regression tests.
17. Input-boundary tests.
18. Rate-limit contract tests.
19. PII regression tests.
20. Production synthetic journey monitoring.
21. Aggregated release dashboard.

## Still requiring external or operational work

22. Independent legal review.
23. Jurisdiction-specific Canada/UK/EU review.
24. External security audit.
25. Formal document approval authority.
26. Historical release signing/approval records.
27. Confirmed organizational endorsements.
28. Official government e-petition sponsorship and identifier.
29. Treasury custody/multisig decision.
30. Nostr bot deployment and protected product-key operations.
31. Human review of translations.
32. Long-term independent archival strategy.

## Decisions before implementation

33. Whether receipt recovery URLs may ever contain a public identifier.
34. Which QR encoding is canonical for each receipt type.
35. Whether document releases receive a project signature, maintainer signature, or organizational signature.
36. Which legal jurisdictions receive formal counsel review first.
37. Whether to publish the npm SDK.
38. Whether to establish a formal advisory or review council.
39. Whether to collect any additional user data at all.
40. Whether a release dashboard belongs in the product or only in HQ.

No item above should be represented as complete until its code, evidence, or external approval exists.
