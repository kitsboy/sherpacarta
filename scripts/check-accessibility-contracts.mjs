import fs from 'node:fs';

const html = fs.readdirSync('public', { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => fs.readFileSync(`public/${entry.name}`, 'utf8')).join('\n');
const css = fs.readFileSync('public/sc-main.css', 'utf8');
const checks = [
  ['journey helper is loaded', html.includes('/js/sc-route-ux.js') || fs.readFileSync('public/verify.html', 'utf8').includes('/js/sc-route-ux.js')],
  ['journey navigation has accessible label', fs.readFileSync('public/js/sc-route-ux.js', 'utf8').includes('aria-label')],
  ['journey identifies current step', fs.readFileSync('public/js/sc-route-ux.js', 'utf8').includes('aria-current')],
  ['offline messaging is present', fs.readFileSync('public/js/sc-route-ux.js', 'utf8').includes('offline')],
  ['responsive rules exist', /@media\s*\(/.test(css)],
  ['reduced motion is considered', /prefers-reduced-motion/.test(css)],
  ['verify controls expose live status', fs.readFileSync('public/verify.html', 'utf8').includes('aria-live')],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Accessibility contract checks passed (${checks.length})`);
