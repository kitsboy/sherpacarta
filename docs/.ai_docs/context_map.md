# sherpacarta — Context Map

## Stack
| Layer | Technology |
|-------|-----------|
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 |
| Production | Self-contained `index.html` (vanilla JS/CSS, 160 KB) |
| Legacy src/ | Vite scaffold (React 19 placeholder — unused in production) |
| Runtime | Fully client-side, no server |

## Ports
| Service | Port |
|---------|------|
| Vite dev server | 5173 |

## Content
| Feature | Details |
|---------|---------|
| Articles | 114 articles protecting digital privacy |
| License | CC0 Public Domain (all 114 articles) |
| Multi-language | UI supports multiple languages |
| Interactive features | Command palette, rights calculator, signing wall |
| Tracking | Zero — no analytics, no cookies, no tracking pixels |

## Key Architecture
- Self-contained 160 KB `index.html` — the entire production site
- Vite build primarily exists for dev server experience
- React `src/` directory is a legacy scaffold and NOT used in production
- No backend, no database, no external dependencies at runtime
- On-chain provenance for article versions (via Satohash, planned)

## Entry Points
| Path | Purpose |
|------|---------|
| index.html | Production site (self-contained) |
| src/ | Legacy React scaffold (unused) |
| docs/ | Project documentation |
| deploy.sh | M4-only deploy script |

## Hosting
Cloudflare Pages — manual deploy from M4 only
Custom domain: sherpacarta.org
CF token: Base64 encoded in deploy.sh (M4 only — never expose)
