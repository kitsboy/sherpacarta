import fs from 'node:fs';
const read = (file) => fs.readFileSync(file, 'utf8');
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
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Next-100 surface checks passed (${checks.length})`);
