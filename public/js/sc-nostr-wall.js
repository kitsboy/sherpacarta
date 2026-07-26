/**
 * SherpaCarta — read-only public Nostr discussion wall
 * Fetches kind-1 notes from relays: author=sherpa pubkey and/or #sherpacarta
 * No nsec. No signing. Public events only.
 */
(function () {
  'use strict';

  var CONFIG_URL = '/data/nostr-sherpa.json';
  var DEFAULT_RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social',
  ];

  function el(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shortPk(hex) {
    if (!hex || hex.length < 16) return hex || '';
    return hex.slice(0, 8) + '…' + hex.slice(-6);
  }

  function fmtTime(ts) {
    try {
      return new Date(ts * 1000).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (_) {
      return String(ts);
    }
  }

  function hashtagFromTags(tags) {
    var out = [];
    (tags || []).forEach(function (t) {
      if (t && t[0] === 't' && t[1]) out.push(t[1]);
    });
    return out;
  }

  function linkify(text) {
    var s = esc(text);
    s = s.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    s = s.replace(/(^|\s)#([a-zA-Z0-9_]+)/g, '$1<span class="nw-tag">#$2</span>');
    return s;
  }

  function Wall(root, cfg) {
    this.root = root;
    this.cfg = cfg;
    this.events = new Map();
    this.sockets = [];
    this.timer = null;
    this.statusEl = root.querySelector('[data-nw-status]');
    this.listEl = root.querySelector('[data-nw-list]');
    this.metaEl = root.querySelector('[data-nw-meta]');
  }

  Wall.prototype.setStatus = function (msg, kind) {
    if (!this.statusEl) return;
    this.statusEl.textContent = msg;
    this.statusEl.dataset.kind = kind || 'info';
  };

  Wall.prototype.render = function () {
    if (!this.listEl) return;
    var arr = Array.from(this.events.values()).sort(function (a, b) {
      return (b.created_at || 0) - (a.created_at || 0);
    });
    var pk = this.cfg.pubkeyHex;
    var njump = (this.cfg.clients && this.cfg.clients.njump) || 'https://njump.me/';
    if (!arr.length) {
      this.listEl.innerHTML =
        '<div class="nw-empty">No public notes yet. Be the first — post on Nostr with <strong>#' +
        esc(this.cfg.wall && this.cfg.wall.includeHashtag ? this.cfg.wall.includeHashtag : 'sherpacarta') +
        '</strong> or message <code>' +
        esc(this.cfg.nip05 || 'sherpa@giveabit.io') +
        '</code> when NIP-05 is live.</div>';
      return;
    }
    this.listEl.innerHTML = arr
      .map(function (ev) {
        var isAgent = pk && ev.pubkey === pk;
        var tags = hashtagFromTags(ev.tags);
        var noteUrl = njump + (ev.id || '');
        return (
          '<article class="nw-note' +
          (isAgent ? ' is-agent' : '') +
          '">' +
          '<header class="nw-note-head">' +
          '<span class="nw-who">' +
          (isAgent
            ? '<i class="fas fa-robot"></i> Sherpa guide'
            : '<i class="fas fa-user"></i> ' + esc(shortPk(ev.pubkey))) +
          '</span>' +
          (isAgent ? '<span class="nw-chip agent">agent</span>' : '<span class="nw-chip">community</span>') +
          '<time class="nw-time" datetime="' +
          esc(new Date((ev.created_at || 0) * 1000).toISOString()) +
          '">' +
          esc(fmtTime(ev.created_at)) +
          '</time>' +
          '</header>' +
          '<div class="nw-body">' +
          linkify(ev.content || '') +
          '</div>' +
          (tags.length
            ? '<div class="nw-tags">' +
              tags
                .map(function (t) {
                  return '<span class="nw-tag">#' + esc(t) + '</span>';
                })
                .join('') +
              '</div>'
            : '') +
          '<footer class="nw-foot"><a href="' +
          esc(noteUrl) +
          '" target="_blank" rel="noopener">Open note ↗</a></footer>' +
          '</article>'
        );
      })
      .join('');
  };

  Wall.prototype.ingest = function (ev) {
    if (!ev || !ev.id || ev.kind !== 1) return;
    if (this.events.has(ev.id)) return;
    this.events.set(ev.id, ev);
    // Cap memory
    if (this.events.size > 80) {
      var sorted = Array.from(this.events.values()).sort(function (a, b) {
        return (a.created_at || 0) - (b.created_at || 0);
      });
      while (sorted.length > 60) {
        var drop = sorted.shift();
        this.events.delete(drop.id);
      }
    }
    this.render();
  };

  Wall.prototype.connect = function () {
    var self = this;
    var relays = this.cfg.relays && this.cfg.relays.length ? this.cfg.relays : DEFAULT_RELAYS;
    var limit = (this.cfg.wall && this.cfg.wall.limit) || 40;
    var pk = this.cfg.pubkeyHex;
    var tag = (this.cfg.wall && this.cfg.wall.includeHashtag) || 'sherpacarta';
    var filters = [];
    if (pk) filters.push({ kinds: [1], authors: [pk], limit: limit });
    filters.push({ kinds: [1], '#t': [tag], limit: limit });

    this.close();
    this.setStatus('Connecting to ' + relays.length + ' relays…', 'info');
    var open = 0;
    var seenEose = 0;

    relays.forEach(function (url) {
      var ws;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        return;
      }
      self.sockets.push(ws);
      var subId = 'scwall_' + Math.random().toString(36).slice(2, 10);

      ws.onopen = function () {
        open++;
        self.setStatus('Live · ' + open + ' relay(s) · public notes only', 'ok');
        filters.forEach(function (f, i) {
          ws.send(JSON.stringify(['REQ', subId + '_' + i, f]));
        });
      };
      ws.onmessage = function (msg) {
        try {
          var data = JSON.parse(msg.data);
          if (!Array.isArray(data)) return;
          if (data[0] === 'EVENT' && data[2]) self.ingest(data[2]);
          if (data[0] === 'EOSE') {
            seenEose++;
            if (!self.events.size && seenEose >= open) {
              self.setStatus('Connected · waiting for #sherpacarta notes', 'info');
            }
          }
        } catch (_) {}
      };
      ws.onerror = function () {};
      ws.onclose = function () {
        open = Math.max(0, open - 1);
        if (open === 0) self.setStatus('Relays disconnected — will retry', 'warn');
      };
    });

    if (this.metaEl) {
      this.metaEl.innerHTML =
        'Filter: <code>#' +
        esc(tag) +
        '</code>' +
        (pk ? ' · agent <code>' + esc(shortPk(pk)) + '</code>' : '') +
        ' · NIP-05 <code>' +
        esc(this.cfg.nip05 || '—') +
        '</code>' +
        (this.cfg.nip05Status === 'pending_publish'
          ? ' <span class="nw-chip warn">NIP-05 pending</span>'
          : ' <span class="nw-chip agent">NIP-05 live</span>');
    }
  };

  Wall.prototype.close = function () {
    this.sockets.forEach(function (ws) {
      try {
        ws.close();
      } catch (_) {}
    });
    this.sockets = [];
  };

  Wall.prototype.start = function () {
    var self = this;
    this.connect();
    var ms = (this.cfg.wall && this.cfg.wall.refreshMs) || 45000;
    this.timer = setInterval(function () {
      // Soft reconnect if no sockets open
      var alive = self.sockets.some(function (s) {
        return s.readyState === 1;
      });
      if (!alive) self.connect();
    }, ms);
  };

  function mount(selector) {
    var root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!root) return;
    fetch(CONFIG_URL, { cache: 'no-cache' })
      .then(function (r) {
        return r.json();
      })
      .then(function (cfg) {
        var wall = new Wall(root, cfg);
        wall.start();
        root._scNostrWall = wall;
      })
      .catch(function () {
        var wall = new Wall(root, {
          relays: DEFAULT_RELAYS,
          wall: { includeHashtag: 'sherpacarta', limit: 40 },
          nip05: 'sherpa@giveabit.io',
        });
        wall.setStatus('Config load failed — using defaults', 'warn');
        wall.start();
      });
  }

  window.SCNostrWall = { mount: mount };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('[data-sc-nostr-wall]').forEach(function (n) {
        mount(n);
      });
    });
  } else {
    document.querySelectorAll('[data-sc-nostr-wall]').forEach(function (n) {
      mount(n);
    });
  }
})();
