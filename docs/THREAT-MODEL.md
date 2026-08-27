# SherpaCarta — Threat model

**Scope:** public site, local-first signing, Canada campaign APIs, Nostr optional publishing, and Satohash proof links.

## Assets to protect

- User privacy and local signatures
- Campaign receipt hashes and limited metadata
- Organizer credentials and secrets
- Charter source integrity and release identity
- Proof status and verification links
- Donation/public wallet information
- Availability of reading and signing paths

## Trust boundaries

1. Browser ↔ static Pages assets
2. Browser localStorage ↔ user device
3. Browser ↔ campaign API/KV/DB
4. Browser ↔ Nostr extension/relays
5. Browser/API ↔ Satohash service
6. M3 repository ↔ CI/deployment
7. M3 code ↔ THOR operational secrets

## Threats and controls

| Threat | Control | Residual risk |
|---|---|---|
| XSS through names, articles, or remote data | Safe DOM/output handling, CSP, bounded inputs | Legacy surfaces require continued review |
| Bot inflation | Rate limits, PoW/Turnstile path, honest labels | Rate limits are not identity verification |
| Organizer abuse | Secret-gated batch endpoint, no secrets in repo | Credential compromise remains possible |
| Stale or false proof claim | Explicit pending/confirmed vocabulary, verification guide | External service status must be checked |
| PII leakage | Minimal fields, local-first defaults, no PII metrics | User may voluntarily publish information |
| Secret exposure | CI pattern scan, password-manager/managed-secret rule | Pattern scans are not complete secret detection |
| Service outage | Offline/read-only fallback and error messaging | Dynamic actions require network |
| Supply-chain compromise | Self-hosted assets, dependency audit, restricted CI permissions | Dependencies still require review |
| Unauthorized content change | Git review, release metadata, hash comparison | Formal signing/approval remains to be added |

## Security invariants

- No private key, nsec, macaroon, organizer token, or invoice key in source control.
- No campaign total described as identity-verified or Parliamentary without authoritative evidence.
- No pending stamp described as Bitcoin-confirmed.
- No dynamic API response cached as authoritative campaign state.
- No user is required to create an account to read the charter.

## Open verification work

Automated endpoint authorization, CSRF, boundary, PII, browser accessibility, viewport, synthetic journey, and external security testing remain outstanding. This document is a threat-model baseline, not a certification.
