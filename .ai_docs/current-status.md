# SherpaCarta current status

**Updated:** 2026-08-27 · Buffy M3
**Branch:** `main`
**Latest pushed release:** `aea67ab`; landing media/CSP/article-layout repair pending commit

## Landing-page repair (2026-08-27)

- Temporarily removed the broken official two-minute film player after the external object URL returned 404/access-denied. The landing page now states that the film is offline pending restoration; no dead player remains.

- Confirmed `sherpacarta.org/video/sherpacarta-2min.mp4` returns the SPA HTML fallback, not media bytes.
- Confirmed `https://videos.giveabit.io/video/sherpacarta-2min.mp4` returns a real MP4; the landing page now keeps that source and explicitly permits it in `media-src`.
- Increased the official film lazy-load viewport margin so the source attaches before the user reaches the film section.
- Fixed the desktop article browser grid with a shrink-safe `minmax(0, 1fr)` content column; the sidebar and article panel remain side-by-side instead of creating a large blank/second-row area.
- The one-minute asset remains intentionally a **silent visual draft**. It was not falsely presented as audio-complete or replaced without approved voice/music.


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
