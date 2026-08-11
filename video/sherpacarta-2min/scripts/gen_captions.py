#!/usr/bin/env python3
"""Generate compositions/captions.html from transcript.json.
Calm storytelling captions: serif, slow fade, 5-6 words per group,
bottom-center, safe area. Deterministic — no random/time.
"""
import json, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tx = json.load(open(os.path.join(BASE, "transcript.json")))

# Group words into phrases of ~5 words on sentence/pause boundaries
groups = []
cur = []
cur_start = None
cur_end = None
for w in tx:
    text = w["text"]
    gap = (w["start"] - cur_end) if cur_end is not None else 0
    if cur and (len(cur) >= 5 or gap > 0.45):
        groups.append({"words": list(cur), "start": cur_start, "end": cur_end})
        cur = []
        cur_start = None
    if cur_start is None:
        cur_start = w["start"]
    cur.append(text)
    cur_end = w["end"]
if cur:
    groups.append({"words": list(cur), "start": cur_start, "end": cur_end})

# Show phrase for 0.6s after last word, fade 0.25 in/out
FADE = 0.25
HOLD = 0.35
rows = []
tl_lines = []
for i, g in enumerate(groups):
    gid = f"cap-{i:03d}"
    start = round(g["start"], 3)
    vis_end = round(g["end"] + HOLD, 3)
    dur = round(vis_end - start, 3)
    text = " ".join(g["words"])
    rows.append(
        f'  <div id="{gid}" class="clip cap-row" data-start="{start}" data-duration="{dur}" data-track-index="{i+2}">{text}</div>'
    )
    tl_lines.append(f'  tl.from("#{gid}", {{ autoAlpha: 0, y: 14, duration: {FADE}, ease: "power2.out" }}, {start});')
    tl_lines.append(f'  tl.to("#{gid}", {{ autoAlpha: 0, y: -8, duration: {FADE}, ease: "power2.in" }}, {round(vis_end - FADE, 3)});')

html = f"""<!doctype html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body>
<template>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=block');
  #root {{
    position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  }}
  .cap-row {{
    position: absolute;
    left: 50%; bottom: 92px;
    transform: translateX(-50%);
    width: max-content; max-width: 1500px;
    text-align: center;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 46px; font-weight: 500; line-height: 1.25;
    color: #e8f0e8;
    padding: 10px 26px;
    background: rgba(3,6,5,0.55);
    border-radius: 10px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }}
</style>
<div id="root" data-composition-id="captions" data-width="1920" data-height="1080">
{chr(10).join(rows)}
</div>
<script>
window.__timelines = window.__timelines || {{}};
const tl = gsap.timeline({{ paused: true }});
{chr(10).join(tl_lines)}
window.__timelines["captions"] = tl;
</script>
</template>
</body>
</html>
"""
out = os.path.join(BASE, "compositions", "captions.html")
open(out, "w").write(html)
print(f"wrote {out} — {len(groups)} caption groups, words={len(tx)}")
