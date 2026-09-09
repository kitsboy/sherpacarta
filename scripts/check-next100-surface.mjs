import fs from 'node:fs';
const read = (file) => fs.readFileSync(file, 'utf8');
const home = read('index.html');
const css = read('public/sc-main.css');
const core = read('public/sc-core.js');
const v2 = read('public/sc-enhancements-v2.js');
const v3 = read('public/sc-enhancements-v3.js');
const homeVersions = [...home.matchAll(/(?:href|src)="\/[^"]+\.(?:css|js)\?v=([^"&]+)"/g)].map((m) => m[1]);
const checks = [
  ['rights education page exists', fs.existsSync('public/rights.html')],
  ['rights page is secular', /secular|nonpartisan|nonreligious/i.test(read('public/rights.html'))],
  ['rights page rejects current-law claim', /not current law/i.test(read('public/rights.html'))],
  ['rights taxonomy is linked', read('public/rights.html').includes('/data/rights-taxonomy.json')],
  ['SEO metadata has eight locales', Object.keys(JSON.parse(read('public/data/seo-i18n.json')).locales).length === 8],
  ['all non-English SEO entries require review', Object.entries(JSON.parse(read('public/data/seo-i18n.json')).locales).filter(([locale]) => locale !== 'en').every(([, value]) => value.review.includes('review'))],
  ['video handoff has two scripts', read('docs/VIDEO-ONE-MINUTE-HANDOFF.md').includes('Film 1') && read('docs/VIDEO-ONE-MINUTE-HANDOFF.md').includes('Film 2')],
  ['video handoff preserves proof boundary', read('docs/VIDEO-ONE-MINUTE-HANDOFF.md').includes('does not prove the text is true')],
  ['share page has platform copy', ['WhatsApp', 'Nostr', 'X / Facebook'].every((value) => read('public/share.html').includes(value))],
  ['disclosure script is loaded on share page', read('public/share.html').includes('/js/sc-disclosure.js')],
  ['sitemap generator includes rights route', read('scripts/generate-sitemap.mjs').includes('/rights.html')],
  ['hero splits local sign vs Canada campaign', home.includes('hero-choice') && home.includes('/canada/sign') && home.includes('House of Commons')],
  ['start page includes Canadian and Media roles', ['CANADIAN', 'MEDIA', '/canada/sign', '/press-kit.html'].every((value) => read('public/start.html').includes(value))],
  ['empty-state styles exist', css.includes('.sc-empty')],
  ['home styles and scripts share one cache-bust token', homeVersions.length > 0 && homeVersions.every((v) => v === homeVersions[0])],
  ['home does not load upgrade batches as script tags', !/sc-upgrades-b\d+\.js/.test(home)],
  ['home executes the production bundle', /\/sc-bundle\.js\?v=/.test(home)],
  ['home has no script preloads', !/<link[^>]+rel=["']preload["'][^>]+as=["']script["']/.test(home)],
  ['first visit stays quiet', !/Welcome to SherpaCarta|features active|Tip: tap ☰|rights warrior|Lightning wallet live/.test(home + core + v2 + v3)],
  ['explore rail hidden on small screens', css.includes('@media(max-width:768px)') && css.includes('.section-dots{display:none!important}')],
  ['cookie banner clears the mobile bottom nav', /#cookie-banner\{[\s\S]*?bottom:calc\(var\(--bottom-nav-h\)/.test(css)],
  ['cookie banner actions are 44px on mobile', css.includes('#cookie-banner .cookie-actions .btn{min-height:44px')],
  ['toast stack clears the mobile bottom nav', /#toast-stack\{[^}]*--bottom-nav-h/.test(css)],
  ['home transparency surface exists', home.includes('transparency-heading') && home.includes('What this site can and cannot do')],
  ['transparency names the House of Commons boundary', /id="transparency-heading"[\s\S]{0,1200}House of Commons/.test(home)],
  ['pending is not Bitcoin-confirmed on verify', read('public/verify.html').includes('Pending is not Bitcoin-confirmed')],
  ['local export and delete remain on home sign', home.includes('exportLocalSignData') && home.includes('clearLocalSignData')],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Next-100 surface checks passed (${checks.length})`);
