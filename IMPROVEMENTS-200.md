# SherpaCarta — 200 Improvements, Updates & Fixes

**Generated:** 2026-07-07 · **BUILD:** 647 · **Live:** https://sherpacarta.org

Prioritized backlog for future sprints. Items marked 🔴 are high-impact gaps discovered during Sprints 6–8.

---

## Charter Content & Data (1–25)

1. 🔴 **Add remaining 100 charter articles** — only 14 of 114 are in `sc-core.js` CHARTER array
2. Split CHARTER into chapter JSON files for maintainability
3. Add full article body text to `/api/v1/articles/{num}.json` for all 114 articles
4. Validate article numbering continuity (no gaps Art. 1–114)
5. Add `version` field per article for amendment tracking
6. Add `effectiveDate` metadata per article
7. Cross-link related articles (e.g. Art. 11 ↔ Art. 12)
8. Add article difficulty/complexity rating for public education
9. Generate plain-text charter export (`/charter.txt`)
10. Generate PDF charter export with proper typography
11. Add EPUB download format
12. Add article audio narration per article (TTS batch)
13. Add signatory count per article (local aggregate, privacy-safe)
14. Add amendment proposal UI wired to Nostr
15. Add diff view between charter v1.0 and v2.0
16. Add Satohash OpenTimestamp stamp button on hash page
17. Sync `charter.json` build field automatically from `SC.BUILD`
18. Add JSON Schema for charter article structure
19. Add Wikidata entity for SherpaCarta
20. Add Schema.org `CreativeWork` JSON-LD for charter
21. Add reading time estimate per article
22. Add article bookmarking (localStorage)
23. Add article share deep-links (`?article=11`)
24. Add printable single-article view
25. Add article comment count from Nostr (read-only, no accounts)

## Architecture & Performance (26–50)

26. Minify `sc-bundle.js` in build pipeline (terser)
27. Minify `sc-core.js` and `sc-main.css` for production
28. Add brotli compression pre-build step
29. Split `sc-bundle.js` into core + sprint chunks (lazy load b9+)
30. Remove duplicate code across enhancement files during consolidation
31. Tree-shake unused legacy enhancement features
32. Add `modulepreload` for critical scripts
33. Self-host Font Awesome instead of CDN
34. Self-host Google Fonts with `font-display: swap`
35. Add critical CSS inlining for above-fold hero
36. Reduce `sc-bundle.js` from 352 KB — target <200 KB
37. Add HTTP/2 server push hints in `_headers`
38. Add `stale-while-revalidate` for API JSON
39. Add service worker runtime caching strategy per asset type
40. Add offline fallback page
41. Add Web Vitals RUM reporting (privacy-preserving, no PII)
42. Add bundle analyzer script (`npm run analyze`)
43. Run Lighthouse CI on every PR (currently warn-only)
44. Set Lighthouse performance budget in CI (fail below 0.8)
45. Add Core Web Vitals badge to status dock
46. Lazy-load QR code library only on donate tab open
47. Lazy-load charter modal content on first open
48. Add `importmap` for future ES module migration
49. Remove unused React/Tailwind deps from `package.json`
50. Delete or archive unused `src/` React scaffold

## Internationalization (51–70)

51. 🔴 **Full charter translation for Spanish** — currently 7 sample articles only
52. Full charter translation for French (5 sample → 114)
53. Full charter translation for Arabic with complete RTL article layout
54. Full charter translation for German
55. Full charter translation for Portuguese
56. Full charter translation for Swahili
57. Full charter translation for Chinese (zh)
58. Add community translation contribution workflow (PR template)
59. Add `?lang=` deep-link on page load for SEO URLs
60. Add locale-specific OG meta tags
61. Add locale-specific JSON-LD
62. Add translation completeness % in i18n-audit
63. Add missing UI keys in de/pt/sw locale files
64. Add glossary translations for all 8 languages
65. Add charter modal language persistence across sessions
66. Add RTL layout audit for Arabic donate/sign sections
67. Add hreflang for `treasury.html` and `security.html`
68. Add `eu` (Basque) locale file (nav already lists it)
69. Add locale fallback chain (es → en)
70. Add professional human review flag per translation

## Trust, Treasury & Transparency (71–90)

71. 🔴 **Replace Lightning TEMP address** with live LNURL when Cam provides it
72. Add static `treasury.json` endpoint mirroring live mempool data
73. Add treasury historical balance chart (monthly snapshots)
74. Add donation goal progress bar
75. Add donor recognition wall (opt-in, no PII)
76. Add annual report auto-generation from treasury data
77. Add multi-sig treasury roadmap documentation
78. Add expense breakdown (hosting, domains, tools)
79. Add bug bounty monetary fund when budget allows
80. Add PGP public key to security.html
81. Add security hall of fame with real names (opt-in)
82. Add CVE assignment process documentation
83. Add dependency audit badge in footer
84. Add `npm audit` to CI pipeline
85. Add Subresource Integrity (SRI) for CDN scripts
86. Add Content-Security-Policy header
87. Add HSTS preload submission
88. Add privacy policy page (distinct from accessibility)
89. Add GDPR-style data processing notice (even though zero collection)
90. Add transparency report quarterly PDF

## API, MCP & SDK (91–110)

