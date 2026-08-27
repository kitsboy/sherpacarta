# Browser and endpoint test plan

## Repository-only checks

Run:

```bash
npm run check:release
npm run check:public
npm run check:security
npm run check:a11y
npm run check:disclosure
npm run check:demo
npm run check:endpoints
```

These use Node built-ins and static fixtures only. They do not claim that a deployed site or external API has passed.

## Browser journeys to execute when an authorized target exists

1. Open `/start.html`; verify keyboard focus and role links.
2. Open the homepage; complete Read → Sign → Verify without a login.
3. Confirm local sign draft recovery and reset behavior.
4. Open `/verify.html`; calculate a hash without network upload.
5. Import a demo receipt marked DEMO DATA; verify mismatch messaging.
6. Enter a demo public stamp ID; verify bounded polling and recovery state.
7. Open `/share.html`; copy platform text and inspect native share fallback.
8. Open `/press-kit.html`; inspect print layout and all evidence links.
9. Set 200% and 400% zoom; confirm no content or controls disappear.
10. Test keyboard-only navigation and screen-reader landmarks.
11. Toggle offline mode; confirm read/local tools remain understandable.
12. Return online; confirm status messaging recovers.

## Endpoint journeys

Use an isolated staging target and synthetic records only. Test method allowlists, malformed hashes, oversized fields, missing organizer credentials, rate limits, CORS, CSRF assumptions, and no-store behavior. Never test against production without written authorization; never use real identity data or move funds.

## Evidence record

For each run record target, commit, browser/runtime, viewport, test fixture, date, operator, pass/fail, screenshots or logs with secrets removed, and remediation links.
