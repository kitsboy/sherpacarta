# SherpaCarta — Technical Architecture

**Status:** current working architecture · 26 August 2026
**Canonical repository:** `kitsboy/sherpacarta`
**Production:** https://sherpacarta.org
**Family:** Give A Bit · Satohash proof plane

## 1. System overview

SherpaCarta is an HTML-first static web product with generated public data, optional Cloudflare Pages Functions for campaign operations, local-first browser participation, optional Nostr publication, and Satohash-based hash/timestamp proof.

```text
[data/charter.json]
        │ build generators
        ├── public/api/v1/charter.json + articles
        ├── public/charter.txt
        ├── public/api/v1/hash.json
        └── public/sc-core.js / public/sc-bundle.js

Browser ── static Pages assets ──┬── localStorage (preferences/signatures/drafts)
                                ├── optional Nostr relays (user-signed events)
                                ├── campaign Functions + KV/DB (Canada receipt metadata)
                                └── Satohash API/site (hash proof lifecycle)
```

## 2. Source-of-truth hierarchy

1. `data/charter.json` is authoritative for charter content.
2. `data/campaign-canada.json` is authoritative for campaign configuration.
3. Generated `public/` outputs are release artifacts and should be regenerated, not hand-edited, where a generator exists.
4. `SOURCE-OF-TRUTH.md` records architecture and operational boundaries.
5. `docs/KIMI-HANDOFF.md` records session continuity; it is not product data.
6. Secrets belong in managed environment storage or a password manager, never in git.

## 3. User-facing trust boundaries

| Surface | Default data location | Meaning |
|---|---|---|
| Reading | Browser/network cache | Public document access |
| General sign | Browser localStorage | Voluntary civic commitment on that device |
| Canada campaign | Optional API receipt hash + limited metadata | Public mandate, not official Parliament count |
| Nostr | User’s extension and relays | Optional user-authorized public event |
| Satohash | Satohash service/API | Hash/timestamp evidence with lifecycle status |
| Donations | Public wallet registry and external rails | Funding information, separate from signature claims |

## 4. Build and release

```bash
npm run build
npm run preview
npm run lint
```

The build generates the charter, campaign mirror, metrics, analytics injection, JS bundle, API files, sitemap, text export, OG cards, and Vite output. Build-generated diffs must be reviewed before commit.

CI trust checks are in `.github/workflows/trust-checks.yml`.

## 5. Security invariants

- Never put nsecs, private keys, macaroons, invoice keys, organizer tokens, or credentials into source files.
- Validate and bound all user-controlled fields server-side.
- Keep campaign API rate limits and method allowlists intact.
- Keep CSP, frame denial, MIME protection, and CORS policies under review.
- Never describe pending proof as Bitcoin-confirmed.
- Never describe campaign totals as official, identity-verified, or Parliamentary without authoritative evidence.
- Do not introduce redirect rules that create extensionless-to-HTML loops.

## 6. Recovery and observability

The service worker uses network-first navigation behavior and a static offline fallback. Dynamic campaign API requests must not be served from stale cache. Public proof routes should provide a recovery path when a proof is missing, expired, pending, or unavailable.

Operational improvements still needed include end-to-end synthetic checks, browser viewport automation, endpoint contract tests, and a release dashboard joining build, accessibility, security, and proof status.

## 7. Change protocol

For a material change:

1. Read `AGENTS.md`, `GROK-SESSION-PROTOCOL.md`, and the current handoff.
2. Identify the canonical source file and avoid editing generated output directly.
3. Make the smallest coherent change.
4. Run build and targeted checks.
5. Review generated artifacts and revert noise.
6. Update status, handoff, and relevant diligence/legal docs.
7. Commit and push only the intended files.

*This document describes implementation boundaries; it is not a security certification or legal opinion.*
