# Independent security audit request

This is a scope template, not an audit report or security certification.

## Requested scope

- Static HTML/JavaScript client and service worker
- Cloudflare Pages deployment and headers
- Canada Functions: sign, stats, batch, ping, proof-of-work
- Authentication and organizer-token boundaries
- Rate limiting, CORS, CSRF, input validation, XSS, privacy leakage
- Build and dependency supply chain
- Nostr and Satohash integration boundaries

## Required rules of engagement

- Written authorization and test window
- Named source IPs and test accounts
- Staging target preferred; production testing only with explicit authorization
- No destructive tests, real-user data access, credential discovery, or fund movement
- Emergency contact and stop conditions
- Evidence handling and deletion terms

## Required deliverables

- Executive risk summary
- Technical findings with severity, reproduction, impact, and remediation
- Scope/exclusion statement
- Evidence-handling statement
- Retest report after remediation
- CVSS or equivalent methodology

A repository check, bug-bounty policy, or passing build must not be substituted for this independent review.
