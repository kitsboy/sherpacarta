#!/usr/bin/env python3
"""Generate SherpaCarta 2min HyperFrames scene compositions.

Shared design tokens from DESIGN.md; bespoke visual + GSAP timeline per scene.
Deterministic only — no Math.random / Date.now. Finite repeats.
"""
import os

SCENES_DIR = os.path.join(os.path.dirname(__file__), "..", "compositions")

# ---------------------------------------------------------------- shared css
FONTS = """@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=block');"""

BASE_CSS = FONTS + """
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #030605; }
  .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
  .mono { font-family: 'DM Mono', ui-monospace, monospace; }
  .sans { font-family: 'Outfit', system-ui, sans-serif; }
"""

def scene_html(scene_id, duration, body, css, timeline, root_style=""):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
</head>
<body>
<template>
<style>
{BASE_CSS}
{root_style}
{css}
</style>
<div id="root" data-composition-id="{scene_id}" data-width="1920" data-height="1080">
{body}
</div>
<script>
window.__timelines = window.__timelines || {{}};
const tl = gsap.timeline({{ paused: true }});
const dur = {duration};
{timeline}
window.__timelines["{scene_id}"] = tl;
</script>
</template>
</body>
</html>
"""

# ---------------------------------------------------------------- scene 01
S01_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; display: flex; align-items: center; justify-content: center; }
  #s01-vignette {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 62% 55% at 50% 46%, rgba(10,31,22,0.0) 0%, rgba(3,6,5,0.9) 78%);
  }
  #s01-parchment {
    position: relative; width: 1080px; height: 720px;
    background:
      linear-gradient(115deg, rgba(232,192,64,0.10) 0%, rgba(232,192,64,0.02) 40%, rgba(20,212,146,0.05) 100%),
      #0a1f16;
    border: 1px solid rgba(232,192,64,0.35);
    box-shadow: 0 60px 160px rgba(0,0,0,0.75), inset 0 0 120px rgba(232,192,64,0.06);
    border-radius: 6px;
  }
  #s01-parchment::before {
    content: ""; position: absolute; inset: 26px;
    border: 1px solid rgba(232,192,64,0.18); border-radius: 3px;
  }
  #s01-seal {
    position: absolute; left: 50%; top: 50%; width: 168px; height: 168px;
    transform: translate(-50%, -50%);
    border: 3px double #e8c040; border-radius: 50%;
    background: radial-gradient(circle at 38% 34%, rgba(245,215,106,0.28), rgba(232,192,64,0.06) 68%);
    box-shadow: 0 0 60px rgba(232,192,64,0.22), inset 0 0 30px rgba(232,192,64,0.12);
  }
  #s01-seal::after {
    content: "S"; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 92px; font-weight: 700; color: #f5d76a;
  }
  #s01-dust {
    position: absolute; inset: 0; opacity: 0.16; pointer-events: none;
    background-image:
      radial-gradient(rgba(245,215,106,0.5) 1px, transparent 1.4px),
      radial-gradient(rgba(61,224,168,0.4) 1px, transparent 1.5px);
    background-size: 7px 9px, 11px 13px; background-position: 0 0, 3px 4px;
  }
  #s01-year {
    position: absolute; left: 0; right: 0; bottom: 118px; text-align: center;
    font-family: 'DM Mono', monospace; font-size: 30px; letter-spacing: 0.34em; color: #9ff5d0;
  }
"""
S01_BODY = """
  <div id="s01-dust"></div>
  <div id="s01-parchment"><div id="s01-seal"></div></div>
  <div id="s01-year">MAGNA&nbsp;CARTA&nbsp;·&nbsp;1215</div>
  <div id="s01-vignette"></div>
"""
S01_TL = """
  tl.from("#s01-parchment", { scale: 1.06, opacity: 0, duration: 2.2, ease: "power2.out" }, 0.35);
  tl.from("#s01-seal", { scale: 0.4, opacity: 0, duration: 1.6, ease: "back.out(1.6)" }, 1.1);
  tl.to("#s01-parchment", { y: -14, duration: dur, ease: "sine.inOut" }, 0);
  tl.from("#s01-year", { opacity: 0, y: 18, duration: 1.0, ease: "power2.out" }, 2.4);
  tl.to("#s01-seal", { boxShadow: "0 0 84px rgba(232,192,64,0.34)", duration: 3.4, ease: "sine.inOut", repeat: 1, yoyo: true }, 2.2);
"""

