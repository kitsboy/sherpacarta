# NEXT-100 — UX, Flow & Product Roadmap (2026-09-08)

Source: full site audit executed 2026-09-08 (first-visit noise, sign-flow consistency, mobile chrome, perf, honesty copy — all shipped). This is the prioritized forward list. **User experience is the top priority throughout.**

## Phase 1 — Experience & Flow (do first)

1. Rebuild the article reader into a proper reading experience (typographic scale, chapter nav, progress, related articles) — the 114 articles are the product. ✅ 2026-09-08
2. Decide the canonical journey: personal local sign vs Canada campaign — consider a single "What do you want to do?" split at the hero for Canadians vs everyone else. ✅ 2026-09-09 (hero cards + `/start.html` roles)
3. Add a real, tracked conversion funnel: Umami events for hero-CTA → sign-started → review → confirmed → share, then act on the data. ✅ hooks live; hero_path_local / hero_path_canada added
4. Replace the canned "AI summary" template with a genuinely useful generated digest or remove the label. ✅ 2026-09-10 (local excerpt, not a model)
5. Add a proper `/start.html` gate: role picker (Visitor / Canadian / Organizer / Verifier / Media) that routes to the right flow. ✅ plus Sign locally as a first-class path
6. First-run language detection (navigator.language) with a subtle, non-blocking language suggestion.
7. Empty states everywhere: signers wall, amendments, press room, archive — each with a next-step CTA. ✅ 2026-09-09
8. Sticky section awareness: highlight the active journey-rail step as you scroll.
9. Progress persistence for long readers (last-read article, resume chip — exists, needs polish + tests).
10. Share-to-story flows: generate quote/OG cards per article (existing `?article=` deep links need visual cards).

## Phase 2 — Mobile GUI

11. One bottom nav system only — delete dead `.mobile-action-bar` CSS + the legacy duplicate nav source. ✅ 2026-09-10
12. Bottom-sheet sign review on mobile (aligns with existing sheet CSS for other modals).
13. Reach audit: every tap target ≥ 44px, every fixed element inventoried once (single "floating chrome registry").
14. Safe-area + dynamic toolbar handling on iOS (keyboard overlap on sign form). ✅ 2026-09-10 (`--kb-inset` via visualViewport)
15. Mobile table/compare views beyond swipe-hint (sticky first column option).
16. Font-size clamp pass at 320px; test all sections at 320/360/390/430.
17. Pull-to-refresh friendly (avoid accidental reloads on sign).
18. PWA install bar → first-class install flow with proper dismissal + only after engagement.
19. Haptic feedback on confirm actions where supported.
20. Offline-first polish: make the sign flow + charter fully usable offline with a clear banner.

## Phase 3 — Desktop GUI

21. Custom cursor: keep only as an opt-in brand flourish or remove — it fights with native affordances.
22. Unify the fixed chrome: status dock + section rail + scroll minimap — pick one navigation surface.
23. Cards/components system: consistent border-radius, hover elevation, focus states across pillars/orgs/press/world tracks.
24. Typography scale pass: hero → section → card hierarchy; check line lengths (45–75ch).
25. Light theme quality pass (it exists; verify contrast in every section).
26. High-contrast + dyslexia theme regression suite (they exist; add visual QA).
27. Hero performance: particle canvas + aurora + waves — measure battery/CPU on low-end; consider static fallback.
28. Print stylesheet for charter, briefing, leave-behind (exists partially — QA it).
29. Scrollbar/scroll-jump consistency when modals open (body scroll lock).
30. Focus visibility: full keyboard walk of every page.

## Phase 4 — Trust & Honesty Surfaces

31. Press section: replace logo-styled cards with clearly-labeled "recommended reading" cards (already reworded; restyle).
32. Add a visible "What this site can and cannot do" transparency card near the top (stamp ≠ law, signatures local).
33. Live stamp status widget: show pending vs confirmed on the proof path.
34. Public roadmap with % complete per gate (mirrors external-gates.json).
35. Add a "verified by you" local hash-check widget on the charter (SHA-256 vs release hash).
36. Data-export audit: one obvious "all my local data" export/delete control.
37. Amend the FAQ governance language into a proper Governance page with the real process.
38. Coalition section: show the actual request pipeline (form → review → listing) instead of open seats only.
39. Add changelog/diff view for charter versions (exists in archive — surface it on the home page).
40. Metrics page: surface live Umami + KV numbers (HQ overlay) instead of static snapshots.

## Phase 5 — Performance & Architecture

