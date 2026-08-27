import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const files = ['public/sw.js', 'public/js/sc-disclosure.js', 'public/js/sc-proof-lifecycle.js', 'public/js/sc-proof-tools.js', 'functions/api/canada/sign.js', 'functions/api/canada/batch.js', 'functions/api/canada/_shared.js'];
const source = files.map(read).join('\n');
const checks = [
  ['no private-key literals', !/(?:nsec1[0-9a-z]{20,}|BEGIN (?:RSA |EC )? PRIVATE KEY|-----BEGIN PRIVATE KEY-----)/i.test(source)],
  ['no common live credential assignments', !/(?:API_KEY|SECRET|TOKEN|PASSWORD)\s*[:=]\s*["'][^"']{16,}["']/i.test(source)],
  ['receipt export explicitly redacts sensitive fields', read('public/js/sc-proof-tools.js').includes('private key') && read('public/js/sc-proof-tools.js').includes('Redacted export')],
  ['campaign sign endpoint validates receipt hash', read('functions/api/canada/sign.js').includes('receiptHash.length !== 64')],
  ['campaign batch endpoint requires organizer auth', read('functions/api/canada/batch.js').includes('ORGANIZER_TOKEN')],
  ['service worker avoids caching campaign API', read('public/sw.js').includes("startsWith('/api/canada')")],
  ['security page links threat model', read('public/security.html').includes('threat')],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Security contract checks passed (${checks.length}) across ${files.length} production files`);