# ---------------------------------------------------------------- scene 02
S02_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s02-phone {
    position: absolute; left: 50%; top: 50%; width: 300px; height: 590px;
    transform: translate(-50%, -50%); border-radius: 46px;
    border: 2px solid rgba(61,224,168,0.55);
    background: linear-gradient(180deg, #0a1f16 0%, #06120d 100%);
    box-shadow: 0 0 90px rgba(20,212,146,0.16), inset 0 0 60px rgba(20,212,146,0.05);
  }
  #s02-screen {
    position: absolute; left: 20px; right: 20px; top: 66px; bottom: 20px;
    border: 1px solid rgba(61,224,168,0.18); border-radius: 26px; overflow: hidden;
  }
  #s02-scan {
    position: absolute; left: 0; right: 0; top: 0; height: 110px;
    background: linear-gradient(180deg, rgba(20,212,146,0.0), rgba(20,212,146,0.30), rgba(20,212,146,0.0));
    animation: s02-scan 2.4s linear infinite;
  }
  #s02-face {
    position: absolute; left: 50%; top: 50%; width: 150px; height: 180px; transform: translate(-50%, -60%);
    border: 1px solid rgba(61,224,168,0.4); border-radius: 46% 46% 42% 42%;
    background: radial-gradient(circle at 50% 34%, rgba(61,224,168,0.16), transparent 62%);
  }
  #s02-score {
    position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%);
    font-family: 'DM Mono', monospace; font-size: 30px; letter-spacing: 0.22em; color: #e8c040;
  }
  #s02-caption {
    position: absolute; left: 50%; top: 150px; transform: translateX(-50%);
    font-family: 'Outfit', sans-serif; font-size: 40px; font-weight: 300; color: #e8f0e8; letter-spacing: 0.08em;
  }
"""
S02_BODY = """
  <div id="s02-caption">THE POWERS THAT SHAPE YOUR LIFE</div>
  <div id="s02-phone">
    <div id="s02-screen">
      <div id="s02-scan"></div>
      <div id="s02-face"></div>
      <div id="s02-score">SCORE&nbsp;·&nbsp;87</div>
    </div>
  </div>
"""
S02_TL = """
  tl.from("#s02-caption", { opacity: 0, y: -26, duration: 1.0, ease: "power3.out" }, 0.25);
  tl.from("#s02-phone", { y: 90, opacity: 0, duration: 1.2, ease: "power3.out" }, 0.45);
  tl.from("#s02-score", { opacity: 0, duration: 0.8, ease: "power2.out" }, 2.1);
"""

# ---------------------------------------------------------------- scene 03
S03_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s03-rack {
    position: absolute; left: 50%; top: 54%; transform: translate(-50%, -50%);
    display: flex; gap: 10px;
  }
  .s03-unit {
    width: 200px; height: 420px; border: 1px solid rgba(42,107,79,0.65); border-radius: 10px;
    background: linear-gradient(180deg, #0a1f16, #07150e);
    display: flex; flex-direction: column; gap: 14px; padding: 26px 18px;
  }
  .s03-led {
    height: 8px; border-radius: 4px; background: #14d492; opacity: 0.85;
  }
  .s03-led.dim { background: #2a6b4f; opacity: 0.5; }
  .s03-led.gold { background: #e8c040; }
  #s03-arrow {
    position: absolute; left: 50%; top: 118px; transform: translateX(-50%);
    font-family: 'DM Mono', monospace; font-size: 34px; letter-spacing: 0.26em; color: #f5d76a;
  }
"""
S03_BODY = """
  <div id="s03-arrow">1215&nbsp;&rarr;&nbsp;2026</div>
  <div id="s03-rack">
    <div class="s03-unit">
      <div class="s03-led gold"></div><div class="s03-led"></div><div class="s03-led dim"></div>
      <div class="s03-led"></div><div class="s03-led dim"></div><div class="s03-led gold"></div>
      <div class="s03-led"></div><div class="s03-led"></div><div class="s03-led dim"></div>
    </div>
    <div class="s03-unit">
      <div class="s03-led dim"></div><div class="s03-led gold"></div><div class="s03-led"></div>
      <div class="s03-led dim"></div><div class="s03-led"></div><div class="s03-led gold"></div>
      <div class="s03-led dim"></div><div class="s03-led"></div><div class="s03-led"></div>
    </div>
    <div class="s03-unit">
      <div class="s03-led"></div><div class="s03-led dim"></div><div class="s03-led gold"></div>
      <div class="s03-led"></div><div class="s03-led gold"></div><div class="s03-led dim"></div>
      <div class="s03-led"></div><div class="s03-led"></div><div class="s03-led gold"></div>
    </div>
  </div>
"""
S03_TL = """
  tl.from("#s03-arrow", { opacity: 0, y: 20, duration: 1.2, ease: "power2.out" }, 0.3);
  tl.from(".s03-unit", { y: 70, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.14 }, 0.6);
"""

