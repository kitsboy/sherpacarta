# Kimi Handoff — SherpaCarta

Ongoing handoff log for M3 (Grok) → M4 (Kimi). Append new sessions at the top.

---

## Handoff to Kimi — 2026-07-02 (Session 6 — Sidebar Restore / Goodbye)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Fixed landing dock layout across 3 commits (`fdfe8b9`, `5b8346b`, `d79065f`)
- [x] Eliminated footer black gap (document-flow widgets after footer)
- [x] Restored sidebar + BC Challenge — **HTML-first** inside `#left-ui-dock`
- [x] BC Challenge enhanced (pulse, smooth scroll, always pinned top-left)
- [x] Overrides for zen/reading/screenshot so sidebar never disappears
- [x] BUILD `20260703-425`, SW `v3.6`, scripts `?v=425`
- [x] `SESSION-SUMMARY-2026-07-02.md` written

### Decisions

- Sidebar widgets must live in HTML, not only JS-created — cached JS was hiding them via orphan CSS
- Status dock stays top-right; left dock = BC + a11y below header
- Orphan body widgets relocated off-screen, never `display:none`

### What's Next

- [ ] QA sherpacarta.org post-deploy (hard refresh)
- [ ] Lightning live wallet
- [ ] Walkthrough video
- [ ] Kimi: integrate `SESSION-SUMMARY-2026-07-02.md` into Obsidian vault

### Git State

- Last commit SHA: d79065ff8b9b71e86671074ad60a6b2d4c4f9a40
- Branch: main
- Unpushed: none (handoff docs pending this commit)

---

## Latest Session Summary (from 2026-07-02 goodbye)

**Chat topic:** Landing page sidebar/BC Challenge layout fixes — stuck at bottom, black gap, then total disappearance.

**Finished:** HTML-first sidebar in `#left-ui-dock`, footer gap gone, docks pinned below header, BUILD 425 deployed.

**Still to do:** Live QA after cache clear, Lightning wallet, walkthrough video, Kimi vault sync.

**Next for Kimi:** Read `SESSION-SUMMARY-2026-07-02.md`. Update MASTER-BRAIN / Kanban. Do not sync M4 until Cam says go.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

---

## Handoff to Kimi — 2026-07-02 (Session 5 — Landing Dock Layout)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Left UI dock (BC tab + a11y toolbar) — viewport-centered mid-left, card chrome, scroll behind
- [x] Status dock (BUILD + Online) — moved to bottom-right; back-top stacks above
- [x] Removed resize JS that pinned left dock below header (feat 383)
- [x] Section dots panel + fade near footer; mobile dots left / dock right
- [x] Footer void padding reduced; float-assert center unobstructed
- [x] Features 406–415, BUILD 20260703-415, SW cache v3.4
- [x] Deployed: `fdfe8b9`

### Decisions

- Left dock mirrors section-dots pattern (`top: 50%; transform: translateY(-50%)`)
- Status dock on right keeps left clear and avoids float-assert overlap
- Mobile: opposite sides for dock vs dots to prevent collision

### What's Next

- [ ] Visual QA on sherpacarta.org after CDN cache clears
- [ ] Lightning live wallet
- [ ] Short walkthrough video

### Git State

- Last commit SHA: fdfe8b9d5218138996f3bed3af1db5a97567724b
- Branch: main
- Unpushed: none

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

---

## Handoff to Kimi — 2026-07-02 (Session 4 — 300 Features v3.0)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] `sc-enhancements-v3.js` — features 201–300 (4 groups × 25)
- [x] `docs/USAGE.md` — full how-to + video script outline
- [x] Nav ? button → usage guide modal
- [x] BUILD badge → 300 features, searchable + category tabs
- [x] ⌘K expanded: Help, Personalize, Distribute, Charter groups
- [x] SW cache v3.0, deployed

### Decisions

- Video tutorial: recommended 2–3 min; CTA banner + notify button until recorded
- Groups 9–12 themed: Help, Charter Depth, Personalization, Distribution

### What's Next

- [ ] Record short walkthrough video per USAGE.md script
- [ ] Lightning live wallet
- [ ] Institutional adoption doc

### Git State

- See latest commit after push

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

---

## Handoff to Kimi — 2026-07-02 (Session 3 — Branding Polish)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Give A Bit orange brush logo in header + footer (`giveabit-logo.png`)
- [x] Contact: hello@giveabit.io (subject: Sherpacarta) — footer, press kit, ⌘K
- [x] Official socials only: Twitter @give_bit, Nostr NIP-05 kimi@giveabit.io, GitHub
- [x] Hero + donation strips aligned to official socials (removed WA/TG/FB/LI)
- [x] Footer dead links wired (CHANGELOG, I18N, orgs, legal, privacy anchors)
- [x] Twitter meta + JSON-LD publisher → Give A Bit / @give_bit
- [x] og-image.png (1200×630) for social crawlers
- [x] BUILD 20260703-202, deployed to sherpacarta.org

### Decisions

