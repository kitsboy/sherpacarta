# SherpaCarta — 2‑Minute Video · Hermes + HyperFrames Package

**Status:** READY FOR KIMI (THOR / Hermes)  
**Date:** 2026-08-11  
**Author:** Grok (M3) · Cam approved direction  
**Product:** https://sherpacarta.org  
**Owner handoff:** `docs/KIMI-HANDOFF.md` (top section)

---

## What Kimi should do

Build and render a **~120 second, 16:9** educational film using the **Hermes HyperFrames skill** (HTML/CSS/GSAP → MP4).

| Priority | Action |
|----------|--------|
| **1** | Install/enable HyperFrames skill if needed; run `npx hyperframes doctor` |
| **2** | Create project + `DESIGN.md` from brand tokens below |
| **3** | Implement multi-scene composition from the **scene table + full VO** |
| **4** | TTS + captions (optional but preferred) |
| **5** | `lint` → `validate` (contrast) → `inspect` → `preview` → draft → high render |
| **6** | Hand back: `final.mp4` path + any notes; **no secrets** in repo |

**Do not:** invent user counts, country signup totals, or “127 countries signed.”  
**Do not:** make the film Canada-first — **international first**, Canada = live national offering only.

---

## Stack

| Layer | Tool |
|-------|------|
| **Spine (type, timeline, UI cards, CTAs, captions)** | **HyperFrames** in Hermes |
| **Optional B‑roll atmosphere** | Grok Imagine stills → 6s clips, or stock |
| **Product truth** | Real screenshots / short captures of sherpacarta.org |
| **Assemble/render** | `npx hyperframes render` (+ FFmpeg under the hood) |

HyperFrames skill path (this machine family):

```text
~/.hermes/hermes-agent/optional-skills/creative/hyperframes/SKILL.md
```

Docs: Hermes user guide → optional skill **creative/hyperframes**.

---

## One-time setup (THOR / Hermes host)

```bash
# Install skill if missing
hermes skills install official/creative/hyperframes

# Skill setup (Node ≥ 22, ffmpeg, chrome-headless-shell)
bash "$(dirname "$(find ~/.hermes -path '*/hyperframes/SKILL.md' 2>/dev/null | head -1)")/scripts/setup.sh"

npx hyperframes doctor
```

---

## Scaffold

```bash
npx hyperframes init sherpacarta-2min --non-interactive
cd sherpacarta-2min
# optional seed:
# npx hyperframes init sherpacarta-2min --example kinetic-type --non-interactive
```

---

## DESIGN.md (required before any HTML)

Create at project root. Use **exactly** these tokens:

```markdown
# DESIGN.md — SherpaCarta 2min

## Style Prompt
Cinematic constitutional documentary. Calm power. Dark forest night stage,
emerald light, gold seals. International civic movement — not SaaS, not crypto-bro.

## Colors
| Role | Hex |
|------|-----|
| Background | #030605 |
| Surface | #0a1f16 |
| Border | #2a6b4f |
| Emerald | #14d492 |
| Emerald bright | #3de0a8 / #9ff5d0 |
| Gold | #e8c040 / #f5d76a |
| Text | #ffffff |
| Text secondary | #e8f0e8 |

## Typography
- Titles: serif display (Cormorant / Georgia stack)
- Labels / captions: mono (DM Mono / system mono)
- Body: clean sans (Outfit / system-ui)

## Motion
- Slow pushes, soft fades, staggered type entrances
- One clear motion per beat
- Finite GSAP repeats only (no infinite loops)

## What NOT to Do
- No fake metrics or “millions of users”
- No Canada-only framing for the whole film
- No claiming Parliamentary e-petition = campaign totals
- No claiming Bitcoin confirmed until status is confirmed
- No default blue SaaS palette / Roboto-only generic look
- No busy multi-action character animation as hero
```

---

## Narrative thesis

> For 800 years, rights documents limited kings. SherpaCarta limits algorithms, platforms, and data brokers — a living digital Magna Carta for every person on Earth.

