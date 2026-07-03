# SherpaCarta Platform Roadmap

**Version 2.1 — 2026-07-02**  
**English first. International expansion second.**

---

## Vision

Build the defining civic document of the 21st century: a **living, editable, timestamped, globally discussable** charter of digital human rights — from moral declaration to enforceable law, starting in **Canada and British Columbia**.

---

## Phase 1 — Foundation (NOW — Q3 2026)

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Single-page charter experience | ✅ Live | `index.html` at sherpacarta.org |
| Real Bitcoin donation address | ✅ | On-chain treasury configured |
| Lightning (temp + warning) | ✅ | Placeholder until live LNURL |
| QR code popups (BTC + LN) | ✅ | Scan-to-donate modals |
| Enhanced mission on landing | ✅ | Magna Carta → today narrative |
| Canada / BC Challenge section | ✅ | First jurisdiction strategy |
| Footer Give A Bit branding | ✅ | Subtle logo link |
| og-image for social sharing | ✅ | `public/og-image.svg` |
| Docs: mission, marketing, SEO, deployment | ✅ | See `docs/` |
| Local signing | ✅ | localStorage |
| Charter edit mode (local) | ✅ | Make Editable in modal |
| OpenTimestamp via Satohash | ✅ | SHA-256 + link to stamp |

---

## Phase 2 — Participation Layer (Q3–Q4 2026)

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Nostr sign-in (NIP-07) | ✅ UI | Extension-based identity |
| Amendment proposals | ✅ Local + Nostr | Kind 1 events tagged `#sherpacarta` |
| Public comment thread | ✅ Local first | Sync to Nostr when signed in |
| Charter version hashing | ✅ | Stored locally, Satohash stamp |
| Press kit PDF | ⏳ | Export from MARKETING.md |
| FAQPage JSON-LD | ⏳ | Rich SERP |
| sitemap.xml + robots.txt | ⏳ | SEO hygiene |

**Nostr architecture:**
- **Identity:** NIP-07 browser extension (Alby, nos2x, Primal) — no passwords on our servers
- **Amendments:** Kind 1 notes with tags `t=sherpacarta`, `t=amendment`, optional `article=Art.11`
- **Signatures:** Kind 1 or custom kind with `t=sherpacarta-sign`
- **Relays:** `relay.damus.io`, `nos.lol`, `relay.snort.social` (expandable)
- **Privacy:** Only what user chooses to publish; default remains local-only

**OpenTimestamp / Satohash integration:**
- Client computes SHA-256 of charter canonical text
- User stamps hash at [satohash.giveabit.io](https://satohash.giveabit.io) — file never leaves device
- Proof anchors to Bitcoin via OpenTimestamps standard
- Court-ready existence proof for "this version existed at this time"
- See [Satohash Marketing](https://github.com/kitsboy/satohash/blob/main/docs/MARKETING.md)

---

## Phase 3 — Canada & BC Legal Challenge (Q4 2026 – 2027)

See **[CANADA-BC-CHALLENGE.md](CANADA-BC-CHALLENGE.md)** for full strategy.

**Goal:** Use SherpaCarta as model language for provincial and federal digital rights legislation.

**Tactics:**
1. MLA/MP briefing packages (EXECUTIVE_SUMMARY + CANADA-BC doc)
2. BC Privacy Commissioner + federal OPC engagement
3. Municipal "Safe Harbour" adoptions (Vancouver, Victoria pilot)
4. Coalition partners: BC civil liberties, privacy NGOs, Indigenous data sovereignty groups
5. Petition + signatory drive with verified Nostr/on-chain signatures
6. Model Private Member's Bill language derived from Arts. 11–13, 61–62

---

## Phase 4 — Global Scale (2027+)

| Deliverable | Notes |
|-------------|-------|
| Full charter i18n | es, fr, zh, ar, pt, de, sw — community PR workflow |
| Dedicated locale routes | `/es/`, `/fr/` with hreflang |
| Public signature ledger | Privacy-preserving aggregate counts |
| API for embeds | `GET /api/v1/articles`, signature widgets |
| MCP server | Charter search, article lookup for AI agents |
| Organization endorsement portal | Verified institutional signers |
| Annual global council (Art. 114) | Deliberation UI on Nostr + recorded minutes stamped on Bitcoin |

---

## Editable Document Model

SherpaCarta is a **living document** — not a static PDF.

| Mode | Who | Where stored | Published |
|------|-----|--------------|-----------|
| Read | Everyone | CDN | Public |
| Edit (draft) | Anyone | localStorage | Private |
| Propose amendment | Signatories | localStorage + Nostr | Optional public |
| Ratify | Organizations | Future council UI | On-chain + OTS timestamp |

**Rules (Art. 114):** Rights may only expand, never contract.

---

## API & MCP (Planned)

```
GET  /api/v1/charter          — full JSON charter
GET  /api/v1/articles/:num    — single article
GET  /api/v1/hash             — current canonical SHA-256
POST /api/v1/amendments       — (future) authenticated proposals
```

**MCP tools (planned):**
- `search_charter` — semantic + keyword article search
- `get_article` — fetch article by number
- `get_pillar_summary` — four pillars overview
- `link_satohash_stamp` — return stamp URL for current hash

---

## What NOT to do yet

- Full backend with user accounts (violates privacy stance)
- Forced Nostr login to read charter
- Simulated metrics presented as audited facts
- Machine-translated binding legal text without human review

---

*Part of the [Give A Bit](https://giveabit.io) family.*