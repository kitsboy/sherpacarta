/**
 * Nostr helpers — nsec from env only.
 */
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure';
import { nip19 } from 'nostr-tools';
import WebSocket from 'ws';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.nostr.band',
];

export function loadSecretKey() {
  const raw = (process.env.SHERPA_NSEC || process.env.NOSTR_NSEC || '').trim();
  if (!raw) {
    throw new Error(
      'Missing SHERPA_NSEC (or NOSTR_NSEC). Export the nsec in the environment — never commit it.'
    );
  }
  if (raw.startsWith('nsec1')) {
    const decoded = nip19.decode(raw);
    if (decoded.type !== 'nsec') throw new Error('Invalid nsec');
    return decoded.data;
  }
  // hex
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Uint8Array.from(Buffer.from(raw, 'hex'));
  }
  throw new Error('SHERPA_NSEC must be nsec1… or 64-char hex');
}

export function pubkeyHex(sk) {
  return getPublicKey(sk);
}

export function expectedPubkey() {
  return (
    process.env.SHERPA_PUBKEY_HEX ||
    '7db5119f154648c8a93ef15ea86b25f5f89328c2e8e039537092758d787d72fd'
  );
}

export function assertIdentity(sk) {
  const pk = pubkeyHex(sk);
  const want = expectedPubkey().toLowerCase();
  if (pk.toLowerCase() !== want) {
    throw new Error(
      `nsec does not match sherpa@ pubkey.\n  got  ${pk}\n  want ${want}\nAborting — wrong key.`
    );
  }
  return pk;
}

export function relays() {
  const env = process.env.SHERPA_RELAYS || process.env.NOSTR_RELAYS;
  if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
  return DEFAULT_RELAYS.slice();
}

export function makeNote(sk, content, extraTags = []) {
  const tags = [
    ['t', 'sherpacarta'],
    ['t', 'digitalrights'],
    ...extraTags,
  ];
  const event = finalizeEvent(
    {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content: String(content).slice(0, 4000),
    },
    sk
  );
  return event;
}

export function makeReply(sk, content, parentEvent) {
  const tags = [
    ['e', parentEvent.id, '', 'root'],
    ['e', parentEvent.id, '', 'reply'],
    ['p', parentEvent.pubkey],
    ['t', 'sherpacarta'],
  ];
  return finalizeEvent(
    {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content: String(content).slice(0, 4000),
    },
    sk
  );
}

/** Publish to multiple relays; resolve when majority ack or timeout */
export function publishEvent(event, relayUrls = relays(), timeoutMs = 12000) {
  return new Promise((resolve) => {
    const results = [];
    let done = 0;
    const total = relayUrls.length;
    if (!total) {
      resolve({ ok: false, results: [], error: 'no relays' });
      return;
    }
    const finish = () => {
      if (done >= total) {
        const oks = results.filter((r) => r.ok).length;
        resolve({ ok: oks > 0, results, okCount: oks });
      }
    };
    const timer = setTimeout(() => {
      done = total;
      finish();
    }, timeoutMs);

    for (const url of relayUrls) {
      let settled = false;
      const settle = (row) => {
        if (settled) return;
        settled = true;
        results.push(row);
        done++;
        try {
          ws.close();
        } catch (_) {}
        if (done >= total) {
          clearTimeout(timer);
          finish();
        }
      };
      let ws;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        settle({ url, ok: false, error: String(e.message || e) });
        continue;
      }
      ws.on('open', () => {
        ws.send(JSON.stringify(['EVENT', event]));
      });
      ws.on('message', (raw) => {
        try {
          const msg = JSON.parse(String(raw));
          if (Array.isArray(msg) && msg[0] === 'OK' && msg[1] === event.id) {
            settle({ url, ok: !!msg[2], error: msg[3] || null });
          }
        } catch (_) {}
      });
      ws.on('error', (e) => settle({ url, ok: false, error: String(e.message || e) }));
      ws.on('close', () => settle({ url, ok: false, error: 'closed' }));
    }
  });
}

export function subscribeMentions(pk, onEvent, relayUrls = relays()) {
  const sockets = [];
  const since = Math.floor(Date.now() / 1000) - 60;
  for (const url of relayUrls) {
    let ws;
    try {
      ws = new WebSocket(url);
    } catch (_) {
      continue;
    }
    sockets.push(ws);
    const subId = 'sherpa_' + Math.random().toString(36).slice(2, 10);
    ws.on('open', () => {
      // Mentions via p-tag
      ws.send(
        JSON.stringify([
          'REQ',
          subId + '_p',
          { kinds: [1], '#p': [pk], since, limit: 20 },
        ])
      );
      // Hashtag conversations we might want to engage carefully — optional later
    });
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(String(raw));
        if (Array.isArray(msg) && msg[0] === 'EVENT' && msg[2]) {
          onEvent(msg[2], url);
        }
      } catch (_) {}
    });
    ws.on('error', () => {});
  }
  return {
    close() {
      for (const ws of sockets) {
        try {
          ws.close();
        } catch (_) {}
      }
    },
  };
}

export { generateSecretKey, nip19, DEFAULT_RELAYS };
