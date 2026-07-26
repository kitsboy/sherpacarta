#!/usr/bin/env node
/**
 * Ensure Umami + sc-analytics beacon on index.html and all public HTML pages.
 * Idempotent. productId sherpacarta.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEBSITE_ID = '9b6f05bf-286e-4b21-9094-1d675f9b4442';
const UMAMI =
  `<script defer src="https://analytics.giveabit.io/script.js" data-website-id="${WEBSITE_ID}"></script>`;
const BEACON = '<script defer src="/js/sc-analytics.js?v=733"></script>';
const MARKER = 'data-website-id="' + WEBSITE_ID + '"';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

function inject(html) {
  let next = html;
  let changed = false;

  if (!next.includes(MARKER)) {
    if (next.includes('</head>')) {
      next = next.replace('</head>', `<!-- suite analytics: first-party Umami (sherpacarta) -->\n${UMAMI}\n${BEACON}\n</head>`);
      changed = true;
    }
  } else if (!next.includes('/js/sc-analytics.js')) {
    // Umami present — add event beacon before </head>
    if (next.includes('</head>')) {
      next = next.replace('</head>', `${BEACON}\n</head>`);
      changed = true;
    }
  }

  return { next, changed };
}

const files = [join(root, 'index.html'), ...walk(join(root, 'public'))];
let n = 0;
for (const file of files) {
  let html;
  try {
    html = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  if (!html.includes('<head') && !html.includes('<HEAD')) continue;
  const { next, changed } = inject(html);
  if (changed) {
    writeFileSync(file, next);
    n++;
    console.log('injected', relative(root, file));
  }
}
console.log(`inject-analytics: updated ${n} file(s)`);
