# SherpaCarta — QA release gate

Run this gate before a material release. A green build alone is not enough.

## Automated checks

- `npm run build`
- `node --check public/sw.js`
- `node --check public/js/sc-top30.js`
- `node --check public/js/sc-next100.js`
- `node --check public/js/sc-reliability.js`
- `git diff --check`
- Secret-pattern scan
- Honest-proof wording scan
- Dependency audit where CI/network permits

## Browser checks

Test at 320, 360, 390, 768, 1024, and 1280px widths:

- Start here → Read → Sign → Verify
- Navigation opens and closes on mobile
- Sign review shows exact entered values
- Cancel leaves data unchanged
- Reset clears only the local draft
- Offline banner appears when disconnected
- Verification page hashes text locally
- Receipt import does not upload file contents
- Pending proof is not shown as confirmed
- QR and proof links are usable at touch sizes

## Accessibility checks

- Keyboard can reach every action and visible focus is strong.
- Heading order and landmark structure make sense.
- Status changes use `role=status` or an equivalent announcement.
- No essential information is conveyed by color alone.
- 200% and 400% zoom retain content and actions.
- Reduced-motion preference disables nonessential motion.
- Arabic/RTL and long translated labels do not overflow.

## Content and legal checks

- Public mandate is not called an official government petition.
- Campaign totals are not called identity-verified.
- Pending is not called Bitcoin-confirmed.
- Formal documents retain version, date, source, and legal qualification.
- No unsupported endorsement, geographic, visitor, signer, or funding claim appears.

## Release hygiene

- Review generated artifacts separately from source edits.
- Confirm service-worker cache includes new public assets.
- Confirm canonical URLs and sitemap entries.
- Confirm no secrets or personal data enter the commit.
- Update current status, handoff, and relevant formal documentation.
- Record known limitations instead of hiding them.
