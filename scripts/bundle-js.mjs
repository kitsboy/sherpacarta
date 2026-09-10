#!/usr/bin/env node
/**
 * Concatenate the curated home JS path → public/sc-bundle.js (per-file minify).
 *
 * Home must load this one file, never sc-upgrades-b1.js … b15.js as script tags.
 *
 * 2026-09-09 audit: 21 files / 707 numbered feats were concatenated. Most were
 * sprint markers, duplicate HTML, Google Fonts hints, or self-preloads that
 * fought the LCP cut. Live home keeps seven files that still own behavior:
 * QR/a11y/theme/sign wrap, toast queue, Lightning, SW/PWA, bottom nav, share.
 *
 * Dropped from the production bundle (sources stay in public/ for restore):
 *   sc-enhancements-v3.js … v6.js
 *   sc-upgrades-b2.js, b5–b13.js
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

const files = [
  'sc-enhancements.js',
  'sc-enhancements-v2.js',
  'sc-upgrades-b1.js',
  'sc-upgrades-b3.js',
  'sc-upgrades-b4.js',
  'sc-upgrades-b14.js',
  'sc-upgrades-b15.js',
];

let minifyFn = null;
try {
  minifyFn = (await import('terser')).minify;
} catch {
  console.warn('terser not available — writing unminified bundle');
}

let out = `/* SherpaCarta curated home bundle — generated ${new Date().toISOString()} */\n`;
let total = 0;
let rawBytes = 0;
let outBytes = 0;

for (const f of files) {
  try {
    const src = readFileSync(join(publicDir, f), 'utf8');
    rawBytes += src.length;
    total++;
    let body = src;
    let tag = f;
    if (minifyFn) {
      try {
        const min = await minifyFn(src, {
          compress: { passes: 1, drop_console: false },
          mangle: true,
          format: { comments: false },
          ecma: 2020,
        });
        if (min.code) {
          body = min.code;
          tag = f;
        } else if (min.error) {
          console.warn(`Minify skip ${f}:`, min.error.message);
          tag = `${f} (raw)`;
        }
      } catch (e) {
        console.warn(`Minify skip ${f}:`, e.message);
        tag = `${f} (raw)`;
      }
    }
    out += `\n/* ── ${tag} ── */\n${body}\n`;
    outBytes += body.length;
  } catch {
    console.warn(`Skip missing: ${f}`);
  }
}

writeFileSync(join(publicDir, 'sc-bundle.js'), out);
const pct = rawBytes ? Math.round((1 - outBytes / rawBytes) * 100) : 0;
console.log(
  `Bundled ${total} files → public/sc-bundle.js (${(outBytes / 1024).toFixed(1)} KB` +
    (pct > 0 ? `, ~${pct}% smaller` : '') +
    `)`
);
