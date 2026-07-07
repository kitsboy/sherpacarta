#!/usr/bin/env node
/** Concatenate enhancement + upgrade scripts → public/sc-bundle.js */
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
];

let bundle = `/* SherpaCarta bundled enhancements — generated ${new Date().toISOString()} */\n`;
let total = 0;
for (const f of files) {
  try {
    const src = readFileSync(join(publicDir, f), 'utf8');
    bundle += `\n/* ── ${f} ── */\n${src}\n`;
    total++;
  } catch {
    console.warn(`Skip missing: ${f}`);
  }
}
writeFileSync(join(publicDir, 'sc-bundle.js'), bundle);
console.log(`Bundled ${total} files → public/sc-bundle.js (${(bundle.length / 1024).toFixed(1)} KB)`);