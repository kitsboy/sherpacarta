#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const charter = JSON.parse(readFileSync(join(root, 'public/api/v1/charter.json'), 'utf8'));

const staticUrls = [
  { loc: 'https://sherpacarta.org/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/#charter', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/#sign', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/#canada-bc', priority: '0.85', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/#faq', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/changelog.html', priority: '0.6', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/comparison.html', priority: '0.75', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/press.html', priority: '0.75', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/press-kit.html', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/charter.txt', priority: '0.75', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/humans.txt', priority: '0.3', changefreq: 'yearly' },
  { loc: 'https://sherpacarta.org/canada/', priority: '0.95', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/canada/sign.html', priority: '0.95', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/canada/join', priority: '0.95', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/canada/paper.html', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/canada/official.html', priority: '0.85', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/canada/bc/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/canada/proof.html', priority: '0.85', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/canada/about.html', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/treasury.html', priority: '0.7', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/security.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/report/2026-report.html', priority: '0.7', changefreq: 'yearly' },
  { loc: 'https://sherpacarta.org/bc/model-bill.html', priority: '0.75', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/bc/safe-harbour.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/bc/indigenous-data.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/bc/town-hall-kit.html', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://sherpacarta.org/status.html', priority: '0.5', changefreq: 'weekly' },
  { loc: 'https://sherpacarta.org/accessibility.html', priority: '0.5', changefreq: 'monthly' },
  ...['es', 'fr', 'de', 'zh', 'pt', 'ar', 'sw'].map((l) => ({
    loc: `https://sherpacarta.org/?lang=${l}`, priority: '0.8', changefreq: 'monthly',
  })),
];

const articleUrls = charter.articles
  .filter((a) => a.num.startsWith('Art.'))
  .map((a) => ({
    loc: `https://sherpacarta.org/?article=${a.num.replace('Art. ', '')}`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

const urls = [...staticUrls, ...articleUrls];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(root, 'public/sitemap.xml'), xml);
console.log(`Sitemap: ${urls.length} URLs (${articleUrls.length} articles)`);