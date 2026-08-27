# SherpaCarta implementation map

## Product flow

`/start.html` → read charter → optional local sign → inspect receipt → `/verify.html` → Satohash public proof status.

## Source and artifacts

- Source charter: `data/charter.json`
- Build generators: `scripts/`
- Public artifacts: `public/api/`, `public/data/`, `public/charter.txt`
- Release metadata: `public/release-manifest.json`, `public/data/releases.json`, `public/data/release-approvals.json`

## Browser boundaries

- Local: reading preferences, general sign drafts, local commitments.
- Optional remote: Canada receipt hash/limited campaign metadata, Nostr events, Satohash public proof metadata.
- Never remote: private keys, passwords, organizer tokens, identity documents, unnecessary PII.

## Verification controls

- `check:release`: manifest/index/hash consistency.
- `check:public`: verifier and receipt contracts.
- `check:security`: secret/privacy/auth/cache contracts.
- `check:a11y`: journey/status/responsive accessibility contracts.
- `build`: generated artifacts and production bundle.

## Ownership map

| Area | Code owner | External dependency |
|---|---|---|
| Static site and build | M3 repository | Cloudflare Pages deployment |
| Satohash proof service | Give A Bit/Satohash plane | Satohash API lifecycle |
| Campaign operations | Functions + protected Cloudflare secret | Organizer/operator |
| Treasury | Public wallet metadata only | HQ/Vault custody decision |
| Nostr | Browser/user-authorized layer | Protected bot/key operations |
| Legal status | Documentation only | Qualified counsel and authorities |
| Accessibility | Repository checks and human QA | Browser/screen-reader review |
| Monitoring | Workflow foundations | Production target and alert owner |

## Required handoff files

- `docs/KIMI-HANDOFF.md`
- `.ai_docs/current-status.md`
- `LATEST-UPDATE.md`
- `SOURCE-OF-TRUTH.md`
- `docs/NEXT-100-FULL-EXECUTION.md`

This map is operational documentation, not an authorization grant or certification.
