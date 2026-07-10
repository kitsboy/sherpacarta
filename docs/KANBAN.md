# SherpaCarta Kanban — Finish Later

**Owner:** Cam (decisions) · Kimi/M4 (orchestration/docs) · Grok/M3 (code when unblocked)  
**Updated:** 2026-07-09 (security-audit goodbye)  
**Live site:** https://sherpacarta.org  
**Session summaries:** `SESSION-SUMMARY-2026-07-09-security-audit.md` · `SESSION-SUMMARY-2026-07-09.md`  
**Public registries:** `/data/wallets.json` · `/data/jurisdictions.json` · `/status` · `/treasury` · `/jurisdictions`

Use this board in Obsidian / Linear / GitHub Projects. Do **not** invent endorsements, signature counts, or “live Lightning” until Cam confirms.

---

## Legend

| Tag | Meaning |
|-----|---------|
| 🧑 **CAM** | Needs Cam decision, wallet, or real-world action |
| 🤖 **CODE** | M3 can implement once unblocked |
| 📋 **KIMI** | Docs, vault, process, tracking |
| ⚖️ **LEGAL** | Jurisdiction / petition / counsel care |
| 🔐 **SECURITY** | Keys, identity, safety |

---

## ✅ DONE (do not re-open without reason)

- [x] Site live on Cloudflare Pages (static + Canada Functions)
- [x] 308 redirect loop fixed; Canada pages load (`/canada/sign` etc.)
- [x] Dual-track Canada petition (campaign API + paper + official bridge UI)
- [x] PETITION_KV + `/api/canada/sign|stats|batch`
- [x] Federal-only paper sheet + QR join + organizer/proof/official pages
- [x] Executive briefing EN/FR + leave-behind
- [x] Design sprint: self-hosted fonts/FA, honest local signatures, mobile CTA/articles fix
- [x] HRF YouTube embed (privacy-friendly)
- [x] OG cards + social meta
- [x] BTC on-chain treasury address live + mempool dashboard
- [x] NIP-05 works: `kimi@giveabit.io` on **giveabit.io**
- [x] Jurisdictions map CA → UK/EU scaffolding (`/jurisdictions`)
- [x] Honest wallets registry + live `/status` probes
- [x] TEMP Lightning warnings (site does not claim LN is live)
- [x] Security audit remediations (2026-07-09): XSS DOM safety, CSP, SW v6.3, API rate limits, method allowlist, CORS, displayName sanitize
- [x] Paper batch API **locked** without `ORGANIZER_TOKEN` (unauth → 503)
- [x] FAQ keyboard buttons; honest newsletter waitlist copy; FAQ signing copy local-first
- [x] `/api/canada/ping` health endpoint

---

## 📥 BACKLOG (full reminder list)

### A. Money & transparent funding 🔐🧑

| ID | Card | Notes |
|----|------|-------|
| A1 | **Pick official Lightning destination** | giveabit already has live LNURL-pay: `kimi@giveabit.io` and `cam@giveabit.io`. Choose which (if any) is **SherpaCarta movement** money vs personal. |
| A2 | **Wire Lightning into site** | After A1: set `public/data/wallets.json` → `lightning.status: live`, `lud16` / `lnurl`; remove TEMP UI. 🤖 |
| A3 | **Confirm BTC treasury key custody** | Address `bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad` — seed backup, device offline, who controls. |
| A4 | **Multi-sig plan (when treasury grows)** | Optional 2-of-3; document cosigners. |
| A5 | **Silent Payments (BIP-352)** | Optional privacy donate path; needs SP wallet + address in `wallets.json`. |
| A6 | **Public spend policy** | Short honest “what donations fund” on `/treasury`. |
| A7 | **Do not mix personal/movement funds long-term** | Label wallets clearly. |

### B. Nostr identity 🔐🧑

| ID | Card | Notes |
|----|------|-------|
| B1 | **Confirm official npub story** | giveabit NIP-05 maps `kimi` / `cam` / `_` to same pubkey today — intentional? |
| B2 | **Optional `sherpacarta.org` NIP-05** | `/.well-known/nostr.json` on this domain (not required; parent NIP-05 works). |
| B3 | **No custom Nostr relay required** | Client NIP-07 + public relays enough for now. Relay only if retention/moderation needed. |
| B4 | **Canada Nostr kind 1978** | Keep privacy-first; no identity leakage. |

### C. Canada law-change beachhead ⚖️🧑

| ID | Card | Notes |
|----|------|-------|
| C1 | **Find MP champion** | Authorize House e-petition. |
| C2 | **Get e-### number** | Publish on Parliament site. |
| C3 | **Plug e-### into campaign config** | `data/campaign-canada.json` + UI “Official live”. 🤖 |
| C4 | **5 supporters for e-petition creation** | Process requirement. |
| C5 | **Print federal sheets + field collection** | Organizer path already built. |
| C6 | **Use briefing packs with staffers** | `/briefing` · `/leave-behind` · FR note. |

