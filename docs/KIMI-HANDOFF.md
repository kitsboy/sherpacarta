# Kimi Handoff — SherpaCarta

Ongoing handoff log for M3 (Grok) → M4 (Kimi). **Newest sessions at the top.**

---

## Latest Session Summary (from 2026-07-09 goodbye — security audit)

**Chat Topic:** Comprehensive security/reliability/a11y/UI audit, remediations, production deploy, clean handoff.

### Finished in this session
- Full audit report (Critical→Info): unauth batch/sign, XSS, races, SW stale cache, missing CSP, FAQ a11y, etc.
- **Shipped remediations** (live on sherpacarta.org):
  - Canada API: rate limits, method allowlist, CORS allowlist, sanitize displayName, safer stats updates
  - **Paper batch locked** — needs Cloudflare secret `ORGANIZER_TOKEN` + header `X-Organizer-Token` (or Bearer)
  - XSS: safe DOM for toast / signers / amendments / Nostr / Canada receipt + public wall
  - SW **v6.3** network-first HTML; never cache `/api/canada/*`
  - CSP + `X-Frame-Options: DENY`
  - FAQ keyboard buttons; better `--text3` contrast; honest newsletter waitlist; FAQ signing copy fixed
  - Ed25519: no private key in localStorage; no auto-attest wrap on home sign
  - `/api/canada/ping` health; MCP article path validation
- Production stats restored to **total: 4** after smoke-test batch inflation was corrected in KV
- Live checks: batch without token → **503**; ping → `batch-v3-locked`; CSP present

### Still to do
| Priority | Item | Who |
|----------|------|-----|
| High | Set `ORGANIZER_TOKEN` in CF Pages env; document for organizers | 🧑 Cam |
| High | Optional Turnstile/PoW on campaign sign (bots within rate limit) | later |
| Med | Modal focus trap; optional system cursor default | 🤖 |
| Cam-gated | Lightning pick → wallets.json; BTC custody; Nostr npub story | 🧑 |
| Cam-gated | MP + e-### + paper field ops | 🧑 |
| Expansion | UK legal brief → EU pilots; human i18n | 🧑/📋 |

### Next for Kimi
- Integrate `SESSION-SUMMARY-2026-07-09-security-audit.md` into vault / MASTER-BRAIN when Cam says go
- Update Kanban: mark security remediations done; add card “set ORGANIZER_TOKEN”
- **Do not** invent live Lightning, endorsements, or verified campaign totals
- Educate Hermes; clean summaries only (no raw chat dumps)
- **Do not sync M4** until Cam or Kimi says it’s time

### Git State
- SHA: see `git log -1` after goodbye commit (base: `17b3336` + goodbye)
- Commits this session: `135d814` · `eb80969` · `17b3336` · goodbye
- Branch: `main` · pushed · Live: https://sherpacarta.org

### Organizer token (ops note for Cam)
1. CF Pages → sherpacarta → Settings → Environment variables → `ORGANIZER_TOKEN` (secret)
2. Browser on `/canada/organizer`: `sessionStorage.setItem('sc_organizer_token', '<token>')`
3. Then “Log batch” works remotely; else local-only backup

---

## Session — 2026-07-09 (earlier goodbye — jurisdictions + Kanban)

**Chat Topic:** Fix page loads, verify stack, structure CA→UK/EU, document backend finish-later work.

### Finished
- Cloudflare 308 redirect loop fixed; extensionless Canada URLs
- /jurisdictions + wallets.json + real /status + honest /treasury
- docs/KANBAN.md; SESSION-SUMMARY-2026-07-09.md

### Still Cam-gated
- Lightning · BTC custody · Nostr · MP · UK/EU

**Git (that session):** e4fc7eb era  
**Live:** https://sherpacarta.org

---

## Session — 2026-07-09 (Kanban for finish-later)

**Done:**
- Full remaining-work reminder list as Kanban for Kimi
- File: `docs/KANBAN.md`

**Kimi:** Import Kanban into vault/task board. Cam-gated cards tagged CAM.

---

## Session — 2026-07-09 (verify + jurisdictions + treasury honesty)

**Done:**
- Live verify: core pages, Canada API, NIP-05 on giveabit.io, mempool treasury OK
- Added /jurisdictions, /data/jurisdictions.json, /data/wallets.json
- Real /status probes; treasury self-hosted + funding rails honesty
- Home/footer wired; SW v6.2; deploy live

**Git:** `f33fb261a10856ee71dc704a5e3faa8c52513ce5`

---

## Session — 2026-07-09 (page-load fix + polish)

**Machine:** M3 (Grok 4.5)  
**Project:** sherpacarta

