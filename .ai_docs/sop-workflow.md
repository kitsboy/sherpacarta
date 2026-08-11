# Sherpacarta — Standard Operating Procedure

Updated: 2026-08-11

## Quick Commands
```bash
npm run dev              # Vite dev server (port 5173)
npm run build            # Full build chain → dist/
npm run preview          # Preview build (port 4173)
./deploy.sh              # build + Cloudflare Pages deploy
```

## Film re-render (M3 — Kokoro)
```bash
export PATH="$PWD/.tools:$PATH"
export HYPERFRAMES_PYTHON="$PWD/.tools/hf-venv311/bin/python"
cd video/sherpacarta-2min
# narration.wav = Kokoro (or: hyperframes tts vo-full.txt -v af_nova -s 0.7 -o narration_kokoro.wav)
# fit to 120s if needed, then:
npx hyperframes@0.7.106 render --quality high --fps 30 --output final.mp4
cp -f final.mp4 ../../public/video/sherpacarta-2min.mp4
# bump ?v= on index.html video src, then ./deploy.sh
```

**Do not** use macOS `say` for production VO.

## Cache bust
| Asset | Query (session close) |
|-------|------------------------|
| `sc-main.css` / `sc-core.js` / `sc-bundle.js` | `?v=840` |
| Official film MP4 | `?v=841` |

## CSP must allow (live `_headers`)
- `frame-src`: youtube.com, youtube-nocookie.com (HRF companion)
- `media-src`: `'self' blob:` (local film)

## Agent Protocol
1. Read `GROK-SESSION-PROTOCOL.md` + `Agents.md`
2. Read `.ai_docs/current-status.md` and `docs/KIMI-HANDOFF.md` (top)
3. Work on project
4. Update `.ai_docs/current-status.md` + `docs/KIMI-HANDOFF.md` + `LATEST-UPDATE.md`
5. Push to `origin main` · deploy if site-facing
