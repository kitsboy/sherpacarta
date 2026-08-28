# sherpacarta — Last Updated 2026-08-27 by Buffy

## Summary

Complete signing-flow upgrade shipped across multiple commits. The homepage commitment modal now supports local-first signing with validation, draft persistence, accessible review, receipts, sharing, and local data management.

## What shipped

- **Landing page:** Both video players temporarily removed while verified audio-bearing MP4s are restored.
- **Desktop articles:** Grid fixed with `minmax(0, 1fr)` content column.
- **Signing flow:** Full local-first journey — validation, draft persistence, accessible review modal, post-sign success panel, receipt copy/download/print, optional sharing, undo, import/export, clear-all with confirmation.
- **Side navigation:** Upgraded from dots to labeled rail with mobile/touch support.
- **Commitment modal:** Polished card, reduced cursor-ring, mobile full-width buttons.
- **GitHub trust scan:** Fixed false positives from documentation examples.
- **Cancel button:** Hardened with all modal state cleanup and pointer interception fix.

## Key commits

- `83643df` — Finish signing flow quick wins
- `8e3c24a` — Harden signing input validation
- `58a3545` — Complete local signature tools
- `96bc66a` — make sign review cancellation definitive
- `612dbca` — fix sign review cancel interaction
- `d1908e9` — fix trust scans to ignore documentation examples

## Tests passed

Build · Reader · Release · Public · Accessibility · Disclosure · Demo · Endpoints · Sign-flow (33 checks) · Next-100

Updated handoffs: `docs/KIMI-HANDOFF.md` and `.ai_docs/current-status.md`.