# ---------------------------------------------------------------- scene 04 (1215)
S04_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s04-line {
    position: absolute; left: 50%; top: 190px; bottom: 190px; width: 2px; transform: translateX(-50%);
    background: linear-gradient(180deg, transparent, #e8c040 22%, #e8c040 78%, transparent);
  }
  #s04-node {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 26px; height: 26px; border-radius: 50%; background: #e8c040;
    box-shadow: 0 0 44px rgba(232,192,64,0.7);
  }
  #s04-year {
    position: absolute; left: 50%; top: 38%; transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 108px; font-weight: 700; color: #f5d76a;
  }
  #s04-title {
    position: absolute; left: 50%; top: 56%; transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 56px; font-weight: 600; color: #ffffff;
  }
  #s04-sub {
    position: absolute; left: 50%; top: 67%; transform: translateX(-50%);
    font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 300; color: #e8f0e8;
  }
"""
S04_BODY = """
  <div id="s04-line"></div>
  <div id="s04-year">1215</div>
  <div id="s04-node"></div>
  <div id="s04-title">Magna Carta</div>
  <div id="s04-sub">Limits on kings</div>
"""
S04_TL = """
  tl.from("#s04-line", { scaleY: 0, transformOrigin: "50% 50%", duration: 1.2, ease: "power2.out" }, 0.3);
  tl.from("#s04-year", { opacity: 0, y: 34, duration: 1.0, ease: "power3.out" }, 0.5);
  tl.from("#s04-node", { scale: 0, duration: 0.7, ease: "back.out(2.2)" }, 1.3);
  tl.from("#s04-title", { opacity: 0, y: 22, duration: 0.9, ease: "power2.out" }, 1.6);
  tl.from("#s04-sub", { opacity: 0, y: 16, duration: 0.9, ease: "power2.out" }, 2.1);
"""

# ---------------------------------------------------------------- scene 05 (1948)
S05_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s05-line {
    position: absolute; left: 50%; top: 190px; bottom: 190px; width: 2px; transform: translateX(-50%);
    background: linear-gradient(180deg, transparent, #14d492 22%, #14d492 78%, transparent);
  }
  #s05-node {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 26px; height: 26px; border-radius: 50%; background: #14d492;
    box-shadow: 0 0 44px rgba(20,212,146,0.7);
  }
  #s05-year {
    position: absolute; left: 50%; top: 38%; transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 108px; font-weight: 700; color: #9ff5d0;
  }
  #s05-title {
    position: absolute; left: 50%; top: 56%; transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 56px; font-weight: 600; color: #ffffff;
  }
  #s05-sub {
    position: absolute; left: 50%; top: 67%; transform: translateX(-50%);
    font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 300; color: #e8f0e8;
  }
"""
S05_BODY = """
  <div id="s05-line"></div>
  <div id="s05-year">1948</div>
  <div id="s05-node"></div>
  <div id="s05-title">Universal Declaration of Human Rights</div>
  <div id="s05-sub">Rights of every person</div>
"""
S05_TL = """
  tl.from("#s05-line", { scaleY: 0, transformOrigin: "50% 50%", duration: 1.2, ease: "power2.out" }, 0.3);
  tl.from("#s05-year", { opacity: 0, y: 34, duration: 1.0, ease: "power3.out" }, 0.5);
  tl.from("#s05-node", { scale: 0, duration: 0.7, ease: "back.out(2.2)" }, 1.3);
  tl.from("#s05-title", { opacity: 0, y: 22, duration: 0.9, ease: "power2.out" }, 1.6);
  tl.from("#s05-sub", { opacity: 0, y: 16, duration: 0.9, ease: "power2.out" }, 2.1);
"""

