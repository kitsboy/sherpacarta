# SherpaCarta Translation Workflow

**English first. Human review required for binding legal text.**

## Coverage tiers

| Tier | Scope | Review |
|------|-------|--------|
| UI | Hero, nav, footer, modals | 1 native speaker |
| Summary | Pillar blurbs, FAQ | 2 reviewers |
| Charter | Full 114 articles | Legal + native panel |

## How to contribute

1. Fork `kitsboy/sherpacarta`
2. Edit `TRANSLATIONS` in `index.html` for UI strings
3. For charter articles, add locale file under `docs/translations/{lang}/`
4. Open PR with `lang:xx` label
5. Maintainer merges after review

## Quality rules

- Never machine-translate binding legal text without human sign-off
- RTL locales (`ar`) require layout QA
- Article numbers stay canonical (`Art. 11`); body text translates

---

*Give A Bit · sherpacarta.org*