/**
 * SherpaCarta Upgrades Batch 3 — Features 468–487
 * API, mobile/UX, performance, trust & media
 */
(function SCUpgradesB3() {
  'use strict';
  const BUILD = '20260704-487';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b3 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b3.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B3 #${id}:`, e); }
  }

  // 41 — Resume reading
  feat(468, 'Resume reading', () => {
    const key = 'sc_last_article';
    document.addEventListener('click', (e) => {
      const art = e.target.closest?.('[data-art-num],.charter-article');
      if (art) localStorage.setItem(key, art.dataset?.artNum || art.id || '');
    });
    const last = localStorage.getItem(key);
    if (last && !location.hash) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost resume-read-btn';
      btn.style.cssText = 'position:fixed;bottom:5rem;right:1rem;z-index:440;font-size:.62rem;padding:.4rem .75rem';
      btn.innerHTML = `<i class="fas fa-bookmark"></i> Resume Art. ${last}`;
      btn.onclick = () => window.jumpToArticle?.(last) || (location.hash = `#art-${last}`);
      document.body.appendChild(btn);
      setTimeout(() => btn.remove(), 12000);
    }
  });

  // 42 — Signature certificate export
  feat(469, 'Signature certificate', () => {
    window.downloadSignCertificate = () => {
      const name = $('sign-name')?.value || localStorage.getItem('sc_last_signer') || 'Signatory';
      const html = `<!DOCTYPE html><html><head><title>SherpaCarta Certificate</title><style>body{font-family:Georgia,serif;text-align:center;padding:3rem;border:8px double #10b981;max-width:600px;margin:2rem auto}h1{color:#10b981}.seal{font-size:3rem}</style></head><body>
        <div class="seal">⚖</div><h1>Certificate of Signature</h1>
        <p>This certifies that <strong>${name}</strong> has signed the SherpaCarta Global Digital Magna Carta.</p>
        <p style="font-size:.85rem;color:#666">${new Date().toLocaleDateString()} · CC0 · sherpacarta.org</p>
        <p><em>Print to PDF (Cmd+P)</em></p></body></html>`;
      const w = window.open('', '_blank');
      if (w) { w.document.write(html); w.document.close(); }
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Sign', icon: 'fa-certificate', label: 'Signature Certificate', sub: 'Print PDF', action: () => window.downloadSignCertificate() });
    }
  });

  // 43–46 — API + embed + MCP + OpenAPI links
  feat(470, 'API endpoint links', () => {
    const legal = document.querySelector('.legal-links');
    if (legal) {
      legal.insertAdjacentHTML('beforeend', '<a href="/api/v1/charter.json" target="_blank" rel="noopener">API</a>');
      legal.insertAdjacentHTML('beforeend', '<a href="/api/v1/openapi.json" target="_blank" rel="noopener">OpenAPI</a>');
    }
    window.SHERPA_API = {
      charter: '/api/v1/charter.json',
      hash: '/api/v1/hash.json',
      article: (n) => `/api/v1/articles/${encodeURIComponent(n)}.json`,
    };
  });

  feat(471, 'Embeddable sign widget', () => {
    const snippet = `<iframe src="https://sherpacarta.org/embed/sign-widget.html" width="320" height="120" style="border:1px solid #10b981;border-radius:12px" title="Sign SherpaCarta"></iframe>`;
    window.copyEmbedSnippet = () => {
      navigator.clipboard.writeText(snippet);
      toast('Embed snippet copied', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Distribute', icon: 'fa-code', label: 'Copy Embed Widget', sub: 'Partner sites', action: () => window.copyEmbedSnippet() });
    }
  });

  feat(472, 'MCP descriptor expansion', () => {
    fetch('/mcp.json').then((r) => r.json()).then((m) => {
      m.tools.push(
        { name: 'link_satohash_stamp', description: 'Return Satohash stamp URL for charter hash' },
        { name: 'get_pillar_summary', description: 'Four pillars overview' }
      );
      m.version = '2.4.0';
      window.SHERPA_MCP = m;
    }).catch(() => {});
  });

  // 47–51 — Mobile & UX
  feat(473, 'Mobile nav simplify', () => {
    const s = document.createElement('style');
    s.textContent = `@media(max-width:768px){
      #status-dock{transform:translateY(0);transition:transform .3s}
      #status-dock.scrolled-away{transform:translateY(-120%)}
      .modal-inner{margin:.75rem;max-height:92vh;border-radius:1rem}
      .donation-card,.sign-section{padding:1rem}
      #float-assert{font-size:.65rem;padding:.5rem .75rem}
    }`;
    document.head.appendChild(s);
  });

  feat(474, 'Touch target audit', () => {
    document.querySelectorAll('button,.btn,.pay-tab,.nav-link,.dot-link').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.width < 40) el.style.minWidth = '44px';
      if (r.height > 0 && r.height < 40) el.style.minHeight = '44px';
    });
  });

  feat(475, 'Status dock auto-hide on scroll', () => {
    const dock = $('status-dock');
    if (!dock) return;
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > last && y > 200) dock.classList.add('scrolled-away');
      else dock.classList.remove('scrolled-away');
      last = y;
    }, { passive: true });
  });

  feat(476, 'Bottom sheet modals mobile', () => {
    const s = document.createElement('style');
    s.textContent = `@media(max-width:768px){
      .modal.open{align-items:flex-end}
      .modal-inner{border-radius:1.25rem 1.25rem 0 0;width:100%;max-width:100%}
      #qr-modal.open{align-items:flex-end}
      #qr-modal .qr-card{border-radius:1.25rem 1.25rem 0 0;max-width:100%}
    }`;
    document.head.appendChild(s);
  });

  feat(477, 'Persistent a11y chip', () => {
    if ($('a11y-chip')) return;
    const chip = document.createElement('button');
    chip.id = 'a11y-chip';
    chip.type = 'button';
    chip.setAttribute('aria-label', 'Accessibility tools');
    chip.innerHTML = '<i class="fas fa-universal-access"></i>';
    chip.style.cssText = 'position:fixed;bottom:calc(1.25rem + env(safe-area-inset-bottom,0));left:max(.5rem,env(safe-area-inset-left,0));z-index:454;width:40px;height:40px;border-radius:50%;border:1px solid var(--border2);background:rgba(11,17,11,.92);color:var(--em);cursor:pointer;font-size:.9rem';
    chip.onclick = () => window.focusA11yToolbar?.() || window.SC6?.toggleA11yDock?.();
    document.body.appendChild(chip);
  });

  feat(478, 'WCAG contrast helpers', () => {
    if (!document.body.classList.contains('high-contrast')) {
      const s = document.createElement('style');
      s.id = 'contrast-boost';
      s.textContent = `.btn-primary,.sign-submit{color:#000!important;font-weight:700}
        a:focus-visible,button:focus-visible{outline:2px solid var(--em);outline-offset:2px}`;
      document.head.appendChild(s);
    }
  });

  // 52–57 — Performance
  feat(479, 'content-visibility sections', () => {
    const s = document.createElement('style');
    s.textContent = `section.section{content-visibility:auto;contain-intrinsic-size:auto 600px}`;
    document.head.appendChild(s);
  });

  feat(480, 'Defer particles on mobile', () => {
    if (window.innerWidth < 768 || navigator.connection?.saveData) {
      $('particle-canvas')?.remove();
      document.body.classList.add('no-particles');
    }
  });

  feat(481, 'SW update banner', () => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (sessionStorage.getItem('sc_sw_reload')) return;
      const bar = document.createElement('div');
      bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;background:var(--em);color:#000;padding:.75rem 1rem;display:flex;justify-content:space-between;align-items:center;font-size:.8rem;font-weight:600';
      bar.innerHTML = '<span>New version available</span><button style="background:#000;color:#fff;border:none;padding:.4rem .75rem;border-radius:100px;cursor:pointer" onclick="sessionStorage.setItem(\'sc_sw_reload\',1);location.reload()">Refresh</button>';
      document.body.appendChild(bar);
    });
  });

  feat(482, 'Legacy React note in console', () => {
    console.info('SherpaCarta runtime: pure HTML/JS. src/ React scaffold is unused — see README.');
  });

  feat(483, 'Changelog link', () => {
    const legal = document.querySelector('.legal-links');
    if (legal && !legal.querySelector('[href="/changelog.html"]')) {
      legal.insertAdjacentHTML('beforeend', '<a href="/changelog.html">Changelog</a>');
    }
  });

  feat(484, 'Treasury transparency page section', () => {
    const donate = document.querySelector('.donate-layout .reveal');
    if (!donate) return;
    const t = document.createElement('a');
    t.href = `https://mempool.space/address/${window.SHERPA_WALLETS?.btc || ''}`;
    t.target = '_blank';
    t.rel = 'noopener';
    t.style.cssText = 'display:inline-block;margin-top:1rem;font-size:.72rem;color:var(--em2)';
    t.innerHTML = '<i class="fas fa-scale-balanced"></i> How we fund this — on-chain treasury proof →';
    donate.appendChild(t);
  });

  feat(485, 'Walkthrough video CTA', () => {
    const hero = document.querySelector('.hero-cta');
    if (!hero) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.style.marginTop = '.5rem';
    btn.innerHTML = '<i class="fas fa-play-circle"></i> 2-min walkthrough';
    btn.onclick = () => toast('Walkthrough video coming soon — see docs/USAGE.md for script', 'info');
    hero.appendChild(btn);
  });

  feat(486, 'Press boilerplate generator', () => {
    window.genPressBoilerplate = () => {
      const text = `FOR IMMEDIATE RELEASE\n\nSherpaCarta publishes 114 articles of digital human rights — a living Magna Carta for the algorithmic age. CC0. Bitcoin-funded. Zero tracking.\n\nhttps://sherpacarta.org\nhello@giveabit.io`;
      navigator.clipboard.writeText(text);
      toast('Press boilerplate copied', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Distribute', icon: 'fa-bullhorn', label: 'Press Boilerplate', sub: 'Copy to clipboard', action: () => window.genPressBoilerplate() });
    }
  });

  feat(487, 'Merge B3 BUILD + feature rollup', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.UPGRADES_B3 = SHERPA_UPGRADES.b3.items;
    SC.totalFeatures = 487;
    SC.allUpgrades = [
      ...(SHERPA_UPGRADES.b1?.items || []),
      ...(SHERPA_UPGRADES.b2?.items || []),
      ...(SHERPA_UPGRADES.b3?.items || []),
    ];
    const bb = document.querySelector('.build-badge');
    if (bb) {
      bb.textContent = 'BUILD ' + BUILD;
      bb.title = '487 features + 60 upgrades';
    }
    const orig = SC.showFeatures;
    SC.showFeatures = function () {
      if (orig) orig();
      const grid = $('features-modal')?.querySelector('.features-grid');
      if (grid && !grid.dataset.upgrades) {
        const items = SC.allUpgrades.map((f) => `<div class="feat-item"><span>${f.id}</span> ${f.name}</div>`).join('');
        grid.insertAdjacentHTML('beforeend', items);
        grid.dataset.upgrades = '1';
        $('features-modal')?.querySelector('h2').textContent = '487 Features';
      }
    };
    setTimeout(() => toast('SherpaCarta upgraded — 60 enhancements live. BUILD 487.', 'success'), 2000);
    console.log(`SherpaCarta B3 upgrades — BUILD ${BUILD}`);
  });
})();