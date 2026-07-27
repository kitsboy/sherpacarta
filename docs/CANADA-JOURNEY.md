# Canada journey — hub + official path

**Hub:** https://sherpacarta.org/canada/  
**Official path:** https://sherpacarta.org/canada/official  
**Sign:** https://sherpacarta.org/canada/sign  
**Paper:** https://sherpacarta.org/canada/paper  

---

## Promise (shared)

Canadians deserve digital privacy, data sovereignty, and algorithmic accountability.  
**SherpaCarta** is the reference charter (114 articles; CC0).  
This campaign builds **public mandate** and aims for a **House of Commons e-petition (e-###)** when an MP sponsors it.

We never claim campaign totals are Parliamentary signatures.

---

## Three tracks (honest)

| Track | Page | Effect | When |
|-------|------|--------|------|
| **A · Campaign** | `/canada/sign` | Movement mandate. **Not** Parliamentary count. | Now |
| **B · Federal paper** | `/canada/paper` | Legal paper petition; MP can present ink. | Now |
| **C · Official e-petition** | `/canada/official` → ourcommons.ca | Only after MP + e-### on Parliament’s site. | When live |

Never blur A/B into “official e-petition signatures.”

---

## Fluid journey (user story)

1. **Show up** — Sign campaign (~30s), share #Sherpacarta / Nostr.  
2. **Make it solid** — Print federal sheet, collect wet signatures, organize locally.  
3. **Make it official** — MP authorizes e-###; 500+ validated signatures; government responds after presentation.

Hub = front door (why + tracks + stats).  
Official = Parliament path (status + tools + checklist).

---

## Hub page (`/canada/`)

Content pillars:

- **Promise** — honest dual-track; rights framing  
- **Stakes** — if we stay quiet vs if we show up  
- **Why three reasons** — privacy, algorithms, MP leverage  
- **Live stats** + province map + recent wall  
- **3-step flow** + **three track tiles**  
- **Bridge** to official path  
- **Roles** — citizen / organizer / press  
- **FAQ** — objections answered  
- **Sticky mobile CTAs** — Sign · Official path  
- Links: briefing, leave-behind, organizer, BC, town hall, jurisdictions, legal docs  

---

## Official page (`/canada/official`)

Content pillars:

- **Status pill** — seeking MP vs LIVE e-### (from `campaign-canada.json`)  
- **Win box** — what e-### success looks like (500, 45-day response)  
- **Roles** — constituent / organizer / amplifier  
- **Stages 1–4** with “you are here” markers  
- **Federal prayer** + copy + Clerk email + Commons guide  
- **Organizer checklist** (localStorage only)  
- **MP finder** + outreach email + mailto  
- **Press one-liner** + X / Nostr / press kit  
- **Rules** + FAQ  
- **Parallel CTAs** — do not wait for MP  
- Sticky: Sign · Email MP  

When `officialChannels.federal.status === "live"` and `ePetitionId` is set, primary CTA becomes Parliament’s URL.

---

## Why people should participate (copy spine)

| Audience | Hook | First action |
|----------|------|--------------|
| Anyone Canadian | Your data is not a product · 30 seconds | `/canada/sign` |
| Organizer | Paper + checklist + MP email ready | `/canada/paper` + `/canada/official` |
| Press / allies | Dual-track, honest counts, public mandate | Press line on official page |
| MP offices | Reference framework; authorize ≠ full endorsement | Briefing + leave-behind |

---

## When e-### goes live

1. Update `data/campaign-canada.json` (and public mirror):  
   - `officialChannels.federal.status: "live"`  
   - `ePetitionId`, `url`  
2. Redeploy / regenerate campaign JSON to `public/data/`  
3. Both pages auto-switch CTA to Parliament’s site  

Checklist last item: “Received e-### and updated campaign data.”

---

## Proof layer (not Parliament)

Campaign receipts and merkle roots can be stamped on Bitcoin via Satohash:

- Deep-link: `https://satohash.io/stamp?hash=<64hex>&ref=sherpacarta-canada`
- Contract: `docs/LEARN-STAMP-FAMILY.md`
- Stamp ≠ House of Commons signature

## Related docs & pages

| Resource | Path |
|----------|------|
| Legal model | `docs/CANADA-PETITION-LEGAL.md` |
| BC challenge | `docs/CANADA-BC-CHALLENGE.md` |
| Campaign data | `public/data/campaign-canada.json` |
| Stamp family contract | `docs/LEARN-STAMP-FAMILY.md` |
| Prep checklist | `docs/PREP-NOW.md` |
| MP briefing | `/briefing.html` |
| Leave-behind | `/leave-behind.html` |
| Press kit | `/press.html` |
| Discuss | `/nostr` · X `#Sherpacarta` / `@give_bit` |
| About | `/canada/about` |
| Organizer | `/canada/organizer` |
| Town hall kit | `/bc/town-hall-kit.html` |

---

## Product rules (non-negotiable)

1. Never label a campaign button as “sign the Parliamentary petition” unless it opens the live e-### URL.  
2. Never invent signature totals.  
3. Never collect phone/email for “we’ll submit to Parliament for you.”  
4. Always show: **Campaign** vs **Official e-petition** vs **Paper**.  
5. Attestation: *“I am a Canadian citizen or resident of Canada.”*

---

*Safe Harbour · Give A Bit family · Not legal advice.*
