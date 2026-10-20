import fs from 'node:fs';

const files = {
  verify: fs.readFileSync('verify.html', 'utf8'),
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
  ['homepage does not claim zero tracking', !/zero tracking/i.test(fs.readFileSync('index.html', 'utf8'))],
  ['homepage does not deny analytics', !/no analytics/i.test(fs.readFileSync('index.html', 'utf8')) && !/zero analytics/i.test(fs.readFileSync('index.html', 'utf8'))],
  ['homepage privacy claim links to the policy', fs.readFileSync('index.html', 'utf8').includes('No ad trackers') && fs.readFileSync('index.html', 'utf8').includes('href="/privacy"')],
  ['homepage names our counter and the IP boundary', fs.readFileSync('index.html', 'utf8').includes('analytics.giveabit.io') && fs.readFileSync('index.html', 'utf8').includes('Your IP address is not saved there')],
  ['social meta source matches the homepage claim', fs.readFileSync('scripts/apply-social-meta.mjs', 'utf8').includes('No ad trackers or tracking cookies') && !fs.readFileSync('scripts/apply-social-meta.mjs', 'utf8').includes('Earth. Zero tracking.')],
  ['high-impact pages do not claim zero tracking', ['index.html', 'public/press.html', 'public/press-kit.html', 'public/briefing.html', 'public/leave-behind.html', 'public/canada/about.html', 'public/canada/join.html', 'public/canada/proof.html', 'public/report/2026-report.html', 'public/humans.txt', 'public/js/sc-share.js', 'public/og-image.svg'].every((file) => !/zero tracking/i.test(fs.readFileSync(file, 'utf8')))],
  ['live bundle copy does not claim zero tracking', !/zero tracking/i.test(fs.readFileSync('public/sc-enhancements.js', 'utf8') + fs.readFileSync('public/sc-upgrades-b3.js', 'utf8') + fs.readFileSync('public/sc-upgrades-b14.js', 'utf8'))],
  ['phone explore rail stays hidden', fs.readFileSync('public/sc-main.css', 'utf8').includes('@media(max-width:768px)') && fs.readFileSync('public/sc-main.css', 'utf8').includes('.section-dots{display:none!important}')],
];
const failed = required.filter(([, ok]) => !ok);
if (failed.length) {
  console.error(failed.map(([name]) => `FAIL: ${name}`).join('\n'));
  process.exit(1);
}
console.log(`Public contract checks passed (${required.length})`);
