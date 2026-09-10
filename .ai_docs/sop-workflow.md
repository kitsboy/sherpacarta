# Sherpacarta — Standard Operating Procedure

Updated: 2026-09-10

## Quick Commands
```bash
npm run dev              # Vite dev (5173)
npm run build            # Full chain → dist/
npm run preview          # Preview dist
npm run check:next100    # Home contracts (38)
npm run check:sign-flow  # Sign + 390px review (37)
./deploy.sh              # build + Cloudflare Pages (if needed)
```

Full check set used this session: next100, sign-flow, markers, reader, public, security, disclosure, demo.

## Cache bust
All HTML `?v=` on css/js **one token**. Current: **`v=918`**. SW: **`sherpacarta-v9.7`**. Bump together.

Home does **not** link `/fonts/fonts.css` (faces inlined). Do not add `rel=preload as=script`.

## Curated bundle
`scripts/bundle-js.mjs` KEEP: enhancements, v2, b1, b3, b4, b14, b15.  
Never re-add `sc-upgrades-b9.js` (Google Fonts + self-preload).

## Lazy modules
`scLoadShare` / `scLoadNostr` / `scLoadPress` in `index.html`. Do not put those three back as eager `<script src>`.

## Agent Protocol
1. Read `GROK-SESSION-PROTOCOL.md` + `Agents.md`
2. Read `.ai_docs/current-status.md` + top of `docs/KIMI-HANDOFF.md`
3. Stamp contract: `docs/LEARN-STAMP-FAMILY.md`
4. Canada: `docs/CANADA-JOURNEY.md`
5. Work — no MP/e-###/film-audio/human-i18n unless Cam asks
6. Update current-status + KIMI-HANDOFF + LATEST-UPDATE
7. `git push origin main`
