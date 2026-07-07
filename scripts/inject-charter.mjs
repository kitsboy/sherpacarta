#!/usr/bin/env node
/** Inject data/charter.json → public/sc-core.js CHARTER array */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const charter = JSON.parse(readFileSync(join(root, 'data/charter.json'), 'utf8'));
const corePath = join(root, 'public/sc-core.js');
let core = readFileSync(corePath, 'utf8');

const charterJs = JSON.stringify(charter.chapters, null, 2);
const startMarker = 'window.CHARTER = ';
const endMarker = 'const CHARTER = window.CHARTER;';

const start = core.indexOf(startMarker);
const end = core.indexOf(endMarker);
if (start === -1 || end === -1) {
  console.error('CHARTER markers not found in sc-core.js');
  process.exit(1);
}

core = core.slice(0, start) + `window.CHARTER = ${charterJs};\n\n` + core.slice(end);
writeFileSync(corePath, core);
console.log(`Injected ${charter.articleCount} articles + preamble into sc-core.js`);