**Runtime:** ~2:00  
**Tone:** Constitutional · urgent · global · calm power  

---

## Full voiceover script (~280 words · speak as-is)

### [0:00–0:18] Cold open
In 1215, a piece of parchment told a king he was not above the law.  
Eight centuries later, the powers that shape your life rarely wear a crown.  
They run on servers. They score you. They decide — silently — who is seen, who is denied, who is forgotten.

### [0:18–0:42] The inheritance
The Magna Carta planted an idea that outlived empires: power must answer to rights.  
The Universal Declaration of Human Rights carried that promise to every nation.  
In 2011, Iceland proved people can write their own founding text.  
Now the battlefield is digital — and the old documents never named the new kings.

### [0:42–1:08] The problem
Surveillance capitalism. Black-box algorithms. Platforms that write the rules of speech and identity.  
Consent buried in fine print. Data sold as if it never belonged to you.  
These systems cross borders faster than laws.  
And no one asked humanity to sign the terms.

### [1:08–1:38] The charter
SherpaCarta is a living charter of digital human rights — one hundred fourteen articles.  
Privacy as a birthright. Data sovereignty. Freedom of expression online.  
Algorithmic accountability. Rights that may only expand — never contract.  
Published under CC0. Bitcoin-funded. Zero tracking. Built in the open.  
Not a corporation. A global civic movement.

### [1:38–1:52] How it works
You can read it. Sign it locally — no account required.  
Stamp its hash on Bitcoin. Debate it on Nostr.  
Around the world, jurisdictions will translate it into law in their own way.  
Canada is a live national offering today. The United Kingdom and European Union paths are next.  
One charter. Many legal roads.

### [1:52–2:00] Close
The rights we fail to assert today become the tyrannies our children inherit tomorrow.  
SherpaCarta.org  
Sign. Share. Stamp. Assert.

---

## Scene table (HyperFrames compositions)

| # | Time | Scene ID | Visual (HTML / media) | On-screen text | VO |
|---|------|----------|----------------------|----------------|-----|
| 1 | 0:00–0:06 | `cold-parchment` | Dark plate + parchment texture CSS/SVG | — | Cold open start |
| 2 | 0:06–0:12 | `cold-phone` | Abstract phone / score glow (no real brands) | — | … |
| 3 | 0:12–0:18 | `cold-servers` | Abstract server / data light | **1215 → 2026** | End cold open |
| 4 | 0:18–0:24 | `inherit-1215` | Timeline node gold | **1215 · Magna Carta** · Limits on kings | Inheritance |
| 5 | 0:24–0:30 | `inherit-1948` | Timeline node | **1948 · UDHR** · Rights of every person | … |
| 6 | 0:30–0:36 | `inherit-2011` | Timeline node | **2011 · Iceland** · People write the text | … |
| 7 | 0:36–0:42 | `inherit-2026` | Timeline + seal | **2026 · SherpaCarta** · Digital age | … |
| 8 | 0:42–0:50 | `problem-profile` | Kinetic cards | **PROFILED** | Problem |
| 9 | 0:50–0:58 | `problem-predict` | Kinetic cards | **PREDICTED** | … |
| 10 | 0:58–1:08 | `problem-tos` | Wall of micro-terms (fake) | **WITHOUT APPEAL** | … |
| 11 | 1:08–1:16 | `charter-wordmark` | Logo + title | **SherpaCarta** · Digital Magna Carta | Charter |
| 12 | 1:16–1:24 | `charter-114` | Big number card | **114 articles** · living charter | … |
| 13 | 1:24–1:32 | `charter-pillars` | Four pillars | Privacy · Access · Expression · Data | … |
| 14 | 1:32–1:38 | `charter-trust` | Badge row | **CC0 · Zero tracking · Bitcoin-funded · Open source** | … |
| 15 | 1:38–1:42 | `how-sign` | Sign UI still or HTML mock | **Sign · no account** | How it works |
| 16 | 1:42–1:46 | `how-stamp` | Stamp / hash still | **Stamp on Bitcoin** | … |
| 17 | 1:46–1:52 | `how-world` | World tracks / map | **One charter · many legal paths** · Canada live offering · UK/EU next | … |
| 18 | 1:52–1:56 | `close-quote` | Quote plate | Rights we fail to assert… | Close |
| 19 | 1:56–2:00 | `close-cta` | End card | **sherpacarta.org** · Sign · Share · Stamp · Assert | End |

