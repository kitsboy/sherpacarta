## 2026-08-11 — Film project status (M3 close)

**Live on site:** https://sherpacarta.org/#film  
**Committed asset:** `public/video/sherpacarta-2min.mp4` (`?v=841`)  
**Local final:** `video/sherpacarta-2min/final.mp4` (gitignored)

### VO history
| Version | Tool | Notes |
|---------|------|--------|
| THOR first | Kokoro af_nova @ 0.7× | Original high-quality delivery (~120.6s) |
| M3 bad | macOS `say` | Cam rejected — robotic |
| **M3 current** | **Kokoro af_nova** | atempo-fit to **120.0s** · re-render high@30fps |

### Re-render
```bash
export PATH="/Users/cam/Projects/sherpacarta/.tools:$PATH"
export HYPERFRAMES_PYTHON="/Users/cam/Projects/sherpacarta/.tools/hf-venv311/bin/python"
cd video/sherpacarta-2min
npx hyperframes@0.7.106 render --quality high --fps 30 --output final.mp4
```

### Truth rules
- no fake metrics · pending ≠ BTC confirmed · movement not corporation · no "127 countries"  
- international-first · Canada = live national offering (scene 17 only)

### Open (optional)
- 9:16 crop for Stories/Reels  
- re-sync captions if VO changes materially  
