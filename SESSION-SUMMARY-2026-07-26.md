# Session Summary — 2026-07-26

**Chat Topic:** Real suite metrics end-to-end for SherpaCarta → HQ (`productId: sherpacarta`). No invoice keys in git.

## Key Things We Did
- Confirmed Cam keeps LNbits invoice keys in **HQ Vault only** (correct — never paste into product repo)
- Built live metrics pipeline: CF Function + build-time generator from public sources
- Regenerated honest KPIs: 114 articles · 4 signers · 12,884 sats on-chain
- Injected first-party Umami + event beacon across 29 HTML pages
- Documented wallet id `sherpacarta` for HQ Money; public LNURL still pending
- Handoff for Kimi: kill demo envelope, prefer live origin

## What We Finished
- [x] Live `/metrics.json` (Function + static fallback)
- [x] `npm run metrics` / build + CI generate step
- [x] Site-wide analytics inject
- [x] wallets.json v2 + treasury honesty copy
- [x] Handoff + status docs

## Still open (not blocked on secrets in this repo)
- [ ] Kimi: remove HQ demo metrics for sherpacarta
- [ ] Kimi: confirm Vault/Worker wallet `sherpacarta` balances green
- [ ] Public LNURL/lud16 when Cam/Kimi publish receive endpoint
- [ ] HQ Umami overlay for visitors_monthly
- [ ] Optional HQ UI polish session (card / money / sparklines)

## Recovery
Use **/whatsup** to reload context.
