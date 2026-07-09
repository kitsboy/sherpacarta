#!/usr/bin/env node
/**
 * Inject complete Open Graph + Twitter Card meta into all public HTML pages
 * so WhatsApp, Telegram, Signal, X, LinkedIn, iMessage render strong previews.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://sherpacarta.org';

/** @type {Record<string, { title: string, description: string, image: string, path: string }>} */
const PAGES = {
  'index.html': {
    title: 'SherpaCarta — The Global Digital Magna Carta',
    description:
      '114 living articles protecting privacy, data sovereignty, and freedom online for every person on Earth. Zero tracking. Bitcoin-funded. Sign the charter.',
    image: '/og/default.png',
    path: '/',
  },
  'public/briefing.html': {
    title: 'SherpaCarta — Executive Briefing for Decision-Makers',
    description:
      'Two-page print briefing: what SherpaCarta is, why digital rights matter, how it works, Canada petition path, and key links for elected officials.',
    image: '/og/default.png',
    path: '/briefing.html',
  },
  'public/briefing-fr.html': {
    title: 'SherpaCarta — Note de breffage pour décideurs',
    description:
      'Note imprimable : qu’est-ce que SherpaCarta, pourquoi c’est important, pétition canadienne et liens clés pour les élus.',
    image: '/og/default.png',
    path: '/briefing-fr.html',
  },
  'public/leave-behind.html': {
    title: 'SherpaCarta — One-Page Leave-Behind',
    description:
      'One-page handout for staffers: what it is, the Canada ask, key articles, and links. Privacy is a birthright.',
    image: '/og/default.png',
    path: '/leave-behind.html',
  },
  'public/canada/index.html': {
    title: 'Canada Digital Rights Petition — SherpaCarta',
    description:
      'Sign the campaign, print the federal Commons sheet, or prepare the official e-petition path. Canadian citizens & residents · no ID · no minimum age.',
    image: '/og/canada.png',
    path: '/canada/',
  },
  'public/canada/sign.html': {
    title: 'Sign for Canada — SherpaCarta Campaign',
    description:
      '30-second campaign commitment for digital human rights. Privacy-first receipt. Not the Parliamentary e-petition until an MP authorizes e-###.',
    image: '/og/sign.png',
    path: '/canada/sign.html',
  },
  'public/canada/join.html': {
    title: 'Join SherpaCarta Canada — You Scanned a Sheet',
    description:
      'Add your digital campaign commitment and keep the ink on the paper petition. Dual-track: movement + Parliament.',
    image: '/og/join.png',
    path: '/canada/join',
  },
  'public/canada/paper.html': {
    title: 'Print Federal Petition Sheet — SherpaCarta Canada',
    description:
      'One House of Commons sheet for all of Canada. Every province counts. Original ink · QR to join online · MP presents.',
    image: '/og/paper.png',
    path: '/canada/paper.html',
  },
  'public/canada/official.html': {
    title: 'Official e-Petition Path — SherpaCarta Canada',
    description:
      'Status of the House of Commons e-petition, MP outreach tools, and federal prayer text. Campaign and paper sheets available now.',
    image: '/og/canada.png',
    path: '/canada/official.html',
  },
  'public/canada/proof.html': {
    title: 'Cryptographic Proof — SherpaCarta Canada',
    description:
      'SHA-256 petition hash, merkle roots, and Satohash Bitcoin stamps. Verify integrity without exposing identities.',
    image: '/og/canada.png',
    path: '/canada/proof.html',
  },
  'public/canada/organizer.html': {
    title: 'Organizer Tools — SherpaCarta Canada',
    description:
      'Log paper batches, print federal sheets, and run town halls for the Canada digital rights petition.',
    image: '/og/paper.png',
    path: '/canada/organizer.html',
  },
  'public/canada/about.html': {
    title: 'About SherpaCarta Canada',
    description:
      'Global Digital Magna Carta. Canada first. Dual-track petition. Zero tracking. Living document — rights only expand.',
    image: '/og/canada.png',
    path: '/canada/about.html',
  },
  'public/canada/bc/index.html': {
    title: 'BC Digital Rights Challenge — SherpaCarta',
    description:
      'British Columbia is the beachhead. Federal petition signatures from BC already count for Canada. Organize · print · sign.',
    image: '/og/canada.png',
    path: '/canada/bc/',
  },
  'public/treasury.html': {
    title: 'Treasury — SherpaCarta',
    description:
      'Bitcoin-funded only. Live on-chain transparency. No VC, no ads, no government grants. Fund digital human rights.',
    image: '/og/treasury.png',
    path: '/treasury.html',
  },
  'public/security.html': {
    title: 'Security & Bug Bounty — SherpaCarta',
    description:
      'Privacy by design. Open source. Responsible disclosure and bug bounty for the Global Digital Magna Carta.',
    image: '/og/security.png',
    path: '/security.html',
  },
  'public/press.html': {
    title: 'Press Room — SherpaCarta',
    description:
      'Media assets, boilerplate, and story angles for the Global Digital Magna Carta. Contact hello@giveabit.io.',
    image: '/og/default.png',
    path: '/press.html',
  },
  'public/press-kit.html': {
    title: 'Press Kit — SherpaCarta',
    description:
      'One-liners, facts, assets, and Canada campaign details for journalists and institutions.',
    image: '/og/default.png',
    path: '/press-kit.html',
  },
  'public/comparison.html': {
    title: 'SherpaCarta vs Magna Carta vs GDPR — Comparison',
    description:
      'How the Global Digital Magna Carta extends 1215, Iceland 2011, and modern privacy law into the AI era.',
    image: '/og/default.png',
    path: '/comparison.html',
  },
  'public/changelog.html': {
    title: 'Changelog — SherpaCarta',
    description: 'Version history of the Global Digital Magna Carta site and charter releases.',
    image: '/og/default.png',
    path: '/changelog.html',
  },
  'public/accessibility.html': {
    title: 'Accessibility — SherpaCarta',
    description: 'Accessibility statement for sherpacarta.org — high contrast, reduced motion, keyboard access.',
    image: '/og/default.png',
    path: '/accessibility.html',
  },
  'public/status.html': {
    title: 'Status — SherpaCarta',
    description: 'Service status for the SherpaCarta Global Digital Magna Carta.',
    image: '/og/default.png',
    path: '/status.html',
  },
  'public/bc/town-hall-kit.html': {
    title: 'Town Hall Kit — SherpaCarta BC',
    description: '90-minute agenda and materials to run a digital rights town hall in British Columbia.',
    image: '/og/canada.png',
    path: '/bc/town-hall-kit.html',
  },
  'public/bc/model-bill.html': {
    title: 'BC Model Bill — SherpaCarta',
    description: 'Model legislative language for a BC Digital Rights Act drawn from the SherpaCarta charter.',
    image: '/og/canada.png',
    path: '/bc/model-bill.html',
  },
  'public/bc/safe-harbour.html': {
    title: 'Municipal Safe Harbour — SherpaCarta',
    description: 'Safe Harbour standards for cities adopting digital rights protections.',
    image: '/og/canada.png',
    path: '/bc/safe-harbour.html',
  },
  'public/bc/indigenous-data.html': {
    title: 'Indigenous Data Sovereignty — SherpaCarta',
    description: 'Digital rights and data sovereignty for Indigenous nations and communities.',
    image: '/og/canada.png',
    path: '/bc/indigenous-data.html',
  },
  'public/report/2026-report.html': {
    title: '2026 Report — SherpaCarta',
    description: 'Annual report and transparency notes for the Global Digital Magna Carta movement.',
    image: '/og/default.png',
    path: '/report/2026-report.html',
  },
};

