# Session Summary — 2026-07-09 (SherpaCarta)

**Chat Topic:** Recover and harden sherpacarta.org after broken page loads; verify the full stack; structure Canada → UK/EU path; document money/identity/backend work Cam must finish later.

**Machine:** M3 (Grok 4.5) · **Project:** sherpacarta  
**Final commit (at goodbye):** `e4fc7eb` · **Branch:** main · **Live:** https://sherpacarta.org

---

## Key Things We Did

- Diagnosed blank/hanging pages as Cloudflare **308 self-loops** (bad `_redirects` 200 rewrites + pretty-URL stripping)
- Fixed redirects; standardized on **extensionless** Canada URLs (`/canada/sign`)
- Verified live stack: home, Canada, APIs, fonts, assets, mempool, NIP-05
- Discovered **Lightning LNURL already live on giveabit** (`kimi@` / `cam@`) but **not wired** into SherpaCarta donate UI (still TEMP by design)
- Added **jurisdictions map**, **wallets.json**, **real status probes**, **honest treasury rails**
- Wrote **`docs/KANBAN.md`** full finish-later board for Kimi
- Explained npm packages (ELI15): build tools, not visitor runtime

---

## What We Finished

- [x] Page-load fix + deploy (Canada + key static pages return 200)
- [x] Mobile Canada CTA + articles browser (prior) remain live
- [x] HRF YouTube embed (prior) live
- [x] `/jurisdictions` + `data/jurisdictions.json` (CA live · UK/EU planned)
- [x] `/data/wallets.json` + sc-core hydrate hook for future LN
- [x] `/status` live browser checks
- [x] `/treasury` self-hosted, funding rails honesty
- [x] Home/footer links; SW v6.2; honest donate copy
- [x] Kanban + Kimi handoff + this session summary

---

## What We Are Still Aiming to Finish

See **`docs/KANBAN.md`** (source of task truth). Cam-gated first:

1. **Pick Lightning** (`kimi@giveabit.io` / `cam@` / new) → wire site
2. **BTC key custody** confirmation
3. **Nostr official pubkey** story (kimi/cam/_ same key?)
4. **MP + e-###** + 5 supporters + paper field ops
5. UK legal brief → EU pilots (after Canada traction)
6. Optional: Silent Payments, multi-sig, npm publish, human i18n

---

## Update / Status

Site is **healthy and structured**. Core product path works. Remaining work is almost all **human decisions and real-world Canada ops**, not broken pages. Lightning infrastructure exists on giveabit but SherpaCarta still correctly shows TEMP until Cam chooses the movement address.

---

## Key Decisions / Notes

- Prefer **extensionless** links; never re-add extensionless→`.html` 200 rewrites
- Campaign signatures ≠ Parliamentary e-petition until e-### live
- NIP-05 lives on **giveabit.io**, not sherpacarta.org (OK for parent brand)
- No custom Nostr relay required for launch
- Do not invent endorsements or global signature counts
- **Do not sync M4 / MASTER-BRAIN until Cam says go**

---

## Mission Tie-in

Privacy is a birthright. Canada first, then UK/EU with jurisdiction-specific honesty. Bitcoin-funded, zero-tracking, rights only expand.

---

## Recovery

Next chat: **`/whatsup`** or read `docs/KIMI-HANDOFF.md` + `docs/KANBAN.md` + this file.
