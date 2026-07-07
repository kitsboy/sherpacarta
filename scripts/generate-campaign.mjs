#!/usr/bin/env node
/** Copy campaign + satohash templates to public/data, inject petition hash */
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const campaign = JSON.parse(readFileSync(join(root, 'data/campaign-canada.json'), 'utf8'));
const hash = createHash('sha256').update(`CA|${campaign.id}|${campaign.petitionText}`).digest('hex');

campaign.petitionHash = hash;
campaign.build = '20260707-687';
campaign.updated = new Date().toISOString();

const outDir = join(root, 'public/data');
const tplDir = join(outDir, 'satohash-templates');
mkdirSync(tplDir, { recursive: true });

writeFileSync(join(outDir, 'campaign-canada.json'), JSON.stringify(campaign, null, 2));
cpSync(join(root, 'data/satohash-templates/sherpacarta-canada-referendum.json'), join(tplDir, 'sherpacarta-canada-referendum.json'));

writeFileSync(join(outDir, 'proof-canada.json'), JSON.stringify({
  campaignId: campaign.id,
  jurisdiction: 'CA',
  petitionHash: hash,
  build: campaign.build,
  templateId: 'sherpacarta-canada-referendum-v1',
  templateUrl: '/data/satohash-templates/sherpacarta-canada-referendum.json',
  satohashSubmit: 'https://satohash.io/templates/',
  signatureMethods: campaign.signatureMethods,
  note: 'Aggregate counts are device-local unless Nostr relay aggregation is enabled. Merkle roots stamped via Satohash.',
  updated: campaign.updated,
}, null, 2));

console.log(`Campaign generated: petition hash ${hash.slice(0, 16)}…`);