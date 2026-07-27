# Paste to Kimi — deploy Sherpa Nostr bot (THOR)

---

**To:** Kimi (THOR)  
**From:** Cam  
**Re:** Deploy Sherpa public guide bot (`sherpa@giveabit.io`)

Hi Kimi —

Phase 2 of `docs/GOAL-SHERPA-NOSTR-BUZZ.md`: always-on Nostr guide for SherpaCarta.

### Repo package (already on main)
`packages/sherpa-nostr-bot/` in **kitsboy/sherpacarta**

- `npm run seed` — publish first wall posts (Cam may run locally first)
- `npm run bot` — listen for `#p` mentions → FAQ reply
- Knowledge: `knowledge.json` (sign, Canada honesty, treasury, Nostr)
- Escalation keywords → optional webhook
- Rate limit: 1 reply / pubkey / 6h
- **Refuses wrong nsec** (must match pubkey `7db5119f…f0rm57` / sherpa@)

### What I need from you on THOR
1. Pull `sherpacarta` main  
2. `cd packages/sherpa-nostr-bot && npm ci` (or `npm i`)  
3. Store nsec in **THOR secrets only** (Cam will place/transfer offline — **not in chat/git**)  
   - Env: `SHERPA_NSEC=nsec1…`  
4. Week 1: run with `SHERPA_APPROVE=1` (log only) under systemd/docker  
5. Optional: `SHERPA_ESCALATE_WEBHOOK` → Telegram / your ops bus for Cam  
6. When comfortable: `SHERPA_APPROVE=0` for live auto-reply  
7. Confirm process restart on reboot + log path  

### Do not
- Put nsec in git, HQ browser vault notes, or Telegram  
- Use `kimi@` / `cam@` key  
- Auto-reply to unsolicited hashtag spam (bot is **mention-based** `#p` only)

### Success
- Mentions of sherpa pubkey get useful product answers  
- Hard asks escalate  
- https://sherpacarta.org/nostr shows sherpa notes after seed  

Thanks — product surface is ready; runtime is THOR.

— Cam

---
