# KIMI-HANDOFF-sherpacarta-20260610.md

You are Kimi, running on the M4 HERMES machine (Master Brain). This is a clean hand-off for the **SherpaCarta** project from Goose on the M3 Mac.

## Two-Machine Setup Reminder
- **M3 Mac (Goose)**: Main coding, research, iteration, and browser-based development work.
- **M4 Mac (You + HERMES)**: Permanent Obsidian vault, MASTER-BRAIN.md, Kanban, architecture docs, and strategic oversight. This is the long-term memory and single source of truth for all Give A Bit projects.
- Connect via Tailscale. Sync the entire `/sherpacarta/` folder (or the relevant docs + key files) after each hand-off.
- Working style: Explain everything simply (like to a 16-year-old). One clear step at a time. Always explain before changes and ask for confirmation. End completed tasks with “Done ✅”. Be encouraging and patient.

## Project Pitch (Remember This Exactly)
SherpaCarta is the Global Digital Magna Carta for the 21st Century — a living, globally-signed charter of 114 articles protecting digital privacy, data sovereignty, freedom of expression, and algorithmic rights for every person on Earth (all 8 billion). 

It is a moral and political declaration and modern successor to the 1215 Magna Carta and the 2011 Icelandic Constitutional Bill (the first crowdsourced constitution). It explicitly binds both states *and* powerful private corporations/algorithms. 

The project ships a stunning, fully self-contained, interactive single-page website with custom cursor, ⌘K command palette, full article browser (local signing + sharing + "AI" summaries), Rights Protection Calculator, historical comparison timeline, Bitcoin donation flow, rich social sharing across X/WhatsApp/Telegram/LinkedIn/etc., multi-language support, print/read-aloud/download charter features, and excellent SEO. 

Everything is CC0 public domain. The site practices extreme privacy: zero tracking, zero cookies (ironic banner only), zero analytics. Funded only by voluntary Bitcoin (on-chain transparent). Tagline: "Privacy is not a feature. It is a birthright."

## Current State (as of BUILD-20260610-001)
- Single source of truth folder: `/Users/cam/projects/sherpacarta/`
- **Core deliverable**: `index.html` — the complete, beautiful, production-ready self-contained SherpaCarta experience (all 114 articles, full interactivity, custom everything). This is what users see at sherpacarta.org.
- `README.md` — Now a professional, complete guide with dev instructions (`npm run dev` for instant browser work with hot reload, `npm run build` + preview), structure explanation, and contribution notes.
- `docs/EXECUTIVE_SUMMARY.md` — Clean problem/solution framing, four pillars (Privacy First, Universal Access, Freedom of Expression, Data Sovereignty), strategic positioning, momentum stats, and clear calls to action. Ready for partners, funders, and serious readers.
- `docs/MARKETING.md` — Full brand voice, messaging architecture, one-pager text, social templates, press boilerplate, objection handling, and visual identity guidance. Directly usable for outreach.
- GitHub (source of truth): https://github.com/kitsboy/sherpacarta.git (remotes configured; recent commits around cleanup, professional README, and site integration).
- Intended live site: https://sherpacarta.org/ (all meta tags, OG, Twitter cards, JSON-LD already point here).
- Deployment: Vite static. `npm run build` → `dist/`. Works on Cloudflare Pages, Vercel, Netlify, GitHub Pages, or as a raw single HTML file. Dev server is excellent for ongoing work.
- This session (the work leading to this hand-off): User hit a Vite parse5 doctype error on the old placeholder. We installed the full rich HTML/JS/CSS the user supplied, fixed the site so `npm run dev` just works beautifully in the browser, added the exact executive + marketing docs they requested, did a small delightful polish (mouse-repelling emerald particles in the hero), updated the README, and verified clean builds.

## Your Tasks on M4
1. Copy `SOURCE-OF-TRUTH.md`, `KIMI-HANDOFF-sherpacarta-20260610.md`, `docs/EXECUTIVE_SUMMARY.md`, `docs/MARKETING.md`, and the updated `README.md` into your Obsidian vault under the SherpaCarta (or equivalent capitalized) project folder.
2. Update `MASTER-BRAIN.md`, your Kanban, and any project maps or architecture docs with the current state, pitch, GitHub link, live target, and the fact that the canonical experience is the self-contained `index.html`.
3. Educate yourself and Hermes on the full vision: This is a serious digital human rights movement tool, not just a pretty website. The charter is the product; the site is the accessible front door. Emphasize the CC0 + extreme privacy + Bitcoin funding + living document (rights only expand) principles.
4. Maintain the single source of truth discipline in the `/sherpacarta/` folder. Update BUILD numbers on meaningful changes and keep SOURCE-OF-TRUTH.md current.
5. When the user (or Goose) is ready for next steps (real deployment, more features, outreach using the marketing docs, etc.), prepare a clean hand-off back to the M3 machine.
6. Use the EXECUTIVE_SUMMARY and MARKETING files as the authoritative references for any writing, strategy, or education work on this project.

**Template Rule for All Future Projects:** Every Give A Bit project must have at least: GitHub source, live URL (when deployed), deployment details, key docs list, simple pitch, Git snapshot, mission alignment, gaps/improvements, and a hand-off note. Use the giveabit-project-handoff skill (or the `update-kimi <project>` command) on every project to keep the system automatic.

Please confirm integration by replying with what you updated in your vault, any immediate observations or next actions you plan for SherpaCarta, and confirmation that you have absorbed the pitch and the two new docs. The `/sherpacarta/` folder (and its `index.html` + `/docs/`) is the perpetual single source of truth — respect it on both machines.

