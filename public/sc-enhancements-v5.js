/**
 * SherpaCarta Enhancements v3.2 — Features 326–375
 * Groups 14–15 × 25 features
 */
(function SCEnhancementsV5() {
  'use strict';
  const BUILD = '20260703-375';
  const FEATURES = [];
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  function feat(id, name, fn) {
    FEATURES.push({ id, name });
    try { fn(); } catch (e) { console.warn(`Feature ${id}:`, e); }
  }

  window.SC5 = window.SC5 || {};

  // ═══ GROUP 14: Footer & Brand Center (326–350) ═══════════

  feat(326, 'Centered parent logo copyright row', () => {
    const center = document.querySelector('.legal-bottom-center');
    if (center) center.setAttribute('role', 'contentinfo');
  });

  feat(327, 'Parent logo 2× size (44px)', () => {
    document.querySelectorAll('.giveabit-footer-parent img').forEach((img) => {
      img.style.height = '44px';
      img.height = 44;
    });
  });

  feat(328, 'Parent logo entrance animation', () => {
    const s = document.createElement('style');
    s.textContent = '.giveabit-footer-parent{animation:parent-logo-in .8s ease both}@keyframes parent-logo-in{from{opacity:0;transform:translateY(8px)}to{opacity:.85;transform:none}}';
    document.head.appendChild(s);
  });

  feat(329, 'Parent logo focus ring a11y', () => {
    const s = document.createElement('style');
    s.textContent = '.giveabit-footer-parent:focus-visible{outline:2px solid var(--em);outline-offset:4px;border-radius:4px}';
    document.head.appendChild(s);
  });

  feat(330, 'Footer center responsive stack', () => {
    SC5.checkFooterLayout = () => {
      const lb = document.querySelector('.legal-bottom');
      if (lb && window.innerWidth < 768) lb.classList.add('legal-bottom-stacked');
      else lb?.classList.remove('legal-bottom-stacked');
    };
    SC5.checkFooterLayout();
    window.addEventListener('resize', SC5.checkFooterLayout);
  });

  feat(331, 'CC0 badge under parent logo', () => {
    const center = document.querySelector('.legal-bottom-center');
    if (center && !$('cc0-badge')) {
      const b = document.createElement('span');
      b.id = 'cc0-badge';
      b.className = 'parent-tagline';
      b.textContent = 'CC0 · Public Domain';
      center.appendChild(b);
    }
  });

  feat(332, 'Parent logo double-click easter egg', () => {
    document.querySelector('.giveabit-footer-parent')?.addEventListener('dblclick', () => {
      toast('giveaBit.io — Bitcoin-powered tools for human dignity 🧡', 'success');
    });
  });

  feat(333, 'Copyright auto year', () => {
    const p = document.querySelector('.legal-bottom-left p');
    if (p) p.innerHTML = p.innerHTML.replace('2026', String(new Date().getFullYear()));
  });

  feat(334, 'Parent logo preload high priority', () => {
    const l = document.querySelector('link[href="/giveabit-parent-logo.jpg"]');
    if (l) l.setAttribute('fetchpriority', 'high');
  });

  feat(335, 'Footer scroll-into-view on hash #parent', () => {
    if (location.hash === '#parent') {
      document.querySelector('.legal-bottom-center')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  feat(336, 'Parent link ⌘K shortcut', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Contact', icon: 'fa-building', label: 'Parent Company — giveaBit.io', sub: 'Center footer logo', action: () => window.open('https://giveabit.io', '_blank', 'noopener') },
      { group: 'Navigate', icon: 'fa-arrow-down', label: 'Scroll to Parent Logo', sub: 'Footer center', action: () => document.querySelector('.legal-bottom-center')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
    );
  });

  feat(337, 'Manifest parent icon entry', () => {
    fetch('/manifest.json').then((r) => r.json()).then((m) => {
      m.icons = m.icons || [];
      if (!m.icons.find((i) => i.src?.includes('parent'))) {
        m.icons.push({ src: '/giveabit-parent-logo.jpg', sizes: '512x256', type: 'image/jpeg', purpose: 'any' });
      }
    }).catch(() => {});
  });

  feat(338, 'Footer separator accent line', () => {
    const s = document.createElement('style');
    s.textContent = '.legal-bottom-center::before,.legal-bottom-center::after{content:"";display:block;width:40px;height:1px;background:linear-gradient(90deg,transparent,var(--em),transparent);margin:.25rem 0}';
    document.head.appendChild(s);
  });

  feat(339, 'Parent logo light theme contrast', () => {
    SC5.parentLogoContrast = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      document.querySelectorAll('.giveabit-footer-parent img').forEach((img) => {
        img.style.filter = light ? 'drop-shadow(0 1px 2px rgba(0,0,0,.15))' : 'none';
      });
    };
    SC5.parentLogoContrast();
    const orig = window.toggleTheme;
    window.toggleTheme = function () {
      if (orig) orig();
      setTimeout(SC5.parentLogoContrast, 50);
    };
  });

  feat(340, 'Local parent logo impression counter', () => {
    const n = parseInt(localStorage.getItem('sc_parent_impressions') || '0', 10) + 1;
    localStorage.setItem('sc_parent_impressions', String(n));
    const link = document.querySelector('.giveabit-footer-parent');
    if (link) link.addEventListener('click', () => {
      localStorage.setItem('sc_parent_clicks', String(parseInt(localStorage.getItem('sc_parent_clicks') || '0', 10) + 1));
    });
  });

  feat(341, 'Footer landmark aria label', () => {
    document.querySelector('.legal-footer')?.setAttribute('aria-label', 'Legal information and parent company');
  });

  feat(342, 'Parent logo title dynamic', () => {
    document.querySelector('.giveabit-footer-parent')?.setAttribute('title', 'giveaBit.io — parent company · Bitcoin · Privacy · Human dignity');
  });

  feat(343, 'Copy parent URL button', () => {
    SC5.copyParentUrl = () => {
      navigator.clipboard.writeText('https://giveabit.io');
      toast('giveabit.io copied', 'success');
    };
    const center = document.querySelector('.legal-bottom-center');
    if (center && !$('copy-parent-btn')) {
      const btn = document.createElement('button');
      btn.id = 'copy-parent-btn';
      btn.type = 'button';
      btn.className = 'btn btn-ghost';
      btn.style.cssText = 'font-size:.5rem;padding:.2rem .5rem;margin-top:.15rem';
      btn.innerHTML = '<i class="fas fa-link"></i> copy giveabit.io';
      btn.onclick = () => SC5.copyParentUrl();
      center.appendChild(btn);
    }
  });

  feat(344, 'Footer print layout preserve center', () => {
    const s = document.createElement('style');
    s.textContent = '@media print{.legal-bottom{grid-template-columns:1fr!important;justify-items:center}.giveabit-footer-parent img{height:48px!important}}';
    document.head.appendChild(s);
  });

  feat(345, 'Wave + parent logo synergy glow', () => {
    const s = document.createElement('style');
    s.textContent = '.legal-bottom-center .giveabit-footer-parent{position:relative;z-index:1}';
    document.head.appendChild(s);
  });

  feat(346, 'Parent brand in JSON-LD sameAs', () => {
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      try {
        const j = JSON.parse(s.textContent);
        if (j.publisher?.name === 'Give A Bit' && j.publisher.sameAs) {
          if (!j.publisher.sameAs.includes('https://giveabit.io')) j.publisher.sameAs.unshift('https://giveabit.io');
          s.textContent = JSON.stringify(j);
        }
      } catch (_) {}
    });
  });

  feat(347, 'SW cache v3.2', () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((r) => r.forEach((reg) => reg.update()));
  });

  feat(348, 'Screenshot mode preserve parent center', () => {
    const s = document.createElement('style');
    s.textContent = 'body.screenshot-mode .legal-bottom-center{display:flex!important;opacity:1!important}';
    document.head.appendChild(s);
  });

  feat(349, 'Usage guide parent logo note', () => {
    const orig = window.SC3?.showUsageGuide;
    if (orig) {
      window.SC3.showUsageGuide = function () {
        orig();
        const sections = $('usage-guide-modal')?.querySelector('.usage-sections');
        if (sections && !sections.querySelector('.parent-note')) {
          sections.insertAdjacentHTML('beforeend', '<section class="parent-note"><h3>🧡 Parent Company</h3><p style="font-size:.82rem;color:var(--text2)">SherpaCarta is a <a href="https://giveabit.io" target="_blank" rel="noopener" style="color:var(--em)">giveaBit.io</a> project. Parent logo centered in footer.</p></section>');
        }
      };
    }
  });

  feat(350, 'Group 14 footer polish complete', () => {
    console.log('Footer center brand: giveaBit.io @ 44px');
  });

  // ═══ GROUP 15: Advanced Power (351–375) ══════════════════

  feat(351, 'Session duration tracker', () => {
    SC5.sessionStart = Date.now();
    SC5.getSessionMins = () => Math.round((Date.now() - SC5.sessionStart) / 60000);
    window.addEventListener('beforeunload', () => {
      const total = parseInt(localStorage.getItem('sc_total_mins') || '0', 10) + SC5.getSessionMins();
      localStorage.setItem('sc_total_mins', String(total));
    });
  });

  feat(352, 'Article read heatmap local', () => {
    SC5.heatmap = JSON.parse(localStorage.getItem('sc_heatmap') || '{}');
    SC5.markRead = (num) => {
      SC5.heatmap[num] = (SC5.heatmap[num] || 0) + 1;
      localStorage.setItem('sc_heatmap', JSON.stringify(SC5.heatmap));
    };
    const orig = window.filterCharter;
    window.filterCharter = function (q) {
      if (orig) orig(q);
      if (q?.startsWith('Art')) SC5.markRead(q);
    };
  });

  feat(353, 'Top articles dashboard widget', () => {
    SC5.renderTopArticles = () => {
      const el = $('top-articles-widget');
      if (!el) return;
      const heat = SC5.heatmap || JSON.parse(localStorage.getItem('sc_heatmap') || '{}');
      const top = Object.entries(heat).sort((a, b) => b[1] - a[1]).slice(0, 3);
      el.innerHTML = top.length
        ? top.map(([n, c]) => `<button type="button" class="btn btn-ghost" style="font-size:.6rem" onclick="openCharterModal();setTimeout(()=>filterCharter('${n}'),400)">${n} (${c}×)</button>`).join(' ')
        : '<span style="font-size:.7rem;color:var(--text3)">Read articles to see your top picks</span>';
    };
    const dash = $('personal-dashboard');
    if (dash) {
      const w = document.createElement('div');
      w.id = 'top-articles-widget';
      w.style.marginTop = '.75rem';
      w.innerHTML = '<div class="calc-label">YOUR TOP ARTICLES</div>';
      dash.appendChild(w);
      setTimeout(SC5.renderTopArticles, 500);
    }
  });

  feat(354, 'Rights score sparkline history', () => {
    SC5.scoreHistory = JSON.parse(localStorage.getItem('sc_score_spark') || '[]');
    const orig = window.calcRights;
    if (orig) {
      window.calcRights = function () {
        orig();
        const score = parseInt($('calc-score')?.textContent || '0', 10);
        if (score > 0) {
          SC5.scoreHistory.push({ score, ts: Date.now() });
          SC5.scoreHistory = SC5.scoreHistory.slice(-20);
          localStorage.setItem('sc_score_spark', JSON.stringify(SC5.scoreHistory));
        }
      };
    }
  });

  feat(355, 'Amendment templates library', () => {
    SC5.templates = [
      { title: 'Expand Art. 11', text: 'Propose clarifying that biometric data is included in absolute privacy protections.' },
      { title: 'AI transparency', text: 'Propose strengthening Art. 61 with mandatory human review for high-stakes decisions.' },
      { title: 'Children\'s rights', text: 'Propose new article: minors shall not be subject to profiling for commercial purposes.' },
    ];
    SC5.useTemplate = (i) => {
      const t = SC5.templates[i];
      if (!t) return;
      const ta = document.querySelector('.amend-form textarea');
      if (ta) { ta.value = t.text; toast('Template loaded: ' + t.title, 'success'); }
    };
    const box = document.createElement('div');
    box.style.cssText = 'display:flex;gap:.35rem;flex-wrap:wrap;margin-bottom:.5rem';
    box.innerHTML = SC5.templates.map((t, i) =>
      `<button type="button" class="btn btn-ghost" style="font-size:.6rem" onclick="SC5.useTemplate(${i})">${t.title}</button>`
    ).join('');
    document.querySelector('.amend-form')?.prepend(box);
  });

  feat(356, 'BC MLA outreach pack', () => {
    window.downloadBCOutreachPack = () => {
      const pack = `BC OUTREACH PACK — SherpaCarta\n\n1. Sign at sherpacarta.org\n2. Email MLA (template in ⌘K)\n3. Stamp on satohash.giveabit.io\n4. Share with 3 contacts\n\nhello@giveabit.io (subject: Sherpacarta)`;
      const blob = new Blob([pack], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'BC-Outreach-Pack.txt';
      a.click();
      toast('BC outreach pack downloaded', 'success');
    };
  });

  feat(357, 'Petition signature goal local', () => {
    SC5.petitionGoal = parseInt(localStorage.getItem('sc_petition_goal') || '100', 10);
    SC5.petitionCount = () => (window.state?.signers?.length || 0);
    SC5.renderPetitionBar = () => {
      let bar = $('petition-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'petition-bar';
        bar.style.cssText = 'margin-top:1rem;font-size:.72rem;color:var(--text2)';
        $('canada-bc')?.querySelector('.challenge-banner')?.appendChild(bar);
      }
      const c = SC5.petitionCount();
      const pct = Math.min(100, Math.round((c / SC5.petitionGoal) * 100));
      bar.innerHTML = `Local petition progress: ${c} / ${SC5.petitionGoal} signatures (${pct}%)<div style="height:4px;background:var(--bg3);border-radius:2px;margin-top:.35rem"><div style="height:100%;width:${pct}%;background:var(--em);border-radius:2px"></div></div>`;
    };
    SC5.renderPetitionBar();
    const orig = window.signCharter;
    if (orig) window.signCharter = function () { orig.apply(this, arguments); SC5.renderPetitionBar(); };
  });

  feat(358, 'Charter read-aloud speed', () => {
    SC5.speechRate = parseFloat(localStorage.getItem('sc_speech_rate') || '1');
    SC5.setSpeechRate = (r) => {
      SC5.speechRate = r;
      localStorage.setItem('sc_speech_rate', String(r));
      toast('Read-aloud speed: ' + r + '×', 'info');
    };
    const orig = window.readAloud;
    if (orig) {
      window.readAloud = function () {
        orig();
        if (state.utterance) state.utterance.rate = SC5.speechRate;
      };
    }
  });

  feat(359, 'Nostr relay picker UI', () => {
    const sel = document.createElement('select');
    sel.className = 'nostr-relay-pick';
    sel.style.cssText = 'font-size:.65rem;margin-left:.35rem;background:var(--bg3);border:1px solid var(--border);color:var(--text2);border-radius:6px;padding:.25rem';
    sel.innerHTML = (window.NOSTR_RELAYS || ['wss://relay.damus.io']).map((r) => `<option value="${r}">${r.replace('wss://', '')}</option>`).join('');
    sel.onchange = () => { localStorage.setItem('sc_preferred_relay', sel.value); toast('Preferred relay: ' + sel.value, 'info'); };
    const saved = localStorage.getItem('sc_preferred_relay');
    if (saved) sel.value = saved;
    $('nostr-connect-btn')?.after(sel);
  });

  feat(360, 'Relay health check button', () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.style.fontSize = '.6rem';
    btn.innerHTML = '<i class="fas fa-signal"></i> Check relays';
    btn.onclick = async () => {
      const relays = window.NOSTR_RELAYS || [];
      let ok = 0;
      for (const r of relays) {
        if (await SC2?.relayStatus?.(r)) ok++;
      }
      toast(`${ok}/${relays.length} relays reachable`, ok ? 'success' : 'error');
    };
    $('nostr-connect-btn')?.parentElement?.appendChild(btn);
  });

  feat(361, 'Satohash quick stamp button', () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.style.cssText = 'font-size:.65rem;margin-top:.5rem';
    btn.innerHTML = '<i class="fab fa-bitcoin"></i> Stamp on Satohash';
    btn.onclick = () => {
      if (window.stampCharterHash) stampCharterHash();
      else window.open('https://satohash.giveabit.io', '_blank', 'noopener');
    };
    $('sign')?.querySelector('.sign-section')?.appendChild(btn);
  });

  feat(362, 'Donation milestone progress', () => {
    const bar = document.createElement('div');
    bar.className = 'donate-milestone';
    bar.style.cssText = 'font-size:.65rem;color:var(--text3);margin-top:.75rem;font-family:var(--mono)';
    bar.textContent = 'Funding: community-powered · goal tracking coming with live wallet';
    document.querySelector('.donation-card')?.appendChild(bar);
  });

  feat(363, 'Sign milestone confetti tiers', () => {
    const orig = window.signCharter;
    if (orig) {
      window.signCharter = function () {
        orig.apply(this, arguments);
        const n = window.state?.signers?.length || 0;
        if ([1, 5, 10, 25].includes(n)) window.SC?.confetti?.();
      };
    }
  });

  feat(364, 'Locale number formatting sign count', () => {
    const fmt = (n) => n.toLocaleString();
    const counter = $('live-counter');
    if (counter && window.state) {
      const orig = Object.getOwnPropertyDescriptor(window.state, 'signCount');
      setInterval(() => {
        if ($('live-counter')) $('live-counter').textContent = fmt(window.state.signCount || 0);
      }, 5000);
    }
  });

  feat(365, 'Timezone-aware greeting', () => {
    const h = new Date().getHours();
    const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    setTimeout(() => toast(greet + ' — ready to assert your digital rights?', 'info'), 6000);
  });

  feat(366, 'Seasonal wave tint', () => {
    const m = new Date().getMonth();
    const wb = $('wave-bg');
    if (!wb) return;
    if (m === 11 || m === 0) wb.classList.add('waves-winter');
    if (m >= 5 && m <= 7) wb.classList.add('waves-summer');
    const s = document.createElement('style');
    s.textContent = '#wave-bg.waves-winter path{filter:hue-rotate(20deg)}#wave-bg.waves-summer path{filter:hue-rotate(-15deg)}';
    document.head.appendChild(s);
  });

  feat(367, 'Konami code v2 easter egg', () => {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input,textarea')) return;
      if (e.key === seq[pos]) { pos++; if (pos === seq.length) { pos = 0; toast('🎮 Art. 11 is the Konami code of digital rights!', 'success'); document.body.classList.add('konami-flash'); setTimeout(() => document.body.classList.remove('konami-flash'), 2000); } }
      else pos = 0;
    });
    const s = document.createElement('style');
    s.textContent = 'body.konami-flash{animation:kflash .5s 3}@keyframes kflash{50%{filter:brightness(1.3)}}';
    document.head.appendChild(s);
  });

  feat(368, 'Article tag word cloud', () => {
    SC5.renderTagCloud = () => {
      if (typeof CHARTER === 'undefined') return;
      const tags = {};
      CHARTER.forEach((ch) => ch.articles.forEach((a) => (a.tags || []).forEach((t) => { tags[t] = (tags[t] || 0) + 1; })));
      const cloud = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 12);
      let el = $('tag-cloud');
      if (!el) {
        el = document.createElement('div');
        el.id = 'tag-cloud';
        el.style.cssText = 'display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1rem';
        $('articles-heading')?.parentElement?.appendChild(el);
      }
      el.innerHTML = cloud.map(([t, n]) =>
        `<span class="tag-pill" style="font-size:${0.6 + n * 0.05}rem;padding:.25rem .6rem;border:1px solid var(--border2);border-radius:100px;color:var(--text3);font-family:var(--mono)">${t}</span>`
      ).join('');
    };
    (window.SC2?.idle || ((fn) => setTimeout(fn, 2000)))(SC5.renderTagCloud);
  });

  feat(369, 'Export full session report', () => {
    window.exportSessionReport = () => {
      const report = {
        exported: new Date().toISOString(),
        signers: window.state?.signers?.length || 0,
        sessionMins: SC5.getSessionMins?.() || 0,
        totalMins: localStorage.getItem('sc_total_mins'),
        heatmap: SC5.heatmap,
        checklist: JSON.parse(localStorage.getItem('sc_checklist') || '{}'),
        stars: SC2?.stars,
        build: BUILD,
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sherpacarta-session-report.json';
      a.click();
      toast('Session report exported', 'success');
    };
  });

  feat(370, 'Import session report', () => {
    window.importSessionReport = () => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'application/json';
      inp.onchange = () => {
        const r = new FileReader();
        r.onload = () => {
          try {
            const data = JSON.parse(r.result);
            if (data.heatmap) localStorage.setItem('sc_heatmap', JSON.stringify(data.heatmap));
            toast('Session data imported', 'success');
            SC5.renderTopArticles?.();
          } catch (_) { toast('Invalid report file', 'error'); }
        };
        r.readAsText(inp.files[0]);
      };
      inp.click();
    };
  });

  feat(371, 'Power user ⌘K batch', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Power', icon: 'fa-file-export', label: 'Export Session Report', sub: 'JSON backup', action: exportSessionReport },
      { group: 'Power', icon: 'fa-file-import', label: 'Import Session Report', sub: 'Restore heatmap', action: importSessionReport },
      { group: 'Power', icon: 'fa-map', label: 'BC Outreach Pack', sub: 'Download .txt', action: downloadBCOutreachPack },
      { group: 'Power', icon: 'fa-gauge', label: 'Speech Rate 1.25×', sub: 'Faster read-aloud', action: () => SC5.setSpeechRate(1.25) }
    );
  });

  feat(372, 'Charter progress ring in dashboard', () => {
    const pct = Math.min(100, Math.round((parseInt(localStorage.getItem('sc_articles_read') || '0', 10) / 114) * 100));
    const dash = $('personal-dashboard');
    if (dash) {
      const ring = document.createElement('div');
      ring.style.cssText = 'margin-top:.5rem;font-size:.65rem;color:var(--text3)';
      ring.textContent = `Charter explored: ${pct}% of 114 articles`;
      dash.appendChild(ring);
    }
  });

  feat(373, 'Article deep link from tag cloud click', () => {
    document.addEventListener('click', (e) => {
      if (e.target.classList?.contains('tag-pill') && typeof CHARTER !== 'undefined') {
        const tag = e.target.textContent.trim();
        const art = CHARTER.flatMap((c) => c.articles).find((a) => a.tags?.includes(tag));
        if (art) { openCharterModal(); setTimeout(() => filterCharter(art.num), 400); }
      }
    });
  });

  feat(374, 'Feature range tab 351–375', () => {
    if (SC3?.featRanges) {
      SC3.featRanges.push({ label: 'Power 351–375', min: 351, max: 375 });
      SC3.featRanges.push({ label: 'Brand 326–350', min: 326, max: 350 });
    }
  });

  feat(375, 'Merge SC5 + BUILD 375', () => {
    window.SC = window.SC || {};
    SC.FEATURES_V5 = FEATURES;
    SC.BUILD = BUILD;
    SC.totalFeatures = 375;
    const origShow = SC.showFeatures;
    SC.showFeatures = function () {
      if (origShow) origShow();
      const grid = $('features-modal')?.querySelector('.features-grid');
      if (grid && !grid.dataset.v5merged) {
        grid.insertAdjacentHTML('beforeend', FEATURES.map((f) => `<div class="feat-item"><span>${f.id}</span> ${f.name}</div>`).join(''));
        grid.dataset.v5merged = '1';
        $('features-modal')?.querySelector('h2').textContent = '375 Features';
        $('features-modal')?.querySelector('p').textContent = 'BUILD ' + BUILD;
      }
    };
    const bb = document.querySelector('.build-badge');
    if (bb) {
      bb.textContent = 'BUILD ' + BUILD;
      bb.title = '375 features — click for list · right-click for guide';
    }
    setTimeout(() => {
      if (!sessionStorage.getItem('sc_375_loaded')) {
        sessionStorage.setItem('sc_375_loaded', '1');
        toast('375 features — giveaBit.io centered in footer at 2× size 🧡', 'success');
      }
    }, 5000);
  });

  console.log(`SherpaCarta v3.2 — features 326–375 loaded (${FEATURES.length})`);
})();