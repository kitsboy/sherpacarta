#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const localesDir = join(root, 'public/locales');

console.log('\nSherpaCarta i18n Audit\n');

const hreflang = (html.match(/hreflang/g) || []).length;
console.log(`${hreflang >= 5 ? '✓' : '✗'} hreflang tags: ${hreflang}`);

const navLangs = [...html.matchAll(/option value="(\w+)"/g)].map((m) => m[1]);
console.log(`${navLangs.length >= 5 ? '✓' : '✗'} nav languages: ${navLangs.join(', ')}`);

if (existsSync(localesDir)) {
  const files = readdirSync(localesDir).filter((f) => f.endsWith('.json'));
  console.log(`✓ locale files: ${files.length}`);
  files.forEach((f) => {
    const data = JSON.parse(readFileSync(join(localesDir, f), 'utf8'));
    const arts = data.articles ? Object.keys(data.articles).length : 0;
    console.log(`  ${f}: ui=${!!data.ui} articles=${arts}`);
  });
} else {
  console.log('✗ public/locales/ missing');
}

console.log('');