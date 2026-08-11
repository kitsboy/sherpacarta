/**
 * SherpaCarta — shared Nostr helpers (browser)
 * No nsec. NIP-07 only when user connects. Zero tracking.
 *
 * Used by: sc-core publish path (if loaded), wall, petition (optional), docs.
 * Safe to load after or without sc-core.
 */
(function (global) {
  'use strict';

  /** Canonical public relays — must stay within CSP connect-src */
  var DEFAULT_RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social',
    'wss://relay.nostr.band',
  ];

  /** Product guide (primary for sherpacarta.org NIP-05 `_` / sherpa / sherpacarta) */
  var SHERPA_HEX = '7db5119f154648c8a93ef15ea86b25f5f89328c2e8e039537092758d787d72fd';
  /** Suite ops (kimi@) — same hex as giveabit.io */
  var KIMI_HEX = '076fbd672795bfba1f905084bbe05dcee4937aa1db995c2f87d616ea0f73f8d4';

  function uniq(arr) {
    var out = [];
    var seen = Object.create(null);
    (arr || []).forEach(function (x) {
      if (!x || typeof x !== 'string') return;
      var u = x.trim();
      if (!u || seen[u]) return;
      if (!/^wss:\/\//i.test(u) && !/^ws:\/\//i.test(u)) return;
      seen[u] = true;
      out.push(u);
    });
    return out;
  }

  /**
   * Ordered relay list: preferred first, then defaults, then extras, then optional NIP-65.
   * LocalStorage keys (legacy + current): sc_preferred_relay, sc_nostr_relay, sc_nostr_relays_extra
   */
  function getRelays(opts) {
    opts = opts || {};
    var base = (global.NOSTR_RELAYS && global.NOSTR_RELAYS.length
      ? global.NOSTR_RELAYS.slice()
      : DEFAULT_RELAYS.slice());
    var preferred =
      opts.preferred ||
      (typeof localStorage !== 'undefined' &&
        (localStorage.getItem('sc_preferred_relay') || localStorage.getItem('sc_nostr_relay'))) ||
      null;
    var extra = [];
    try {
      extra = JSON.parse(
        (typeof localStorage !== 'undefined' && localStorage.getItem('sc_nostr_relays_extra')) || '[]'
      );
    } catch (_) {
      extra = [];
    }
    var nip65 = [];
    try {
      nip65 = JSON.parse(
        (typeof localStorage !== 'undefined' && localStorage.getItem('sc_nip65_relays')) || '[]'
      );
    } catch (_) {
      nip65 = [];
    }
    var ordered = [];
    if (preferred) ordered.push(preferred);
    ordered = ordered.concat(base, nip65, extra);
    if (opts.writeOnly && opts.nip65Write && opts.nip65Write.length) {
      ordered = opts.nip65Write.concat(ordered);
    }
    return uniq(ordered);
  }

  function publishToOneRelay(relay, signedEvent, timeoutMs) {
    timeoutMs = timeoutMs || 2800;
    return new Promise(function (resolve) {
      var ws;
      var done = false;
      var finish = function (ok) {
        if (done) return;
        done = true;
        try {
          ws && ws.close();
        } catch (_) {}
        resolve(!!ok);
      };
      try {
        ws = new WebSocket(relay);
      } catch (_) {
        finish(false);
        return;
      }
      var t = setTimeout(function () {
        finish(false);
      }, timeoutMs);
      ws.onopen = function () {
        try {
          ws.send(JSON.stringify(['EVENT', signedEvent]));
        } catch (_) {
          clearTimeout(t);
          finish(false);
          return;
        }
        // Allow OK/NOTICE; treat open+send as provisional success after brief window
        setTimeout(function () {
          clearTimeout(t);
          finish(true);
        }, 500);
      };
      ws.onmessage = function (ev) {
        try {
          var msg = JSON.parse(ev.data);
          if (msg[0] === 'OK' && msg[1] === signedEvent.id) {
            clearTimeout(t);
            finish(!!msg[2]);
          }
        } catch (_) {}
      };
      ws.onerror = function () {
        clearTimeout(t);
        finish(false);
      };
      ws.onclose = function () {
        /* resolve handled by timers */
      };
    });
  }

  /**
   * Fan-out signed event to all relays. Returns { ok, successCount, total, relaysOk }.
   */
  function publishEvent(signedEvent, opts) {
    opts = opts || {};
    var relays = opts.relays || getRelays(opts);
    if (!signedEvent || !signedEvent.id) {
      return Promise.resolve({ ok: false, successCount: 0, total: 0, relaysOk: [] });
    }
    return Promise.all(
      relays.map(function (r) {
        return publishToOneRelay(r, signedEvent, opts.timeoutMs).then(function (ok) {
          return { relay: r, ok: ok };
        });
      })
    ).then(function (results) {
      var relaysOk = results.filter(function (x) {
        return x.ok;
      }).map(function (x) {
        return x.relay;
      });
      return {
        ok: relaysOk.length > 0,
        successCount: relaysOk.length,
        total: relays.length,
        relaysOk: relaysOk,
      };
    });
  }

  /**
   * Probe one relay (open websocket).
   */
  function relayHealth(url, timeoutMs) {
    timeoutMs = timeoutMs || 2500;
    return new Promise(function (resolve) {
      var ws;
      var done = false;
      var finish = function (ok) {
        if (done) return;
        done = true;
        try {
          ws && ws.close();
        } catch (_) {}
        resolve(ok);
      };
      try {
        ws = new WebSocket(url);
      } catch (_) {
        finish(false);
        return;
      }
      var t = setTimeout(function () {
        finish(false);
      }, timeoutMs);
      ws.onopen = function () {
        clearTimeout(t);
        finish(true);
      };
      ws.onerror = function () {
        clearTimeout(t);
        finish(false);
      };
    });
  }

  /**
   * Fetch NIP-65 (kind 10002) for a pubkey from seed relays.
   * Returns { read: string[], write: string[], raw: event|null }
   */
  function fetchNip65(pubkeyHex, seedRelays, timeoutMs) {
    timeoutMs = timeoutMs || 4000;
    var seeds = uniq(seedRelays && seedRelays.length ? seedRelays : DEFAULT_RELAYS).slice(0, 4);
    if (!pubkeyHex || !/^[a-f0-9]{64}$/i.test(pubkeyHex)) {
      return Promise.resolve({ read: [], write: [], raw: null });
    }
    var pk = pubkeyHex.toLowerCase();
    var best = null;

    function parseTags(ev) {
      var read = [];
      var write = [];
      (ev.tags || []).forEach(function (t) {
        if (!t || t[0] !== 'r' || !t[1]) return;
        var url = t[1];
        var marker = (t[2] || '').toLowerCase();
        if (marker === 'read') read.push(url);
        else if (marker === 'write') write.push(url);
        else {
          read.push(url);
          write.push(url);
        }
      });
      return { read: uniq(read), write: uniq(write) };
    }

    var tasks = seeds.map(function (relay) {
      return new Promise(function (resolve) {
        var ws;
        try {
          ws = new WebSocket(relay);
        } catch (_) {
          resolve(null);
          return;
        }
        var sub = 'nip65_' + Math.random().toString(36).slice(2, 9);
        var t = setTimeout(function () {
          try {
            ws.close();
          } catch (_) {}
          resolve(null);
        }, timeoutMs);
        ws.onopen = function () {
          ws.send(
            JSON.stringify([
              'REQ',
              sub,
              { kinds: [10002], authors: [pk], limit: 1 },
            ])
          );
        };
        ws.onmessage = function (msg) {
          try {
            var data = JSON.parse(msg.data);
            if (data[0] === 'EVENT' && data[2] && data[2].kind === 10002) {
              var ev = data[2];
              if (!best || (ev.created_at || 0) > (best.created_at || 0)) best = ev;
            }
            if (data[0] === 'EOSE') {
              clearTimeout(t);
              try {
                ws.close();
              } catch (_) {}
              resolve(best);
            }
          } catch (_) {}
        };
        ws.onerror = function () {
          clearTimeout(t);
          resolve(null);
        };
      });
    });

    return Promise.all(tasks).then(function () {
      if (!best) return { read: [], write: [], raw: null };
      var p = parseTags(best);
      return { read: p.read, write: p.write, raw: best };
    });
  }

  /**
   * Build unsigned NIP-65 kind 10002 event for NIP-07 signEvent.
   * Markers: both read+write for each default relay (outbox-friendly).
   */
  function buildNip65Event(pubkeyHex, relays) {
    var list = uniq(relays && relays.length ? relays : DEFAULT_RELAYS);
    var tags = list.map(function (r) {
      return ['r', r];
    });
    return {
      kind: 10002,
      created_at: Math.floor(Date.now() / 1000),
      tags: tags,
      content: '',
      pubkey: pubkeyHex,
    };
  }

  /**
   * Optional: user publishes their own NIP-65 list via NIP-07.
   */
  async function publishMyNip65() {
    if (!global.nostr || typeof global.nostr.getPublicKey !== 'function') {
      throw new Error('Connect a Nostr extension first (NIP-07)');
    }
    var pk = await global.nostr.getPublicKey();
    var draft = buildNip65Event(pk, getRelays());
    var signed = await global.nostr.signEvent(draft);
    var res = await publishEvent(signed);
    if (res.ok) {
      try {
        localStorage.setItem('sc_nip65_relays', JSON.stringify(getRelays()));
      } catch (_) {}
    }
    return res;
  }

  var api = {
    DEFAULT_RELAYS: DEFAULT_RELAYS,
    SHERPA_HEX: SHERPA_HEX,
    KIMI_HEX: KIMI_HEX,
    NIP05_PRODUCT: 'sherpa@sherpacarta.org',
    NIP05_OPS: 'kimi@sherpacarta.org',
    NIP05_PRODUCT_GIVEABIT: 'sherpa@giveabit.io',
    NIP05_OPS_GIVEABIT: 'kimi@giveabit.io',
    getRelays: getRelays,
    publishEvent: publishEvent,
    publishToOneRelay: publishToOneRelay,
    relayHealth: relayHealth,
    fetchNip65: fetchNip65,
    buildNip65Event: buildNip65Event,
    publishMyNip65: publishMyNip65,
    uniq: uniq,
  };

  global.SCNostr = api;

  // Align window.NOSTR_RELAYS if empty or missing nostr.band
  if (!global.NOSTR_RELAYS || !global.NOSTR_RELAYS.length) {
    global.NOSTR_RELAYS = DEFAULT_RELAYS.slice();
  } else {
    global.NOSTR_RELAYS = uniq(global.NOSTR_RELAYS.concat(DEFAULT_RELAYS));
  }
})(typeof window !== 'undefined' ? window : globalThis);
