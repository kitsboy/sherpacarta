#!/usr/bin/env node
/**
 * Always-on Sherpa guide bot — mentions (#p) only.
 *
 *   export SHERPA_NSEC='nsec1…'
 *   export SHERPA_APPROVE=1          # optional: log only, do not publish
 *   export SHERPA_ESCALATE_WEBHOOK=  # optional URL for hard questions
 *   npm run bot
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  loadSecretKey,
  assertIdentity,
  makeReply,
  publishEvent,
  subscribeMentions,
  relays,
  nip19,
} from '../lib/nostr.mjs';
import { craftReply, getIdentity } from '../lib/reply.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stateDir = process.env.SHERPA_STATE_DIR || join(root, '.state');
const ratePath = join(stateDir, 'rate.json');
const logPath = join(stateDir, 'bot.log');

function loadRate() {
  try {
    if (existsSync(ratePath)) return JSON.parse(readFileSync(ratePath, 'utf8'));
  } catch (_) {}
  return {};
}

function saveRate(map) {
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(ratePath, JSON.stringify(map, null, 2));
}

function logLine(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  try {
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(logPath, line, { flag: 'a' });
  } catch (_) {}
}

function rateOk(pubkey, hours = 6) {
  const map = loadRate();
  const last = map[pubkey] || 0;
  const minGap = hours * 3600 * 1000;
  if (Date.now() - last < minGap) return false;
  map[pubkey] = Date.now();
  // prune old
  const cutoff = Date.now() - 7 * 86400 * 1000;
  for (const k of Object.keys(map)) {
    if (map[k] < cutoff) delete map[k];
  }
  saveRate(map);
  return true;
}

async function escalateHook(payload) {
  const url = process.env.SHERPA_ESCALATE_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    logLine('escalate webhook failed: ' + (e.message || e));
  }
}

async function main() {
  const sk = loadSecretKey();
  const pk = assertIdentity(sk);
  const id = getIdentity();
  const approveOnly = process.env.SHERPA_APPROVE === '1' || process.env.SHERPA_APPROVE === 'true';

  logLine(`Sherpa bot starting · ${id.nip05} · ${nip19.npubEncode(pk)}`);
  logLine(`Relays: ${relays().join(', ')}`);
  logLine(approveOnly ? 'MODE: approve-only (no publish)' : 'MODE: auto-reply');

  const seen = new Set();

  subscribeMentions(pk, async (ev) => {
    try {
      if (!ev || !ev.id || !ev.pubkey) return;
      if (ev.pubkey === pk) return; // ignore self
      if (seen.has(ev.id)) return;
      seen.add(ev.id);
      if (seen.size > 500) {
        const arr = [...seen];
        arr.slice(0, 200).forEach((id) => seen.delete(id));
      }

      const content = String(ev.content || '');
      logLine(`mention from ${ev.pubkey.slice(0, 12)}… :: ${content.slice(0, 120).replace(/\n/g, ' ')}`);

      const reply = craftReply(content);
      if (reply.kind === 'escalate') {
        logLine('ESCALATE → Cam');
        await escalateHook({
          type: 'sherpa_escalate',
          from: ev.pubkey,
          eventId: ev.id,
          content,
          at: new Date().toISOString(),
        });
      }

      if (!rateOk(ev.pubkey, 6)) {
        logLine('rate-limit skip for ' + ev.pubkey.slice(0, 12));
        return;
      }

      if (approveOnly) {
        logLine(`[approve] would reply (${reply.kind}/${reply.topic}): ${reply.text.slice(0, 200)}`);
        return;
      }

      const out = makeReply(sk, reply.text, ev);
      const res = await publishEvent(out);
      logLine(
        `reply ${out.id.slice(0, 12)}… ${res.ok ? 'OK' : 'FAIL'} ${res.okCount || 0} relays · topic=${reply.topic || reply.kind}`
      );
    } catch (e) {
      logLine('handler error: ' + (e.message || e));
    }
  });

  // keep process alive
  process.on('SIGINT', () => {
    logLine('shutdown');
    process.exit(0);
  });
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
