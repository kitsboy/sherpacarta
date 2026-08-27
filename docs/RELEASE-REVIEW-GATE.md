# SherpaCarta release review gate

Use this checklist before describing a release as approved, official, confirmed, or production-ready.

## Required repository evidence

- [ ] `npm run check:release` passes.
- [ ] `npm run check:public` passes.
- [ ] `npm run check:security` passes.
- [ ] `npm run check:a11y` passes.
- [ ] `npm run build` passes.
- [ ] Generated files are reviewed and unrelated churn is excluded.
- [ ] Release hash and manifest identify the same document version.
- [ ] Satohash links use the canonical `/stamp?hash=&ref=` contract.

## Required human review

- [ ] A named maintainer reviews content and accessibility.
- [ ] A security reviewer checks deployed headers, authentication, rate limits, and logs.
- [ ] Counsel reviews jurisdiction-specific claims before legal language is published.
- [ ] A records owner approves the release provenance and retention plan.

## Language gate

Do not use **official**, **approved**, **legally binding**, **government adopted**, **verified signer**, or **Bitcoin-confirmed** unless the corresponding external evidence is attached to the release record. A passing build is technical evidence only.

## Evidence packet

Each release should link to the source version, complete SHA-256 hash, manifest, approval record, changelog, review identities, unresolved risks, and proof status. Never include private keys, organizer tokens, identity documents, or unnecessary personal data.