# ---------------------------------------------------------------- scene 06 (2011)
S06_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s06-line {
    position: absolute; left: 50%; top: 190px; bottom: 190px; width: 2px; transform: translateX(-50%);
    background: linear-gradient(180deg, transparent, #e8c040 22%, #e8c040 78%, transparent);
  }
  #s06-node {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 26px; height: 26px; border-radius: 50%; background: #e8c040;
    box-shadow: 0 0 44px rgba(232,192,64,0.7);
  }
  #s06-year {
    position: absolute; left: 50%; top: 38%; transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 108px; font-weight: 700; color: #f5d76a;
  }
  #s06-title {
    position: absolute; left: 50%; top: 56%; transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 56px; font-weight: 600; color: #ffffff;
  }
  #s06-sub {
    position: absolute; left: 50%; top: 67%; transform: translateX(-50%);
    font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 300; color: #e8f0e8;
  }
"""
S06_BODY = """
  <div id="s06-line"></div>
  <div id="s06-year">2011</div>
  <div id="s06-node"></div>
  <div id="s06-title">Iceland</div>
  <div id="s06-sub">People write the text</div>
"""
S06_TL = """
  tl.from("#s06-line", { scaleY: 0, transformOrigin: "50% 50%", duration: 1.2, ease: "power2.out" }, 0.3);
  tl.from("#s06-year", { opacity: 0, y: 34, duration: 1.0, ease: "power3.out" }, 0.5);
  tl.from("#s06-node", { scale: 0, duration: 0.7, ease: "back.out(2.2)" }, 1.3);
  tl.from("#s06-title", { opacity: 0, y: 22, duration: 0.9, ease: "power2.out" }, 1.6);
  tl.from("#s06-sub", { opacity: 0, y: 16, duration: 0.9, ease: "power2.out" }, 2.1);
"""

# ---------------------------------------------------------------- scene 07 (2026)
S07_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s07-line {
    position: absolute; left: 50%; top: 190px; bottom: 190px; width: 2px; transform: translateX(-50%);
    background: linear-gradient(180deg, transparent, #3de0a8 22%, #3de0a8 78%, transparent);
  }
  #s07-node {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 26px; height: 26px; border-radius: 50%; background: #3de0a8;
    box-shadow: 0 0 44px rgba(61,224,168,0.7);
  }
  #s07-year {
    position: absolute; left: 50%; top: 38%; transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 108px; font-weight: 700; color: #9ff5d0;
  }
  #s07-title {
    position: absolute; left: 50%; top: 56%; transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 56px; font-weight: 600; color: #ffffff;
  }
  #s07-sub {
    position: absolute; left: 50%; top: 67%; transform: translateX(-50%);
    font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 300; color: #e8f0e8;
  }
  #s07-seal {
    position: absolute; left: 50%; top: 31%; transform: translateX(-50%);
    width: 40px; height: 40px; border-radius: 50%;
    border: 2px solid #3de0a8; box-shadow: 0 0 30px rgba(61,224,168,0.5);
  }
"""
S07_BODY = """
  <div id="s07-line"></div>
  <div id="s07-year">2026</div>
  <div id="s07-node"></div>
  <div id="s07-seal"></div>
  <div id="s07-title">SherpaCarta</div>
  <div id="s07-sub">The digital age</div>
"""
S07_TL = """
  tl.from("#s07-line", { scaleY: 0, transformOrigin: "50% 50%", duration: 1.2, ease: "power2.out" }, 0.3);
  tl.from("#s07-year", { opacity: 0, y: 34, duration: 1.0, ease: "power3.out" }, 0.5);
  tl.from("#s07-node", { scale: 0, duration: 0.7, ease: "back.out(2.2)" }, 1.3);
  tl.from("#s07-seal", { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(2.2)" }, 1.9);
  tl.from("#s07-title", { opacity: 0, y: 22, duration: 0.9, ease: "power2.out" }, 2.3);
  tl.from("#s07-sub", { opacity: 0, y: 16, duration: 0.9, ease: "power2.out" }, 2.8);
"""

# ---------------------------------------------------------------- scene 08 (PROFILED)
S08_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s08-card {
    position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%);
    width: 860px; padding: 56px 70px;
    background: #0a1f16; border: 1px solid rgba(42,107,79,0.7); border-radius: 14px;
    box-shadow: 0 30px 100px rgba(0,0,0,0.6);
  }
  #s08-label {
    font-family: 'DM Mono', monospace; font-size: 30px; letter-spacing: 0.3em; color: #14d492;
    text-transform: uppercase; margin-bottom: 22px;
  }
  #s08-word {
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 128px; font-weight: 700; color: #ffffff; line-height: 1;
  }
  #s08-sub {
    position: absolute; left: 50%; top: 72%; transform: translateX(-50%);
    font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 300; color: #e8f0e8;
  }
  #s08-x {
    position: absolute; right: 40px; top: 28px; font-family: 'DM Mono', monospace;
    font-size: 26px; color: rgba(232,192,64,0.5);
  }