### Done
- [x] Root cause of blank/hanging pages: Cloudflare redirect 200 rewrites + pretty-URL stripping caused 308 self-loops (fixed in 473dbd2)
- [x] Live verify: /canada/sign and all key pages return 200 (no redirect loop)
- [x] Extensionless Canada URLs as canonical (/canada/sign not .html)
- [x] Sitemap, OG/canonical, sc-bundle, mobile nav, petition JS, SW v6.1, asset cache bust v730
- [x] Pushed + deployed to Cloudflare Pages

### Decisions
- Prefer extensionless links; never re-add extensionless-to-html 200 rewrites
- Skip LNURL / NIP-05 / MP champion until Cam provides them

### Git State
- SHA: `8ab223d35cb9b1b411109de3ec77a0b887aae2b1`
- Branch: main · pushed

### Cam still needs (short list)
1. Lightning LNURL (replace TEMP donation address)
2. MP sponsor + e-### for official Parliament e-petition
3. Optional: npm login + npm run publish:packages (SDK only — not site load)
4. Optional: human-reviewed ES/FR legal i18n + real endorsements

---

## Handoff to Kimi — 2026-07-09 (Canada petition finish)

**Machine:** M3 (Grok 4.5)  
**Project:** sherpacarta

### Done

- [x] Dual-track Canada petition v2 (campaign API + paper + official bridge)
- [x] Federal-only paper sheet (no BC tab; all provinces count federally)
- [x] QR join landing, organizer paper-batch API, hub heatmap/recent wall
- [x] Sign confetti/SMS share, proof redesign, official MP checklist
- [x] PETITION_KV bound; `/api/canada/sign|stats|batch`

### Cam still needs

- [ ] MP to authorize federal e-petition → set e-### in campaign-canada.json
- [ ] Print sheets + field collection
- [ ] 5 supporters for e-petition creation

### Git

- Branch: main · see latest commits after deploy

---

## Handoff to Kimi — 2026-07-09 (Design Sprint BUILD 720)

**Machine:** M3 (Grok 4.5)  
**Project:** sherpacarta

### Done

- [x] World-class design tokens + hero conversion (Sign primary, Canada CTA, proof chips)
- [x] Self-hosted fonts (Outfit, Cormorant, DM Mono) + Font Awesome — zero Google Fonts CDN
- [x] Honest local signatures (no inflated 4,271 global claim)
- [x] Coalition “seats open” honesty redesign
- [x] Mobile bottom nav, first-visit onboarding, high-contrast + dyslexia themes
- [x] Charter export TXT/MD, press-kit.html, charter.txt, humans.txt, offline.html
- [x] Spanish + French locale expansion; SW v5.4; features 688–720 (`sc-upgrades-b14.js`)

### Decisions

- Signatures are browser-local only; marketing must not invent global counts
- Organizational grid is aspirational seats, never fake endorsements
- Self-host type/icons to match zero-tracking claim

### What's Next

- [ ] Lightning LNURL when Cam provides it
- [ ] `npm run publish:packages` after `npm login`
- [ ] Federal e-petition (MP sponsor)
- [ ] Human-reviewed full legal i18n (ES/FR bodies)
- [ ] Kimi: integrate BUILD 720 into MASTER-BRAIN — **do not sync M4 until Cam says go**

### Git State

- Branch: main
- See latest commit after push/deploy

---

## Handoff to Kimi — 2026-07-07 (Goodbye)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Press outlets BUILD 688 — links, icons, mobile marquee, SW v5.3 (`0d71baa`, deployed)
- [x] All docs synced to BUILD 688 (`fb69bc6`)
- [x] `SESSION-SUMMARY-2026-07-07.md` updated for clean recovery

### Decisions

- Custom SVG fallbacks for outlets not in Simple Icons (Wired, EFF, VICE, RoW, PI)
- Docs commit excluded timestamp-only build artifacts

### What's Next

- [ ] Lightning LNURL when Cam provides it
- [ ] `npm run publish:packages` after `npm login`
- [ ] Federal e-petition (MP sponsor)
- [ ] Kimi: integrate this summary into MASTER-BRAIN / Obsidian — **do not sync to M4 until Cam or Kimi says it's time**

### Git State

- Last commit SHA: fb69bc6
- Branch: main
- Unpushed: none

---

## Latest Session Summary (from 2026-07-07 goodbye)

**Chat topic:** Finish press section follow-ups, sync all docs, close session cleanly.

**Finished in this session:**
- Press outlets BUILD 688 live at sherpacarta.org
- 23 documentation files updated to current architecture and BUILD state
- Goodbye handoff + session summary written

**Still to do:**
- Lightning wallet, npm publish, federal e-petition, Satohash template submit, Kimi vault sync

**Next for Kimi:** Read `SESSION-SUMMARY-2026-07-07.md` and top handoff section. Integrate into MASTER-BRAIN / Kanban. Use giveabit-project-handoff skill for future updates.

---

