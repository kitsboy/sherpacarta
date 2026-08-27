# Nostr operations template

> **DEMO DATA — runbook template only.** No private key, nsec, seed, or production operator is recorded here. Steve Jobs is a fictional example and has no operational role.

## Demo operating record

- Operator: Steve Jobs **(DEMO DATA — fictional example)**
- Environment: `DEMO DATA — staging only`
- Product npub: public value may be recorded separately
- Private key: **never record here**
- Relays: `DEMO DATA — example only`
- Status: `not-deployed`

## Required real controls

- Managed secret storage and least privilege
- Key ownership and rotation schedule
- Relay allowlist and moderation policy
- NIP-05 ownership verification
- Incident response and shutdown process
- Backup/recovery test without exposing secrets
- Separate product and suite-operations identities
- Audit log with no private material

THOR/HQ operators must execute secret-bearing work. M3 code must remain secret-free.