"""
S08_BODY = """
  <div id="s08-card">
    <div id="s08-x">[&nbsp;VERDICT&nbsp;]</div>
    <div id="s08-label">They score you</div>
    <div id="s08-word">PROFILED</div>
  </div>
  <div id="s08-sub">without consent, without appeal</div>
"""
S08_TL = """
  tl.from("#s08-card", { scale: 0.92, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.4);
  tl.from("#s08-label", { opacity: 0, x: -24, duration: 0.7, ease: "power2.out" }, 0.9);
  tl.from("#s08-word", { opacity: 0, y: 34, duration: 0.8, ease: "power3.out" }, 1.2);
  tl.from("#s08-sub", { opacity: 0, y: 18, duration: 0.8, ease: "power2.out" }, 1.9);
  tl.from("#s08-x", { opacity: 0, duration: 0.6, ease: "power2.out" }, 2.4);
"""

# ---------------------------------------------------------------- scene 09 (PREDICTED)
S09_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s09-card {
    position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%);
    width: 860px; padding: 56px 70px;
    background: #0a1f16; border: 1px solid rgba(42,107,79,0.7); border-radius: 14px;
    box-shadow: 0 30px 100px rgba(0,0,0,0.6);
  }
  #s09-label {
    font-family: 'DM Mono', monospace; font-size: 30px; letter-spacing: 0.3em; color: #e8c040;
    text-transform: uppercase; margin-bottom: 22px;
  }
  #s09-word {
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 128px; font-weight: 700; color: #ffffff; line-height: 1;
  }
  #s09-track {
    position: absolute; left: 50%; top: 73%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 26px;
    font-family: 'DM Mono', monospace; font-size: 26px; color: #e8f0e8;
  }
  .s09-dot { width: 14px; height: 14px; border-radius: 50%; background: #2a6b4f; }
  .s09-dot.now { background: #14d492; box-shadow: 0 0 18px rgba(20,212,146,0.8); }
  .s09-dot.next { background: #e8c040; }
"""
S09_BODY = """
  <div id="s09-card">
    <div id="s09-label">Algorithms decide</div>
    <div id="s09-word">PREDICTED</div>
  </div>
  <div id="s09-track">
    <span class="s09-dot now"></span><span>YOUR&nbsp;NEXT&nbsp;MOVE</span>
    <span class="s09-dot next"></span><span>ALREADY&nbsp;GUESSED</span>
  </div>
"""
S09_TL = """
  tl.from("#s09-card", { scale: 0.92, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.4);
  tl.from("#s09-label", { opacity: 0, x: -24, duration: 0.7, ease: "power2.out" }, 0.9);
  tl.from("#s09-word", { opacity: 0, y: 34, duration: 0.8, ease: "power3.out" }, 1.2);
  tl.from("#s09-track", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, 1.9);
"""

# ---------------------------------------------------------------- scene 10 (WITHOUT APPEAL)
S10_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s10-wall {
    position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%);
    width: 980px; height: 560px; padding: 40px 50px; overflow: hidden;
    background: #0a1f16; border: 1px solid rgba(42,107,79,0.55); border-radius: 14px;
  }
  .s10-line {
    font-family: 'DM Mono', monospace; font-size: 18px; color: rgba(232,240,232,0.66);
    margin-bottom: 16px; white-space: nowrap; overflow: hidden;
  }
  #s10-stamp {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) rotate(-9deg);
    border: 5px solid #e8c040; color: #f5d76a; border-radius: 10px;
    font-family: 'DM Mono', monospace; font-size: 64px; font-weight: 500; letter-spacing: 0.14em;
    padding: 26px 52px; background: rgba(3,6,5,0.72);
    box-shadow: 0 0 60px rgba(232,192,64,0.25);
  }
