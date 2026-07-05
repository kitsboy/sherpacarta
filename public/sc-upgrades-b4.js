/**
 * SherpaCarta Sprint 1 — Batch 4 upgrades (488–507)
 */
(function SCUpgradesB4() {
  'use strict';
  const BUILD = '20260704-507';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b4 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b4.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B4 #${id}:`, e); }
  }

  // 488 — Donation tier buttons
  feat(488, 'Donation tier buttons', () => {
    const pane = $('donate-pane-btc');
    const addr = window.SHERPA_WALLETS?.btc;
    if (!pane || !addr) return;
    const tiers = [
      { label: '21k sats', sats: 21000 },
      { label: '100k sats', sats: 100000 },
      { label: '1M sats', sats: 1000000 },
    ];
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem';
    wrap.innerHTML = '<span style="font-family:var(--mono);font-size:.55rem;color:var(--text3);width:100%">QUICK AMOUNTS</span>';
    tiers.forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost';
      b.style.fontSize = '.62rem';
      b.textContent = t.label;
      b.onclick = () => {
        const uri = `bitcoin:${addr}?amount=${(t.sats / 1e8).toFixed(8)}`;
        navigator.clipboard.writeText(uri).then(() => toast(`Copied ${t.label} payment URI`, 'success'));
      };
      wrap.appendChild(b);
    });
    pane.appendChild(wrap);
  });

  // 489 — ?article= deep link
  feat(489, 'Article deep link on load', () => {
    const params = new URLSearchParams(location.search);
    const art = params.get('article') || params.get('art');
    if (!art) return;
    setTimeout(() => {
      window.openCharterModal?.();
      setTimeout(() => {
        window.jumpToArticle?.(art.replace(/^Art\.\s*/i, ''));
        const tabs = document.querySelectorAll('.article-tab');
        tabs.forEach((t) => t.click());
      }, 400);
    }, 600);
  });

  // 490 — Mobile nav section links
  feat(490, 'Mobile nav section links', () => {
    const menu = $('nav-menu');
    if (!menu || menu.querySelector('.nav-section-links')) return;
    const links = [
      { label: 'Mission', href: '#mission' },
      { label: 'Charter', action: () => window.openCharterModal?.() },
      { label: 'Sign', href: '#sign' },
      { label: 'Donate', href: '#donate-heading' },
      { label: 'FAQ', href: '#faq' },
    ];
    const nav = document.createElement('div');
    nav.className = 'nav-section-links';
    nav.style.cssText = 'display:none;width:100%;flex-direction:column;gap:.35rem;padding:.5rem 0;border-top:1px solid var(--border);margin-top:.5rem';
    links.forEach((l) => {
      const a = document.createElement('button');
      a.type = 'button';
      a.className = 'btn btn-ghost';
      a.style.cssText = 'justify-content:flex-start;font-size:.78rem;width:100%';
      a.textContent = l.label;
      a.onclick = () => {
        if (l.action) l.action();
        else document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' });
        $('nav-toggle')?.click();
      };
      nav.appendChild(a);
    });
    menu.appendChild(nav);
    const s = document.createElement('style');
    s.textContent = '@media(max-width:768px){.nav-section-links{display:flex!important}}';
    document.head.appendChild(s);
  });

  // 491 — Skip links per section
  feat(491, 'Section skip links', () => {
    const skip = document.createElement('nav');
    skip.setAttribute('aria-label', 'Skip to section');
    skip.className = 'section-skip-nav';
    skip.innerHTML = [
      ['Charter', '#charter'],
      ['Sign', '#sign'],
      ['Donate', '#donate-heading'],
      ['FAQ', '#faq'],
    ].map(([l, h]) => `<a href="${h}" class="section-skip-link">${l}</a>`).join('');
    document.body.insertBefore(skip, $('main-nav')?.nextSibling || document.body.firstChild);
    const s = document.createElement('style');
    s.textContent = `.section-skip-nav{position:fixed;top:-100px;left:1rem;z-index:99998;display:flex;gap:.35rem;flex-wrap:wrap;background:var(--bg2);padding:.4rem .6rem;border-radius:100px;border:1px solid var(--border2);transition:top .2s}
      .section-skip-nav:focus-within{top:4.5rem}
      .section-skip-link{font-size:.65rem;color:var(--em);text-decoration:none;padding:.2rem .45rem;font-family:var(--mono)}`;
    document.head.appendChild(s);
  });

  // 492 — Reduced motion
  feat(492, 'Reduced motion global', () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.classList.add('reduce-motion');
    $('particle-canvas')?.remove();
    const s = document.createElement('style');
    s.textContent = `.reduce-motion *,.reduce-motion *::before,.reduce-motion *::after{animation:none!important;transition:none!important}
      .reduce-motion .trust-bar{display:none}`;
    document.head.appendChild(s);
  });

  // 493 — Modal focus trap
  feat(493, 'Modal focus trap', () => {
    const trap = (modal) => {
      if (!modal) return;
      const focusable = modal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      });
      setTimeout(() => first?.focus(), 50);
    };
    const obs = new MutationObserver(() => {
      document.querySelectorAll('.modal.open,#qr-modal.open,#cmd-overlay.open').forEach(trap);
    });
    obs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
  });

  // 494–496 — Static pages linked in footer
  feat(494, 'security.txt link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML('beforeend', '<a href="/.well-known/security.txt">Security</a>');
  });

  feat(495, 'Status page link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML('beforeend', '<a href="/status.html">Status</a>');
  });

  feat(496, 'Accessibility statement link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML('beforeend', '<a href="/accessibility.html">Accessibility</a>');
  });

  // 497 — Donation thank-you on copy
  feat(497, 'Donation copy thank-you', () => {
    const orig = window.copyBTC;
    window.copyBTC = function () {
      if (orig) orig();
      setTimeout(() => toast('Thank you for supporting digital rights — every sat counts.', 'success'), 300);
    };
  });

  // 498 — Article collections
  feat(498, 'Article collections', () => {
    const collections = [
      { name: 'Start Here', arts: ['1', '2', '11', '12', '13'] },
      { name: 'For Parents', arts: ['21', '31', '41'] },
      { name: 'For Developers', arts: ['51', '61', '62'] },
    ];
    const charter = $('charter');
    if (!charter) return;
    const box = document.createElement('div');
    box.style.cssText = 'margin-bottom:1rem;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center';
    box.innerHTML = '<span style="font-family:var(--mono);font-size:.58rem;color:var(--text3)">COLLECTIONS:</span>';
    collections.forEach((c) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'star-pill';
      b.textContent = c.name;
      b.onclick = () => {
        window.openCharterModal?.();
        toast(`${c.name}: ${c.arts.map((a) => 'Art.' + a).join(', ')}`, 'info');
      };
      box.appendChild(b);
    });
    charter.querySelector('.section-max')?.prepend(box);
  });

  // 499 — Fuzzy ⌘K search
  feat(499, 'Fuzzy command palette', () => {
    const synonyms = { privacy: ['art. 11', 'art 11'], donate: ['bitcoin', 'btc', 'fund'], sign: ['signature', 'assert'] };
    const score = (item, q) => {
      const hay = `${item.label} ${item.sub} ${item.group}`.toLowerCase();
      if (hay.includes(q)) return 10;
      let s = 0;
      q.split(/\s+/).forEach((w) => { if (w.length > 2 && hay.includes(w)) s += 3; });
      Object.entries(synonyms).forEach(([k, vals]) => {
        if (q.includes(k) && vals.some((v) => hay.includes(v))) s += 5;
      });
      return s;
    };
    const orig = window.cmdSearch;
    window.cmdSearch = function (q) {
      if (!q || q.length < 2) { if (orig) orig(q); return; }
      const query = q.toLowerCase();
      const filtered = (window.CMD_ITEMS || []).map((i) => ({ i, s: score(i, query) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.i);
      if (!filtered.length) { if (orig) orig(q); return; }
      const groups = [...new Set(filtered.map((i) => i.group))];
      const container = $('cmd-results');
      if (!container) return;
      window.cmdFocused = 0;
      container.innerHTML = groups.map((g) => `
        <div class="cmd-group-label">${g}</div>
        ${filtered.filter((i) => i.group === g).map((item) => `
          <div class="cmd-item" onclick="(${item.action.toString()})();closeCommandPalette()" role="option">
            <div class="cmd-item-icon"><i class="fas ${item.icon}"></i></div>
            <div><div class="cmd-item-text">${item.label}</div><div class="cmd-item-sub">${item.sub}</div></div>
          </div>`).join('')}
      `).join('');
    };
    window.CMD_ITEMS = window.CMD_ITEMS || (typeof CMD_ITEMS !== 'undefined' ? CMD_ITEMS : []);
  });

  // 500 — PWA install prompt
  feat(500, 'PWA install prompt', () => {
    let deferred;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferred = e;
      if (localStorage.getItem('sc_pwa_dismissed')) return;
      const bar = document.createElement('div');
      bar.id = 'pwa-install-bar';
      bar.style.cssText = 'position:fixed;bottom:4.5rem;left:50%;transform:translateX(-50%);z-index:470;background:var(--bg2);border:1px solid var(--border2);border-radius:100px;padding:.5rem 1rem;display:flex;gap:.75rem;align-items:center;font-size:.72rem;box-shadow:var(--shadow)';
      bar.innerHTML = `<span>Add SherpaCarta to home screen</span>
        <button class="btn btn-primary" style="font-size:.65rem;padding:.3rem .65rem">Install</button>
        <button class="btn btn-ghost" style="font-size:.65rem;padding:.3rem .5rem">×</button>`;
      bar.querySelector('.btn-primary').onclick = () => { deferred?.prompt(); bar.remove(); };
      bar.querySelector('.btn-ghost').onclick = () => { localStorage.setItem('sc_pwa_dismissed', '1'); bar.remove(); };
      document.body.appendChild(bar);
    });
  });

  // 501 — Print charter CSS
  feat(501, 'Print charter CSS', () => {
    const s = document.createElement('style');
    s.textContent = `@media print{
      #main-nav,#status-dock,#float-assert,#back-top,#a11y-chip,.section-skip-nav{display:none!important}
      .charter-modal-content,.modal-inner{max-height:none!important;overflow:visible!important}
      .charter-article{break-inside:avoid;page-break-inside:avoid}
      body{background:#fff;color:#000}}`;
    document.head.appendChild(s);
  });

  // 502 — HTML export (EPUB-friendly)
  feat(502, 'HTML charter export', () => {
    window.downloadCharterHTML = () => {
      const text = typeof getCharterPlainText === 'function' ? getCharterPlainText() : '';
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SherpaCarta Charter</title></head><body><h1>SherpaCarta v2.0</h1><pre>${text.replace(/</g, '&lt;')}</pre><p>CC0 — https://sherpacarta.org</p></body></html>`;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      a.download = 'SherpaCarta-Charter.html';
      a.click();
      toast('Charter HTML downloaded — import to e-reader apps', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Actions', icon: 'fa-file-code', label: 'Download Charter HTML', sub: 'E-reader friendly', action: () => window.downloadCharterHTML() });
    }
  });

  // 503 — Share article via Web Share API
  feat(503, 'Share article native', () => {
    window.shareArticle = (num, title) => {
      const url = `https://sherpacarta.org/?article=${num}`;
      const text = `${title} — SherpaCarta Art. ${num}`;
      if (navigator.share) navigator.share({ title: 'SherpaCarta', text, url }).catch(() => {});
      else { navigator.clipboard.writeText(url); toast('Article link copied', 'success'); }
    };
  });

  // 504 — Real counts mode (disable simulated increment)
  feat(504, 'Real counts only mode', () => {
    window.SC_REAL_COUNTS = true;
    localStorage.setItem('sc_real_counts_only', '1');
  });

  // 505 — Cache headers via meta note (full headers in _headers file)

  // 506 — Volunteer CTA
  feat(506, 'Volunteer CTA', () => {
    const mission = $('mission');
    if (!mission) return;
    const cta = document.createElement('a');
    cta.href = 'mailto:hello@giveabit.io?subject=Sherpacarta%20Volunteer';
    cta.className = 'btn btn-ghost';
    cta.style.marginTop = '1rem';
    cta.innerHTML = '<i class="fas fa-hands-helping"></i> Volunteer — join 24 countries';
    mission.querySelector('.mission-inner')?.appendChild(cta);
  });

  // 507 — BUILD merge
  feat(507, 'Sprint 1 BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 1;
    SC.UPGRADES_B4 = SHERPA_UPGRADES.b4.items;
    SC.totalFeatures = 507;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    console.log(`SherpaCarta Sprint 1 — BUILD ${BUILD} (${SHERPA_UPGRADES.b4.items.length} upgrades)`);
  });
})();