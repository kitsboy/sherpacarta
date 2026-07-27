#!/usr/bin/env node
/**
 * Generate high-impact 1200×630 PNG social cards for X, WhatsApp, Telegram, iMessage, LinkedIn.
 * Solid backgrounds (no transparency) for crawler reliability.
 * Includes brand mark when public/brand-mark.png is present.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'og');
mkdirSync(outDir, { recursive: true });

const markPath = join(root, 'public', 'brand-mark.png');
let markDataUri = '';
if (existsSync(markPath)) {
  const b64 = readFileSync(markPath).toString('base64');
  markDataUri = `data:image/png;base64,${b64}`;
}

const CARDS = [
  {
    file: 'default.png',
    eyebrow: '1215  →  2026',
    title: 'SherpaCarta',
    subtitle: 'A Magna Carta for the Digital Age',
    line: '114 articles  ·  Privacy is a birthright  ·  Sign the charter',
    cta: 'SHERPACARTA.ORG',
  },
  {
    file: 'discuss.png',
    eyebrow: 'PUBLIC SQUARE  ·  NOSTR + X',
    title: 'Join the discussion',
    subtitle: '#Sherpacarta · @give_bit · sherpa@',
    line: 'Open protocol + mainstream reach  ·  Digital rights in public',
    cta: 'SHERPACARTA.ORG/NOSTR',
  },
  {
    file: 'canada.png',
    eyebrow: '🇨🇦  CANADA DIGITAL RIGHTS',
    title: 'Sign for Canada',
    subtitle: 'Campaign · Paper · Path to e-petition',
    line: 'Citizen or resident  ·  No ID  ·  Toward official e-###',
    cta: 'SHERPACARTA.ORG/CANADA',
  },
  {
    file: 'sign.png',
    eyebrow: '30-SECOND COMMITMENT',
    title: 'Assert your rights',
    subtitle: 'Sign the living digital charter',
    line: 'Local-first  ·  Optional Nostr  ·  Zero tracking',
    cta: 'SHERPACARTA.ORG  ·  SIGN NOW',
  },
  {
    file: 'paper.png',
    eyebrow: 'HOUSE OF COMMONS  ·  PAPER',
    title: 'Print & sign in ink',
    subtitle: 'One federal sheet for all of Canada',
    line: 'BC · ON · QC · every province counts federally',
    cta: 'SHERPACARTA.ORG/CANADA/PAPER',
  },
  {
    file: 'join.png',
    eyebrow: 'YOU SCANNED A SHEET',
    title: 'Join the movement',
    subtitle: 'Digital campaign + paper for Parliament',
    line: 'Scan to sign online  ·  Ink still counts on the sheet',
    cta: 'SHERPACARTA.ORG/CANADA/JOIN',
  },
  {
    file: 'treasury.png',
    eyebrow: 'BITCOIN-FUNDED  ·  ZERO VC',
    title: 'Live treasury',
    subtitle: 'On-chain transparency for the movement',
    line: 'No ads  ·  No grants  ·  Citizens only',
    cta: 'SHERPACARTA.ORG/TREASURY',
  },
  {
    file: 'security.png',
    eyebrow: 'OPEN SOURCE  ·  BUG BOUNTY',
    title: 'Security & trust',
    subtitle: 'Privacy by design is non-negotiable',
    line: 'Report responsibly  ·  Build in public',
    cta: 'SHERPACARTA.ORG/SECURITY',
  },
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cardSvg(c) {
  const eyebrow = escapeXml(c.eyebrow);
  const title = escapeXml(c.title);
  const subtitle = escapeXml(c.subtitle);
  const line = escapeXml(c.line);
  const cta = escapeXml(c.cta);
  const titleSize = c.title.length > 18 ? 68 : 88;

  const mark = markDataUri
    ? `<image href="${markDataUri}" x="920" y="140" width="200" height="320" opacity="0.95" preserveAspectRatio="xMidYMid meet"/>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050806"/>
      <stop offset="50%" stop-color="#0a1410"/>
      <stop offset="100%" stop-color="#0c1a14"/>
    </linearGradient>
    <radialGradient id="glow" cx="22%" cy="18%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="88%" cy="75%" r="40%">
      <stop offset="0%" stop-color="#f7931a" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#f7931a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Opaque base (critical for WhatsApp / some X crawlers) -->
  <rect width="1200" height="630" fill="#050806"/>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Subtle grid -->
  <g opacity="0.1" stroke="#34d399" stroke-width="1">
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${70 + i * 70}" x2="1200" y2="${70 + i * 70}"/>`).join('')}
    ${Array.from({ length: 16 }, (_, i) => `<line x1="${60 + i * 75}" y1="0" x2="${60 + i * 75}" y2="630"/>`).join('')}
  </g>

  <!-- Accent rails -->
  <rect x="0" y="0" width="12" height="630" fill="#10b981"/>
  <rect x="12" y="0" width="4" height="630" fill="#f7931a"/>

  <!-- Brand chip -->
  <rect x="56" y="44" width="248" height="42" rx="21" fill="#0c1812" stroke="#34d399" stroke-width="1.5"/>
  <text x="180" y="71" text-anchor="middle" fill="#6ee7b7" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16" letter-spacing="3.5" font-weight="600">SHERPACARTA</text>

  <!-- Brand mark (right) -->
  ${mark}

  <!-- Eyebrow -->
  <text x="60" y="150" fill="#f7931a" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19" letter-spacing="3.5">${eyebrow}</text>

  <!-- Title -->
  <text x="60" y="255" fill="#f4faf6" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" font-weight="700">${title}</text>

  <!-- Subtitle -->
  <text x="60" y="325" fill="#6ee7b7" font-family="Georgia, 'Times New Roman', serif" font-size="32" font-style="italic">${subtitle}</text>

  <!-- Gold/emerald divider -->
  <rect x="60" y="360" width="120" height="5" rx="2" fill="#10b981"/>
  <rect x="188" y="360" width="40" height="5" rx="2" fill="#f7931a"/>

  <!-- Supporting line -->
  <text x="60" y="420" fill="#b8c4b8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19" letter-spacing="0.5">${line}</text>

  <!-- Bottom bar -->
  <rect x="0" y="530" width="1200" height="100" fill="#07100b"/>
  <rect x="0" y="530" width="1200" height="3" fill="#10b981"/>
  <text x="60" y="590" fill="#34d399" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="23" letter-spacing="4" font-weight="600">${cta}</text>
  <text x="1140" y="590" text-anchor="end" fill="#6a7a6a" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" letter-spacing="2">GIVE A BIT</text>
</svg>`;
}

for (const c of CARDS) {
  const svg = cardSvg(c);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: '#050806',
  });
  const png = resvg.render().asPng();
  writeFileSync(join(outDir, c.file), png);
  console.log(`Wrote public/og/${c.file} (${(png.length / 1024).toFixed(1)} KB)`);
}

const defPng = new Resvg(cardSvg(CARDS[0]), {
  fitTo: { mode: 'width', value: 1200 },
  background: '#050806',
}).render().asPng();
writeFileSync(join(root, 'public', 'og-image.png'), defPng);
console.log('Updated public/og-image.png');
console.log('OG cards ready (brand mark:', markDataUri ? 'yes' : 'no', ')');
