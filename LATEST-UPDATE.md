# sherpacarta — Last Updated 2026-09-08 by Buffy

## Summary

Full site-wide UX audit executed end-to-end: quieted the first-visit experience, fixed sign-flow consistency, de-cluttered the mobile bottom chrome, fixed a double-download perf bug, and made the honesty copy match the project's own truth rules. All repo checks pass.

## What shipped

- **First-visit quiet (P0):** Removed every stale build-announcement toast (BUILD 487/527/647/667/687/720), the welcome/init toasts ("100/200/300 features active", "Welcome to SherpaCarta", "Press ⌘K" tip), both onboarding tour systems (the blocking overlay and the invisible undismissable dialog), and the announcement banner. First load is now clean: hero → one CTA → journey rail.
- **Sign flow consistency (P0):** Enter key now opens the review modal (no more direct-sign bypass), the auto-download of `SherpaCarta-Signature.txt` on confirm was removed (receipt actions are user-triggered), title-blink and post-sign share toast removed, and a "Make your signature count" Canada nudge card added to the sign section so the local-sign vs real-campaign distinction is explicit.
- **Mobile chrome (P0):** Cookie banner now floats above the bottom nav (was covering it), journey rail no longer clips on small screens, floating "I Assert My Rights" button and dead `.mobile-action-bar` markup removed, back-to-top/toast-stack/a11y-chip repositioned above the bottom nav, confetti disabled under prefers-reduced-motion.
- **Performance (P1):** Unified all `?v=` cache-busts to `v=900` — the head preload (`v=865`) and body script tags (`v=862`) were mismatched, causing sc-core/sc-bundle/sc-nostr-lib to be downloaded twice. Bundle slimmed 309 KB → 295 KB. Service worker bumped to `v9.0`, draft-video + contact-sheet entries and duplicate paths removed.
- **Honesty copy (P1):** Trust bar "40+ Languages" → "8+ Languages", "8+ Billion People" → "Every Person on Earth", hero "Bitcoin-stamped" → "Bitcoin-verifiable", press section gained an explicit "references, not claims of coverage" line, FAQ softened on "legal panels"/"24 countries", and volunteer copy no longer claims 24 countries.
- **Housekeeping:** Duplicate OG/social-preview meta block removed; visible focus rings added across the sign flow, bottom nav, and floating buttons.

## Tests passed

Build · Release · Public (9) · Security (7) · Accessibility (7) · Disclosure (8) · Demo (7) · Endpoints (8) · SEO/i18n (7) · Rights (5) · Next-100 (11) · Sign-flow (33) · Reader · `git diff --check`

Updated handoffs: `docs/KIMI-HANDOFF.md`, `.ai_docs/current-status.md`, `SOURCE-OF-TRUTH.md`.