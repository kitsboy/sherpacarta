# Session Summary — SherpaCarta — 2026-07-02

## Chat Topic
Landing page UI dock layout: fix sidebar (a11y tools) and BC Challenge button positioning, eliminate footer black gap, then restore them when they disappeared entirely.

## Key Things We Did
- Iterated dock positioning (center → top → HTML-first)
- Created `#left-ui-dock` and `#status-dock` for pinned UI
- Moved BUILD + Online to top-right status pill
- Diagnosed root cause: widgets appended after footer with `position: static` + orphan `display:none` CSS
- Embedded BC Challenge + a11y toolbar directly in `index.html` inside the dock
- Added zen/reading/screenshot mode overrides so sidebar never hides
- Enhanced BC button (pulse, smooth scroll, stronger styling)
- Cache-bust scripts `?v=425`, service worker `v3.6`

## What We Finished
- [x] Footer black gap eliminated (trimmed body/footer padding, removed document-flow widgets)
- [x] Sidebar + BC Challenge restored and HTML-first (no JS dependency for visibility)
- [x] Docks pinned below header, fixed on scroll
- [x] BUILD `20260703-425` deployed (`d79065f`)

## What We Are Still Aiming to Finish
- [ ] Visual QA on https://sherpacarta.org after hard refresh / SW cache clears
- [ ] Replace Lightning TEMP with live LNURL when Cam provides it
- [ ] Short walkthrough video per `docs/USAGE.md`
- [ ] Institutional adoption doc / BC model bill pack
- [ ] Kimi: sync hand-off to Obsidian / MASTER-BRAIN

## Update / Status
As of 2026-07-02, SherpaCarta landing page has a reliable left sidebar: BC Challenge button on top, a11y tools below, both fixed below the header. Status dock (BUILD + Online) sits top-right. Three layout commits this session: `fdfe8b9` (center docks), `5b8346b` (top + gap fix), `d79065f` (HTML-first restore). Users need Cmd+Shift+R if they still see old BUILD numbers.

## Key Decisions / Notes
- **HTML-first sidebar** beats JS-only dock assembly (survives cached JS)
- Never use `display:none` on orphan body widgets — relocate off-screen instead
- BC Challenge always visible; a11y toolbar can still collapse via ♿ chip
- Reading/zen modes must not hide `#left-ui-dock`

## Mission Tie-in
SherpaCarta practices what it preaches — accessible, privacy-first, zero-tracking UI. A stable sidebar keeps BC Challenge (Canada beachhead) and a11y tools reachable for every visitor, supporting the global digital rights movement under the Give A Bit family.

---
*Safe Harbour · giveabit.io*