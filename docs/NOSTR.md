# SherpaCarta — Nostr integration

**Updated:** 2026-08-11  
**Domain:** https://sherpacarta.org  
**Status:** NIP-05 live on this domain · NIP-07 optional publish · local-first signatures  

---

## A. Audit (pre-fix → post-fix)

### Before
| Area | State |
|------|--------|
| **NIP-05** | `/.well-known/nostr.json` **missing** → Cloudflare returned homepage HTML |
| **Identity UX** | Pointed only at `sherpa@giveabit.io` (parent) |
| **Relays (CSP)** | damus, nos.lol, snort, nostr.band |
| **Relays (code)** | Often **3 of 4** (missing `relay.nostr.band` in sc-core / wall / petition) |
| **NIP-07** | Connect + kind 1 amendments + kind 1978 Canada campaign |
| **NIP-65** | Not used |
| **Publish** | Fire-and-forget or first-relay-wins; fragile empty `NOSTR_RELAYS` edge case fixed earlier |

### After
| Area | State |
|------|--------|
| **NIP-05** | Static `public/.well-known/nostr.json` + JSON Content-Type + CORS |
| **Names** | `kimi`, `sherpa`, `_`, `sherpacarta` → exact hex from giveabit |
| **Primary `_` / sherpacarta** | **Sherpa product guide** key (not kimi) — this site is product, not suite ops |
| **Relays** | Same 4 in CSP, code, NIP-05 map, wall, petition |
| **NIP-65** | Fetch agent outbox for wall; optional user `publishMyNostrRelays()`; ops template JSON |
| **Helpers** | `public/js/sc-nostr-lib.js` → `window.SCNostr` |

### Primary key justification
**`_` and `sherpacarta` → sherpa hex**  
`7db5119f154648c8a93ef15ea86b25f5f89328c2e8e039537092758d787d72fd`  

Reason: sherpacarta.org’s public face is the product guide (`sherpa@`), not suite ops (`kimi@`). giveabit.io keeps `_` → kimi for the parent brand; this domain mirrors product identity.

---

## Identities (exact hex — do not invent new keys)

| NIP-05 | Hex pubkey |
|--------|------------|
| `sherpa@sherpacarta.org` | `7db5119f154648c8a93ef15ea86b25f5f89328c2e8e039537092758d787d72fd` |
| `sherpacarta@sherpacarta.org` | same (sherpa) |
| `_@sherpacarta.org` | same (sherpa) |
| `kimi@sherpacarta.org` | `076fbd672795bfba1f905084bbe05dcee4937aa1db995c2f87d616ea0f73f8d4` |
| `sherpa@giveabit.io` / `kimi@giveabit.io` | same hex (parent NIP-05, still valid) |

npub (sherpa): `npub10k63r8c4geyv32f77902s6e97hufx2xzarsrj5msjf6c67rawt7sf0rm57`

---

## Files that touch Nostr

| File | Role |
|------|------|
| `public/.well-known/nostr.json` | **NIP-05** names + relays map |
| `public/_headers` | JSON Content-Type + CORS for NIP-05 |
| `public/js/sc-nostr-lib.js` | Shared relays, fan-out publish, NIP-65 fetch/publish helpers |
| `public/js/sc-nostr-wall.js` | Read-only wall (kind 1 + optional NIP-65 discovery) |
| `public/js/sc-petition-canada.js` | Kind **1978** campaign signs (NIP-07) |
| `public/sc-core.js` | NIP-07 connect, kind **1** publish, NIP-05 copy helpers |
| `public/sc-upgrades-b6.js` | Multi-relay publish override, feed, NIP-05/NIP-65 UI hints |
| `public/sc-upgrades-b2.js` | Early amend feed + relay picker |
| `public/sc-enhancements-v5.js` | Relay picker + health button |
| `public/data/nostr-sherpa.json` | Public agent config (**no nsec**) |
| `public/data/nostr-nip65-recommended.json` | Ops template for kind 10002 |
| `public/nostr.html` | Discuss page |
| `functions/api/canada/sign.js` | Stores optional `nostrEventId` (no key custody) |
| `packages/sherpa-nostr-bot/` | THOR bot package (nsec only in Vault) |

### Event kinds in use
| Kind | Use |
|------|-----|
| 1 | Amendments / public notes · tag `#sherpacarta` |
| 1978 | Canada campaign petition commitment |
| 30023 | Optional long-form article publish (upgrade) |
| 10002 | NIP-65 relay list (discovery + optional user publish) |

---

## Relays (canonical)

Must remain in **CSP `connect-src`** and in code:

1. `wss://relay.damus.io`  
2. `wss://nos.lol`  
3. `wss://relay.snort.social`  
4. `wss://relay.nostr.band`  

Do not remove. Optional future: self-hosted write relay — document only, not required.

---

## NIP-07 UX (unchanged contract)

- Sign-in is **optional**.  
- Charter / amendment data stays **local** unless user chooses publish.  
- No accounts, no server-side key custody, no tracking of pubkeys beyond optional Canada campaign stats fields.  
- Extension: Alby / nos2x / Primal (`window.nostr`).

---

## NIP-65 (outbox) — how it works here

1. **Site cannot sign for sherpa/kimi** (no nsec in repo).  
2. **Recommended list** lives in `public/data/nostr-nip65-recommended.json`.  
3. **Cam/Kimi** publish kind 10002 for product keys offline/THOR.  
4. **Visitors** may publish their own list: `publishMyNostrRelays()` (NIP-07).  
5. **Wall** optionally fetches agent kind 10002 and opens extra write relays **only if** already CSP-allowlisted.

---

## Verify after deploy

```bash
# Must be JSON, not HTML
curl -sI https://sherpacarta.org/.well-known/nostr.json | grep -i content-type
curl -s 'https://sherpacarta.org/.well-known/nostr.json' | head
curl -s 'https://sherpacarta.org/.well-known/nostr.json?name=sherpa'
curl -s 'https://sherpacarta.org/.well-known/nostr.json?name=kimi'

# Config
curl -s https://sherpacarta.org/data/nostr-sherpa.json | head -20
```

Clients: search `sherpa@sherpacarta.org` / `kimi@sherpacarta.org` in Damus, Primal, etc.

---

## Security rules

| Rule | Why |
|------|-----|
| **nsec never in git / client** | Public repo |
| **One sherpa key for life** | Followers + NIP-05 trust |
| **Wall is read-only** | No DMs in iframe |
| **CSP relay allowlist** | No arbitrary `wss://` from NIP-65 |

---

## Open (ops)

| Who | Item |
|-----|------|
| Kimi/Cam | Publish kind 10002 for sherpa + kimi nsecs (THOR) |
| Kimi | Bot deploy (`docs/GOAL-SHERPA-NOSTR-BUZZ.md`) |
| Optional | Self-hosted relay (future) |

---

## Related docs

- `docs/GOAL-SHERPA-NOSTR-BUZZ.md` — bot + Buzz plan  
- `public/data/nostr-sherpa.json` — live public config  
- `packages/sherpa-nostr-bot/` — bot package  