### D. UK & Europe expansion ⚖️📋

| ID | Card | Notes |
|----|------|-------|
| D1 | **UK legal brief (not Canadian forms)** | UK Parliament petition rules ≠ Commons paper sheets. |
| D2 | **UK hub pages (after D1)** | Mirror structure of `/canada/` carefully. 🤖 |
| D3 | **EU: pick 1–2 pilot member states** | No fake single “EU petition.” |
| D4 | **FR/DE official briefings** | Human-reviewed legal language. |
| D5 | **Entity / nonprofit decision** | Only if raising serious EU/UK funds. |

### E. Product / content honesty 📋🤖

| ID | Card | Notes |
|----|------|-------|
| E1 | **Human-reviewed ES/FR charter bodies** | UI locales exist; full legal text needs humans. |
| E2 | **Real org endorsements only** | Seats open until verified — never invent. |
| E3 | **Press kit PDF export** | Optional polish. |
| E4 | **npm publish packages** | `npm login` + `publish:packages` — **not** required for site load. |
| E5 | **Terser minify fixes** | v5/v6/b3 skip minify — non-blocking. |

### F. Security & ops 🔐

| ID | Card | Notes |
|----|------|-------|
| F1 | **Monitor `hello@giveabit.io`** | Public contact + security.txt. |
| F2 | **Tighten CSP further** | Baseline CSP shipped; refine without breaking YouTube/embed/jsDelivr QR. |
| F3 | **Keep zero-tracking promise** | No sneaky analytics without ethics decision. |
| F4 | **PETITION_KV hygiene** | Minimal data only; campaign ≠ Parliament IDs. |
| F5 | **Set ORGANIZER_TOKEN** 🧑 | CF Pages secret; unlock `/canada/organizer` remote batch logs. |
| F6 | **Captcha / PoW on campaign sign** | Rate limits only today; bots can still inflate slowly. 🤖 |
| F7 | **Modal focus trap** | Charter / command palette / QR a11y. 🤖 |

---

## 📋 TODO (ready / next up)

Ordered for Cam + Kimi focus:

1. **F5** — Set `ORGANIZER_TOKEN` if paper field ops need remote logging
2. **A1** — Decide Lightning Address (`kimi@` / `cam@` / new)
3. **A3** — Confirm BTC key backup/custody
4. **B1** — Confirm official Nostr pubkey story
5. **C1–C4** — MP + e-### + 5 supporters
6. **C5** — Print & collect paper (local organizer backup works without token)
7. **A2** — Code: wire Lightning (blocked on A1)
8. **F6 / F7** — Captcha + modal focus trap when free
9. **D1** — UK legal brief (after Canada traction)
10. **E1** — Human i18n review

---

## 🚧 DOING (empty until next session)

_Nothing in flight. Security remediations shipped; remaining work is Cam-gated or optional polish._

---

## 👀 REVIEW / VERIFY (quick live checks)

- [x] https://sherpacarta.org/api/canada/ping → `batch-v3-locked`
- [x] POST `/api/canada/batch` without token → 503
- [x] CSP + X-Frame-Options on HTML
- [ ] https://sherpacarta.org/canada/sign
- [ ] https://sherpacarta.org/status
- [ ] https://sherpacarta.org/treasury
- [ ] https://sherpacarta.org/jurisdictions
- [ ] https://sherpacarta.org/data/wallets.json
- [ ] https://giveabit.io/.well-known/nostr.json?name=kimi
- [ ] https://giveabit.io/.well-known/lnurlp/kimi  ← live LNURL exists; not yet on SC donate UI

---

## 🧊 BLOCKED (explicit)

| Blocked card | Waiting on |
|--------------|------------|
| A2 Wire Lightning UI | A1 Cam picks address |
| C3 e-### in config | C1–C2 MP + Parliament |
| D2 UK pages | D1 legal path |
| A5 Silent Payments | SP wallet from Cam |
| E4 npm publish | Cam `npm login` |

---

## Suggested Kimi actions (M4)

1. Import this board into vault / task system (preserve IDs A1…F4).
2. Do **not** sync aggressive MASTER-BRAIN changes until Cam says go (prior handoff note).
3. When Cam answers A1/B1, open a short M3 ticket: “wire wallets.json + donate UI.”
4. Track Canada field ops (print, MP outreach) outside code.
5. Keep legal honesty: campaign ≠ e-petition until e-### live.

---

## One-page Cam cheat sheet

```
MONEY     BTC live · LN exists on giveabit but NOT wired to sherpacarta · SP later
IDENTITY  NIP-05 kimi@giveabit.io works · confirm pubkey ownership story
CANADA    Code done · need MP + e-### + paper in the wild
WORLD     /jurisdictions scaffold · UK/EU need legal briefs first
CODE      Site healthy · most remaining work is human decisions
```

---

*Safe Harbour · Give A Bit family · rights only expand.*
