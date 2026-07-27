# Paste this to Grok in `sherpacarta` (M3)

**From:** Grok on Satohash (2026-07-27) · Cam handoff  
**Workspace:** `~/projects/sherpacarta` (or `/Users/cam/Projects/sherpacarta`)  
**Read first:** this file + `docs/KIMI-HANDOFF.md` (top) + `src/lib/satohash.js` + `public/sc-core.js` (`stampCharterOnBitcoin`)

---

## Context (do not re-implement Satohash SPA)

Satohash now owns the stamp UX plane. **Root cause of “Stamp it not working”** was **not primarily Sherpa** — it was Satohash SPA posting to same-origin (no `VITE_API_URL`). That is fixed on satohash `main` (`cee9227`):

- Production hosts → `https://api.satohash.io`
- Canonical entry: `https://satohash.io/stamp?hash=<64hex>&ref=<productId>`
- Home `/?hash=&ref=` still redirects to `/stamp`
- Honest status: pending ≠ Bitcoin confirmed; real API `id` required

**Your job on Sherpa is family-client hygiene + UX loop-back**, not rebuilding Satohash.

---

## Copy-paste task for Grok (sherpacarta)

```
You are Grok on M3. Workspace: ~/projects/sherpacarta.

Read first:
1. docs/GROK-PROMPT-STAMP-HANDOFF.md  (this file)
2. docs/KIMI-HANDOFF.md (top)
3. src/lib/satohash.js
4. public/sc-core.js — stampCharterOnBitcoin + satohashStampHash
5. public/js/sc-petition-canada.js — stampOnSatohash

## Done already (do not redo blindly)
- Charter + Canada stamp buttons should open:
  https://satohash.io/stamp?hash=…&ref=sherpacarta|sherpacarta-canada
- satohashStampGuideUrl(hash, { ref, label, campaign })
- sc-bundle rebuilt once (b2584ae)

## MUST DO now (audit + harden + ship)

### 1) Full URL audit (fail if any weak handoff remains)
Search entire repo (public/*.js, src, packages, html) for:
- satohash.io?ref=  (home without /stamp)
- satohash.giveabit.io?ref=  without /stamp
- window.open(…satohash…) that omits /stamp?hash=
- Any hard-coded host drift (prefer canonical https://satohash.io)

Replace every stamp handoff with:
  ${SATOHASH_SITE}/stamp?hash=<64hex>&ref=<id>&label=…&campaign=…
Refs:
  - charter → ref=sherpacarta
  - Canada  → ref=sherpacarta-canada&campaign=sherpacarta-canada-v1 (or existing campaign id)

### 2) In-app API path (optional but preferred)
Where we already call satohashStampHash / stampHash():
- Always send X-Satohash-Client: sherpacarta | sherpacarta-canada
- Require response.id (throw if missing)
- After success, show verifyUrl: https://satohash.io/verify/{id}
- Never toast “stamped on Bitcoin” until status === confirmed
- Pending is OK: “Submitted — pending confirmation” + share verify link

### 3) Bundle + deploy
- npm run bundle (or project’s sc-bundle script) so public/sc-bundle.js matches sources
- Commit + push main so CF Pages / live sherpacarta.org picks it up
- Smoke from live site: Stamp charter → lands on satohash /stamp with hash prefilled

### 4) Acceptance smoke
1. From live Sherpa charter “Stamp”:
   opens satohash.io/stamp?hash=64hex&ref=sherpacarta…
2. CTA on Satohash works → real stamp id
3. /verify/{id} cold-load works
4. curl -s https://api.satohash.io/metrics.json | jq '.schema,.raw.demo'
5. After THOR rebuild: stamps attributed under segments by_client.sherpacarta

### 5) Docs
- Prepend docs/KIMI-HANDOFF.md with what you changed
- Update LATEST-UPDATE.md
- Do NOT invent demo metrics or put secrets in git

### Out of scope
- Satohash SPA routes / CF Pages deploy of satohash (other repo)
- THOR Docker rebuild (Kimi)
- HQ UI
- Customer/CRM data

## One-liner
Family products open /stamp?hash=&ref= with X-Satohash-Client attribution, surface verify/{id}, never fake “confirmed”.
```

---

## Optional extras (if time)

| Item | Why |
|------|-----|
| Prefer one host: `satohash.io` everywhere | Drop `satohash.giveabit.io` as primary open target (alias still works) |
| After stamp, offer “Copy verify link” | Closes Cam’s “return with shareable proof” loop |
| Template deep-link to `/templates/…` only if template published | Canada referendum JSON is soft — don’t dead-end |
| MCP package `packages/sherpacarta-mcp` | Ensure stamp helper matches src/lib if exposed |

---

## Do not ask Cam for

- Customer lists, emails, nsec, LNbits keys, CF tokens  
- “Enough users” — metrics need stamp counters + `ref`, not CRM  

## Tell Cam if blocked

- Live Sherpa still ships old `sc-bundle` (deploy lag)  
- API returns 402 → Kimi: `REQUIRE_LIGHTNING` / family keys on THOR  
- `client_id` null on GET stamp → Kimi Docker rebuild satohash-api  
