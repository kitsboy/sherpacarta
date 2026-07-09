#!/usr/bin/env node
/** Generate public/charter.txt from data/charter.json */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const d = JSON.parse(readFileSync(join(root, 'data/charter.json'), 'utf8'));
let out = 'SHERPACARTA — THE GLOBAL DIGITAL MAGNA CARTA\n';
out += 'Privacy is not a feature. It is a birthright.\n';
out += `CC0 Public Domain · https://sherpacarta.org · build ${d.build || ''}\n`;
out += '='.repeat(60) + '\n\n';
if (d.preamble) {
  out += 'PREAMBLE\n\n' + (typeof d.preamble === 'string' ? d.preamble : (d.preamble.text || JSON.stringify(d.preamble))) + '\n\n';
}
const chapters = d.chapters || [];
if (chapters.length) {
  for (const ch of chapters) {
    out += `\n${ch.chapter || ch.title || ''}\n${'-'.repeat(40)}\n\n`;
    for (const a of ch.articles || []) {
      out += `${a.num || ''}: ${a.title || ''}\n\n`;
      out += String(a.body || '').replace(/<[^>]+>/g, '') + '\n\n';
    }
  }
} else {
  for (const a of d.articles || []) {
    out += `${a.num || a.id || ''}: ${a.title || ''}\n\n`;
    out += String(a.body || '').replace(/<[^>]+>/g, '') + '\n\n';
  }
}
writeFileSync(join(root, 'public/charter.txt'), out);
console.log(`charter.txt → ${(out.length / 1024).toFixed(1)} KB`);
