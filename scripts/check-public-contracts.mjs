import fs from 'node:fs';

const files = {
  verify: fs.readFileSync('public/verify.html', 'utf8'),
  lifecycle: fs.readFileSync('public/js/sc-proof-lifecycle.js', 'utf8'),
  tools: fs.readFileSync('public/js/sc-proof-tools.js', 'utf8'),
  sw: fs.readFileSync('public/sw.js', 'utf8'),
};
const required = [
  ['verify page loads lifecycle helper', files.verify.includes('/js/sc-proof-lifecycle.js')],
  ['verify page has public stamp ID input', files.verify.includes('id="proof-id"')],
  ['lifecycle uses bounded polling', files.lifecycle.includes('MAX_POLLS') && files.lifecycle.includes('DELAY_MS')],
  ['lifecycle distinguishes confirmed', files.lifecycle.includes("status === 'confirmed'")],
  ['lifecycle encodes public ID', files.lifecycle.includes('encodeURIComponent(id)')],
  ['receipt export is redacted', files.tools.includes('Redacted export')],
  ['private keys excluded from export', files.tools.includes('private key')],
  ['service worker caches lifecycle helper', files.sw.includes('/js/sc-proof-lifecycle.js')],
  ['canonical Satohash stamp route remains documented', fs.readFileSync('docs/LEARN-STAMP-FAMILY.md', 'utf8').includes('/stamp?hash=&ref=')],
];
const failed = required.filter(([, ok]) => !ok);
if (failed.length) {
  console.error(failed.map(([name]) => `FAIL: ${name}`).join('\n'));
  process.exit(1);
}
console.log(`Public contract checks passed (${required.length})`);
