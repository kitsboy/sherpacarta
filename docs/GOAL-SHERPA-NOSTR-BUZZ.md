# GOAL — SherpaCarta public Nostr + internal Buzz

**Status:** Planned · product surface scaffolding live · bot + NIP-05 + Buzz = THOR  
**Owner product (M3/Grok):** site wall, contact UX, public config (npub only)  
**Owner ops (THOR/Kimi):** NIP-05 publish, bot runtime, Buzz deploy, secrets vault  
**Identity:** `sherpa@giveabit.io` (product guide) — **not** `kimi@` ops

---

## Vision (refined over time)

```
PUBLIC  (Nostr relays — anyone)
  visitor → sherpa@giveabit.io / #sherpacarta
         → THOR “Sherpa guide” bot
         → signed public reply
         → live discussion wall on sherpacarta.org (read-only)

INTERNAL (Buzz on THOR — family agents only)
  Cam / Grok / Kimi / Rosa / …
         → channels (#sherpacarta, ops, code)
         → product work, handoffs, escalations
  optional: public bot escalates hard Qs → Buzz #sherpacarta
```

Self-updating: wall polls relays; bot answers from live charter/metrics context; HQ shows agent health later.

---

## Phases

### Phase 0 — Identity (Cam + Kimi) ✅
- [x] Generate **one** keypair for product agent (npub public; nsec **only** in Cam’s password manager)
- [x] Cam stores **nsec** offline (password manager) — never git / chat storage
- [x] Kimi published NIP-05 `sherpa` → pubkey on `giveabit.io/.well-known/nostr.json` (2026-07-27, giveabit `bea71e8`)
- [x] `nip05Status: live` on product config (Grok)
- [x] `kimi@` / `cam@` not used for the public bot (separate sherpa key)

### Phase 1 — Public discussion wall (M3) ✅
- [x] Public config `public/data/nostr-sherpa.json` (npub, relays, tags — **no nsec**)
- [x] Read-only wall component (relay REQ for notes from sherpa + `#sherpacarta`)
- [x] Page `/nostr` + homepage strip link
- [x] Contact UX points to `sherpa@giveabit.io` (**NIP-05 live**)
- [ ] Polish: deep links to njump / native clients; moderation denylist

### Phase 2 — THOR Sherpa guide bot (Kimi) 🟡 package ready
- [x] Package: `packages/sherpa-nostr-bot` (seed + bot + knowledge + escalate)
- [x] FAQ: what / sign / Canada honesty / treasury / Nostr / privacy
- [x] Rate limit + approve-only mode + wrong-key abort
- [ ] Cam: `npm run seed` with local `SHERPA_NSEC` (wall not empty)
- [ ] Kimi: deploy bot on THOR (secrets env, systemd/docker)
- [ ] Week 1: `SHERPA_APPROVE=1` then go live
- [ ] Escalate webhook → Cam / later Buzz `#sherpacarta`
- [ ] Metrics: replies_24h, escalations (secret-free → HQ later)

### Phase 3 — Buzz on THOR (Kimi) ⬜
- [ ] Follow `HQ/docs/BUZZ-PLAN.md` (wait for stable enough release)
- [ ] Deploy workspace; agents as members with own keys
- [ ] Channel `#sherpacarta` for product; bridge from public bot
- [ ] Never expose Buzz to public iframe (internal only)

### Phase 4 — Self-updating loop ⬜
- [ ] Bot context auto-refresh from origin metrics + FAQ md
- [ ] Wall shows bot + community notes with “human / agent” chip when NIP-05 known
- [ ] HQ agent card for sherpa (uptime, last reply)

---

## Security rules (non-negotiable)

| Rule | Why |
|------|-----|
| **nsec never in git** | Repo is public / leaked = identity stolen |
| **nsec never in agent “memory” or chat as storage** | Logs are not a vault |
| **One keypair for life of `sherpa@`** | Regenerating loses followers and trust |
| **Bot uses invoice-free, read-only product data** | No LNbits admin / vault keys in bot |
| **Public wall is read-only** | No iframe of private DMs; only public notes |

**Cam holds nsec.** Agents (Grok/Kimi) may hold **npub only** in public config.

---

## Success criteria

1. Visitor sees live `#sherpacarta` / sherpa notes on site without leaving.  
2. Messaging `sherpa@giveabit.io` gets a helpful, honest reply about SherpaCarta.  
3. Ops stays on Buzz/Telegram/Kimi — not mixed into public bot key.  
4. Zero nsec in GitHub history.

---

## Related files

| File | Role |
|------|------|
| `public/data/nostr-sherpa.json` | Public identity + relays |
| `public/js/sc-nostr-wall.js` | Read-only wall |
| `public/nostr.html` | Discussion page |
| `docs/KIMI-HANDOFF.md` | Ops handoff for Phase 0–2 |
| HQ `docs/BUZZ-PLAN.md` | Internal workspace |

---

*Safe Harbour · Bitcoin-sovereign · Part of Give A Bit*
