# SherpaCarta current status

**Updated:** 2026-09-09 · Buffy M3
**Branch:** `main`
**Latest pushed release:** first-choice journey (local vs Canada) · v=913 · SW v9.2

## First-choice journey (2026-09-09)

Hero split is live: Sign locally vs Join the Canada campaign, plus `/start.html` roles and empty-state CTAs. Fake seed signers removed from the wall. Mobile Explore rail hidden; PWA install deferred until the hero leaves the viewport.

## Lighthouse sweep after v911 (2026-09-08, evening)

Confirmed today's v911 changes did **not** regress performance beyond noise. Lighthouse CI assertion scores across the day (home / treasury; security stable ~0.99–1.00, never warned):

| Commit state | Home | Treasury |
|---|---|---|
| pre-v910 era (`34268407580`, 19:20Z) | 0.46 | 0.64 |
| post-reader, pre-v911 (`34271667779`, 19:54Z) | 0.47 | 0.66 |
| v911 + guards (`34275558751`, 20:34Z) | 0.45 | 0.64 |

Home perf ≈0.45–0.47 and treasury ≈0.64–0.66 are the established local-runner baseline (dev `vite preview`, throttled); both sit below the 0.7 warn threshold but the workflow is `continue-on-error`, so CI stays green. No v911-attributable regression — the −0.02 drift is within run-to-run noise (±0.02 typical for single-run LHCI).

**Pre-existing issue found (not from today):** `lighthouse.yml` artifact upload always warns `No files were found with the provided path: .lighthouseci/` — lhci writes reports *after* assertions in autorun, but the upload step still misses them in CI (works locally). Fix separately: add `temporary-public-storage` upload target or move upload before assert; masked by `continue-on-error: true`.

## CI trust-gate fix (2026-09-08, later)

`static-trust` failed on run #38 of Trust checks. Root cause: the "Require honest proof language" step greps **two** files (GitHub shows only the first line as the step name, which pointed at the manifest that was actually fine). The real failure was the second grep — the exact string `Pending is not Bitcoin-confirmed` was missing from `public/verify.html` after the audit reader rewrite. Also fixed in the same commit: a stray `+` rebase artifact in verify.html, the interrupted funnel-analytics work in `sc-analytics.js` (handlers now wrapped on window `load` so later-loaded sc-core/sc-next100 definitions can't clobber them), cache-bust re-unified to `v=911` (had regressed to a 869/860/910/73x mix), SW cache → `v9.1`. Rebased over parallel hot-fix `9e1dd8d` (same sentence, kept the stray `+`). CI green on `d80c117`.

## Site-wide UX audit pass (2026-09-08)

Executed the full findings list from the 2026-09-08 review: first-visit noise, sign-flow consistency, mobile chrome collisions, a double-download perf bug, and honesty copy mismatches.

### What was done

- **First-visit quiet:** Removed all stale build-announcement toasts (BUILD 487/527/647/667/687/720), welcome/init toasts, both onboarding systems (blocking overlay + invisible undismissable dialog), and the announcement banner. Fresh visits are now clean.
- **Sign flow:** Enter opens the review modal (no direct-sign bypass), no auto-download of signature cert on confirm, no title-blink, no post-sign share toast; added a "Make your signature count" Canada nudge card making local-sign vs real-campaign explicit.
- **Mobile chrome:** Cookie banner floats above the bottom nav; journey rail no longer clips; removed the floating "I Assert My Rights" button and dead `.mobile-action-bar`; back-to-top/toasts/a11y-chip cleared of the nav; confetti respects reduced motion.
- **Performance:** Unified all `?v=` cache-busts to `v=900` (preload was `865`, scripts `862` → sc-core/sc-bundle/sc-nostr-lib downloaded twice); bundle 309→295 KB; SW `v9.0` with draft-video/dupe entries removed.
- **Honesty copy:** Trust bar "8+ Languages" and "Every Person on Earth"; hero "Bitcoin-verifiable"; press section "references, not coverage claims" line; FAQ softened on legal panels/24 countries; volunteer copy fixed.
- **Housekeeping:** Duplicate OG meta block removed; focus-visible rings across sign flow, bottom nav, floating buttons.

### Verification

- `npm run build` ✅
- All 12 check suites pass (release, public, security, a11y, disclosure, demo, endpoints, seo-i18n, rights, next100, sign-flow 33, reader) ✅
- `git diff --check` ✅
- Bundle noise grep clean (no BUILD-announcement toasts) ✅

**Do not regress:**
- No auto-toasts/modals in the first seconds of a fresh visit
- Enter key must open sign review, never sign directly
- No auto file downloads on sign confirm
- Cookie banner must never cover the mobile bottom nav
- Preload and script `?v=` versions must stay identical

## Signing-flow upgrade (2026-08-27)

Complete local-first signing journey shipped across multiple commits.

### What was done