91. Publish `@giveabit/sherpacarta` to npm registry
92. Publish `@giveabit/sherpacarta-mcp` to npm registry
93. Add TypeScript types package `@giveabit/sherpacarta-types`
94. Add GraphQL read-only endpoint (optional)
95. Add webhook for charter hash changes
96. Add rate limiting docs for API consumers
97. Add API versioning (`/api/v2/`)
98. Add CORS preflight handling documentation
99. Add MCP HTTP/SSE transport (not just stdio)
100. Add MCP tool: `get_chapter`
101. Add MCP tool: `compare_articles`
102. Add SDK Python package
103. Add SDK Rust crate
104. Add embed.js theme customizer (colors, fonts)
105. Add embed.js sign callback event (`onSign`)
106. Add WordPress plugin using SDK
107. Add Shopify app for merchant badge
108. Add Zapier integration
109. Add API usage analytics (privacy-preserving aggregate)
110. Add OpenAPI client code generation in CI

## SEO & Distribution (111–130)

111. Add per-article canonical URLs in sitemap (all 114)
112. Add `NewsArticle` schema for press releases
113. Add `PodcastEpisode` schema for feed items
114. Add Google Search Console verification meta
115. Add Bing Webmaster verification
116. Add IndexNow ping on deploy
117. Add RSS feed for charter amendments
118. Add Atom feed alternative
119. Add press kit PDF export
120. Add one-pager PDF from MARKETING.md
121. Add institutional adoption pack PDF
122. Add social share image per article (dynamic OG)
123. Add link preview debugger page
124. Add UTM campaign tracking docs (without site tracking)
125. Add Reddit/Telegram/Discord share buttons
126. Add Bluesky share integration
127. Add Nostr share (NIP-78)
128. Add QR code for site URL in footer
129. Add `/humans.txt`
130. Add `/security.txt` automated validation in CI

## Accessibility (131–145)

131. Add skip links for all modals
132. Add focus trap audit for cmd-overlay
133. Add `aria-live` for toast notifications
134. Add high-contrast theme (beyond dark/light)
135. Add dyslexia-friendly font toggle
136. Add reduced-motion respect audit (full site)
137. Add keyboard nav for article browser
138. Add screen reader test with NVDA/VoiceOver scripts
139. Add WCAG 2.2 AA automated audit in CI
140. Add alt text audit for all images
141. Add form label audit for sign form
142. Add color contrast fix for `--text3` on light theme
143. Add caption/transcript for video section
144. Add sign language video option (future)
145. Add accessibility statement last-reviewed date auto-update

## Mobile & UX (146–160)

146. Add touch target size audit (min 44px)
147. Add swipe gestures for article navigation
148. Add pull-to-refresh for treasury widget
149. Add PWA install prompt (after SW stable)
150. Add iOS splash screens in manifest
151. Add Android adaptive icon
152. Add bottom nav for mobile (Sign / Charter / Donate)
153. Add haptic feedback on sign (mobile)
154. Add share sheet API on mobile sign
155. Add offline sign queue (sync when online via Nostr)
156. Fix any remaining horizontal scroll on small screens
157. Add tablet-optimized charter modal layout
158. Add landscape mode calculator layout
159. Add sticky donate CTA A/B test (removed BUILD 426 — re-evaluate)
160. Add onboarding tooltip tour for first visit

## Canada / BC Challenge & Political (161–175)

161. Add MLA/MP outreach CRM export from sign data (local only)
162. Add CANADA-BC-CHALLENGE.md integration in hero for BC users
163. Add geo-detect BC prompt (privacy-safe, client-side IP optional)
164. Add model bill PDF download
165. Add safe harbour template ZIP
166. Add indigenous data sovereignty page expansion
167. Add town hall kit printable materials
168. Add political adoption tracker by jurisdiction
169. Add petition signature count (real, not simulated)
170. Add email-your-MLA template generator
171. Add stamp charter v2.0 on Satohash before first political meeting
172. Add comparison page: SherpaCarta vs GDPR vs CCPA
173. Add UN digital rights alignment matrix
174. Add EU AI Act cross-reference table
175. Add BC privacy act gap analysis update

## Nostr & Decentralization (176–185)

176. Add Nostr login (NIP-07) for sign publishing
177. Add NIP-78 event publishing on sign
178. Add relay health indicator in footer
179. Add amendment discussion threads on Nostr
180. Add Nostr-based public signature count (opt-in)
181. Add nostr.json verification for giveabit.io
182. Add decentralized mirror list page
183. Add IPFS deploy script
184. Add .onion mirror documentation
185. Add censorship-resistance runbook

## DevOps, Docs & Handoff (186–200)

186. Add GitHub Actions auto-deploy to Cloudflare Pages
187. Add preview deployments for PRs
188. Add staging environment (staging.sherpacarta.org)
189. Add smoke test script post-deploy
190. Add visual regression tests (Playwright)
191. Add E2E test for sign flow
192. Update SOURCE-OF-TRUTH.md to BUILD 647
193. Kimi: sync Sprints 6–8 to Obsidian / MASTER-BRAIN
194. Add CONTRIBUTING.md with charter edit process
195. Add CODEOWNERS for critical files
196. Add CHANGELOG auto-generation from conventional commits
197. Add feature flag system for gradual rollouts
198. Add error boundary / global `window.onerror` reporter (no PII)
199. Add health check endpoint `/api/v1/health.json`
200. Add roadmap page linking sprints 9+ (governance, institutions, education)

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*