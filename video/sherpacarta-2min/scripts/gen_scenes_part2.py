#!/usr/bin/env python3
"""Part 2 — scenes 13-19 + writer. Imports part 1 definitions."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_scenes_part1 import (  # noqa: E402
    SCENES_DIR, scene_html, BASE_CSS, S01_CSS, S01_BODY, S01_TL,
    S02_CSS, S02_BODY, S02_TL, S03_CSS, S03_BODY, S03_TL,
    S04_CSS, S04_BODY, S04_TL, S05_CSS, S05_BODY, S05_TL,
    S06_CSS, S06_BODY, S06_TL, S07_CSS, S07_BODY, S07_TL,
    S08_CSS, S08_BODY, S08_TL, S09_CSS, S09_BODY, S09_TL,
    S10_CSS, S10_BODY, S10_TL, S11_CSS, S11_BODY, S11_TL,
    S12_CSS, S12_BODY, S12_TL,
)

# ---------------------------------------------------------------- scene 13 (pillars)
S13_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s13-head {
    position: absolute; left: 50%; top: 150px; transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 64px; font-weight: 600; color: #ffffff;
  }
  #s13-row {
    position: absolute; left: 50%; top: 53%; transform: translate(-50%, -50%);
    display: flex; gap: 30px;
  }
  .s13-pillar {
    width: 340px; padding: 44px 30px; text-align: center;
    background: #0a1f16; border: 1px solid rgba(42,107,79,0.7); border-radius: 12px;
  }
  .s13-icon {
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 54px; font-weight: 700;
    color: #14d492; margin-bottom: 20px;
  }
  .s13-name {
    font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 500; color: #ffffff; margin-bottom: 10px;
  }
  .s13-note {
    font-family: 'DM Mono', monospace; font-size: 18px; letter-spacing: 0.1em; color: #9ff5d0; text-transform: uppercase;
  }
"""
S13_BODY = """
  <div id="s13-head">Four Pillars</div>
  <div id="s13-row">
    <div class="s13-pillar"><div class="s13-icon">&#128274;</div><div class="s13-name">Privacy</div><div class="s13-note">a birthright</div></div>
    <div class="s13-pillar"><div class="s13-icon">&#128736;</div><div class="s13-name">Data Sovereignty</div><div class="s13-note">yours, not theirs</div></div>
    <div class="s13-pillar"><div class="s13-icon">&#128172;</div><div class="s13-name">Expression</div><div class="s13-note">free online</div></div>
    <div class="s13-pillar"><div class="s13-icon">&#9878;</div><div class="s13-name">Accountability</div><div class="s13-note">algorithms answer</div></div>
  </div>
"""
S13_TL = """
  tl.from("#s13-head", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out" }, 0.35);
  tl.from(".s13-pillar", { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.14 }, 0.7);
"""