- **Validation:** Meaningful name validation (2+ letters/numbers), Unicode-safe normalization, duplicate detection, character counters, inline errors.
- **Draft persistence:** Auto-save, restore, debounce, timestamp, failure notification, discard confirmation.
- **Review modal:** Accessible description, step indicator, close button, Escape/backdrop cancellation, focus trapping, explicit "nothing is published automatically" badge.
- **Post-sign success:** Timestamped panel with receipt copy/download/print, undo, and share actions.
- **Local data management:** Export, import with merge/replace preview, clear-all with confirmation, storage size indicator.
- **Nostr:** Explicit public-and-optional disclosure, relay health check, no automatic publishing.
- **Accessibility:** Reduced-motion coverage, keyboard-only flow, live announcements, visible focus states.
- **Mobile:** Full-width buttons, stacked layout, touch-friendly targets.
- **Contracts:** `check:sign-flow` now covers 33 automated checks.

### Key commits

- `83643df` — Finish signing flow quick wins
- `8e3c24a` — Harden signing input validation
- `58a3545` — Complete local signature tools
- `96bc66a` — make sign review cancellation definitive
- `612dbca` — fix sign review cancel interaction

### Landing-page repair

- Both video players temporarily removed pending verified audio-bearing MP4s.
- Desktop article browser grid fixed.
- Side navigation upgraded to labeled rail.
- Commitment modal polished.
- GitHub trust scan fixed.

### Verification

- `npm run build` ✅
- `npm run check:sign-flow` ✅ (33 checks)
- `npm run check:reader` ✅
- `npm run check:release` ✅
- `npm run check:public` ✅
- `npm run check:a11y` ✅
- `npm run check:disclosure` ✅
- `npm run check:demo` ✅
- `npm run check:endpoints` ✅
- `npm run check:next100` ✅
- `git diff --check` ✅


## Delivered this session

- Added multilingual SEO metadata for English, French, Spanish, German, Portuguese, Swahili, Arabic, and Chinese with human-review states.
- Added secular/nonpartisan/nonreligious digital-rights framing guidance and current-law boundaries.
- Added educational rights taxonomy and article-reference checks.
- Added `docs/VIDEO-ONE-MINUTE-HANDOFF.md` with enhanced civic/history and technical Bitcoin/Satohash/OpenTimestamps scripts for later production.
- Added `docs/VIDEO-SHERPA-ONE-MINUTE-BRIEF.md` with a realistic young British male presenter concept, 60-second script, visual direction, and consent/review gates.
- Rendered and published the first one-minute **silent visual draft** at `/video/sherpacarta-one-minute-draft.mp4`, with a visible DEMO DATA notice and temporary geometric presenter stand-in; the MP4 has no embedded voiceover or music.
- Added `/rights.html` secular plain-language digital-rights education page.
- Added `check:next100` covering the new rights, SEO, social, and video package.
- Connected the educational rights taxonomy to the article reader with local progress, category filtering, citation copy, provenance labels, and share context.
- Added `check:reader` for the reader/data/cache integration contract.
- Added `check:seo-i18n` and `check:rights`.


- Added `/share.html` with professional WhatsApp, X/Twitter, Facebook, and Nostr-ready copy, canonical Open Graph/Twitter metadata, evidence links, and native-share fallback.
- Added explicit `DEMO DATA` warnings to press and press-kit surfaces.
- Added demo catalog, showcase checklist, and deep gap register.
- Added clearly labeled fictional templates for legal counsel, MP/e-###, endorsements, audit, formal authority, treasury custody/multisig, Nostr operations, translation review, and independent archive/recovery.
- Added existing-dependency-only endpoint fixture checks and consolidated repository-contract CI workflow.
- Updated source-of-truth, Kanban, and Kimi handoff maps.

## Verification

- `npm run check:release` ✅
- `npm run check:public` ✅
- `npm run check:security` ✅
- `npm run check:a11y` ✅
- `npm run check:disclosure` ✅
- `npm run check:demo` ✅
- `npm run check:endpoints` ✅
- JavaScript syntax checks ✅
- `npm run build` ✅
- `git diff --check` ✅

## Demo policy

“Steve Jobs” appears only in explicitly marked DEMO DATA documentation as a fictional example. It is not a real endorsement, lawyer, MP, reviewer, translator, custodian, operator, or contact. Public records contain no invented external evidence.

## Video audio gate

The published one-minute asset is not an audio-complete film. Voiceover, music, rights/consent, mix verification, caption review, and replacement preview remain pending. Do not describe the current MP4 as narrated, scored, or finished.

## External gates still require real action

Independent legal counsel, Canada/UK/EU review, independent security audit, authorized deployed testing, formal approval authority, MP sponsorship/e-###, direct organizational endorsements, treasury custody decision, protected Nostr operations, human translation approval, and independent archive/recovery all remain uncompleted until evidence is supplied.
