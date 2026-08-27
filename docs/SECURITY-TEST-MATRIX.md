# Security and privacy test matrix

This matrix separates checks that run in-repository from controls requiring deployed-system or independent review.

| Area | Repository check | Current boundary |
|---|---|---|
| Secret leakage | `npm run check:security` | Pattern scan, not a credential manager or historical Git scrub |
| Receipt privacy | `npm run check:security` | Confirms redacted export code; does not inspect a user's local browser |
| Hash input | `npm run check:public` | Public contract and shape checks; fuzz tests remain open |
| Campaign authorization | `npm run check:security` | Confirms organizer-token gate exists; deployed auth tests remain open |
| Campaign API caching | `npm run check:security` | Confirms service-worker bypass; CDN behavior needs deployment verification |
| Release integrity | `npm run check:release` | Manifest/index/hash consistency |
| CSP and headers | Existing security workflow | Must still be checked against deployed response headers |
| Rate limiting | Not yet automated | Requires endpoint contract tests and a controlled staging target |
| CSRF | Not yet automated | Requires browser/API test design and deployment target |
| Dependency vulnerabilities | Existing workflow | Advisory output requires triage and ownership |

## Release rule

A passing repository check means the checked invariant is present in source. It does not mean the service has passed an external penetration test, legal review, or production monitoring.
