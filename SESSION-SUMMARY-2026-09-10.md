# Session Summary — 2026-09-10

**Chat Topic:** Pick up SherpaCarta, ship the first-choice journey, then finish the unblocked roadmap tracks and close the session.

**Key Things We Did:**
- `/whatsup` + git pull; summarized recent UX/LCP/CI work
- Shipped local-sign vs Canada campaign at the hero, plus `/start.html` roles
- Locked load/bundle/trust/mobile with contract checks
- Fixed 390px sign-review so it sits above the bottom nav
- Curated the home JS bundle (21 files / 707 feats → 7 files, 294 KB → 114 KB)
- Lazy-loaded share, Nostr, and press JS; dropped canned AI Summary; iOS keyboard inset

**What We Finished:**
- First-choice hero and empty states
- Trust card: stamp ≠ law; local signature ≠ House of Commons petition
- Curated `sc-bundle.js`; no Google Fonts; no self-preload
- Sign-review as a document-level bottom sheet above `--bottom-nav-h`
- Lazy modules; In brief excerpts; `--kb-inset`
- Contracts: next100 38, sign-flow 37

**What We Are Still Aiming to Finish:**
- Home LCP (slim CSS, font subset)
- Optional delete of unused upgrade source files
- Cam-gated: MP + e-###, film voice/music, human French, treasury custody, Nostr bot nsec

**Update / Status:**
As of 2026-09-10, `main` is at `764c79e`, cache `v=918`, SW `v9.7`. Site is technically ready. Politics, film audio, and keys stay with Cam.

**Key Decisions / Notes:**
- Two-path hero is canonical; do not collapse to one Sign button
- `#sign-review` must stay outside `.reveal` or `position:fixed` is trapped
- Do not re-add `sc-upgrades-b9.js` to the bundle
- Pending is not Bitcoin-confirmed

**Mission Tie-in:**
Give A Bit: local-first dignity, honest petition counts, Bitcoin proof without pretending a stamp is law.

**Next for Kimi:** Fold this into MASTER-BRAIN / Kanban. Do not invent endorsements or e-###. Code stays on M3.