- NIP-05 corrected to kimi@giveabit.io (not givaebit.io typo)
- Hero share strip simplified to match footer policy — charter sharing still via ⌘K/native share
- Legal footer links scroll to on-page blocks (no separate policy pages yet)

### What's Next

- [ ] Replace Lightning TEMP with live LNURL when Cam provides it
- [ ] Important doc — institutional adoption / BC model bill pack
- [ ] Full charter i18n beyond hero strings
- [ ] Real signature ledger (optional, privacy-preserving)
- [ ] Kimi: sync to Obsidian / MASTER-BRAIN

### Git State

- Last commit SHA: ee9cde0
- Branch: main
- Unpushed: none

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

---

## Handoff to Kimi — 2026-07-02 (Session 2)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Real BTC address: `bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad`
- [x] Lightning TEMP with DO NOT SEND warnings + QR popups (BTC + LN)
- [x] Mission section on landing (Magna Carta 1215 → today, two quotes)
- [x] Canada & BC Challenge section + `docs/CANADA-BC-CHALLENGE.md`
- [x] Platform roadmap `docs/ROADMAP.md` (Nostr, Satohash, API, MCP plan)
- [x] Nostr sign-in (NIP-07) + amendment proposals (local + relay publish)
- [x] Satohash/OpenTimestamp integration — stamp charter hash on Bitcoin
- [x] Charter Save Draft + enhanced Make Editable
- [x] og-image.svg for social previews
- [x] Give A Bit logo in copyright footer → giveabit.io
- [x] FAQPage JSON-LD
- [x] Updated MARKETING, EXECUTIVE_SUMMARY, MISSION, README, SOURCE-OF-TRUTH

### Decisions

- English-first for official text; amendments in any language accepted, English reviewed first
- Lightning remains TEMP until Cam provides live LNURL — loud warnings everywhere
- Nostr is optional — local-only remains default (privacy by design)
- Canada/BC is first jurisdiction beachhead, not exclusive scope

### What's Next

- [ ] Replace Lightning TEMP with live address
- [ ] Press kit PDF export
- [ ] MLA/MP outreach using CANADA-BC-CHALLENGE.md
- [ ] Stamp charter v2.0 on Satohash before first political meeting
- [ ] sitemap.xml + robots.txt
- [ ] Full charter translation workflow (post-English stabilization)

### Git State

- Branch: `main`
- See latest commit after push

---

## Handoff to Kimi — 2026-07-02 (Session 1)

*(Previous session: mobile polish, footer tabs, docs audit — see git history)*

---

## Handoff to Kimi — 2026-07-04

**Machine:** M3 (Grok)
**Project:** sherpacarta

### Done

- [x] Sprint 5 i18n expansion — 20 upgrades, BUILD 587 (`sc-upgrades-b8.js`)
- [x] New locales: de, pt, sw (full UI JSON) + es/fr/ar charter overlays
- [x] Nav language picker expanded (de, pt, sw)
- [x] Glossary modal, charter lang toggle, ⌘K language switchers, RTL fixes, TTS lang
- [x] `scripts/i18n-audit.mjs` + `npm run i18n-audit`
- [x] Service worker v4.3 with locale assets cached
- [x] Committed, pushed, deployed to sherpacarta.org

### Decisions

- Charter overlays (es/fr/ar) ship as partial translations — full article coverage deferred
- de/pt/sw get UI strings + sample articles; expand via locale JSON workflow
- i18n-audit script validates hreflang, nav langs, and locale file coverage

### What's Next

- [ ] Sprint 6: Architecture & performance (split index.html, bundle JS, Lighthouse CI)
- [ ] Sprint 7: Trust & transparency (treasury dashboard, bug bounty)
- [ ] Sprint 8: Distribution & integrations (MCP server, npm SDK)
- [ ] Replace Lightning TEMP with live LNURL when Cam provides it
- [ ] Kimi: sync Sprint 5 i18n to Obsidian / MASTER-BRAIN

### Git State

- Last commit SHA: 4307692
- Branch: main
- Unpushed: none

---

## Latest Session Summary (from 2026-07-04 goodbye)

**Chat topic:** Finished Sprint 5 i18n (BUILD 587), deployed, closed session with reminder to do Sprint 6 later.

**Finished in this session:**
- Sprint 5 i18n — `sc-upgrades-b8.js`, 6 locale files, i18n-audit script, SW v4.3
- Built, committed (`8c77248`), pushed, deployed to sherpacarta.org
- Handoff docs (`4307692`), `SESSION-SUMMARY-2026-07-04.md`

**Still to do (Cam: "remember to do this later"):**
- **Sprint 6** — split `index.html`, bundle JS, Lighthouse CI
- Sprint 7 — treasury dashboard, bug bounty
- Sprint 8 — MCP server, npm SDK
- Lightning live wallet when LNURL provided

**Next for Kimi:** Integrate `SESSION-SUMMARY-2026-07-04.md` into MASTER-BRAIN / Obsidian. Do not sync to M4 until Cam or Kimi says it's time.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*