# ---------------------------------------------------------------- scene 14 (trust badges)
S14_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s14-head {
    position: absolute; left: 50%; top: 190px; transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 60px; font-weight: 600; color: #ffffff;
  }
  #s14-row {
    position: absolute; left: 50%; top: 52%; transform: translate(-50%, -50%);
    display: flex; gap: 26px; flex-wrap: wrap; justify-content: center; width: 1500px;
  }
  .s14-badge {
    font-family: 'DM Mono', monospace; font-size: 28px; letter-spacing: 0.08em;
    color: #e8f0e8; border: 1px solid rgba(232,192,64,0.55); border-radius: 40px;
    padding: 22px 42px; background: rgba(10,31,22,0.7);
  }
  .s14-badge.gold { color: #f5d76a; border-color: #e8c040; }
"""
S14_BODY = """
  <div id="s14-head">Built Different</div>
  <div id="s14-row">
    <div class="s14-badge gold">CC0</div>
    <div class="s14-badge">ZERO TRACKING</div>
    <div class="s14-badge">BITCOIN-FUNDED</div>
    <div class="s14-badge">OPEN SOURCE</div>
  </div>
"""
S14_TL = """
  tl.from("#s14-head", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out" }, 0.35);
  tl.from(".s14-badge", { scale: 0.8, opacity: 0, duration: 0.7, ease: "back.out(1.7)", stagger: 0.14 }, 0.8);
"""

# ---------------------------------------------------------------- scene 15 (sign)
S15_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s15-card {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 780px; padding: 56px 64px; text-align: center;
    background: #0a1f16; border: 1px solid rgba(42,107,79,0.7); border-radius: 16px;
    box-shadow: 0 30px 100px rgba(0,0,0,0.6);
  }
  #s15-title {
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 72px; font-weight: 700; color: #ffffff; margin-bottom: 12px;
  }
  #s15-sub {
    font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 300; color: #e8f0e8; margin-bottom: 36px;
  }
  #s15-btn {
    display: inline-block; font-family: 'DM Mono', monospace; font-size: 26px; letter-spacing: 0.14em;
    color: #030605; background: #14d492; border-radius: 8px; padding: 22px 54px;
    box-shadow: 0 0 40px rgba(20,212,146,0.35);
  }
"""
S15_BODY = """
  <div id="s15-card">
    <div id="s15-title">Read it. Sign it.</div>
    <div id="s15-sub">No account. No tracking. Locally, on your own device.</div>
    <div id="s15-btn">SIGN&nbsp;&#9998;</div>
  </div>
"""
S15_TL = """
  tl.from("#s15-card", { scale: 0.9, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.3);
  tl.from("#s15-title", { opacity: 0, y: 24, duration: 0.6, ease: "power2.out" }, 0.7);
  tl.from("#s15-sub", { opacity: 0, y: 18, duration: 0.6, ease: "power2.out" }, 1.0);
  tl.from("#s15-btn", { scale: 0.85, opacity: 0, duration: 0.5, ease: "back.out(1.8)" }, 1.4);
"""

# ---------------------------------------------------------------- scene 16 (stamp)
S16_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s16-card {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 860px; padding: 52px 60px; text-align: center;
    background: #0a1f16; border: 1px solid rgba(42,107,79,0.7); border-radius: 16px;
  }
  #s16-title {
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 62px; font-weight: 700; color: #ffffff; margin-bottom: 10px;
  }
  #s16-sub {
    font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 300; color: #e8f0e8; margin-bottom: 30px;
  }
  #s16-hash {
    font-family: 'DM Mono', monospace; font-size: 22px; color: #14d492; letter-spacing: 0.06em;
    border: 1px dashed rgba(61,224,168,0.6); border-radius: 10px; padding: 20px 30px; margin: 0 auto;
    display: inline-block; background: rgba(3,6,5,0.6);
  }
  #s16-badge {
    display: inline-block; margin-top: 26px; font-family: 'DM Mono', monospace; font-size: 20px;
    letter-spacing: 0.16em; color: #f5d76a; border: 1px solid #e8c040; border-radius: 30px; padding: 12px 28px;
  }
"""
S16_BODY = """
  <div id="s16-card">
    <div id="s16-title">Stamp its hash on Bitcoin</div>
    <div id="s16-sub">Your signature, anchored forever, verifiable by anyone</div>
    <div id="s16-hash">9da88734&nbsp;…&nbsp;5c2f&nbsp;·&nbsp;SHA-256</div>
    <div id="s16-badge">PENDING&nbsp;&#9679;&nbsp;VERIFY ON CHAIN</div>
  </div>