"""
S10_BODY = """
  <div id="s10-wall">
    <div class="s10-line">By using this service you agree to the complete and irrevocable transfer of all rights to your personal data, likeness, behavioral profile, and all derived inferences</div>
    <div class="s10-line">including but not limited to any data not yet collected, any data not yet invented, and any data belonging to persons not yet born</div>
    <div class="s10-line">for any purpose whatsoever, in perpetuity, across all jurisdictions, whether known or unknown at the time of signature</div>
    <div class="s10-line">You further waive any right to notice, review, objection, appeal, arbitration, or human consideration of any decision made about you</div>
    <div class="s10-line">by any algorithm, model, system, or successor technology, and you acknowledge that silence constitutes agreement</div>
    <div class="s10-line">and that continued use of this website constitutes agreement to this and any future version of these terms</div>
    <div class="s10-line">with no obligation on our part to inform you, ever, of anything, including but not limited to this sentence</div>
  </div>
  <div id="s10-stamp">WITHOUT APPEAL</div>
"""
S10_TL = """
  tl.from("#s10-wall", { scale: 0.96, opacity: 0, duration: 1.0, ease: "power3.out" }, 0.3);
  tl.from(".s10-line", { opacity: 0, x: -40, duration: 0.8, ease: "power2.out", stagger: 0.18 }, 0.7);
  tl.from("#s10-stamp", { scale: 2.2, opacity: 0, duration: 0.7, ease: "power3.out" }, 3.2);
"""

# ---------------------------------------------------------------- scene 11 (wordmark)
S11_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s11-seal {
    position: absolute; left: 50%; top: 34%; transform: translate(-50%, -50%);
    width: 120px; height: 120px; border: 3px double #14d492; border-radius: 50%;
    background: radial-gradient(circle at 38% 34%, rgba(61,224,168,0.3), rgba(20,212,146,0.05) 68%);
    box-shadow: 0 0 60px rgba(20,212,146,0.28);
  }
  #s11-seal::after {
    content: "S"; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 66px; font-weight: 700; color: #9ff5d0;
  }
  #s11-name {
    position: absolute; left: 50%; top: 52%; transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 148px; font-weight: 700; color: #ffffff;
    letter-spacing: 0.01em; white-space: nowrap;
  }
  #s11-sub {
    position: absolute; left: 50%; top: 66%; transform: translateX(-50%);
    font-family: 'DM Mono', monospace; font-size: 34px; letter-spacing: 0.4em; color: #14d492;
    text-transform: uppercase;
  }
"""
S11_BODY = """
  <div id="s11-seal"></div>
  <div id="s11-name">SherpaCarta</div>
  <div id="s11-sub">Digital Magna Carta</div>
"""
S11_TL = """
  tl.from("#s11-seal", { scale: 0, opacity: 0, duration: 1.1, ease: "back.out(1.8)" }, 0.5);
  tl.from("#s11-name", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out" }, 0.9);
  tl.from("#s11-sub", { opacity: 0, y: 18, duration: 1.2, ease: "power2.out" }, 1.7);
"""

# ---------------------------------------------------------------- scene 12 (114)
S12_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s12-number {
    position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 260px; font-weight: 700; color: #9ff5d0;
    font-variant-numeric: tabular-nums;
  }
  #s12-label {
    position: absolute; left: 50%; top: 63%; transform: translateX(-50%);
    font-family: 'Outfit', sans-serif; font-size: 40px; font-weight: 400; color: #ffffff;
  }
  #s12-sub {
    position: absolute; left: 50%; top: 70%; transform: translateX(-50%);
    font-family: 'DM Mono', monospace; font-size: 26px; letter-spacing: 0.22em; color: #e8c040;
    text-transform: uppercase;
  }
"""
S12_BODY = """
  <div id="s12-number">0</div>
  <div id="s12-label">articles · a living charter</div>
  <div id="s12-sub">of digital human rights</div>
"""
S12_TL = """
  tl.from("#s12-number", { opacity: 0, scale: 1.12, duration: 0.8, ease: "power3.out" }, 0.4);
  const counter = { v: 0 };
  tl.to(counter, {
    v: 114,
    duration: 2.4,
    ease: "power2.inOut",
    onUpdate: () => {
      document.getElementById("s12-number").textContent = String(Math.round(counter.v));
    },
  }, 0.8);
  tl.from("#s12-label", { opacity: 0, y: 22, duration: 0.8, ease: "power2.out" }, 2.2);
  tl.from("#s12-sub", { opacity: 0, y: 16, duration: 0.8, ease: "power2.out" }, 2.7);
"""
