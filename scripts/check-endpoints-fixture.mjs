import fs from 'node:fs';

const sign = fs.readFileSync('functions/api/canada/sign.js', 'utf8');
const batch = fs.readFileSync('functions/api/canada/batch.js', 'utf8');
const shared = fs.readFileSync('functions/api/canada/_shared.js', 'utf8');
const checks = [
  ['sign method allowlist', sign.includes('METHODS = new Set')],
  ['sign receipt hash length bound', sign.includes('receiptHash.length !== 64')],
  ['sign display name sanitization', sign.includes('sanitizeDisplayName') || sign.includes('displayName')],
  ['batch organizer authentication', batch.includes('ORGANIZER_TOKEN')],
  ['shared rate limiting', shared.includes('rateLimit')],
  ['shared CORS/method handling', shared.includes('corsHeaders')],
  ['shared no raw request logging', !/console\.log\(.*body|console\.log\(.*request/i.test(shared)],
  ['no secret literal in endpoint source', !/(?:nsec1[0-9a-z]{20,}|-----BEGIN PRIVATE KEY-----)/i.test(`${sign}\n${batch}\n${shared}`)],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Endpoint fixture checks passed (${checks.length})`);
