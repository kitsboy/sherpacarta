import fs from 'node:fs';
import path from 'node:path';

const roots = ['public', 'functions', 'scripts', 'src', 'packages'];
const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html|js|mjs|json|md|yml|yaml)$/.test(entry.name)) files.push(full);
  }
}
roots.forEach(walk);
const sourceFiles = files.filter((file) => file !== 'scripts/check-security-contracts.mjs');
const source = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const checks = [
  ['no private-key literals', !/(?:nsec1[0-9a-z]{20,}|BEGIN (?:RSA |EC )?PRIVATE KEY|-----BEGIN PRIVATE KEY-----)/i.test(source)],
  ['no common live credential assignments', !/(?:API_KEY|SECRET|TOKEN|PASSWORD)\s*[:=]\s*["'][^"']{16,}["']/i.test(source)],
  ['receipt export explicitly redacts sensitive fields', source.includes('private key') && source.includes('Redacted export')],
  ['campaign sign endpoint validates receipt hash', fs.readFileSync('functions/api/canada/sign.js', 'utf8').includes('receiptHash.length !== 64')],
  ['campaign batch endpoint requires organizer auth', fs.readFileSync('functions/api/canada/batch.js', 'utf8').includes('ORGANIZER_TOKEN')],
  ['service worker avoids caching campaign API', fs.readFileSync('public/sw.js', 'utf8').includes("startsWith('/api/canada')")],
  ['security page links threat model', fs.readFileSync('public/security.html', 'utf8').includes('THREAT-MODEL') || fs.readFileSync('public/security.html', 'utf8').includes('threat')],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) {
  console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n'));
  process.exit(1);
}
console.log(`Security contract checks passed (${checks.length}) across ${files.length} files`);
