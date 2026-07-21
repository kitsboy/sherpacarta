# Sherpacarta — Context Map

BUILD: 732 / Updated: 2026-07-16

## Directory Structure
sherpacarta/
index.html              Main landing
data/charter.json       114 articles source of truth
public/
  sc-main.css           Styles
  sc-core.js            Core JS (CHARTER injected)
  sc-bundle.js          Enhancements + upgrades
  js/                   Canada + press scripts
  canada/               Campaign pages
  api/v1/               Public JSON API
packages/               SDK + MCP (npm publish pending)
scripts/                Build generators
docs/                   Documentation (incl. diligence packs)
dist/                   Build output (gitignored)
deploy.sh               Cloudflare Pages deploy

## Build Chain
npm run build =
  generate-charter -> inject-charter -> generate-campaign
  -> bundle-js -> generate-api -> generate-sitemap -> vite build

## Stack
Static HTML/JS + Vite build
No React/framework dependency
PWA: service worker (sherpacarta-v5.3)

## Ports
Dev: 5173 / Preview: 4173

## Deployment
Production: Cloudflare Pages via ./deploy.sh
