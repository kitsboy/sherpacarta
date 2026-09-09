# sherpacarta — Last Updated 2026-09-09 by Buffy

## Summary

Shipped the canonical first-choice journey: the home hero now splits **Sign locally** vs **Join the Canada campaign**, `/start.html` is a role gate, and empty states have next-step CTAs. Verified on desktop and mobile. Cache-bust `v=913`, SW `v9.2`.

## What shipped

- Hero path cards with dual-track honesty (local commitment ≠ House of Commons e-petition).
- Start-here roles: Visitor, Sign locally, Canadian, Organizer, Verifier, Media.
- Empty states on the signers wall, amendments, press, and archive.
- First-visit quiet follow-through: no Lightning toast, no cookie toast, PWA bar only after the hero is off-screen, no Explore rail on mobile.

## Tests passed

Next-100 (14) · Sign-flow (33) · Markers · `git diff --check` · browser QA desktop 1440×900 and mobile 390×844.
