# SherpaCarta Platform Roadmap

**Version 3.0 — 2026-07-07**  
**BUILD:** 688 · **English first. International expansion second.**

---

## Vision

Build the defining civic document of the 21st century: a **living, editable, timestamped, globally discussable** charter of digital human rights — from moral declaration to enforceable law, starting in **Canada and British Columbia**.

---

## Phase 1 — Foundation ✅ (Q3 2026)

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Single-page charter experience | ✅ Live | sherpacarta.org |
| Architecture split (CSS/JS) | ✅ | `sc-main.css`, `sc-core.js`, `sc-bundle.js` |
| Real Bitcoin donation address | ✅ | On-chain treasury |
| Lightning (temp + warning) | ✅ | Placeholder until live LNURL |
| Canada / BC Challenge section | ✅ | Main site + `/canada/` pages |
| Canada petition system | ✅ | BUILD 687 — passkey, Nostr, Satohash |
| Treasury dashboard | ✅ | `treasury.html` + mempool.space |
| Bug bounty page | ✅ | `security.html` |
| Docs: mission, marketing, SEO, deployment | ✅ | `docs/` |
| Local signing | ✅ | localStorage |
| OpenTimestamp via Satohash | ✅ | SHA-256 + stamp link |
| sitemap.xml + robots.txt | ✅ | 143 URLs |

---

## Phase 2 — Participation Layer ✅ (mostly complete)

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Nostr sign-in (NIP-07) | ✅ | Extension-based identity |
| Amendment proposals | ✅ | Local + Nostr kind 1 |
| Charter version hashing | ✅ | Satohash stamp |
| Full 114-article charter | ✅ | BUILD 667 — `data/charter.json` |
| Press section (linked outlets) | ✅ | BUILD 688 — icons + mobile marquee |
| Press kit PDF | ⏳ | Export from MARKETING.md |
| FAQPage JSON-LD | ⏳ | Rich SERP |

**Nostr architecture:**
- Identity: NIP-07 (Alby, nos2x, Primal)
- Canada signatures: kind 1978 with merkle root
- Amendments: kind 1, tags `t=sherpacarta`, `t=amendment`
- Relays: `relay.damus.io`, `nos.lol`, `relay.snort.social`

---

## Phase 3 — Canada & BC Legal Challenge (Q4 2026 – 2027)

See **[CANADA-BC-CHALLENGE.md](CANADA-BC-CHALLENGE.md)**.

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Campaign pages | ✅ | `/canada/`, `/canada/bc/` |
| Moral sign + proof | ✅ | `sc-petition-canada.js` |
| Satohash template | ✅ | Local JSON; submit to satohash.io pending |
| Federal e-petition | ⏳ | Needs MP sponsor + e-### number |
| MLA/MP briefing packages | ⏳ | EXECUTIVE_SUMMARY + CANADA doc |
| Municipal Safe Harbour pilots | ⏳ | Vancouver, Victoria |

---

## Phase 4 — Global Scale (2027+)

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Public JSON API | ✅ | `/api/v1/` — 114 articles, hash, OpenAPI |
| MCP server | ✅ | `packages/sherpacarta-mcp` (stdio) |
| npm SDK | ✅ Local | `@giveabit/sherpacarta` — publish pending |
| Embed widget | ✅ | `embed.js` |
| Full charter i18n | ⏳ | UI locales exist; article bodies mostly English |
| Dedicated locale routes | ⏳ | `/es/`, `/fr/` with hreflang |
| Public signature ledger | ⏳ | Privacy-preserving aggregate counts |
| Organization endorsement portal | ⏳ | Verified institutional signers |
| Annual global council (Art. 114) | ⏳ | Nostr + on-chain minutes |

---

## Editable Document Model

| Mode | Who | Where stored | Published |
|------|-----|--------------|-----------|
| Read | Everyone | CDN | Public |
| Edit (draft) | Anyone | localStorage | Private |
| Propose amendment | Signatories | localStorage + Nostr | Optional public |
| Ratify | Organizations | Future council UI | On-chain + OTS |

**Rules (Art. 114):** Rights may only expand, never contract.

---

## API & MCP (Live)

```
GET  /api/v1/charter.json       — full charter index
GET  /api/v1/articles/art-N.json — single article
GET  /api/v1/hash.json          — canonical SHA-256
GET  /api/v1/index.json         — endpoint catalog
GET  /api/v1/openapi.json       — OpenAPI spec
```

**MCP tools:** `search_charter`, `get_article`, `get_pillar_summary`, `link_satohash_stamp`

**Publish:** `npm run publish:packages` (requires `npm login`)

---

## What NOT to do yet

- Full backend with user accounts
- Forced Nostr login to read charter
- Machine-translated binding legal text without human review

---

*Part of the [Give A Bit](https://giveabit.io) family.*