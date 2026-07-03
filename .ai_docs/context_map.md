# Sherpacarta — Context Map

## Directory Structure
```
sherpacarta/
├── src/           # React source code
├── public/        # Static assets
├── dist/          # Build output (gitignored)
├── docs/          # Documentation
├── archive/       # Legacy/backup files
├── .ai_docs/      # Auto-generated agent docs
├── index.html     # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── wrangler.toml
└── deploy.sh
```

## Dependencies
| Package | Type |
|---------|------|
| react, react-dom | Runtime |
| framer-motion | Runtime |
| lucide-react | Runtime |
| vite, @vitejs/plugin-react | Dev |
| tailwindcss, postcss, autoprefixer | Dev |
| eslint | Dev |

## Build Chain
```
src/ (React JSX) → Vite + React plugin + Tailwind → dist/ (static SPA)
```

## Configuration

### Vite (vite.config.js)
- Plugin: @vitejs/plugin-react
- Tailwind CSS via PostCSS

### Wrangler (wrangler.toml)
- project: sherpacarta
- build output: dist/
- compatibility_date: 2026-06-15

### Ports
- Dev: 5173 (Vite default)
- Preview: 4173 (Vite preview default)

## Deployment Targets
- Production: Cloudflare Pages (auto-deploy on push to main)
- URL: sherpacarta.giveabit.io
