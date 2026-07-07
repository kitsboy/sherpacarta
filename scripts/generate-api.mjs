#!/usr/bin/env node
/** Extract CHARTER metadata → static API JSON + per-article files */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = '20260707-647';

function extractCharter() {
  for (const file of ['public/sc-core.js', 'index.html']) {
    const html = readFileSync(join(root, file), 'utf8');
    const startMarker = 'window.CHARTER = [';
    const altMarker = 'const CHARTER = [';
    let start = html.indexOf(startMarker);
    let offset = startMarker.length - 1;
    if (start === -1) {
      start = html.indexOf(altMarker);
      offset = altMarker.length - 1;
    }
    if (start === -1) continue;
    let i = start + offset;
    let depth = 0;
    for (; i < html.length; i++) {
      if (html[i] === '[') depth++;
      else if (html[i] === ']') {
        depth--;
        if (depth === 0) { i++; break; }
      }
    }
    const marker = html.includes(startMarker) ? startMarker : altMarker;
    const arrStart = html.indexOf('[', start + marker.length - 10);
    return eval(html.slice(arrStart, i));
  }
  console.error('CHARTER not found');
  process.exit(1);
}

const CHARTER = extractCharter();
const articles = [];
const articleBodies = {};

CHARTER.forEach((ch) => {
  (ch.articles || []).forEach((a) => {
    articles.push({ num: a.num, title: a.title, chapter: ch.chapter, tags: a.tags || [] });
    articleBodies[a.num] = {
      num: a.num,
      title: a.title,
      chapter: ch.chapter,
      tags: a.tags || [],
      body: a.body || null,
    };
  });
});

const plain = articles.map((a) => `${a.num}: ${a.title}`).join('\n');
const hash = createHash('sha256').update(plain).digest('hex');

const apiDir = join(root, 'public/api/v1');
const articlesDir = join(apiDir, 'articles');
mkdirSync(articlesDir, { recursive: true });

writeFileSync(join(apiDir, 'charter.json'), JSON.stringify({
  version: '2.0',
  build: BUILD,
  articleCount: articles.length,
  chapters: CHARTER.map((c) => c.chapter),
  articles,
}, null, 2));

writeFileSync(join(apiDir, 'hash.json'), JSON.stringify({
  algorithm: 'SHA-256',
  hash,
  build: BUILD,
  canonicalPreview: plain.slice(0, 200) + '…',
  stampUrl: 'https://satohash.giveabit.io',
  updated: new Date().toISOString(),
}, null, 2));

function articleSlug(num) {
  return String(num).toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
}

Object.entries(articleBodies).forEach(([num, data]) => {
  const slug = articleSlug(num);
  const payload = { ...data, slug, url: `/api/v1/articles/${slug}.json` };
  writeFileSync(join(articlesDir, `${slug}.json`), JSON.stringify(payload, null, 2));
});

writeFileSync(join(apiDir, 'index.json'), JSON.stringify({
  version: '1.0.0',
  build: BUILD,
  endpoints: {
    charter: '/api/v1/charter.json',
    hash: '/api/v1/hash.json',
    openapi: '/api/v1/openapi.json',
    articles: '/api/v1/articles/{num}.json',
    treasury: '/treasury.html',
    mcp: '/mcp.json',
    embed: '/embed.js',
  },
  sdk: '@giveabit/sherpacarta',
  mcpPackage: '@giveabit/sherpacarta-mcp',
}, null, 2));

writeFileSync(join(apiDir, 'openapi.json'), JSON.stringify({
  openapi: '3.0.3',
  info: { title: 'SherpaCarta API', version: '1.0.0', description: 'Static read-only charter API' },
  servers: [{ url: 'https://sherpacarta.org/api/v1' }],
  paths: {
    '/charter.json': { get: { summary: 'Full charter index', responses: { 200: { description: 'JSON charter' } } } },
    '/hash.json': { get: { summary: 'Canonical SHA-256', responses: { 200: { description: 'Hash metadata' } } } },
    '/index.json': { get: { summary: 'API catalog', responses: { 200: { description: 'Endpoint index' } } } },
    '/articles/{num}.json': { get: { summary: 'Single article', parameters: [{ name: 'num', in: 'path', required: true }] } },
  },
}, null, 2));

console.log(`API generated: ${articles.length} articles, ${Object.keys(articleBodies).length} article files, hash ${hash.slice(0, 16)}…`);