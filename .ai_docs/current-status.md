# SherpaCarta current status

**Updated:** 2026-08-27 · Buffy M3
**Branch:** `main`
**Latest pushed release:** `83643df`

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
