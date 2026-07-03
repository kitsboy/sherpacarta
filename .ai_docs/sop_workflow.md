# Sherpacarta — SOP & Workflow

## Stack
React 18 SPA, Vite, Tailwind CSS, framer-motion. Deployed to Cloudflare Pages.

## Quick Start

### Install
```bash
npm install
```

### Development
```bash
npm run dev
# Starts Vite dev server at http://localhost:5173
```

### Build
```bash
npm run build
# Outputs to dist/
```

### Lint
```bash
npm run lint
```

### Preview
```bash
npm run preview
# Serves dist/ locally
```

## Deployment

### Manual (wrangler)
```bash
npm run build
wrangler pages deploy dist --project-name=sherpacarta --branch=main
```

### Via deploy.sh
```bash
./deploy.sh
```

### Auto-deploy
Push to origin main triggers Cloudflare Pages auto-deploy.

## Project Structure
- src/ — React source
- public/ — static assets
- dist/ — build output
- docs/ — project docs
- archive/ — legacy files
