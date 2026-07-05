/**
 * SherpaCarta Upgrades Batch 2 — Features 447–466
 * BC/legal, Nostr, charter & signing
 */
(function SCUpgradesB2() {
  'use strict';
  const BUILD = '20260704-467';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b2 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b2.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B2 #${id}:`, e); }
  }

  // 21 — Press kit download (enhanced)
  feat(447, 'Press kit PDF-ready export', () => {
    window.downloadPressKitPDF = () => {
      const kit = `SHERPACARTA PRESS KIT\n\nBoilerplate:\nSherpaCarta is a global civic movement publishing a living charter of digital human rights. 114 articles. CC0. Bitcoin-funded. Zero tracking.\n\nSite: https://sherpacarta.org\nEmail: hello@giveabit.io (subject: Sherpacarta)\nBitcoin: ${window.SHERPA_WALLETS?.btc || ''}\nX: @give_bit\nNostr NIP-05: kimi@giveabit.io\nGitHub: https://github.com/kitsboy/sherpacarta\n\nKey facts: 114 articles, 811 years of rights tradition, Canada/BC Challenge launch market.\n\nPrint this page to PDF (Cmd+P) for press distribution.`;
      const blob = new Blob([kit], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-Press-Kit.txt';
      a.click();
      toast('Press kit downloaded — print to PDF for distribution', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Distribute', icon: 'fa-newspaper', label: 'Download Press Kit', sub: 'TXT → print PDF', action: () => window.downloadPressKitPDF() });
    }
  });

  // 22 — Institutional adoption pack link
  feat(448, 'Institutional adoption pack', () => {
    const bc = $('canada-bc');
    if (!bc) return;
    const box = document.createElement('div');
    box.className = 'adoption-pack-cta';
    box.style.cssText = 'margin-top:1.5rem;padding:1.25rem;background:var(--bg3);border:1px solid var(--border2);border-radius:1rem';
    box.innerHTML = `<h3 style="font-family:var(--serif);font-size:1.35rem;margin-bottom:.5rem">Institutional Adoption Pack</h3>
      <p style="font-size:.82rem;color:var(--text2);line-height:1.7;margin-bottom:1rem">Model bill language, executive summary, and BC challenge strategy for MLAs, MPs, and civil society partners.</p>
      <a href="https://github.com/kitsboy/sherpacarta/blob/main/docs/CANADA-BC-CHALLENGE.md" class="btn btn-primary" target="_blank" rel="noopener" style="margin-right:.5rem"><i class="fas fa-file-contract"></i> BC Challenge Doc</a>
      <a href="https://github.com/kitsboy/sherpacarta/blob/main/docs/EXECUTIVE_SUMMARY.md" class="btn btn-ghost" target="_blank" rel="noopener"><i class="fas fa-landmark"></i> Executive Summary</a>`;
    bc.querySelector('.section-max')?.appendChild(box);
  });

  // 23 — MLA briefing one-pager
  feat(449, 'MLA briefing one-pager', () => {
    window.openMlaBrief = () => {
      const w = window.open('', '_blank');
      if (!w) return;
      w.document.write(`<!DOCTYPE html><html><head><title>SherpaCarta MLA Brief</title><style>body{font-family:Georgia,serif;max-width:700px;margin:2rem auto;padding:1rem;line-height:1.6}h1{font-size:1.5rem}h2{font-size:1.1rem;margin-top:1.5rem}.meta{font-size:.85rem;color:#555}</style></head><body>
        <h1>SherpaCarta — MLA Briefing One-Pager</h1>
        <p class="meta">For British Columbia legislators · CC0 · giveabit.io</p>
        <h2>Ask</h2>
        <p>Adopt SherpaCarta Arts. 11–13 as model language for BC digital rights legislation.</p>
        <h2>Why BC</h2>
        <p>Strong privacy foundations (PIPEDA) with gaps in algorithmic accountability and platform power.</p>
        <h2>Proof</h2>
        <p>114-article charter · OpenTimestamp on Bitcoin via Satohash · Zero tracking site</p>
        <h2>Contact</h2>
        <p>hello@giveabit.io (subject: Sherpacarta BC)</p>
        <p><em>Print this page (Cmd+P) for your meeting folder.</em></p></body></html>`);
      w.document.close();
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-landmark', label: 'MLA Briefing One-Pager', sub: 'Printable', action: () => window.openMlaBrief() });
    }
  });

  // 24 — Petition bar with goal
  feat(450, 'Petition progress bar', () => {
    const sign = $('sign');
    if (!sign) return;
    const goal = 10000;
    const count = parseInt(localStorage.getItem('sc_count') || '4271', 10);
    const pct = Math.min(100, (count / goal) * 100);
    const bar = document.createElement('div');
    bar.className = 'petition-bar';
    bar.innerHTML = `<div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:.58rem;color:var(--text3);margin-bottom:.35rem"><span>Petition momentum</span><span>${count.toLocaleString()} / ${goal.toLocaleString()} goal</span></div>
      <div class="charter-progress"><div class="charter-progress-fill" style="width:${pct}%"></div></div>
      <p style="font-size:.6rem;color:var(--text3);margin-top:.35rem">Aggregate counter — local signatures + illustrative seed. Not audited.</p>`;
    sign.querySelector('.sign-section')?.insertBefore(bar, sign.querySelector('.sign-form'));
  });

  // 25 — BC outreach email templates in ⌘K
  feat(451, 'BC outreach email templates', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'BC Outreach', icon: 'fa-envelope', label: 'Email MLA Template', sub: 'BC digital rights', action: () => {
        const body = encodeURIComponent(`Dear MLA,\n\nI urge you to review SherpaCarta as model language for BC digital rights legislation.\n\nhttps://sherpacarta.org/#canada-bc\n\n114 articles. CC0. Privacy by design.\n\nRespectfully,\n[Your name]`);
        location.href = `mailto:?subject=${encodeURIComponent('SherpaCarta — BC Digital Rights Model')}&body=${body}`;
      }},
      { group: 'BC Outreach', icon: 'fa-envelope-open', label: 'Email MP Template', sub: 'Federal PIPEDA gaps', action: () => {
        const body = encodeURIComponent(`Dear MP,\n\nSherpaCarta offers 114 articles addressing algorithmic accountability gaps in federal privacy law.\n\nhttps://sherpacarta.org\n\nI request your office review the Canada & BC Challenge section.\n\n[Your name]`);
        location.href = `mailto:?subject=${encodeURIComponent('SherpaCarta — Federal Digital Rights')}&body=${body}`;
      }}
    );
  });

  // 26 — Coalition endorsement portal stub
  feat(452, 'Coalition endorsement portal', () => {
    const orgs = $('orgs');
    if (!orgs) return;
    const portal = document.createElement('div');
    portal.style.cssText = 'margin-top:1.5rem;padding:1rem;background:rgba(16,185,129,.06);border:1px dashed var(--border2);border-radius:.75rem;text-align:center';
    portal.innerHTML = `<p style="font-size:.8rem;color:var(--text2)"><i class="fas fa-handshake" style="color:var(--em)"></i> <strong>Organization endorsements</strong> — verified institutional signers coming Q4 2026.</p>
      <a href="mailto:hello@giveabit.io?subject=Sherpacarta%20Coalition%20Endorsement" class="btn btn-ghost" style="margin-top:.75rem;font-size:.72rem">Request endorsement →</a>`;
    orgs.querySelector('.section-max')?.appendChild(portal);
  });

  // 27 — Satohash stamp CTA prominence
  feat(453, 'Satohash stamp CTA', () => {
    const mission = $('mission');
    if (!mission) return;
    const cta = document.createElement('div');
    cta.style.cssText = 'margin-top:1.5rem';
    cta.innerHTML = `<a href="https://satohash.giveabit.io" target="_blank" rel="noopener" class="btn btn-primary"><i class="fas fa-stamp"></i> Stamp Charter on Bitcoin (Satohash)</a>
      <p style="font-size:.65rem;color:var(--text3);margin-top:.5rem">SHA-256 proof via OpenTimestamp — file never leaves your device.</p>`;
    mission.querySelector('.mission-inner')?.appendChild(cta);
  });

  // 28 — Legal gap map (PIPEDA ↔ articles)
  feat(454, 'Legal gap map', () => {
    const bc = $('canada-bc');
    if (!bc) return;
    const map = document.createElement('div');
    map.className = 'legal-gap-map';
    map.style.cssText = 'margin-top:1.5rem;display:grid;gap:.5rem';
    const gaps = [
      { law: 'PIPEDA — consent', art: 'Art. 11', gap: 'Default surveillance not prohibited' },
      { law: 'BC FIPPA', art: 'Art. 12', gap: 'Cross-border data transfer limits' },
      { law: 'Algorithmic decisions', art: 'Art. 61', gap: 'No plain-language explanation right' },
      { law: 'Platform power', art: 'Art. 62', gap: 'Discrimination by algorithm unchecked' },
    ];
    map.innerHTML = `<div style="font-family:var(--mono);font-size:.58rem;color:var(--text3);letter-spacing:.12em;margin-bottom:.35rem">LEGAL GAP MAP — CANADA</div>` +
      gaps.map((g) => `<div style="display:grid;grid-template-columns:1fr 80px 1fr;gap:.5rem;padding:.6rem .75rem;background:var(--bg3);border:1px solid var(--border);border-radius:.5rem;font-size:.72rem"><span style="color:var(--text2)">${g.law}</span><span style="color:var(--em);font-family:var(--mono)">${g.art}</span><span>${g.gap}</span></div>`).join('');
    bc.querySelector('.section-max')?.appendChild(map);
  });

  // 29 — Nostr amendment feed from relays
  feat(455, 'Nostr amendment feed', () => {
    const list = $('amend-list');
    if (!list) return;
    const feed = document.createElement('div');
    feed.id = 'nostr-amend-feed';
    feed.style.cssText = 'margin-top:1rem;padding:.75rem;background:var(--bg3);border:1px solid var(--border);border-radius:.75rem;font-size:.72rem;color:var(--text2)';
    feed.innerHTML = '<div style="font-family:var(--mono);font-size:.55rem;color:var(--text3);margin-bottom:.5rem">NOSTR FEED (relay.damus.io)</div><div id="nostr-feed-items">Connect Nostr to load public proposals…</div>';
    list.parentElement?.appendChild(feed);
    window.loadNostrAmendFeed = async () => {
      const items = $('nostr-feed-items');
      if (!items || !window.NOSTR_RELAYS) return;
      items.textContent = 'Loading from relay…';
      try {
        const relay = window.NOSTR_RELAYS[0];
        const ws = new WebSocket(relay);
        const subs = [];
        ws.onopen = () => {
          ws.send(JSON.stringify(['REQ', 'sc-amend', { kinds: [1], '#t': ['sherpacarta', 'amendment'], limit: 8 }]));
        };
        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data);
          if (msg[0] === 'EVENT' && msg[2]) {
            subs.push(msg[2]);
            items.innerHTML = subs.slice(0, 8).map((ev) => `<div style="padding:.4rem 0;border-bottom:1px solid var(--border)">${ev.content?.slice(0, 120)}… <span style="color:var(--text3)">${ev.pubkey?.slice(0, 8)}</span></div>`).join('') || 'No public proposals yet.';
          }
        };
        setTimeout(() => ws.close(), 4000);
      } catch (_) {
        items.textContent = 'Relay unavailable — local proposals shown above.';
      }
    };
    const orig = window.nostrConnect;
    if (orig) {
      window.nostrConnect = async function () {
        await orig();
        window.loadNostrAmendFeed?.();
      };
    }
  });

  // 30 — Nostr signature kind standardization
  feat(456, 'Nostr sign kind tags', () => {
    window.buildNostrSignEvent = (name, country) => ({
      kind: 1,
      tags: [['t', 'sherpacarta'], ['t', 'sherpacarta-sign'], ['name', name], ['country', country || '']],
      content: `I sign the SherpaCarta Global Digital Magna Carta. ${name}${country ? ` · ${country}` : ''} — https://sherpacarta.org`,
    });
  });

  // 31 — Relay picker with health
  feat(457, 'Nostr relay picker', () => {
    const panel = document.querySelector('.nostr-panel');
    if (!panel) return;
    const sel = document.createElement('select');
    sel.id = 'nostr-relay-pick';
    sel.className = 'sign-input';
    sel.style.cssText = 'margin-top:.5rem;font-size:.72rem';
    (window.NOSTR_RELAYS || []).forEach((r, i) => {
      const o = document.createElement('option');
      o.value = r;
      o.textContent = r.replace('wss://', '');
      if (i === 0) o.selected = true;
      sel.appendChild(o);
    });
    sel.onchange = () => {
      localStorage.setItem('sc_nostr_relay', sel.value);
      toast('Relay: ' + sel.value.replace('wss://', ''), 'info');
    };
    const saved = localStorage.getItem('sc_nostr_relay');
    if (saved) sel.value = saved;
    panel.insertBefore(sel, panel.querySelector('p'));
    const health = document.createElement('span');
    health.id = 'relay-health';
    health.style.cssText = 'font-family:var(--mono);font-size:.55rem;color:var(--text3);margin-left:.5rem';
    sel.parentElement?.appendChild(health);
    const test = () => {
      const r = sel.value;
      const ws = new WebSocket(r);
      const t = setTimeout(() => { ws.close(); health.textContent = '○ offline'; health.style.color = 'var(--red)'; }, 3000);
      ws.onopen = () => { clearTimeout(t); ws.close(); health.textContent = '● online'; health.style.color = 'var(--em)'; };
      ws.onerror = () => { clearTimeout(t); health.textContent = '○ offline'; health.style.color = 'var(--red)'; };
    };
    sel.addEventListener('change', test);
    setTimeout(test, 1500);
  });

  // 32 — Amendment threading (reply to local amendment)
  feat(458, 'Amendment reply threads', () => {
    window.replyToAmendment = (id, text) => {
      const replies = JSON.parse(localStorage.getItem('sc_amend_replies') || '{}');
      replies[id] = replies[id] || [];
      replies[id].push({ text, at: Date.now() });
      localStorage.setItem('sc_amend_replies', JSON.stringify(replies));
      toast('Reply saved locally', 'success');
      window.renderAmendments?.();
    };
    const orig = window.renderAmendments;
    window.renderAmendments = function () {
      if (orig) orig();
      const replies = JSON.parse(localStorage.getItem('sc_amend_replies') || '{}');
      document.querySelectorAll('.amend-item').forEach((el, i) => {
        const id = el.dataset.amendId || String(i);
        if (replies[id]?.length) {
          el.insertAdjacentHTML('beforeend', `<div class="amend-replies" style="font-size:.65rem;color:var(--text3);margin-top:.35rem">${replies[id].map((r) => `↳ ${r.text}`).join('<br>')}</div>`);
        }
      });
    };
  });

  // 33 — npub display on sign
  feat(459, 'npub signer display', () => {
    const orig = window.updateNostrUI;
    window.updateNostrUI = function () {
      if (orig) orig();
      const pk = window.state?.nostrPubkey;
      if (!pk) return;
      const wall = $('signers-wall');
      if (wall && !wall.querySelector('.npub-pill')) {
        const pill = document.createElement('div');
        pill.className = 'signer-pill npub-pill';
        pill.textContent = `npub…${pk.slice(0, 6)}`;
        pill.title = pk;
        wall.prepend(pill);
      }
    };
  });

  // 34 — Publish signature to Nostr one-click
  feat(460, 'Publish sign to Nostr', () => {
    const form = document.querySelector('.sign-form');
    if (!form) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.style.cssText = 'margin-top:.5rem;font-size:.72rem';
    btn.innerHTML = '<i class="fas fa-broadcast-tower"></i> Publish signature to Nostr';
    btn.onclick = async () => {
      if (!window.state?.nostrPubkey) { toast('Connect Nostr first', 'error'); return; }
      const name = $('sign-name')?.value?.trim() || 'Anonymous';
      const c = $('sign-country')?.value?.trim() || '';
      const ev = window.buildNostrSignEvent?.(name, c);
      if (ev && window.publishToNostr) {
        const ok = await window.publishToNostr(ev.content, ev.tags);
        toast(ok ? 'Signature published to Nostr' : 'Publish failed', ok ? 'success' : 'error');
      }
    };
    form.appendChild(btn);
  });

  // 35 — Client spam filter for amendments
  feat(461, 'Amendment spam filter', () => {
    const spam = [/viagra/i, /casino/i, /http:\/\//i];
    const orig = window.submitAmendment;
    window.submitAmendment = function () {
      const text = $('amend-text')?.value || '';
      if (spam.some((r) => r.test(text))) { toast('Proposal blocked by spam filter', 'error'); return; }
      if (text.length < 20) { toast('Proposal too short — add detail', 'error'); return; }
      if (orig) orig();
    };
  });

  // 36 — Public signature ledger aggregate
  feat(462, 'Signature ledger aggregate', () => {
    window.SHERPA_LEDGER = {
      local: () => parseInt(localStorage.getItem('sc_count') || '0', 10),
      export: () => ({ count: window.SHERPA_LEDGER.local(), signers: JSON.parse(localStorage.getItem('sc_signers') || '[]'), exported: new Date().toISOString() }),
    };
    const note = document.createElement('p');
    note.style.cssText = 'font-size:.6rem;color:var(--text3);margin-top:.5rem';
    note.textContent = 'Ledger: privacy-preserving local aggregate. No server-side storage.';
    document.querySelector('.sign-section')?.appendChild(note);
  });

  // 37 — Signer export CSV/JSON
  feat(463, 'Signer export CSV/JSON', () => {
    window.exportSigners = (fmt) => {
      const data = JSON.parse(localStorage.getItem('sc_signers') || '[]');
      if (fmt === 'csv') {
        const csv = 'name,country\n' + data.map((s) => `"${s.name}","${s.c || ''}"`).join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = 'sherpacarta-signers-local.csv';
        a.click();
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
        a.download = 'sherpacarta-signers-local.json';
        a.click();
      }
      toast(`Exported ${data.length} local signer(s)`, 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push(
        { group: 'Sign', icon: 'fa-file-csv', label: 'Export Signers CSV', sub: 'Local only', action: () => window.exportSigners('csv') },
        { group: 'Sign', icon: 'fa-file-code', label: 'Export Signers JSON', sub: 'Local only', action: () => window.exportSigners('json') }
      );
    }
  });

  // 38 — Charter version diff viewer
  feat(464, 'Charter diff viewer', () => {
    window.showCharterDiff = () => {
      const draft = localStorage.getItem('sc_charter_draft') || '';
      const canonical = typeof getCharterPlainText === 'function' ? getCharterPlainText() : '';
      const modal = document.createElement('div');
      modal.className = 'modal open';
      modal.innerHTML = `<div class="modal-inner" style="max-width:640px;max-height:80vh;overflow:auto"><button class="modal-close" onclick="this.closest('.modal').remove()"><i class="fas fa-times"></i></button>
        <h2 style="font-family:var(--serif)">Charter Diff</h2>
        <p style="font-size:.75rem;color:var(--text3)">Draft vs canonical v2.0</p>
        <pre style="font-size:.65rem;white-space:pre-wrap;background:var(--bg3);padding:1rem;border-radius:.5rem">${draft ? `Draft length: ${draft.length} chars\nCanonical: ${canonical.length} chars\n\n${draft === canonical ? 'No differences (or no draft saved)' : 'Differences detected — use Make Editable to review.'}` : 'No local draft saved. Use Make Editable in charter modal.'}</pre></div>`;
      document.body.appendChild(modal);
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Charter', icon: 'fa-code-compare', label: 'Charter Diff Viewer', sub: 'Draft vs canonical', action: () => window.showCharterDiff() });
    }
  });

  // 39 — Article JSON-LD sample
  feat(465, 'Article JSON-LD sample', () => {
    if (!window.CHARTER?.[0]?.articles?.[0]) return;
    const art = window.CHARTER[0].articles[0];
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: art.title,
      articleSection: 'SherpaCarta Charter',
      identifier: art.num,
      url: 'https://sherpacarta.org/#charter',
      author: { '@type': 'Organization', name: 'SherpaCarta Global Movement' },
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    });
    document.head.appendChild(s);
  });

  // 40 — Essential 20 articles path
  feat(466, 'Essential 20 reading path', () => {
    const essential = ['Art. 1', 'Art. 2', 'Art. 11', 'Art. 12', 'Art. 13', 'Art. 21', 'Art. 31', 'Art. 41', 'Art. 51', 'Art. 61', 'Art. 62', 'Art. 71', 'Art. 81', 'Art. 91', 'Art. 101', 'Art. 102', 'Art. 103', 'Art. 110', 'Art. 113', 'Art. 114'];
    const charter = $('charter');
    if (!charter) return;
    const box = document.createElement('div');
    box.style.cssText = 'margin-bottom:1.5rem;padding:1rem;background:rgba(16,185,129,.06);border:1px solid var(--border2);border-radius:.75rem';
    box.innerHTML = `<div style="font-family:var(--mono);font-size:.58rem;color:var(--em);letter-spacing:.12em;margin-bottom:.5rem">ESSENTIAL 20 — START HERE</div>
      <div style="display:flex;flex-wrap:wrap;gap:.35rem">${essential.map((n) => `<button type="button" class="star-pill" onclick="jumpToArticle('${n.replace('Art. ', '')}')">${n}</button>`).join('')}</div>`;
    charter.querySelector('.section-max')?.insertBefore(box, charter.querySelector('.charter-browser'));
    window.jumpToArticle = (num) => {
      const el = document.querySelector(`[data-art-num="${num}"],#art-${num}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else { window.openCharterModal?.(); toast(`Open charter and search Art. ${num}`, 'info'); }
    };
  });

  feat(467, 'Merge B2 BUILD', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.UPGRADES_B2 = SHERPA_UPGRADES.b2.items;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    console.log(`SherpaCarta B2 upgrades — BUILD ${BUILD}`);
  });
})();