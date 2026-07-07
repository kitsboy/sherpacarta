#!/usr/bin/env node
/** Extract inline CSS/JS from index.html → public/sc-main.css + public/sc-core.js */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');

const styleRe = /<style>\n([\s\S]*?)\n<\/style>/;
const styleMatch = html.match(styleRe);
if (!styleMatch) {
  console.error('No <style> block found');
  process.exit(1);
}
writeFileSync(join(root, 'public/sc-main.css'), styleMatch[1] + '\n');
html = html.replace(styleRe, '<link rel="stylesheet" href="/sc-main.css?v=647">');

const scriptMarker = '<!-- ════════════════════════════════════════════════════════\n     JAVASCRIPT\n════════════════════════════════════════════════════════ -->\n<script>\n';
const scriptEnd = '</script>\n<script src="https://cdn.jsdelivr.net/npm/qrcode';
const start = html.indexOf(scriptMarker);
const end = html.indexOf(scriptEnd);
if (start === -1 || end === -1) {
  console.error('Inline JS block not found');
  process.exit(1);
}
const jsBody = html.slice(start + scriptMarker.length, end);
writeFileSync(join(root, 'public/sc-core.js'), jsBody);
html = html.replace(
  scriptMarker + jsBody + scriptEnd,
  '<script src="/sc-core.js?v=647" defer></script>\n\n<script src="https://cdn.jsdelivr.net/npm/qrcode'
);

writeFileSync(htmlPath, html);
console.log('Extracted sc-main.css + sc-core.js, updated index.html');