# Canada Petition — Legal Model & Friction Guide

**Version:** 2.0 · **2026-07-09** · Dual-track architecture  
**Official sources:** [House of Commons e-petitions guide](https://www.ourcommons.ca/petitions/en/Home/AboutContent?guide=PIElectronicGuide) · [BC petitions](http://leg.bc.ca/parliamentary-business/parliamentary-procedure/petitions)

---

## Two tracks (never blur these)

| Track | What it is | Counts in Parliament / Legislature? | Where |
|-------|------------|-------------------------------------|-------|
| **A · Campaign** | Civic commitment + crypto proof | **No** | sherpacarta.org + optional Worker + Nostr |
| **B · Official** | Parliamentary / Assembly petition | **Yes** | ourcommons.ca **or** original paper sheets presented by MP/MLA |

Campaign signatures build movement, media, and merkle/Bitcoin proof.  
Official signatures trigger presentation and (federal) a government response duty.

---

## Federal e-petition — least friction that is still legal

| Question | Answer |
|----------|--------|
| Age 18+? | **No minimum age** |
| Government ID? | **Not required** |
| Who can sign? | Canadian **citizen or resident** (citizens abroad OK; non-citizens living in Canada OK) |
| What you give Parliament | Name, email, province + postal code (or country if abroad), phone |
| Extra step | **Click confirm link** in email from `no-reply@petitions.parl.gc.ca` |
| Where you sign | **Only** on Parliament’s website after e-### is published |
| Threshold | **500** validated e-signatures (paper path: **25**) |
| Who must help you | **5–10 supporters** + **one MP** to authorize publication + Clerk certification |
| Prayer limit | **≤ 250 words**, federal jurisdiction, no URLs, respectful language |

**SherpaCarta cannot host “official” e-signatures.** We deep-link to the live e-### when Cam has an MP.

---

## Federal paper petition — legal path you can start today

- Original wet signatures under the prayer text  
- Name + address (city/province is enough if residence is clear)  
- Prayer on **every** sheet  
- Min **25** for certification  
- Any age; citizen or resident  
- MP presents to the House  

PDF / print sheets: `/canada/paper.html` — **one federal Commons sheet** for all Canada.  
A signer in BC, ON, QC, etc. is already a **federal** signature (city + province column).  
We do **not** need 13 provincial paper forms for the Commons path.  
BC remains a *campaign beachhead* (organizing, model law talk), not a separate federal paper instrument.  
QR on sheets opens `/canada/join?from=paper` (campaign + education). **Scanning does not replace a wet signature** for presentation.

---

## BC Legislative Assembly

- **Paper only** (no pure online for presentation)  
- Original ink; no photocopies for the official instrument  
- Name, address, signature under text  
- No minimum age  
- MLA presents  

---

## Campaign methods (Track A) — what they mean

| Method | Friction | Server PII | Legal Parliament? |
|--------|----------|------------|-------------------|
| Moral (name + province + attestation) | Lowest | Receipt hash + province only (Worker) | No |
| Passkey | Low–medium | Receipt hash | No |
| Nostr | Medium (extension) | Optional event id | No |
| Ed25519 anonymous key | Low | Receipt hash | No |
| Paper batch (organizer) | Medium | Counts / optional | Paper can be Track B if form is correct |

---

## Cam checklist — make official e-petition live

1. [ ] Approve federal prayer text (≤250 words) in `data/campaign-canada.json` → `prayers.federalOfficial`  
2. [ ] Optional: email draft to Clerk pre-check `PMB-AED@parl.gc.ca`  
3. [ ] Create account on [petitions.ourcommons.ca](https://petitions.ourcommons.ca/)  
4. [ ] Add 5 supporter emails (not yourself)  
5. [ ] Invite an MP to authorize (30 days to respond; up to 5 attempts)  
6. [ ] When published, set `officialChannels.federal.ePetitionId` + `url` in campaign JSON  
7. [ ] Redeploy — site flips primary “Official” CTA  

---

## Product rules (non-negotiable)

1. Never label a campaign button as “sign the Parliamentary petition” unless it opens the live e-### URL.  
2. Never invent signature totals.  
3. Never collect phone/email for “we’ll submit to Parliament for you.”  
4. Always show: **Campaign commitment** vs **Official e-petition** vs **Paper**.  
5. Attestation checkbox: *“I am a Canadian citizen or resident of Canada.”*

---

*Safe Harbour · Give A Bit family · Not legal advice — verify with Clerk of Petitions / MLA office for formal submissions.*
