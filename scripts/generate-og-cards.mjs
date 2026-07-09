#!/usr/bin/env node
/**
 * Generate high-impact 1200×630 PNG social cards for WhatsApp, Telegram, Signal, X, etc.
 * Solid backgrounds (no alpha) for maximum compatibility.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'og');
mkdirSync(outDir, { recursive: true });

const CARDS = [
  {
    file: 'default.png',
    eyebrow: '1215  →  2026',
    title: 'SherpaCarta',
    subtitle: 'A Magna Carta for the Digital Age',
    line: '114 articles  ·  Privacy is a birthright  ·  Zero tracking',
    cta: 'SHERPACARTA.ORG',
  },
  {
    file: 'canada.png',
    eyebrow: '🇨🇦  CANADA DIGITAL RIGHTS',
    title: 'Sign for Canada',
    subtitle: 'Campaign · Federal paper · Parliament path',
    line: 'Citizen or resident  ·  No ID  ·  No minimum age',
    cta: 'SHERPACARTA.ORG/CANADA',
  },
  {
    file: 'sign.png',
    eyebrow: '30-SECOND CAMPAIGN COMMITMENT',
    title: 'Assert your rights',
    subtitle: 'Sign the living digital charter',
    line: 'Local-first  ·  Optional Nostr  ·  SHA-256 receipt',
    cta: 'SHERPACARTA.ORG  ·  SIGN NOW',
  },
  {
    file: 'paper.png',
    eyebrow: 'HOUSE OF COMMONS  ·  PAPER PETITION',
    title: 'Print & sign in ink',
    subtitle: 'One federal sheet for all of Canada',
    line: 'BC · ON · QC · every province counts federally',
    cta: 'SHERPACARTA.ORG/CANADA/PAPER',
  },
  {
    file: 'join.png',
    eyebrow: 'YOU SCANNED A PETITION SHEET',
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

  // Title size adapts slightly for longer strings
  const titleSize = c.title.length > 18 ? 72 : 92;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050806"/>
      <stop offset="55%" stop-color="#0a120c"/>
      <stop offset="100%" stop-color="#0c1a12"/>
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="20%" r="55%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="80%" r="45%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Solid base (no alpha) for WhatsApp/Telegram reliability -->
  <rect width="1200" height="630" fill="#050806"/>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Grid -->
  <g opacity="0.12" stroke="#10b981" stroke-width="1">
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${70 + i * 70}" x2="1200" y2="${70 + i * 70}"/>`).join('')}
    ${Array.from({ length: 16 }, (_, i) => `<line x1="${60 + i * 75}" y1="0" x2="${60 + i * 75}" y2="630"/>`).join('')}
  </g>

  <!-- Left accent bar -->
  <rect x="0" y="0" width="10" height="630" fill="#10b981"/>
  <rect x="10" y="0" width="3" height="630" fill="#d4af37" opacity="0.7"/>

  <!-- Top brand chip -->
  <rect x="56" y="48" width="220" height="40" rx="20" fill="#0f1a12" stroke="#10b981" stroke-opacity="0.45"/>
  <text x="166" y="74" text-anchor="middle" fill="#34d399" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" letter-spacing="3">SHERPACARTA</text>

  <!-- Eyebrow -->
  <text x="60" y="160" fill="#d4af37" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" letter-spacing="4">${eyebrow}</text>

  <!-- Title -->
  <text x="60" y="270" fill="#f0f5f0" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" font-weight="700">${title}</text>

  <!-- Subtitle -->
  <text x="60" y="340" fill="#6ee7b7" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-style="italic">${subtitle}</text>

  <!-- Divider -->
  <rect x="60" y="380" width="160" height="4" rx="2" fill="#10b981"/>

  <!-- Line -->
  <text x="60" y="440" fill="#a8b4a8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" letter-spacing="1">${line}</text>

  <!-- Bottom CTA bar -->
  <rect x="0" y="540" width="1200" height="90" fill="#08100a"/>
  <rect x="0" y="540" width="1200" height="2" fill="#10b981" opacity="0.5"/>
  <text x="60" y="595" fill="#10b981" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" letter-spacing="4">${cta}</text>
  <text x="1140" y="595" text-anchor="end" fill="#5a6a5a" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16" letter-spacing="2">GIVE A BIT FAMILY</text>
</svg>`;
}

for (const c of CARDS) {
  const svg = cardSvg(c);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: '#050806',
  });
  const png = resvg.render().asPng();
  const path = join(outDir, c.file);
  writeFileSync(path, png);
  console.log(`Wrote public/og/${c.file} (${(png.length / 1024).toFixed(1)} KB)`);
}

// Also refresh root og-image.png (default card) for legacy meta tags
const def = CARDS[0];
const defPng = new Resvg(cardSvg(def), {
  fitTo: { mode: 'width', value: 1200 },
  background: '#050806',
}).render().asPng();
writeFileSync(join(root, 'public', 'og-image.png'), defPng);
console.log('Updated public/og-image.png');

// Copy default to og-image for dist compatibility
console.log('OG cards ready.');
