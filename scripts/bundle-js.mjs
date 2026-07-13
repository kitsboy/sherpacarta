#!/usr/bin/env node
/** Concatenate enhancement + upgrade scripts → public/sc-bundle.js (per-file minify) */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

const files = [
  'sc-enhancements.js',
  'sc-enhancements-v2.js',
  'sc-enhancements-v3.js',
  'sc-enhancements-v4.js',
  'sc-enhancements-v5.js',
  'sc-enhancements-v6.js',
  'sc-upgrades-b1.js',
  'sc-upgrades-b2.js',
  'sc-upgrades-b3.js',
  'sc-upgrades-b4.js',
  'sc-upgrades-b5.js',
  'sc-upgrades-b6.js',
  'sc-upgrades-b7.js',
  'sc-upgrades-b8.js',
  'sc-upgrades-b9.js',
  'sc-upgrades-b10.js',
  'sc-upgrades-b11.js',
  'sc-upgrades-b12.js',
  'sc-upgrades-b13.js',
  'sc-upgrades-b14.js',
  'sc-upgrades-b15.js',
];

let minifyFn = null;
try {
  minifyFn = (await import('terser')).minify;
} catch {
  console.warn('terser not available — writing unminified bundle');
}

let out = `/* SherpaCarta bundled enhancements — generated ${new Date().toISOString()} */\n`;
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
