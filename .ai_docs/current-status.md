# Current Status — Sherpacarta

**Version:** main @ `5204c5d`+ (docs prep follow-up)  
**Last Updated:** 2026-07-27  
**Domain:** https://sherpacarta.org  
**productId:** `sherpacarta` (HQ / Umami / LNbits wallet id)

**HQ:** flagship card · prefers live `sherpacarta.org/metrics.json`  
**Stamp:** family contract live — `/stamp?hash=&ref=` · honest API status  

## Recent Milestones
- **2026-07-27:** Stamp handoff audit+harden (`5204c5d`) — guide URL, require id, verify link, Canada ref, bundle
- **2026-07-27:** Docs package — LEARN-STAMP-FAMILY, PREP-NOW, resolved KIMI-REQUEST / GROK-PROMPT
- **2026-07-27:** Canada hub + official path — promise/stakes, 3 tracks, FAQ, MP tools
- **2026-07-27:** BUILD 734 beauty lift (nav badge, hero ribbon)
- **2026-07-26:** Live CF Function metrics + Umami inject + wallets.json v2

## Live KPIs (origin)
| KPI | Source |
|-----|--------|
| articles_total | charter.json |
| signers_total | /api/canada/stats KV |
| donations_sats / btc | mempool.space |
| languages_served | UI locales |
| visitors_monthly | Umami overlay on HQ (may be 0 on origin) |

## Labels
- productId / metricsKey / LNbits: **`sherpacarta`**
- Umami: `9b6f05bf-286e-4b21-9094-1d675f9b4442`
- Metrics: `https://sherpacarta.org/metrics.json` · `raw.demo: false`
- Stamp refs: `sherpacarta` · `sherpacarta-canada`
- Invoice keys: **HQ Vault only**

## Known Issues / open ops
- Confirm CF Pages served latest `sc-core` (look for `satohashStampGuideUrl` on live)
- Kimi: Nostr bot THOR deploy (`docs/KIMI-REQUEST-SHERPA-BOT.md`)
- Kimi: satohash-api Docker if `client_id` null on stamps
- Cam: MP e-### when sponsor ready
- **Public LNURL / lud16 pending** — Kimi task: `docs/KIMI-REQUEST-LNURL.md` (LNbits + HQ Vault; hand public details to Grok)
- visitors_monthly may stay 0 until Umami overlay/traffic

## Next (see docs/PREP-NOW.md)
1. **Kimi:** Public LNURL for wallet `sherpacarta` via LNbits → Vault → hand lud16 to Grok  
2. Live smoke stamp after CF deploy  
3. Kimi bot + optional client_id rebuild  
4. MP path when politics ready  
