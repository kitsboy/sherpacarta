import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('public/data/seo-i18n.json', 'utf8'));
const required = ['en', 'fr', 'es', 'de', 'pt', 'sw', 'ar', 'zh'];
const serialized = JSON.stringify(data);
const checks = [
  ['SEO schema', data.schema === 'sherpacarta.seo-i18n.v1'],
  ['all eight locales', required.every((locale) => data.locales[locale])],
  ['all entries have title/description/review', required.every((locale) => data.locales[locale].title && data.locales[locale].description && data.locales[locale].review)],
  ['non-English entries require human review', required.filter((locale) => locale !== 'en').every((locale) => data.locales[locale].review.includes('review'))],
  ['secular framing is explicit', /secular|nonpartisan|not religion/i.test(data.framing)],
  ['current-law boundary is explicit', /current law|not.*law|No es ley|pas.*loi|nicht.*Gesetz/i.test(serialized)],
  ['no invented rankings or metrics', !/rank|million|countries reached|endorsement/i.test(serialized)],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`SEO/i18n checks passed (${checks.length})`);
