/**
 * SherpaCarta Sprint 3 — Participation & Nostr (528–547)
 */
(function SCUpgradesB6() {
  'use strict';
  const BUILD = '20260704-547';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b6 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b6.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B6 #${id}:`, e); }
  }

  function getRelays() {
    const custom = JSON.parse(localStorage.getItem('sc_nostr_relays_extra') || '[]');
    const primary = localStorage.getItem('sc_nostr_relay');
    const base = [...(window.NOSTR_RELAYS || [])];
    if (primary && !base.includes(primary)) base.unshift(primary);
    return [...new Set([...base, ...custom])];
  }

  function spamScore(text) {
    let s = 0;
    if (/https?:\/\//i.test(text)) s += 2;
    if (/(viagra|casino|crypto pump)/i.test(text)) s += 5;
    if (text.length < 15) s += 1;
    if (text.length > 2000) s += 2;
    return s;
  }

  // 528 — Relay failover publish
  feat(528, 'Relay failover publish', () => {
    const orig = window.publishToNostr;
    window.publishToNostr = async function (content, tags = []) {
      if (!window.nostr || !window.state?.nostrPubkey) return false;
      const event = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['t', 'sherpacarta'], ...tags],
        content,
        pubkey: window.state.nostrPubkey,
      };
      try {
        const signed = await window.nostr.signEvent(event);
        const relays = getRelays();
        let ok = false;
        for (const relay of relays) {
          try {
            await new Promise((resolve, reject) => {
              const ws = new WebSocket(relay);
              const t = setTimeout(() => { ws.close(); reject(new Error('timeout')); }, 2500);
              ws.onopen = () => {
                ws.send(JSON.stringify(['EVENT', signed]));
                clearTimeout(t);
                setTimeout(() => { ws.close(); resolve(); }, 600);
              };
              ws.onerror = () => { clearTimeout(t); reject(new Error('ws')); };
            });
            ok = true;
            break;
          } catch (_) { /* try next relay */ }
        }
        if (!ok) toast('All relays failed — saved locally only', 'error');
        return ok;
      } catch (e) {
        return false;
      }
    };
    if (orig && orig !== window.publishToNostr) window._publishToNostrOrig = orig;
  });

  // 529 — Multi-relay feed aggregator
  feat(529, 'Multi-relay feed aggregator', () => {
    window.loadNostrAmendFeed = async function () {
      const items = $('nostr-feed-items');
      if (!items) return;
      items.textContent = 'Loading from relays…';
      const collected = [];
      const seen = new Set();
      const relays = getRelays().slice(0, 3);

      const fetchRelay = (relay) => new Promise((resolve) => {
        try {
          const ws = new WebSocket(relay);
          const subId = 'sc-feed-' + Math.random().toString(36).slice(2, 8);
          const t = setTimeout(() => { ws.close(); resolve(); }, 3500);
          ws.onopen = () => {
            ws.send(JSON.stringify(['REQ', subId, { kinds: [1], '#t': ['sherpacarta'], limit: 12 }]));
          };
          ws.onmessage = (e) => {
            try {
              const msg = JSON.parse(e.data);
              if (msg[0] === 'EVENT' && msg[2] && !seen.has(msg[2].id)) {
                if (spamScore(msg[2].content || '') < 4) {
                  seen.add(msg[2].id);
                  collected.push({ ...msg[2], relay: relay.replace('wss://', '') });
                }
              }
            } catch (_) {}
          };
          ws.onclose = () => { clearTimeout(t); resolve(); };
          ws.onerror = () => { clearTimeout(t); resolve(); };
        } catch (_) { resolve(); }
      });

      await Promise.all(relays.map(fetchRelay));
      collected.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
      if (!collected.length) {
        items.innerHTML = '<span style="color:var(--text3)">No public events yet — be the first to publish via Nostr.</span>';
        return;
      }
      items.innerHTML = collected.slice(0, 10).map((ev) => {
        const tags = (ev.tags || []).filter((t) => t[0] === 't').map((t) => t[1]).join(' ');
        return `<div class="nostr-feed-item" style="padding:.5rem 0;border-bottom:1px solid var(--border)">
          <div style="font-size:.7rem;line-height:1.5">${(ev.content || '').slice(0, 160)}${ev.content?.length > 160 ? '…' : ''}</div>
          <div style="font-family:var(--mono);font-size:.55rem;color:var(--text3);margin-top:.25rem">${ev.pubkey?.slice(0, 10)}… · ${ev.relay}${tags ? ' · #' + tags : ''}</div>
        </div>`;
      }).join('');
    };
    setTimeout(() => window.loadNostrAmendFeed?.(), 2000);
  });

  // 530 — Kind 30023 long-form helper
  feat(530, 'Kind 30023 article publish', () => {
    window.publishArticleLongform = async (num, title, body) => {
      if (!window.nostr || !window.state?.nostrPubkey) { toast('Connect Nostr first', 'error'); return; }
      const dTag = `sherpacarta-art-${num}`;
      const event = {
        kind: 30023,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['d', dTag], ['t', 'sherpacarta'], ['title', title], ['article', `Art. ${num}`]],
        content: body,
        pubkey: window.state.nostrPubkey,
      };
      try {
        const signed = await window.nostr.signEvent(event);
        const relay = getRelays()[0];
        const ws = new WebSocket(relay);
        ws.onopen = () => { ws.send(JSON.stringify(['EVENT', signed])); setTimeout(() => ws.close(), 800); };
        toast(`Art. ${num} published as NIP-23 long-form`, 'success');
      } catch (e) { toast('Long-form publish failed', 'error'); }
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Nostr', icon: 'fa-file-lines', label: 'Publish Art. 11 Long-form', sub: 'Kind 30023', action: () => {
        const art = window.CHARTER?.flatMap((c) => c.articles).find((a) => a.num === 'Art. 11');
        if (art) window.publishArticleLongform?.('11', art.title, art.body?.replace(/<[^>]+>/g, '') || '');
      }});
    }
  });

  // 531 — Amendment reactions (local + Nostr kind 7 style)
  feat(531, 'Amendment reactions', () => {
    window.voteAmendment = (id, dir) => {
      const votes = JSON.parse(localStorage.getItem('sc_amend_votes') || '{}');
      votes[id] = (votes[id] || 0) + (dir === 'up' ? 1 : -1);
      localStorage.setItem('sc_amend_votes', JSON.stringify(votes));
      window.renderAmendments?.();
      toast(dir === 'up' ? 'Upvoted' : 'Downvoted', 'info');
    };
    const orig = window.renderAmendments;
    window.renderAmendments = function () {
      if (orig) orig();
      const votes = JSON.parse(localStorage.getItem('sc_amend_votes') || '{}');
      document.querySelectorAll('.amend-item').forEach((el, i) => {
        if (el.querySelector('.amend-votes')) return;
        const id = el.dataset.amendId || String(i);
        const v = votes[id] || 0;
        el.dataset.amendId = id;
        el.insertAdjacentHTML('beforeend', `<div class="amend-votes" style="margin-top:.35rem;display:flex;gap:.5rem;align-items:center">
          <button type="button" class="amend-upvote" onclick="voteAmendment('${id}','up')" aria-label="Upvote">▲ ${v}</button>
          <button type="button" class="amend-upvote" onclick="voteAmendment('${id}','down')" aria-label="Downvote">▼</button>
        </div>`);
      });
    };
    window.renderAmendments?.();
  });

  // 532 — Spam filter on submit
  feat(532, 'Nostr spam filter v2', () => {
    const orig = window.submitAmendment;
    window.submitAmendment = async function () {
      const text = $('amend-text')?.value || '';
      if (spamScore(text) >= 4) { toast('Proposal blocked — looks like spam', 'error'); return; }
      if (orig) return orig();
    };
  });

  // 533 — Auto-publish sign to Nostr on signCharter
  feat(533, 'Auto Nostr sign on charter sign', () => {
    const orig = window.signCharter;
    window.signCharter = async function () {
      const nameBefore = $('sign-name')?.value?.trim();
      if (orig) orig();
      if (window.state?.nostrPubkey && nameBefore) {
        const c = $('sign-country')?.value?.trim() || '';
        const ev = window.buildNostrSignEvent?.(nameBefore, c);
        if (ev) {
          const ok = await window.publishToNostr?.(ev.content, ev.tags);
          if (ok) toast('Signature published to Nostr', 'success');
        }
      }
    };
  });

  // 534 — Mirror local amendments to Nostr thread id
  feat(534, 'Comment mirror tags', () => {
    const orig = window.submitAmendment;
    window.submitAmendment = async function () {
      await orig?.();
      const last = window.state?.amendments?.[window.state.amendments.length - 1];
      if (last?.nostr) localStorage.setItem('sc_last_nostr_amend', JSON.stringify({ ts: last.ts, article: last.article }));
    };
  });

  // 535 — WebAuthn passkey pseudonym
  feat(535, 'Passkey pseudonymous sign', () => {
    window.signWithPasskey = async () => {
      if (!window.PublicKeyCredential) { toast('Passkeys not supported in this browser', 'error'); return; }
      try {
        const id = crypto.randomUUID();
        const cred = await navigator.credentials.create({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: { name: 'SherpaCarta', id: location.hostname },
            user: { id: new TextEncoder().encode(id), name: 'signer@local', displayName: 'SherpaCarta Signer' },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            authenticatorSelection: { userVerification: 'preferred' },
            timeout: 60000,
          },
        });
        const pseudo = 'passkey-' + id.slice(0, 8);
        localStorage.setItem('sc_passkey_id', pseudo);
        $('sign-name').value = pseudo;
        toast('Passkey identity created — review name and sign', 'success');
      } catch (e) { toast('Passkey cancelled or unavailable', 'error'); }
    };
    const form = document.querySelector('.sign-form');
    if (form && !form.querySelector('.passkey-btn')) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost passkey-btn';
      b.style.cssText = 'margin-top:.5rem;font-size:.72rem';
      b.innerHTML = '<i class="fas fa-fingerprint"></i> Sign with Passkey';
      b.onclick = () => window.signWithPasskey();
      form.appendChild(b);
    }
  });

  // 536 — Witness counter
  feat(536, 'Witness counter mode', () => {
    window.witnessCharter = () => {
      const w = parseInt(localStorage.getItem('sc_witness_count') || '0', 10) + 1;
      localStorage.setItem('sc_witness_count', String(w));
      const witnesses = JSON.parse(localStorage.getItem('sc_witnesses') || '[]');
      witnesses.push({ at: Date.now() });
      localStorage.setItem('sc_witnesses', JSON.stringify(witnesses.slice(-50)));
      toast(`You witnessed the charter (${w} local witnesses)`, 'success');
    };
    const form = document.querySelector('.sign-form');
    if (form) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost';
      b.style.cssText = 'margin-top:.5rem;margin-left:.35rem;font-size:.72rem';
      b.innerHTML = '<i class="fas fa-eye"></i> Witness (not sign)';
      b.onclick = () => window.witnessCharter();
      form.appendChild(b);
    }
  });

  // 537 — Org bulk sign CSV import
  feat(537, 'Org bulk sign CSV import', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.style.display = 'none';
    input.id = 'bulk-sign-csv';
    document.body.appendChild(input);
    window.importBulkSigners = () => input.click();
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const lines = String(reader.result).trim().split('\n').slice(1);
        let n = 0;
        lines.forEach((line) => {
          const [name, country] = line.split(',').map((s) => s.replace(/"/g, '').trim());
          if (name && !window.state.signers.find((s) => s.name === name)) {
            window.state.signers.push({ name, c: country || '🏢' });
            n++;
          }
        });
        localStorage.setItem('sc_signers', JSON.stringify(window.state.signers));
        window.state.signCount = window.state.signers.length + 4271;
        localStorage.setItem('sc_count', window.state.signCount);
        window.buildSigners?.();
        toast(`Imported ${n} org signers (local)`, 'success');
      };
      reader.readAsText(file);
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Sign', icon: 'fa-file-import', label: 'Import Org Signers CSV', sub: 'name,country columns', action: () => window.importBulkSigners() });
    }
  });

  // 538 — npub copy
  feat(538, 'Copy npub button', () => {
    const orig = window.updateNostrUI;
    window.updateNostrUI = function () {
      if (orig) orig();
      const pk = window.state?.nostrPubkey;
      if (!pk || $('copy-npub-btn')) return;
      const btn = document.createElement('button');
      btn.id = 'copy-npub-btn';
      btn.type = 'button';
      btn.className = 'btn btn-ghost';
      btn.style.fontSize = '.65rem';
      btn.innerHTML = '<i class="fas fa-copy"></i> npub';
      btn.onclick = async () => {
        try {
          const { nip19 } = await import('https://esm.sh/nostr-tools@2/nip19');
          const npub = nip19.npubEncode(pk);
          navigator.clipboard.writeText(npub);
          toast('npub copied', 'success');
        } catch (_) {
          navigator.clipboard.writeText(pk);
          toast('Pubkey copied (hex)', 'success');
        }
      };
      $('nostr-badge')?.after(btn);
    };
    if (window.state?.nostrPubkey) window.updateNostrUI();
  });

  // 539 — Custom relay manager
  feat(539, 'Custom relay manager', () => {
    const panel = document.querySelector('.nostr-panel');
    if (!panel || $('nostr-relay-add')) return;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:.35rem;margin-top:.5rem;flex-wrap:wrap';
    row.innerHTML = `<input class="sign-input" id="nostr-relay-add" placeholder="wss://your-relay.com" style="flex:1;font-size:.7rem;margin:0">
      <button type="button" class="btn btn-ghost" style="font-size:.65rem" id="nostr-relay-save">Add relay</button>`;
    panel.appendChild(row);
    $('nostr-relay-save')?.addEventListener('click', () => {
      const v = $('nostr-relay-add')?.value?.trim();
      if (!v?.startsWith('wss://')) { toast('Enter wss:// relay URL', 'error'); return; }
      const extra = JSON.parse(localStorage.getItem('sc_nostr_relays_extra') || '[]');
      if (!extra.includes(v)) extra.push(v);
      localStorage.setItem('sc_nostr_relays_extra', JSON.stringify(extra));
      toast('Relay added', 'success');
    });
  });

  // 540 — NIP-05 hint
  feat(540, 'NIP-05 verification hint', () => {
    const panel = document.querySelector('.nostr-panel p');
    if (panel) {
      panel.innerHTML += ' Official NIP-05: <code style="color:var(--em)">kimi@giveabit.io</code> — <button type="button" class="btn btn-ghost" style="font-size:.6rem;padding:.1rem .3rem" onclick="copyNostrNip()">copy</button>';
    }
  });

  // 541 — Amendment sort
  feat(541, 'Amendment sort controls', () => {
    const list = $('amend-list');
    if (!list || $('amend-sort-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'amend-sort-bar';
    bar.style.cssText = 'display:flex;gap:.35rem;margin-bottom:.5rem';
    bar.innerHTML = `<button type="button" class="btn btn-ghost" style="font-size:.62rem" onclick="sortAmendments('date')">Newest</button>
      <button type="button" class="btn btn-ghost" style="font-size:.62rem" onclick="sortAmendments('votes')">Top votes</button>`;
    list.parentElement?.insertBefore(bar, list);
    window.sortAmendments = (mode) => {
      const votes = JSON.parse(localStorage.getItem('sc_amend_votes') || '{}');
      window.state.amendments.sort((a, b) => {
        if (mode === 'votes') return (votes[b.ts] || 0) - (votes[a.ts] || 0);
        return (b.ts || 0) - (a.ts || 0);
      });
      window.renderAmendments?.();
    };
  });

  // 542 — Nostr wizard
  feat(542, 'Nostr onboarding wizard', () => {
    if (localStorage.getItem('sc_nostr_wizard_done')) return;
    setTimeout(() => {
      if (!window.nostr && !localStorage.getItem('sc_nostr_pk')) {
        toast('Tip: Install Alby or nos2x, then Sign in with Nostr to publish amendments', 'info');
        localStorage.setItem('sc_nostr_wizard_done', '1');
      }
    }, 5000);
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Nostr', icon: 'fa-wand-magic-sparkles', label: 'Nostr Setup Wizard', sub: '3-step guide', action: () => {
        alert('1. Install Alby, nos2x, or Primal browser extension\n2. Click Sign in with Nostr\n3. Submit amendments — they publish to relays automatically');
        localStorage.setItem('sc_nostr_wizard_done', '1');
      }});
    }
  });

  // 543 — Per-article Nostr comment
  feat(543, 'Per-article Nostr comment', () => {
    window.commentOnArticle = async (num) => {
      const text = prompt(`Comment on Art. ${num} (published to Nostr if connected):`);
      if (!text) return;
      const msg = `[SherpaCarta Art. ${num}] ${text}\nhttps://sherpacarta.org/?article=${num}`;
      const ok = await window.publishToNostr?.(msg, [['t', 'comment'], ['article', `Art. ${num}`]]);
      toast(ok ? 'Comment published' : 'Saved intent locally — connect Nostr', ok ? 'success' : 'info');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Nostr', icon: 'fa-comment', label: 'Comment on Article', sub: 'Nostr kind 1', action: () => {
        const n = prompt('Article number:', '11');
        if (n) window.commentOnArticle(n.replace(/\D/g, ''));
      }});
    }
  });

  // 544 — Nostr signature aggregate (local feed count)
  feat(544, 'Nostr sign aggregate', () => {
    window.countNostrSigns = () => {
      const feed = document.querySelectorAll('.nostr-feed-item');
      const signs = [...feed].filter((el) => el.textContent?.includes('sign') || el.textContent?.includes('Sign')).length;
      return signs;
    };
    const note = document.createElement('p');
    note.id = 'nostr-aggregate-note';
    note.style.cssText = 'font-size:.6rem;color:var(--text3);margin-top:.5rem';
    note.textContent = 'Nostr layer: decentralized public deliberation — no server accounts.';
    $('nostr-amend-feed')?.appendChild(note);
  });

  // 545 — Signing ceremony mode
  feat(545, 'Signing ceremony mode', () => {
    window.startSignCeremony = () => {
      document.body.classList.add('sign-ceremony');
      const overlay = document.createElement('div');
      overlay.id = 'ceremony-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9990;background:rgba(6,10,6,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center';
      overlay.innerHTML = `<div style="font-family:var(--serif);font-size:clamp(1.5rem,4vw,2.5rem);color:var(--em);margin-bottom:1rem">Sign the Charter</div>
        <p style="color:var(--text2);max-width:400px;font-size:.9rem;line-height:1.7">A moral commitment to digital human rights. Your name joins a living record.</p>
        <button class="btn btn-primary" style="margin-top:1.5rem" onclick="document.getElementById('sign').scrollIntoView({behavior:'smooth'});document.getElementById('ceremony-overlay')?.remove();document.body.classList.remove('sign-ceremony')">Continue to sign →</button>
        <button class="btn btn-ghost" style="margin-top:.5rem" onclick="document.getElementById('ceremony-overlay')?.remove();document.body.classList.remove('sign-ceremony')">Cancel</button>`;
      document.body.appendChild(overlay);
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Sign', icon: 'fa-gavel', label: 'Signing Ceremony', sub: 'Fullscreen ritual', action: () => window.startSignCeremony() });
    }
  });

  // 546 — Export amendments JSON
  feat(546, 'Export amendments backup', () => {
    window.exportAmendments = () => {
      const data = {
        amendments: window.state?.amendments || [],
        votes: JSON.parse(localStorage.getItem('sc_amend_votes') || '{}'),
        replies: JSON.parse(localStorage.getItem('sc_amend_replies') || '{}'),
        exported: new Date().toISOString(),
      };
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      a.download = 'sherpacarta-amendments-backup.json';
      a.click();
      toast('Amendments exported', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Nostr', icon: 'fa-download', label: 'Export Amendments JSON', sub: 'Local backup', action: () => window.exportAmendments() });
    }
  });

  // 547 — BUILD merge
  feat(547, 'Sprint 3 BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 3;
    SC.UPGRADES_B6 = SHERPA_UPGRADES.b6.items;
    SC.totalFeatures = 547;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    setTimeout(() => toast('Sprint 3 Nostr & participation live — BUILD 547', 'success'), 2800);
    console.log(`SherpaCarta Sprint 3 — BUILD ${BUILD}`);
  });
})();