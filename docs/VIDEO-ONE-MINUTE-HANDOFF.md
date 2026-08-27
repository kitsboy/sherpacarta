# One-minute video handoff — SherpaCarta

**Status:** SCRIPT DEVELOPMENT / DEMO-SAFE planning
**Owner:** Kimi/Hermes production later
**Production:** Not rendered or approved
**Rule:** Any future metrics, names, endorsements, legal statements, or Bitcoin proof status must be replaced with current evidence before recording.

## Creative north star

A secular, nonpartisan, humane invitation to turn public anger into constructive civic focus. The Magna Carta is historical inspiration, not religious doctrine and not a claim that SherpaCarta is already law.

---

# Film 1 — “Write the Rights of the Digital Age”

**Runtime:** 60 seconds
**Audience:** general public, local leaders, educators, journalists
**Tone:** serious, hopeful, calm, historically grounded, never alarmist
**Format:** 16:9 master; later 9:16 and 1:1 adaptations
**CTA:** Read the charter; discuss one right; share responsibly

## Voiceover draft (~145 words)

**[0:00–0:07]**
Every generation inherits a new kind of power — and must decide what limits it.

**[0:07–0:16]**
The Magna Carta helped make one idea unforgettable: no ruler should stand above the law. The Universal Declaration carried that idea across borders.

**[0:16–0:25]**
Today, power also lives in platforms, databases, and algorithms — systems that can shape what we see, what we can access, and how we are judged.

**[0:25–0:37]**
SherpaCarta is a public, living charter for the digital age: principles for privacy, control of personal data, free expression, access, explanation, appeal, and human dignity.

**[0:37–0:47]**
It is secular, nonpartisan, and open to challenge. It is not current law. It is a place to begin a peaceful, serious conversation about the law we may need next.

**[0:47–0:55]**
Read it. Question it. Translate it. Discuss it with your community. Help turn shared principles into responsible public action.

**[0:55–1:00]**
SherpaCarta.org. Digital rights are human rights.

## Visual plan

1. Dark, human-centered opening: faces, hands, public spaces; no panic imagery.
2. Historical parchment/stone texture with “Limits on power.”
3. Transition to modern interfaces, server light, and algorithmic abstractions; avoid real-company accusations.
4. Four-to-six right cards: privacy, data control, expression, access, explanation, appeal.
5. Secular global civic table: different people reading the same document.
6. End card: `READ · QUESTION · DISCUSS · BUILD` and the canonical URL.

## On-screen truth labels

- `DEMO DATA` for any illustrative person, map, quote, or scene.
- `PUBLIC CHARTER · NOT CURRENT LAW` on the charter reveal.
- `TIMESTAMP EVIDENCE ≠ LEGAL VALIDITY` if proof imagery appears.

## Do not use

- Religious symbolism or conversion language.
- “The people have spoken” unless supported by defined evidence.
- Unverified signer/country/endorsement counts.
- “Official,” “binding,” or “government adopted” without external evidence.
- Real people’s likenesses, quotes, or endorsements without permission.

---

# Film 2 — “What a Bitcoin Timestamp Proves”

**Runtime:** 60 seconds
**Audience:** technical reviewers, journalists, lawyers, educators
**Tone:** precise, visual, accessible, transparent
**Format:** 16:9 master; captions required; later vertical cut
**CTA:** Verify the source, hash, proof ID, and status yourself

## Voiceover draft (~150 words)

**[0:00–0:06]**
How can anyone know which version of a public document existed first?

**[0:06–0:15]**
Start with the exact file or text. Even one changed character produces a different SHA-256 fingerprint.

**[0:15–0:24]**
That fingerprint is not the document itself. It is a compact identifier for that exact representation.

**[0:24–0:34]**
Submit the fingerprint through Satohash.io. Satohash can use OpenTimestamps to anchor timestamp evidence through Bitcoin’s public network.

**[0:34–0:43]**
The first result may be pending. Pending is not confirmed. The interface must show the difference plainly.

**[0:43–0:51]**
Anyone can recalculate the SHA-256 fingerprint, open the public proof, compare the hash, and inspect the reported status.

**[0:51–0:57]**
This can support evidence of when a specific fingerprint existed. It does not prove the text is true, legal, authored by a particular person, or approved by a government.

**[0:57–1:00]**
Verify the source. Verify the hash. Verify the status.

## Visual plan

1. Exact text/file enters a browser-local hashing frame.
2. Character change splits into two visibly different SHA-256 strings.
3. Satohash.io stamp route shown with canonical family link:
   `https://satohash.io/stamp?hash=&ref=sherpacarta`
4. OpenTimestamps/Bitcoin anchoring shown as a neutral technical diagram.
5. Status state cards: `PENDING`, then conditional `CONFIRMED` only when reported by the proof service.
6. Independent verifier recalculates and compares.
7. Final boundary card:
   `INTEGRITY + TIME EVIDENCE` ≠ `TRUTH + IDENTITY + LEGAL APPROVAL`

## Technical production requirements

- Use a real release hash only after release lock.
- Never show a fabricated transaction ID or confirmation.
- If using demo input, show `DEMO DATA` continuously.
- Capture Satohash UI only with permission and current status.
- Preserve captions and transcript.
- Add audio description or descriptive captions for key diagrams.
- Link the final video to `/verify.html`, the release manifest, and the external-gates record.

---

## Shared end-card standards

- `SherpaCarta.org`
- `Give A Bit family`
- `CC0 where applicable`
- `Read · Question · Discuss · Verify`
- `Not legal advice`
- No unverified logos, endorsements, government marks, or testimonials.

## Production checklist

- [ ] Human editorial review
- [ ] Legal/truth-language review
- [ ] Accessibility/caption review
- [ ] Source/hash lock
- [ ] Demo disclosure audit
- [ ] Music/media rights cleared
- [ ] 16:9 master
- [ ] 9:16 adaptation
- [ ] Caption file
- [ ] Transcript
- [ ] Thumbnail with social metadata
- [ ] Final handoff with checksum and release ID