41. Collapse the 21-file bundle stack: audit b1–b15 superseded features, keep a curated `sc-app.js` of ~30 active features. ✅ 2026-09-09 (7-file curated `sc-bundle.js`; dropped sources remain in `public/` for restore)
42. Remove dead assets: legacy `sc-upgrades-b*.js` sources (keep only what the bundle needs), unused OG/social PNGs, old fonts.
43. CSS: de-duplicate the repeated `.sc-disclosure`/`.sc-journey-context`/media blocks (~8 copies each) into one design-system layer.
44. One versioning scheme: single `?v=` + SW cache name aligned per release (v9.x); script the bump.
45. Lazy-load non-critical JS (share/nostr/wall) only on interaction; code-split the bundle. ✅ 2026-09-10 (share on click, press on near-viewport, nostr on connect/publish)
46. Font budget: subset woff2 or system-first fallback for non-Latin locales.
47. Image budget: AVIF/WebP for og/share/brand; `width`/`height` everywhere (mostly done).
48. Add `<link rel="preload">` only for the critical path; verify no preload/script mismatch again (contract check).
49. Lighthouse CI with budgets (LCP < 2.5s mobile, TBT < 200ms, CLS < 0.1) — lighthouserc.cjs exists.
50. Contract checks for UX regressions: "no auto-toast/modal in first 3s", "no fixed-element overlap at 390px", "no double-fetch of same asset version".

## Phase 6 — Feature Depth (the next real product steps)

51. Canada campaign: e-petition upgrade checklist UI when an MP sponsors (docs exist).
52. Paper petition: organizer dashboard for batch entry (API exists, needs UI).
53. Lightning: show LN balance/status on treasury page via HQ; LNURL-pay QR tested on mobile wallets.
54. Silent Payments address generation for donors.
55. Nostr: live wall filters (by article/tag), NIP-23 long-form publish from the reader.
56. Nostr bot (THOR) approve-mode replies for support.
57. i18n: real human-reviewed locales; start with French full charter (briefing exists).
58. RTL polish for Arabic locale.
59. Search: full-text charter search UX (⌘K exists — add filters + highlights).
60. Bookmarking: sync across devices via Nostr or file export/import.

## Phase 7 — Media & Content

61. Replace the offline film section: either restore verified MP4s or remove the empty section.
62. Produce the 60-second Sherpa film per `docs/VIDEO-SHERPA-ONE-MINUTE-BRIEF.md` (voice, music, captions, approval gates).
63. Article-of-the-day and curated collections surfaced on home (code exists — design them in).
64. Press room: add downloadable logo pack, headshots, b-roll, FAQ for journalists.
65. Blog/Dispatch: first posts on "Why Bitcoin-verifiable" and "Canada path explained".
66. Quote rotator: source-verify every quote; add citation links.
67. Testimonials: only real, consented quotes — replace any seed content.
68. Case studies: Canada organizers' playbook page.
69. Video transcripts + captions for every published film.
70. Sitemap/i18n: implement the 8-locale SEO matrix as real pages, not meta-only.

## Phase 8 — Reliability & Security

71. Endpoint browser automation: real E2E tests against the deployed API (PoW → sign → stats).
72. Rate-limit + Turnstile on campaign sign (docs exist; decide PoW vs captcha).
73. Service worker update UX: test the "new version" banner across browsers.
74. localStorage quotas: warn and offer export before sign data loss.
75. XSS regression fuzz on every user-input surface (names, amendments, nostr notes).
76. CSP audit after bundle cleanup (relax only what's needed).
77. Dependency audit + lockfile refresh (react/framer-motion are unused in the static site — remove?).
78. Remove the unused `src/` React scaffold or wire it to something real.
79. Accessibility statement page: real conformance report (WCAG 2.1 AA) with dates.
80. Independent security audit RFP follow-through (`docs/SECURITY-AUDIT-RFP.md`).

## Phase 9 — Governance & Growth

81. Formal adoption kit: model bill text per jurisdiction (BC exists) → UK/EU drafts.
82. MP toolkit: printable 2-pager + e-petition sponsorship ask (briefing exists).
83. Coalition pipeline: public form + review SLA + verified endorsement listing.
84. Legal counsel engagement (first gate on the external list).
85. Treasury governance: multisig plan, spending policy, quarterly transparency report.
86. Newsletter: real dispatch (mailing infra behind /api/capture waitlist).
87. Community: town-hall kit (BC exists), translation sprint playbook.
88. Metrics transparency page: visitors/signers/donations all live and honest.
89. Give A Bit cross-promo: suite links/cards on each product site.
90. Launch checklist: press day, social kit, Nostr seed, HN/Reddit AMA plan.

## Phase 10 — Polish & Details

91. Favicon/theme-color sync across all pages (meta is dynamic; verify per page).
92. 404 page: on-brand with search + top journeys.
93. Offline page: on-brand with retry + local tools.
94. Error toasts: dedupe + action links (retry, undo).
95. Buttons: consistent icon+label patterns; never rely on color alone.
96. Links: underline + hover states on long-form pages.
97. Focus-visible everywhere; `:target` scroll padding consistent.
98. Loading states for async actions (Nostr publish, QR generation).
99. Copy-paste audit of every heading + CTA for voice consistency (e.g., "Sign & Assert Rights" vs "Sign the Charter").
100. Final brand pass: one headline hierarchy, one CTA voice, one visual metaphor (parchment/gold/emerald) applied consistently.

---

**Truth rules that never change:** local-first privacy, no fake metrics, pending ≠ confirmed, campaign ≠ Parliamentary e-###, no secrets in git, rights only expand.