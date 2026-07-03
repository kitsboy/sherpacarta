---
title: SEO Strategy & Audit
project: sherpacarta
version: 2.0.0
tags: [project, seo, audit, keywords, i18n, hreflang]
last_updated: 2026-07-02
owner: Kimi (Orchestrator) / Qwen (Weekly Audit)
update_frequency: Weekly (Monday)
---

# SEO — SherpaCarta (sherpacarta.org)

## Live URL

https://sherpacarta.org

## International SEO

Language-specific keyword baselines live in:

| Language | File |
|----------|------|
| English (master) | `docs/SEO.md` (this file) |
| Spanish | `docs/SEO-es.md` |
| French | `docs/SEO-fr.md` |
| German | `docs/SEO-de.md` |
| Portuguese | `docs/SEO-pt.md` |
| Chinese | `docs/SEO-zh.md` |
| Swahili | `docs/SEO-sw.md` |

**Site implementation:** `index.html` includes `hreflang` alternates for `en`, `es`, `fr`, `de`, `zh`, `pt`, `sw`, `ar`, and `x-default`. UI translations cover hero/CTA for `en`, `zh`, `es`, `ar`, `fr` via client-side switcher; full charter translation is community-driven (see `docs/I18N.md`).

**Next i18n SEO steps:**
- Add `?lang=` deep-link handling on load (read query param → `switchNavLang`)
- Publish per-locale `title` / `description` meta updates when language switches
- Create dedicated locale landing paths (`/es/`, `/fr/`) if Cloudflare routing allows

## Target Keywords (English)

| Primary Keyword | Search Intent | Current Rank |
|----------------|--------------|-------------|
| digital magna carta | Informational | — |
| digital human rights charter | Informational | — |
| internet bill of rights | Informational | — |
| privacy charter 2026 | Informational | — |
| algorithmic rights framework | Informational | — |
| data sovereignty rights | Informational | — |

## Current Meta Tags

| Tag | Current Value | Status |
|-----|--------------|--------|
| Title | `SherpaCarta — The Global Digital Magna Carta for the 21st Century` | ✅ Strong (may trim for SERP) |
| Description | 114 articles / 8 billion people / sign now | ✅ Good |
| Canonical | `https://sherpacarta.org/` | ✅ |
| og:image | `https://sherpacarta.org/og-image.png` | ❌ Asset missing |
| hreflang | 8 locales + x-default | ✅ Added 2026-07-02 |
| JSON-LD | WebSite + SearchAction | ✅ Partial |

## Structured Data Checklist

- [x] WebSite schema
- [ ] Organization schema (full)
- [ ] FAQPage (FAQ section exists on page — wire schema)
- [ ] Article schema per charter article (long-term)
- [ ] BreadcrumbList (if multi-page routes added)

## Known Gaps (Baseline Audit 2026-07-02)

- **og-image.png** and **logo.png** referenced in meta but not in repo
- Simulated signer counts may hurt trust if indexed as factual claims — consider `noindex` on dynamic counters or clarify in copy
- Footer GitHub links corrected to `kitsboy/sherpacarta`
- Press kit PDF not yet generated
- Sitemap.xml and robots.txt not present

## Weekly Audit Log

| Date | Auditor | Findings | Recommendations |
|------|---------|----------|-----------------|
| 2026-06-24 | Kimi | Locale SEO baselines created | Run full Qwen audit |
| 2026-07-02 | Grok | hreflang added; og-image still missing | Generate OG image; add sitemap; wire FAQ schema |

---

*Auto-updated weekly by Qwen3.5-9B (local LLM). Part of the [Give A Bit](https://giveabit.io) family.*

```
Safe Harbour Statement: This project is provided for educational and informational purposes only.
Nothing herein constitutes legal, financial, or investment advice. Use at your own risk.
© Give A Bit — Bitcoin sovereignty first.
```