Use **transitions** between scenes (`npx hyperframes add` for shaders if desired). Prefer soft crossfade / flash-through-white sparingly.

---

## Product screenshots to capture (M3 or Kimi)

From production site (hard-refresh):

| File suggestion | URL / view |
|-----------------|------------|
| `media/hero.png` | https://sherpacarta.org/ |
| `media/pillars.png` | `#pillars` |
| `media/jurisdictions.png` | `/jurisdictions` or home World tracks |
| `media/canada-offering.png` | `#canada-bc` / `#canada-offering` (one beat only) |
| `media/sign.png` | `#sign` |
| `media/map-demo.png` | Adoption heatmap (already labelled DEMO) |

Optional Imagine B‑roll (not required for v1): parchment, servers, abstract seal — place under `media/`.

---

## Hermes prompt (paste to start work)

```text
Activate hyperframes skill.

Project: SherpaCarta 2-minute education film.
Read and follow: sherpacarta repo docs/VIDEO-HERMES-HYPERFRAMES.md (this file).

Duration: 120s, 16:9, 30fps.
Mood: cinematic constitutional documentary, calm power.

Brand: DESIGN.md tokens in that doc (dark forest, emerald, gold).
International-first. Canada only as "live national offering" late (~1:46–1:52).

Use the FULL voiceover script from VIDEO-HERMES-HYPERFRAMES.md.
Scene table in that doc is the composition list.

Rules:
- No fake metrics / no "millions of users" / no false country counts
- DESIGN.md first — never generic blue SaaS
- lint + validate (contrast) + inspect before high render
- TTS + captions preferred
- draft.mp4 then final.mp4 high quality

Hand back: path to final.mp4 + render notes.
```

---

## CLI checklist

```bash
cd sherpacarta-2min
npx hyperframes lint
npx hyperframes validate
npx hyperframes inspect
npx hyperframes preview
npx hyperframes render --quality draft --output draft.mp4
npx hyperframes render --quality high --fps 30 --output final.mp4
```

TTS example:

```bash
npx hyperframes tts "$(cat vo-full.txt)" --voice af_nova --output narration.wav
npx hyperframes transcribe narration.wav
```

---

## Truth rules (non-negotiable)

| Topic | Rule |
|-------|------|
| Metrics | Honest only; demo map ≠ live global signups |
| Canada campaign | Dual-track; not automatic Parliamentary e-petition counts |
| Stamps | pending ≠ Bitcoin confirmed |
| Product | Movement / civic charter — not a VC product |
| Framing | **International first**; Canada = live offering |

---

## Deliverables

1. `DESIGN.md`  
2. HyperFrames composition project  
3. `draft.mp4` + `final.mp4` (16:9)  
4. Optional: SRT captions, 9:16 crop note for social  
5. Short note in `docs/KIMI-HANDOFF.md` when done (path + status)

---

## Related site context (live product)

- Domain: https://sherpacarta.org  
- International-first home (BUILD 820+): World nav, pillars before Canada offering  
- Demo adoption heatmap: labelled DEMO · TEMP  
- Contact: hello@giveabit.io  
- Stamp family: `https://satohash.io/stamp?hash=&ref=sherpacarta`

---

## End-slate copy (exact)

**Line 1:** The rights we fail to assert today become the tyrannies our children inherit tomorrow.  
**Line 2:** sherpacarta.org  
**Line 3:** Sign · Share · Stamp · Assert  
**Small:** CC0 · A Give A Bit project · Not a corporation  

---

*Package ready for Kimi · 2026-08-11 · Grok M3*
