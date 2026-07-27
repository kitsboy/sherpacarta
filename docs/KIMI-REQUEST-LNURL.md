# KIMI REQUEST — Public Lightning LNURL (LNbits + HQ Vault)

**From:** Cam via Grok (M3) · 2026-07-27  
**To:** Kimi on THOR  
**Priority:** High — Cam: add to your list; set up with LNbits; put details in Vault only; tell Grok/Cam the public values  

**Context:** Prep item #5 — *Public Lightning LNURL when wallet ready (Vault only — never git)*.  
Wallet id already used on HQ: **`sherpacarta`**. Site still has `lud16: null` and TEMP lightning placeholders.

---

## What Cam wants

1. Use **LNbits** on THOR to set up a proper **public Lightning receive** path for SherpaCarta.  
2. Wire it so **hq.giveabit.io** Money / product wallet `sherpacarta` can receive via LNURL (and/or LUD-16).  
3. Store **all secret keys in HQ Vault only** — never commit to git.  
4. **Provide Grok/Cam the public details** so the site can publish them (lud16 / LNURL / notes).

---

## Do (Kimi / THOR)

### A. LNbits wallet
- Confirm wallet id **`sherpacarta`** exists (or create/align name).  
- Prefer **invoice/read keys only** for HQ proxy (admin keys stay THOR-only).  
- Enable **LNURL-pay** (and LUD-16 / Lightning Address if LNbits extension supports it).

### B. Public identifiers (safe to publish later)
Hand back to Cam/Grok (in handoff or Vault “public” note, not git secrets):

| Field | Example shape | Publish? |
|-------|----------------|----------|
| `lud16` | `sherpa@…` or `something@satohash…` | **Yes** (public) |
| `lnurl` or LNURL-pay URL | `LNURL1…` or https pay link | **Yes** if public |
| `walletId` | `sherpacarta` | Yes (already in projects) |
| Invoice/admin keys | — | **Vault only · never chat if avoidable · never git** |

### C. HQ Vault (`hq.giveabit.io`)
- Ensure Money tab / Vault has invoice key for wallet **`sherpacarta`**.  
- Document in Vault notes: which key type, LNURL extension status, lud16 string.  
- Confirm LNbits proxy Worker still works for balances after LNURL enable.

### D. Tell Grok what to put on site (no secrets)
After ready, reply with a short paste:

```
LNURL public ready:
- lud16: …
- lnurl (if any): …
- walletId: sherpacarta
- test: [yes/no paid 1 sat smoke]
- do NOT put in git: invoice/admin keys
Grok: update public/data/wallets.json lightning.lud16 + remove TEMP placeholders; redeploy Sherpa.
```

---

## Hard rules

| Do | Don’t |
|----|--------|
| LNbits on THOR | Put invoice keys in sherpacarta/HQ git |
| Vault for keys | Paste admin keys into public handoffs long-term |
| Public lud16/LNURL only in site JSON | Invent fake Lightning addresses |
| 1-sat receive smoke test | Claim live LN if still TEMP |

---

## Related

- Sherpa: `public/data/wallets.json` → `lightning.lud16` currently `null`  
- HQ: wallet id `sherpacarta` · LNbits proxy · Vault  
- Prep list: `docs/PREP-NOW.md` item 5  

## Out of scope for Grok until you reply

- Publishing lud16 on sherpacarta.org  
- Removing TEMP lightning copy  

**Add to Kimi ops list / kanban:** *Sherpa public LNURL via LNbits → Vault keys → hand public lud16 to Grok.*
