#!/bin/bash
set -e
# Manual Cloudflare Pages publish (rare — the git push to main already publishes).
# NO credential is hardcoded here. Export CLOUDFLARE_API_TOKEN (or a scoped
# CF_PAGES_TOKEN) in your shell first, or this refuses to run.
# The base64-encoded account token that used to live here was revoked 2026-09-17
# after being found in this public repo; the file is now secret-free.
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN is not set. Export it (or a scoped CF_PAGES_TOKEN) before running."
  exit 1
fi
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd ~/projects/sherpacarta
echo "=== Building ==="
npm run build 2>&1
echo "=== Deploying ==="
npx wrangler pages deploy dist/ --project-name sherpacarta 2>&1
echo "=== Done ==="
