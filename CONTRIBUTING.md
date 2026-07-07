# Contributing to SherpaCarta

Thank you for helping build the Global Digital Magna Carta.

## How to Contribute

1. Fork https://github.com/kitsboy/sherpacarta
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make changes; run `npm run build` before committing
4. Commit with a clear message (`feat:`, `fix:`, `ui:`, `docs:`)
5. Open a Pull Request

## Code of Conduct

- Be respectful and constructive
- Focus on digital rights, privacy, and human dignity
- Keep Safe Harbour principles in mind
- Rights only expand, never contract (Art. 114)

## Development Setup

```bash
git clone https://github.com/kitsboy/sherpacarta.git
cd sherpacarta
npm install
npm run dev          # http://localhost:5173
npm run build        # full pipeline → dist/
```

## Charter Content Changes

Article text lives in `data/charter.json`. After editing:

```bash
npm run build        # regenerates sc-core.js, API files, sitemap
```

Do not edit the injected CHARTER array in `sc-core.js` directly.

## Pull Request Guidelines

- One logical change per PR
- Update `CHANGELOG.md` for user-visible changes
- Update `SOURCE-OF-TRUTH.md` for architectural changes
- No tracking, analytics, or cookies — ever

## Movement Contributions (non-code)

- Sign the charter at https://sherpacarta.org
- Propose amendments via Nostr or local form
- Translate articles (see `docs/I18N.md`)
- Share with policymakers (see `docs/CANADA-BC-CHALLENGE.md`)

---

*Part of the [Give A Bit](https://giveabit.io) family.*