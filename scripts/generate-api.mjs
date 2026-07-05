#!/usr/bin/env node
/** Extract CHARTER metadata from index.html → static API JSON */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const startMarker = 'window.CHARTER = [';
const start = html.indexOf(startMarker);
if (start === -1) {
  console.error('CHARTER not found in index.html');
  process.exit(1);
}
let i = start + startMarker.length - 1;
let depth = 0;
for (; i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') {
    depth--;
    if (depth === 0) { i++; break; }
  }
}
const CHARTER = eval(html.slice(start + startMarker.length - 1, i));
const articles = [];
CHARTER.forEach((ch) => {
  (ch.articles || []).forEach((a) => {
    articles.push({ num: a.num, title: a.title, chapter: ch.chapter, tags: a.tags || [] });
  });
});
const plain = articles.map((a) => `${a.num}: ${a.title}`).join('\n');
const hash = createHash('sha256').update(plain).digest('hex');

const apiDir = join(root, 'public/api/v1');
mkdirSync(apiDir, { recursive: true });

writeFileSync(join(apiDir, 'charter.json'), JSON.stringify({
  version: '2.0',
  build: '20260704-487',
  articleCount: articles.length,
  chapters: CHARTER.map((c) => c.chapter),
  articles,
}, null, 2));

writeFileSync(join(apiDir, 'hash.json'), JSON.stringify({
  algorithm: 'SHA-256',
  hash,
  canonicalPreview: plain.slice(0, 200) + '…',
  stampUrl: 'https://satohash.giveabit.io',
  updated: new Date().toISOString(),
}, null, 2));

writeFileSync(join(apiDir, 'openapi.json'), JSON.stringify({
  openapi: '3.0.3',
  info: { title: 'SherpaCarta API', version: '1.0.0', description: 'Static read-only charter API' },
  servers: [{ url: 'https://sherpacarta.org/api/v1' }],
  paths: {
    '/charter.json': { get: { summary: 'Full charter index', responses: { 200: { description: 'JSON charter' } } } },
    '/hash.json': { get: { summary: 'Canonical SHA-256', responses: { 200: { description: 'Hash metadata' } } } },
    '/articles/{num}.json': { get: { summary: 'Single article', parameters: [{ name: 'num', in: 'path' }] } },
  },
}, null, 2));

console.log(`API generated: ${articles.length} articles, hash ${hash.slice(0, 16)}…`);