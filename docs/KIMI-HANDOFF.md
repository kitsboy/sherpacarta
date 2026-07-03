# Kimi Handoff — SherpaCarta

Ongoing handoff log for M3 (Grok) → M4 (Kimi). Append new sessions at the top.

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

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*