import fs from 'node:fs';

const disclosure = fs.readFileSync('public/js/sc-disclosure.js', 'utf8');
const gates = JSON.parse(fs.readFileSync('public/data/external-gates.json', 'utf8'));
const htmlFiles = fs.readdirSync('public').filter((name) => name.endsWith('.html'));
const source = htmlFiles.map((name) => fs.readFileSync(`public/${name}`, 'utf8')).join('\n');
const ids = new Set(gates.gates.map((gate) => gate.id));
const required = ['legal-counsel','jurisdiction-review','security-audit','deployed-testing','approval-authority','canada-epetition','endorsements','treasury-custody','nostr-operations','translation-review','independent-archive'];
const checks = [
  ['disclosure helper defines DEMO DATA', disclosure.includes('DEMO DATA')],
  ['disclosure helper defines REQUIRES YOUR ACTION', disclosure.includes('REQUIRES YOUR ACTION')],
  ['external gate schema is present', gates.schema === 'sherpacarta.external-gates.v1'],
  ['all eleven external gates are recorded', required.every((id) => ids.has(id))],
  ['external gate records have no evidence claims', gates.gates.every((gate) => gate.evidence === null)],
  ['demo map is explicitly labeled', fs.readFileSync('index.html', 'utf8').includes('DEMO') && fs.readFileSync('index.html', 'utf8').includes('illustrative')],
  ['proof truth boundary remains present', source.includes('pending') && source.includes('Bitcoin')],
  ['disclosure asset is cached', fs.readFileSync('public/sw.js', 'utf8').includes('/js/sc-disclosure.js')],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Disclosure contract checks passed (${checks.length})`);