## Handoff to Kimi — 2026-07-07 (Session 8 — Press Outlets / Docs Sync)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Press outlets BUILD 688 — linked cards, `sc-press-outlets.js`, mobile marquee, SW v5.3
- [x] Committed `0d71baa`, pushed, deployed to sherpacarta.org
- [x] All project docs updated to BUILD 688 state

### Decisions

- Simple Icons CDN for Guardian + Hacker News; custom SVG fallbacks for Wired, EFF, VICE, Rest of World, Privacy International (not in Simple Icons set)
- Mobile marquee clones grid cards; non-interactive in marquee; grid hidden below 640px

### What's Next

- [ ] Lightning LNURL when Cam provides it
- [ ] `npm run publish:packages` after `npm login`
- [ ] Federal e-petition (MP sponsor)
- [ ] Kimi: sync BUILD 647–688 + updated docs to Obsidian / MASTER-BRAIN

### Git State

- Last commit SHA: 0d71baa
- Branch: main
- Unpushed: none (docs commit pending this session)

---

## Handoff to Kimi — 2026-07-07 (Session 7 — Canada Petition)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Canada petition BUILD 687 — `/canada/` pages, `sc-petition-canada.js`, campaign JSON
- [x] Moral sign (auto-Canadian), passkey, Nostr kind 1978, merkle root, Satohash stamp
- [x] `sc-upgrades-b13.js` features 668–687
- [x] Press section centered card grid (`c06716f`)

### What's Next

- [x] Press outlets follow-up (links, icons, marquee) — done BUILD 688
- [ ] Satohash template submit when ready

### Git State

- Commits: `dbe8bd2` (687), `c06716f` (press grid), `0d71baa` (688)

---

## Handoff to Kimi — 2026-07-07 (Session 6 — Full Charter)

**Machine:** M3 (Grok)  
**Project:** sherpacarta

### Done

- [x] Full 114-article charter BUILD 667 — `data/charter.json`, generate/inject scripts
- [x] Chapter browser + search; 114 API article files; sitemap 143 URLs
- [x] `sc-upgrades-b12.js` features 648–667
- [x] npm packages scaffolded in `packages/`

### What's Next

- [x] Canada petition — done BUILD 687
- [ ] npm publish

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

## Handoff to Kimi — 2026-07-07

**Machine:** M3 (Grok)
**Project:** sherpacarta

### Done

- [x] Sprint 6 — split CSS/JS, sc-bundle.js, Lighthouse CI, b9 (588–607)
- [x] Sprint 7 — treasury.html, security.html, live mempool widget, b10 (608–627)
- [x] Sprint 8 — embed.js, SDK, MCP server, API articles, b11 (628–647)
- [x] BUILD 647, index.html 212KB→72KB, SW v5.0
- [x] IMPROVEMENTS-200.md backlog

### Decisions

- HTML-first preserved; extraction + bundle not full SPA migration
- Treasury/bounty client-side only (no backend)
- npm packages local in packages/ — publish pending

### What's Next

- [ ] Deploy BUILD 647
- [ ] Publish @giveabit/sherpacarta + mcp to npm
- [ ] Lightning LNURL (needs Cam)
- [ ] Add 100 missing charter articles (IMPROVEMENTS #1)
- [ ] Kimi: sync Sprints 6–8 to Obsidian

### Git State

- Branch: main
- See commit after push

---

## Latest Session Summary (from 2026-07-07)

**Chat topic:** Sprints 6–8, full charter, Canada petition, press outlets, docs sync.

**Finished:** BUILD 647–688 — architecture split, treasury/bounty, API/SDK/MCP, 114 articles, Canada petition, press linked cards + icons + marquee. All docs updated. Deployed.

**Still to do:** Lightning LNURL, npm publish, federal e-petition, Kimi Obsidian sync.

**Next for Kimi:** Integrate `SESSION-SUMMARY-2026-07-07.md` + updated `SOURCE-OF-TRUTH.md`. Do not sync to M4 until Cam or Kimi says it's time.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

## Session — 2026-07-09

**Done:**
- Comprehensive security/reliability/a11y audit remediations shipped
- Canada API: rate limits, method allowlist, CORS restrict, displayName sanitize, batch requires ORGANIZER_TOKEN
- XSS: toast/signers/amendments/Nostr/sign receipt/campaign wall use textContent
- SW v6.3 network-first HTML + no-cache campaign API; CSP + X-Frame-Options DENY
- FAQ keyboard buttons; --text3 contrast; honest newsletter waitlist; Ed25519 no private key storage
- Restored production stats after smoke-test inflation (total=4)
- Deployed production; ping `/api/canada/ping` ok; batch unauthenticated → 503

**Decisions:**
- Paper batch API locked until Cam sets Cloudflare secret ORGANIZER_TOKEN
- Campaign totals remain rate-limited self-reports (not identity-verified)

**Git State:**
- SHA: eb80969 (and 135d814 prior security commit)
- Pushed to origin/main
- Live: https://sherpacarta.org

