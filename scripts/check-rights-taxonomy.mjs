import fs from 'node:fs';
const taxonomy = JSON.parse(fs.readFileSync('public/data/rights-taxonomy.json', 'utf8'));
const charter = JSON.parse(fs.readFileSync('data/charter.json', 'utf8'));
const articles = charter.articles || charter.chapters?.flatMap((chapter) => chapter.articles || []) || [];
const nums = new Set(articles.map((article) => Number(String(article.num).replace(/\D/g, ''))).filter(Boolean));
const refs = taxonomy.categories.flatMap((category) => category.articles);
const checks = [
  ['taxonomy schema', taxonomy.schema === 'sherpacarta.rights-taxonomy.v1'],
  ['categories present', taxonomy.categories.length >= 6],
  ['article references exist', refs.every((num) => nums.has(num))],
  ['legal boundary explicit', /not a legal classification|not legal advice/i.test(taxonomy.disclosure)],
  ['review boundaries explicit', taxonomy.articleMetadata.legalReview === 'not-completed' && taxonomy.articleMetadata.translationReview === 'not-completed'],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Rights taxonomy checks passed (${checks.length})`);
