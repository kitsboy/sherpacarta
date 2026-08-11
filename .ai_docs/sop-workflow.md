# Sherpacarta — Standard Operating Procedure

Updated: 2026-08-11 (goodbye BUILD 860)

## Quick Commands
```bash
npm run dev              # Vite dev server (port 5173)
npm run build            # Full build chain → dist/
npm run preview          # Preview build (port 4173)
./deploy.sh              # build + Cloudflare Pages deploy
```

## Film re-render (M3 — Kokoro only)
```bash
export PATH="$PWD/.tools:$PATH"
export HYPERFRAMES_PYTHON="$PWD/.tools/hf-venv311/bin/python"
cd video/sherpacarta-2min
npx hyperframes@0.7.106 render --quality high --fps 30 --output final.mp4
cp -f final.mp4 ../../public/video/sherpacarta-2min.mp4
# optional poster:
# ffmpeg -y -ss 8 -i final.mp4 -frames:v 1 -update 1 ../../public/video/sherpacarta-2min-poster.jpg
# bump ?v= on index.html → ./deploy.sh
```

**Do not** use macOS `say` for production VO.

## Cache bust (session close)
| Asset | Query |
|-------|--------|
| `sc-main.css` / `sc-core.js` / `sc-bundle.js` / `sc-nostr-lib.js` | `?v=860` |
| Film MP4 + poster | `?v=860` |

## CSP must allow (live `_headers`)
- `frame-src`: youtube.com, youtube-nocookie.com  
- `media-src`: `'self' blob:`  
- `connect-src` Nostr: damus, nos.lol, snort, nostr.band  
- `/.well-known/nostr.json`: `Content-Type: application/json` + CORS  

## Agent Protocol
1. Read `GROK-SESSION-PROTOCOL.md` + `Agents.md`  
2. Read `.ai_docs/current-status.md` + `docs/KIMI-HANDOFF.md` (top) + `docs/NOSTR.md` if Nostr  
3. Work — no marketing/MP/LN/bot unless Cam asks  
4. Update `.ai_docs/current-status.md` + `docs/KIMI-HANDOFF.md` + `LATEST-UPDATE.md`  
5. Push `origin main` · deploy if site-facing  
