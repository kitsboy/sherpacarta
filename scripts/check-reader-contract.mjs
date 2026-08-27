import fs from 'node:fs';

const required = [
  ['index.html', '/js/sc-rights-reader.js'],
  ['public/sw.js', '/js/sc-rights-reader.js'],
  ['public/js/sc-rights-reader.js', 'rights-taxonomy.json'],
  ['public/js/sc-rights-reader.js', 'Copy citation'],
  ['public/data/rights-taxonomy.json', 'articleMetadata'],
];
const errors = [];
for (const [file, needle] of required) {
  if (!fs.existsSync(file) || !fs.readFileSync(file, 'utf8').includes(needle)) errors.push(`${file}: missing ${needle}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Reader contract checks passed');
