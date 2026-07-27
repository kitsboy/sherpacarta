# Canada journey — how the two hub pages work

**Hub:** https://sherpacarta.org/canada/  
**Official path:** https://sherpacarta.org/canada/official  

## Promise (shared)

Canadians deserve digital privacy, data sovereignty, and algorithmic accountability.  
SherpaCarta is the reference charter. This campaign builds **public mandate** and aims for a **House of Commons e-petition (e-###)** when an MP sponsors it.

## Three tracks (honest)

| Track | Page | Effect |
|-------|------|--------|
| **A · Campaign** | `/canada/sign` | Movement mandate. **Not** Parliamentary count. |
| **B · Federal paper** | `/canada/paper` | Legal paper petition; MP can present ink. |
| **C · Official e-petition** | `/canada/official` | Only after MP + e-### on ourcommons.ca. |

Never claim campaign totals are e-petition signatures.

## Hub page (`/canada/`)

- Why participate (privacy, algorithms, MP leverage)
- Live stats + province map
- Journey steps 1→2→3
- CTAs: sign, official path, share, discuss, briefing

## Official page (`/canada/official`)

- Status pill (seeking MP vs live e-###)
- Stages of Parliament process
- Federal prayer copy
- Organizer checklist (localStorage)
- MP finder + outreach email
- Press one-liner
- Parallel CTAs while waiting

## When e-### goes live

1. Update `data/campaign-canada.json` → `officialChannels.federal.status: "live"`, `ePetitionId`, `url`
2. Redeploy / regenerate campaign JSON to public
3. Both pages auto-switch CTA to Parliament’s site

## Related

- `docs/CANADA-PETITION-LEGAL.md`
- `docs/CANADA-BC-CHALLENGE.md`
- Briefing: `/briefing.html` · Leave-behind: `/leave-behind.html`