Thank you — this keeps everything automatic, organized, and moving forward seamlessly between M3 and M4 for the mission.

— Hand-off generated via update-kimi sherpacarta on 2026-06-10 (following giveabit-project-handoff + goodbye skills)

## Latest Session Summary (from 2026-06-10 goodbye)

**Chat Topic**: Setting up and launching the full interactive SherpaCarta website in the browser using the provided HTML, adding the requested executive and marketing documentation, polishing the experience, and completing a clean project hand-off to Kimi via the update-kimi system.

**Key Things We Did**:
- Fixed the Vite `parse5` "non-conforming-doctype" error (old HTML 4.01 doctype in the placeholder index.html).
- Replaced the minimal React/Vite placeholder with the complete, rich, self-contained HTML/CSS/JS the user supplied — the full 114-article charter with custom cursor, ⌘K command palette, interactive article browser (signing, sharing, AI summaries), Rights Calculator, timeline, social sharing, Bitcoin donation, multi-language, print/read-aloud, excellent SEO/OG/JSON-LD.
- Made `npm run dev` the primary, delightful way to work (instant browser at localhost:5173 with HMR).
- Added exactly the requested docs: `docs/EXECUTIVE_SUMMARY.md` (problem, pillars, strategy) and `docs/MARKETING.md` (voice, templates, press kit, objections).
- Small delightful polish: hero particles now subtly repel from the mouse for a premium feel.
- Updated `README.md` with clear dev instructions, project structure, features, and contribution notes.
- Verified clean `npm run build` (dist/ ready for static hosting).
- Created full `SOURCE-OF-TRUTH.md` and `KIMI-HANDOFF-sherpacarta-20260610.md`.
- Executed the official `/Users/cam/bin/update-kimi sherpacarta` to emit the clean context.
- Now formalizing the end-of-chat with structured compression.

**What We Finished**:
- The SherpaCarta site is now fully functional, beautiful, and immediately usable in the browser via standard npm commands.
- Executive and marketing docs are present, high-quality, and ready for partners, press, and Kimi.
- Complete source-of-truth and hand-off infrastructure is in place for the project (GitHub https://github.com/kitsboy/sherpacarta.git, target https://sherpacarta.org/, Vite static deployment).

**What We Are Still Aiming to Finish**:
- Real production deployment to https://sherpacarta.org/ (Cloudflare Pages recommended) + final assets like og-image.png.
- Prune legacy React dependencies from package.json (the delivered product is pure self-contained HTML/JS + Vite for dev convenience only).
- Outreach and adoption using the new MARKETING.md (press, organizations, community translations, local chapters).
- Evolve living charter features (amendment UI, optional lightweight public signature ledger while preserving the strong local-first zero-tracking default).
- Keep SOURCE-OF-TRUTH.md, hand-off files, and BUILD numbers updated on every meaningful change.

**Update / Status**: As of 2026-06-10, SherpaCarta has a production-ready, privacy-maximalist, self-contained interactive website for the 114-article Global Digital Magna Carta for the 21st Century. The project fully follows the Give A Bit two-machine hand-off discipline with clean, structured records. The experience is immediately workable with `npm run dev`. All user-requested documentation is in place. The site itself models the mission: zero tracking, CC0, Bitcoin-funded, empowering normal people with digital rights tools.

**Key Decisions / Notes**:
- Kept the core experience as a single rich `index.html` (Vite wrapper only for dev/build) because it perfectly matches the "living public document" + CC0 philosophy and makes sharing/hosting trivial.
- Legacy `src/` React files left harmlessly in place (not loaded by the site).
- All material sent to Kimi is clean, structured, and useful — no raw chat logs.

**Mission Tie-in**: SherpaCarta directly advances the Give A Bit mission of building approachable, private, sovereignty-respecting Bitcoin tools. The charter and site are a major artifact for digital human rights and resistance to surveillance capitalism. The site itself practices extreme "privacy by design" (collects literally nothing) while giving people a powerful, beautiful, interactive way to assert their rights. The hand-off system ensures this knowledge stays organized and flows reliably to the M4 master brain without chaos or loss.

**Finished in this session**:
- Full beautiful self-contained site installed and working with `npm run dev`.
- Executive Summary and Marketing docs added.
- Visual polish and professional README.
- Complete SOURCE-OF-TRUTH + KIMI-HANDOFF created and emitted via official update-kimi script.
- Clean compression via this goodbye.

**Still to do**:
- Production deployment to sherpacarta.org.
- Legacy dep cleanup.
- Real outreach using the marketing materials.
- Further charter evolution features.

**Next for Kimi**: Integrate this summary (and the SOURCE-OF-TRUTH / docs / README) into MASTER-BRAIN.md, Kanban, and Obsidian vault under SherpaCarta. Update any project maps or architecture docs. Educate yourself and Hermes on the vision: this is the living digital rights charter and movement tool. Use the EXECUTIVE_SUMMARY and MARKETING.md as canonical references. Maintain the single source of truth in the /sherpacarta/ folder. Use the giveabit-project-handoff skill (or `update-kimi sherpacarta`) for any future updates on this or new projects. Confirm integration and list what you updated.

The updated KIMI-HANDOFF file is ready. Do not move or sync anything to M4 until I or Kimi tell you it's time.

Chat ended cleanly with remarkable recovery. Use the /whatsup skill (or "use the whatsup skill") in a new chat window to pick up exactly where we left off — it will load the latest summary automatically.

Great work on SherpaCarta. This keeps everything organized for Give A Bit without losing context or learning. Privacy is a birthright.

Done ✅