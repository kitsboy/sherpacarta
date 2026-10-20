import fs from 'node:fs';

const html = fs.readdirSync('public', { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => fs.readFileSync(`public/${entry.name}`, 'utf8')).join('\n');
const css = fs.readFileSync('public/sc-main.css', 'utf8');
const checks = [
  ['journey helper is loaded', html.includes('/js/sc-route-ux.js') || fs.readFileSync('verify.html', 'utf8').includes('/js/sc-route-ux.js')],
  ['journey navigation has accessible label', fs.readFileSync('public/js/sc-route-ux.js', 'utf8').includes('aria-label')],
  ['journey identifies current step', fs.readFileSync('public/js/sc-route-ux.js', 'utf8').includes('aria-current')],
  ['offline messaging is present', fs.readFileSync('public/js/sc-route-ux.js', 'utf8').includes('offline')],
  ['responsive rules exist', /@media\s*\(/.test(css)],
  ['reduced motion is considered', /prefers-reduced-motion/.test(css)],
  ['verify controls expose live status', fs.readFileSync('verify.html', 'utf8').includes('aria-live')],
  ['homepage a11y trigger has a visible label and state', fs.readFileSync('public/sc-upgrades-b3.js', 'utf8').includes('>Accessibility</span>') && fs.readFileSync('public/sc-upgrades-b3.js', 'utf8').includes('aria-expanded') && fs.readFileSync('public/sc-upgrades-b3.js', 'utf8').includes('aria-controls')],
  ['a11y panel has a named close control', fs.readFileSync('public/sc-enhancements.js', 'utf8').includes('Close accessibility panel') && fs.readFileSync('public/sc-enhancements.js', 'utf8').includes('closeA11yToolbar')],
  ['a11y panel dismisses on Escape', fs.readFileSync('public/sc-enhancements.js', 'utf8').includes("e.key !== 'Escape'") && fs.readFileSync('public/sc-enhancements.js', 'utf8').includes('setA11yOpen(false)')],
  ['a11y toolbar is not forced onto a light background in every theme', !/\[data-theme="light"\] #status-dock,\.a11y-toolbar\{/.test(css)],
  ['a11y panel sets explicit light and high-contrast text', css.includes('[data-theme="light"] .a11y-toolbar button') && css.includes('[data-theme="high-contrast"] .a11y-toolbar button')],
  ['explore can collapse to a persistent handle', fs.readFileSync('public/sc-enhancements-v2.js', 'utf8').includes('explore-handle') && fs.readFileSync('public/sc-enhancements-v2.js', 'utf8').includes("localStorage.getItem('sc_explore_collapsed') === '1'")],
  ['explore collapse respects reduced motion', fs.readFileSync('public/sc-enhancements-v2.js', 'utf8').includes('prefers-reduced-motion') && css.includes('.section-dots,.a11y-toolbar,#a11y-chip')],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Accessibility contract checks passed (${checks.length})`);