const MARKER_START = '<!-- ═══ SOCIAL PREVIEW META (auto) ═══ -->';
const MARKER_END = '<!-- ═══ /SOCIAL PREVIEW META ═══ -->';

function buildBlock(cfg) {
  const url = SITE + cfg.path;
  const image = SITE + cfg.image;
  // Cache-bust for crawlers that stuck on old cards (WhatsApp is aggressive)
  const imageV = image + (image.includes('?') ? '&' : '?') + 'v=724';
  const title = cfg.title;
  const desc = cfg.description;

  return `${MARKER_START}
<meta property="og:type" content="website">
<meta property="og:site_name" content="SherpaCarta">
<meta property="og:locale" content="en_CA">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${imageV}">
<meta property="og:image:secure_url" content="${imageV}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@give_bit">
<meta name="twitter:creator" content="@give_bit">
<meta name="twitter:url" content="${url}">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${imageV}">
<meta name="twitter:image:alt" content="${esc(title)}">
<meta name="description" content="${esc(desc)}">
${MARKER_END}`;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function stripOldSocial(html) {
  // Remove all prior auto blocks (full or empty)
  html = html.replace(
    new RegExp(`${MARKER_START}[\s\S]*?${MARKER_END}\s*`, 'g'),
    ''
  );
  // Remove orphan empty markers
  html = html.replace(new RegExp(`${MARKER_START}\s*`, 'g'), '');
  html = html.replace(new RegExp(`${MARKER_END}\s*`, 'g'), '');
  // Remove common hand-written social tags (keep title element)
  const patterns = [
    /<meta\s+property="og:[^"]+"\s+content="[^"]*"\s*\/?>\s*/gi,
    /<meta\s+name="twitter:[^"]+"\s+content="[^"]*"\s*\/?>\s*/gi,
    /<!--\s*═══\s*OPEN GRAPH[\s\S]*?-->\s*/gi,
    /<!--\s*═══\s*TWITTER[\s\S]*?-->\s*/gi,
  ];
  for (const p of patterns) html = html.replace(p, '');
  return html;
}

function inject(html, block) {
  // Prefer after <title>...</title> or after charset
  if (/<\/title>/i.test(html)) {
    return html.replace(/<\/title>/i, `</title>\n${block}`);
  }
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => `${m}\n${block}`);
  }
  return block + '\n' + html;
}

let n = 0;
for (const [rel, cfg] of Object.entries(PAGES)) {
  const file = join(root, rel);
  try {
    let html = readFileSync(file, 'utf8');
    html = stripOldSocial(html);
    // Remove first meta name=description to avoid duplicates (we'll add one)
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>\s*/i, '');
    const block = buildBlock(cfg);
    html = inject(html, block);
    writeFileSync(file, html);
    n++;
    console.log('Patched', rel);
  } catch (e) {
    console.warn('Skip', rel, e.message);
  }
}

console.log(`Social meta applied to ${n} pages.`);
