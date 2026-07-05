#!/usr/bin/env node
/** Quick SEO file audit for SherpaCarta static site */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const checks = [];

function check(name, ok, detail = '') {
  checks.push({ name, ok, detail });
}

check('index.html', existsSync(join(root, 'index.html')));
check('sitemap.xml', existsSync(join(root, 'public/sitemap.xml')));
check('robots.txt', existsSync(join(root, 'public/robots.txt')));
check('og-image.png', existsSync(join(root, 'public/og-image.png')));

const html = readFileSync(join(root, 'index.html'), 'utf8');
check('canonical', html.includes('rel="canonical"'));
check('hreflang', (html.match(/hreflang/g) || []).length >= 5);
check('FAQPage JSON-LD', html.includes('"FAQPage"'));
check('Organization publisher', html.includes('"Organization"'));

const fail = checks.filter((c) => !c.ok);
console.log('\nSherpaCarta SEO Audit\n');
checks.forEach((c) => console.log(`${c.ok ? '✓' : '✗'} ${c.name}${c.detail ? ` — ${c.detail}` : ''}`));
console.log(fail.length ? `\n${fail.length} issue(s)\n` : '\nAll checks passed\n');
process.exit(fail.length ? 1 : 0);