# SherpaCarta current status

**Updated:** 2026-09-11 · Grok M3
**Branch:** `main`
**Latest pushed release:** Stamp widget clickable above cookie banner · `v=918` · SW `v9.7`
**HEAD:** `3c2abc9` — Keep Stamp widget clickable above the cookie banner

## This session (2026-09-11)

Live QA: Satohash `stamp.js` hashed, but a real Stamp click was covered by `#cookie-banner` (`position:fixed; bottom:0; z-index:700–800`) plus hero/cursor overlays. Cookie still shows after 2s. Banner was not removed.

| Commit | What |
|--------|------|
| `9eeb648` | Drop in Satohash stamp widget on the homepage proof path |
| `3c2abc9` | Pad `.satohash-stamp-wrap` when banner is `display:flex`; `pointer-events:none` on `#cursor` and hero overlays |

### Do not regress (stamp overlay)
- Ironic cookie banner stays. Do not change `/api`.
- `.satohash-stamp-wrap` / `[data-satohash-stamp]` must remain clickable while the banner is visible (padding, not z-index stacking — in-flow widget cannot paint above `position:fixed` because `#main-content` is `z-index:2`).

## This session (2026-09-09 → 2026-09-10)

Picked up from UX/LCP work, then shipped a first-choice journey and four follow-on tracks. All on `origin/main`.

| Commit | What |
|--------|------|
| `536beec` | Hero split: Sign locally vs Join the Canada campaign; `/start.html` roles; empty states |
| `fb4bd47` | Contract checks for load/bundle/trust/mobile |
| `cda3e97` | 390px chrome + can/cannot trust copy |
| `6d2375d` | Sign-review document-level; sheet sits above `--bottom-nav-h` |
| `6740e09` | Curated 7-file `sc-bundle.js` (294 KB → 114 KB) |
| `764c79e` | Lazy share/Nostr/press; no AI Summary; iOS `--kb-inset` |

### Do not regress
- Two-path hero (`hero-choice` + `/canada/sign`). No fake seed signers.
- Home `?v=` on css/js is one token. No `sc-upgrades-b*.js` script tags. No Google Fonts in the bundle. Do not re-add `sc-upgrades-b9.js`.
- `#sign-review` stays a document-level dialog; 390px overlay `bottom: calc(var(--bottom-nav-h) + safe-area)`.
- Cookie / toast / PWA stay above the mobile bottom nav. PWA install waits until the hero is off-screen.
- Home does not eagerly load `sc-share.js`, `sc-nostr-lib.js`, `sc-press-outlets.js`.
- Article brief is **In brief** / “Local excerpt — not a model.” Pending ≠ Bitcoin-confirmed.
- Home must not link `/fonts/fonts.css` (font-face inlined). Lighthouse `numberOfRuns` ≥ 3.
- Enter opens sign review; no auto-download on confirm.

### Contracts
`check:next100` 38 · `check:sign-flow` 37 · markers · reader · public · security · disclosure · demo

## Live product truth
- Lightning: `sherpacarta@breez.tips` (wallets.json). BTC treasury live.
- NIP-05: `sherpa@sherpacarta.org`.
- Canada: dual-track (campaign + paper + official bridge). e-### still seeking MP.
- One-minute film: silent visual draft (DEMO DATA). Voice/music pending.

## Cam-gated (do not invent)
MP + e-### · film voice/music · human French charter · Turnstile keys · npm publish · independent legal/security audit · Nostr bot nsec on THOR.

## Safe next (unblocked code)
- Keep cutting home LCP (slim CSS, font subset).
- iOS keyboard vs sign form is shipped; remaining mobile: floating-chrome inventory, 320px clamp.
- Optional: delete unused `sc-upgrades-b2/b5–b13` and `sc-enhancements-v3–v6` sources (not in the live bundle).
