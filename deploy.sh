#!/bin/bash
set -e
echo "Y2Z1dF9UNkpvdDQ1UjNzOElEZFZmWnRtVDJpbk14TDBIZ2toSWExSENWZzZMM2Y5NDY4ZjI=" | base64 -d > /tmp/cf_token
export CLOUDFLARE_API_TOKEN=$(cat /tmp/cf_token)
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd ~/projects/sherpacarta
echo "=== Building ==="
npm run build 2>&1
echo "=== Deploying ==="
npx wrangler pages deploy dist/ --project-name sherpacarta 2>&1
rm /tmp/cf_token
echo "=== Done ==="
