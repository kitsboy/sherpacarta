#!/usr/bin/env node
/**
 * Publish first public notes as sherpa@ (fills the /nostr wall).
 *
 * Usage (Cam, local — nsec never in git):
 *   export SHERPA_NSEC='nsec1…'
 *   cd packages/sherpa-nostr-bot && npm i && npm run seed
 *
 * Optional: SHERPA_SEED_IDS=intro,canada  (default: all)
 */
import {
  loadSecretKey,
  assertIdentity,
  makeNote,
  publishEvent,
  relays,
  nip19,
} from '../lib/nostr.mjs';
import { getSeedNotes, getIdentity } from '../lib/reply.mjs';

async function main() {
  const sk = loadSecretKey();
  const pk = assertIdentity(sk);
  const id = getIdentity();
  console.log('Identity OK');
  console.log('  nip05 ', id.nip05);
  console.log('  npub  ', nip19.npubEncode(pk));
  console.log('  hex   ', pk);
  console.log('  relays', relays().join(', '));

  const want = (process.env.SHERPA_SEED_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  let notes = getSeedNotes();
  if (want.length) notes = notes.filter((n) => want.includes(n.id));

  if (!notes.length) {
    console.error('No seed notes selected');
    process.exit(1);
  }

  console.log(`\nPublishing ${notes.length} note(s)…\n`);
  for (const note of notes) {
    const event = makeNote(sk, note.content);
    console.log(`→ ${note.id}  ${event.id.slice(0, 12)}…`);
    const res = await publishEvent(event);
    console.log(
      `  ${res.ok ? 'OK' : 'FAIL'}  ${res.okCount || 0}/${(res.results || []).length} relays`
    );
    for (const r of res.results || []) {
      console.log(`    ${r.ok ? '✓' : '✗'} ${r.url}${r.error ? ' — ' + r.error : ''}`);
    }
    // gentle spacing so relays don't rate-limit
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log('\nDone. Check https://sherpacarta.org/nostr (may take a minute).');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