"""
S16_TL = """
  tl.from("#s16-card", { scale: 0.9, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.3);
  tl.from("#s16-title", { opacity: 0, y: 22, duration: 0.6, ease: "power2.out" }, 0.7);
  tl.from("#s16-hash", { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" }, 1.1);
  tl.from("#s16-badge", { opacity: 0, scale: 0.9, duration: 0.5, ease: "power2.out" }, 1.5);
"""

# ---------------------------------------------------------------- scene 17 (world)
S17_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s17-globe {
    position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%);
    width: 420px; height: 420px; border-radius: 50%;
    border: 2px solid rgba(42,107,79,0.8);
    background:
      radial-gradient(circle at 50% 50%, rgba(20,212,146,0.06), transparent 60%),
      repeating-radial-gradient(circle at 50% 50%, transparent 0 62px, rgba(42,107,79,0.35) 62px 64px);
    box-shadow: 0 0 90px rgba(20,212,146,0.12);
  }
  #s17-globe::before, #s17-globe::after {
    content: ""; position: absolute; background: rgba(42,107,79,0.35); border-radius: 50%;
  }
  #s17-globe::before { left: -24px; right: -24px; top: 50%; height: 2px; transform: translateY(-50%); }
  #s17-globe::after { top: -24px; bottom: -24px; left: 50%; width: 2px; transform: translateX(-50%); }
  #s17-dot-ca, #s17-dot-uk, #s17-dot-eu {
    position: absolute; width: 16px; height: 16px; border-radius: 50%;
    box-shadow: 0 0 22px currentColor;
  }
  #s17-dot-ca { left: 50%; top: 50%; transform: translate(-164px, -98px); background: #14d492; color: #14d492; }
  #s17-dot-uk { left: 50%; top: 50%; transform: translate(104px, -116px); background: #e8c040; color: #e8c040; }
  #s17-dot-eu { left: 50%; top: 50%; transform: translate(122px, -60px); background: #3de0a8; color: #3de0a8; }
  #s17-title {
    position: absolute; left: 50%; top: 66%; transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 54px; font-weight: 600; color: #ffffff;
    white-space: nowrap;
  }
  #s17-sub {
    position: absolute; left: 50%; top: 74%; transform: translateX(-50%);
    font-family: 'DM Mono', monospace; font-size: 24px; letter-spacing: 0.14em; color: #9ff5d0;
  }
  #s17-legend {
    position: absolute; left: 50%; top: 82%; transform: translateX(-50%);
    font-family: 'DM Mono', monospace; font-size: 20px; color: #e8f0e8; letter-spacing: 0.08em;
  }
"""
S17_BODY = """
  <div id="s17-globe">
    <div id="s17-dot-ca"></div><div id="s17-dot-uk"></div><div id="s17-dot-eu"></div>
  </div>
  <div id="s17-title">One charter. Many legal roads.</div>
  <div id="s17-sub">CANADA&nbsp;·&nbsp;LIVE&nbsp;&nbsp;|&nbsp;&nbsp;UK&nbsp;&middot;&nbsp;NEXT&nbsp;&nbsp;|&nbsp;&nbsp;EU&nbsp;&middot;&nbsp;NEXT</div>
  <div id="s17-legend">jurisdictions translate it into law, their own way</div>
"""
S17_TL = """
  tl.from("#s17-globe", { scale: 0.7, opacity: 0, duration: 1.0, ease: "power3.out" }, 0.3);
  tl.from("#s17-dot-ca", { scale: 0, duration: 0.5, ease: "back.out(2.4)" }, 1.2);
  tl.from("#s17-dot-uk", { scale: 0, duration: 0.5, ease: "back.out(2.4)" }, 1.6);
  tl.from("#s17-dot-eu", { scale: 0, duration: 0.5, ease: "back.out(2.4)" }, 2.0);
  tl.from("#s17-title", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, 2.3);
  tl.from("#s17-sub", { opacity: 0, y: 14, duration: 0.7, ease: "power2.out" }, 2.8);
  tl.from("#s17-legend", { opacity: 0, duration: 0.7, ease: "power2.out" }, 3.2);
"""

# ---------------------------------------------------------------- scene 18 (quote)
S18_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s18-wrap {
    position: absolute; left: 0; right: 0; top: 0; bottom: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  #s18-quote {
    width: 1400px; text-align: center;
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 60px; font-weight: 600;
    color: #ffffff; line-height: 1.28;
  }
  #s18-mark {
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 170px; color: #e8c040;
    line-height: 0.5; opacity: 0.55; margin-bottom: 8px;
  }
"""
S18_BODY = """
  <div id="s18-wrap">
    <div id="s18-mark">&ldquo;</div>
    <div id="s18-quote">The rights we fail to assert today become the tyrannies our children inherit tomorrow.</div>
  </div>
"""
S18_TL = """
  tl.from("#s18-mark", { opacity: 0, scale: 0.6, duration: 0.7, ease: "power3.out" }, 0.25);
  tl.from("#s18-quote", { opacity: 0, y: 26, duration: 0.9, ease: "power2.out" }, 0.6);
"""

# ---------------------------------------------------------------- scene 19 (CTA)
S19_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #030605; }
  #s19-domain {
    position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 118px; font-weight: 700; color: #ffffff;
    white-space: nowrap;
  }
  #s19-domain .org { color: #14d492; }
  #s19-cta {
    position: absolute; left: 50%; top: 57%; transform: translateX(-50%);
    font-family: 'DM Mono', monospace; font-size: 34px; letter-spacing: 0.24em; color: #f5d76a;
    white-space: nowrap;
  }
  #s19-small {
    position: absolute; left: 50%; top: 68%; transform: translateX(-50%);
    font-family: 'DM Mono', monospace; font-size: 20px; letter-spacing: 0.12em; color: rgba(232,240,232,0.6);
  }
  #s19-seal {
    position: absolute; left: 50%; top: 28%; transform: translate(-50%, -50%);
    width: 88px; height: 88px; border: 2px double #14d492; border-radius: 50%;
    background: radial-gradient(circle at 38% 34%, rgba(61,224,168,0.3), rgba(20,212,146,0.05) 68%);
  }
"""
S19_BODY = """
  <div id="s19-seal"></div>
  <div id="s19-domain">sherpacarta<span class="org">.org</span></div>
  <div id="s19-cta">SIGN&nbsp;&middot;&nbsp;SHARE&nbsp;&middot;&nbsp;STAMP&nbsp;&middot;&nbsp;ASSERT</div>
  <div id="s19-small">CC0&nbsp;&middot;&nbsp;A GIVE A BIT PROJECT&nbsp;&middot;&nbsp;NOT A CORPORATION</div>
"""
S19_TL = """
  tl.from("#s19-seal", { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.8)" }, 0.3);
  tl.from("#s19-domain", { opacity: 0, y: 34, duration: 0.9, ease: "power3.out" }, 0.6);
  tl.from("#s19-cta", { opacity: 0, y: 18, duration: 0.9, ease: "power2.out" }, 1.3);
  tl.from("#s19-small", { opacity: 0, duration: 0.8, ease: "power2.out" }, 1.9);
  tl.to("#s19-domain", { opacity: 0, duration: 0.5, ease: "power2.in" }, dur - 0.6);
  tl.to("#s19-seal", { opacity: 0, duration: 0.5, ease: "power2.in" }, dur - 0.5);
  tl.to("#s19-cta", { opacity: 0, duration: 0.5, ease: "power2.in" }, dur - 0.5);
  tl.to("#s19-small", { opacity: 0, duration: 0.5, ease: "power2.in" }, dur - 0.5);
"""

# ---------------------------------------------------------------- scene table
SCENES = [
    ("scene-01", 6.0, S01_CSS, S01_BODY, S01_TL),
    ("scene-02", 6.0, S02_CSS, S02_BODY, S02_TL),
    ("scene-03", 6.0, S03_CSS, S03_BODY, S03_TL),
    ("scene-04", 6.0, S04_CSS, S04_BODY, S04_TL),
    ("scene-05", 6.0, S05_CSS, S05_BODY, S05_TL),
    ("scene-06", 6.0, S06_CSS, S06_BODY, S06_TL),
    ("scene-07", 6.0, S07_CSS, S07_BODY, S07_TL),
    ("scene-08", 8.0, S08_CSS, S08_BODY, S08_TL),
    ("scene-09", 8.0, S09_CSS, S09_BODY, S09_TL),
    ("scene-10", 10.0, S10_CSS, S10_BODY, S10_TL),
    ("scene-11", 8.0, S11_CSS, S11_BODY, S11_TL),
    ("scene-12", 8.0, S12_CSS, S12_BODY, S12_TL),
    ("scene-13", 8.0, S13_CSS, S13_BODY, S13_TL),
    ("scene-14", 6.0, S14_CSS, S14_BODY, S14_TL),
    ("scene-15", 4.0, S15_CSS, S15_BODY, S15_TL),
    ("scene-16", 4.0, S16_CSS, S16_BODY, S16_TL),
    ("scene-17", 6.0, S17_CSS, S17_BODY, S17_TL),
    ("scene-18", 4.0, S18_CSS, S18_BODY, S18_TL),
    ("scene-19", 4.0, S19_CSS, S19_BODY, S19_TL),
]

def main():
    os.makedirs(SCENES_DIR, exist_ok=True)
    total = 0.0
    for name, dur, css, body, tl in SCENES:
        total += dur
        html = scene_html(name, dur, body, css, tl)
        with open(os.path.join(SCENES_DIR, f"{name}.html"), "w") as f:
            f.write(html)
        print(f"wrote {name}.html ({dur}s)")
    print(f"TOTAL DURATION: {total}s")

if __name__ == "__main__":
    main()
