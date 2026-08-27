import fs from 'node:fs';
import path from 'node:path';

const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(html|js|json|md)$/.test(entry.name)) files.push(file);
  }
}
walk('public');
const press = ['public/press.html', 'public/press-kit.html', 'public/share.html'];
const checks = [
  ['demo catalog exists', fs.existsSync('docs/DEMO-DATA-CATALOG.md')],
  ['all primary press surfaces label demo content', press.every((file) => fs.readFileSync(file, 'utf8').includes('DEMO DATA'))],
  ['fictional Steve Jobs example is documented safely', fs.readFileSync('docs/SOCIAL-PRESS-SYSTEM.md', 'utf8').includes('Steve Jobs') && fs.readFileSync('docs/SOCIAL-PRESS-SYSTEM.md', 'utf8').includes('fictional example')],
  ['no public Steve Jobs claim exists', !files.filter((file) => !file.includes('docs')).some((file) => /Steve Jobs/.test(fs.readFileSync(file, 'utf8')))],
  ['external gate data has no evidence', JSON.parse(fs.readFileSync('public/data/external-gates.json', 'utf8')).gates.every((gate) => gate.evidence === null)],
  ['share page includes Open Graph metadata', fs.readFileSync('public/share.html', 'utf8').includes('og:image')],
  ['share page includes Nostr copy', fs.readFileSync('public/share.html', 'utf8').includes('Nostr')],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Demo-data checks passed (${checks.length})`);
