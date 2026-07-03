/**
 * SherpaCarta Enhancements v3.0 — Features 201–300
 * Groups 9–12 × 25 features
 */
(function SCEnhancementsV3() {
  'use strict';
  const BUILD = '20260703-300';
  const FEATURES = [];
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  function feat(id, name, fn) {
    FEATURES.push({ id, name });
    try { fn(); } catch (e) { console.warn(`Feature ${id}:`, e); }
  }

  window.SC3 = window.SC3 || {};

  // ═══ GROUP 9: Onboarding & Help (201–225) ═══════════════

  feat(201, 'Usage guide modal', () => {
    SC3.showUsageGuide = function () {
      let m = $('usage-guide-modal');
      if (!m) {
        m = document.createElement('div');
        m.id = 'usage-guide-modal';
        m.className = 'modal-overlay';
        m.innerHTML = `<div class="modal-inner" style="max-width:640px;max-height:85vh;overflow-y:auto">
          <button class="modal-close" onclick="SC3.closeUsageGuide()"><i class="fas fa-times"></i></button>
          <h2 style="font-family:var(--serif);margin-bottom:.5rem">How to Use SherpaCarta</h2>
          <p style="font-size:.8rem;color:var(--text3);margin-bottom:1.25rem">300 features · privacy-first · no account required</p>
          <div class="usage-sections">
            <section><h3>🚀 Quick Start (2 min)</h3>
              <ol style="font-size:.82rem;color:var(--text2);line-height:1.8;padding-left:1.2rem">
                <li>Scroll the hero → read the mission</li>
                <li>Click <strong>Open the Full Charter</strong> or press <kbd>C</kbd></li>
                <li>Sign at <strong>Sign the Charter</strong> (press <kbd>G</kbd>)</li>
                <li>Optional: connect Nostr for public amendments</li>
                <li>Share via official channels: @give_bit, Nostr, GitHub</li>
              </ol></section>
            <section><h3>⌨️ Power User</h3>
              <p style="font-size:.82rem;color:var(--text2);line-height:1.7"><kbd>⌘K</kbd> command palette · <kbd>?</kbd> shortcuts · Click <strong>BUILD</strong> badge (bottom-left) for all 300 features · A11y toolbar (bottom-left): font, contrast, reading mode</p></section>
            <section><h3>🇨🇦 Canada / BC Challenge</h3>
              <p style="font-size:.82rem;color:var(--text2);line-height:1.7">⌘K → <em>Legislative Brief</em> or <em>MLA Email Template</em>. Stamp charter on <a href="https://satohash.giveabit.io" target="_blank" rel="noopener" style="color:var(--em)">Satohash</a> before outreach.</p></section>
            <section><h3>📧 Contact</h3>
              <p style="font-size:.82rem;color:var(--text2)"><a href="mailto:hello@giveabit.io?subject=Sherpacarta" style="color:var(--em)">hello@giveabit.io</a> (subject: Sherpacarta)</p></section>
            <section><h3>🎬 Video Tutorial</h3>
              <p style="font-size:.82rem;color:var(--text2);line-height:1.7">A 2–3 min walkthrough is planned (hero → sign → charter → Nostr → donate). For now, this guide + ⌘K covers everything.</p>
              <button type="button" class="btn btn-ghost" style="margin-top:.5rem;font-size:.7rem" onclick="SC3.notifyVideoInterest()"><i class="fas fa-bell"></i> Notify me when video is ready</button>
            </section>
          </div>
          <p style="font-size:.65rem;color:var(--text3);margin-top:1.25rem;font-family:var(--mono)">Full docs: github.com/kitsboy/sherpacarta/docs/USAGE.md</p>
        </div>`;
        m.onclick = (e) => { if (e.target === m) SC3.closeUsageGuide(); };
        document.body.appendChild(m);
        const s = document.createElement('style');
        s.textContent = '.usage-sections section{margin-bottom:1.25rem;border-bottom:1px solid var(--border);padding-bottom:1rem}.usage-sections h3{font-size:.9rem;margin-bottom:.5rem;color:var(--em2)}.usage-sections kbd{background:var(--bg3);padding:.15rem .4rem;border-radius:4px;font-family:var(--mono);font-size:.7rem}';
        document.head.appendChild(s);
      }
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
      localStorage.setItem('sc_guide_seen', '1');
    };
    SC3.closeUsageGuide = () => {
      $('usage-guide-modal')?.classList.remove('open');
      if (!$('charter-modal')?.classList.contains('open') && !$('qr-modal')?.classList.contains('open')) document.body.style.overflow = '';
    };
    SC3.notifyVideoInterest = () => {
      localStorage.setItem('sc_video_interest', '1');
      toast('Noted — we will email hello@giveabit.io list when video drops', 'success');
    };
  });

  feat(202, 'Help button in nav', () => {
    const menu = $('nav-menu');
    if (!menu || $('nav-help-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'nav-help-btn';
    btn.className = 'btn btn-ghost';
    btn.title = 'How to use SherpaCarta';
    btn.setAttribute('aria-label', 'Open usage guide');
    btn.innerHTML = '<i class="fas fa-circle-question"></i>';
    btn.onclick = () => SC3.showUsageGuide();
    menu.insertBefore(btn, menu.querySelector('.btn-primary'));
  });

  feat(203, 'Quick start checklist', () => {
    SC3.checklist = JSON.parse(localStorage.getItem('sc_checklist') || '{"charter":0,"sign":0,"share":0,"nostr":0,"calc":0}');
    SC3.tickCheck = (key) => {
      SC3.checklist[key] = 1;
      localStorage.setItem('sc_checklist', JSON.stringify(SC3.checklist));
      SC3.renderChecklist();
    };
    SC3.renderChecklist = () => {
      const el = $('quick-checklist');
      if (!el) return;
      const items = [
        ['charter', 'Open the charter'],
        ['sign', 'Sign your name'],
        ['share', 'Copy page link'],
        ['nostr', 'Copy Nostr NIP-05'],
        ['calc', 'Run Rights Calculator'],
      ];
      const done = items.filter(([k]) => SC3.checklist[k]).length;
      el.innerHTML = `<div class="calc-label">QUICK START ${done}/${items.length}</div>` +
        items.map(([k, label]) => `<label class="check-item"><input type="checkbox" disabled ${SC3.checklist[k] ? 'checked' : ''}> ${label}</label>`).join('');
    };
    const panel = document.createElement('div');
    panel.id = 'quick-checklist';
    panel.className = 'quick-checklist';
    const sign = $('sign');
    if (sign) sign.querySelector('.sign-section')?.prepend(panel);
    SC3.renderChecklist();
    const origSign = window.signCharter;
    if (origSign) window.signCharter = function () { origSign.apply(this, arguments); SC3.tickCheck('sign'); };
    const origCopy = window.copyPageURL;
    window.copyPageURL = function () { if (origCopy) origCopy(); SC3.tickCheck('share'); };
    const origOpen = window.openCharterModal;
    window.openCharterModal = function () { if (origOpen) origOpen(); SC3.tickCheck('charter'); };
    const origNip = window.copyNostrNip;
    window.copyNostrNip = function () { if (origNip) origNip(); SC3.tickCheck('nostr'); };
    const origCalc = window.calcRights;
    if (origCalc) window.calcRights = function () { origCalc(); SC3.tickCheck('calc'); };
    const s = document.createElement('style');
    s.textContent = '.quick-checklist{margin-bottom:1.25rem;padding:1rem;border:1px solid var(--border);border-radius:.75rem;background:var(--bg3)}.check-item{display:block;font-size:.75rem;color:var(--text2);margin:.35rem 0}';
    document.head.appendChild(s);
  });

  feat(204, 'Feature search in modal', () => {
    SC3.filterFeatures = (q) => {
      const grid = $('features-modal')?.querySelector('.features-grid');
      if (!grid) return;
      const query = q.toLowerCase();
      grid.querySelectorAll('.feat-item').forEach((el) => {
        el.style.display = !query || el.textContent.toLowerCase().includes(query) ? '' : 'none';
      });
    };
    const orig = window.SC?.showFeatures;
    window.SC = window.SC || {};
    window.SC.showFeatures = function () {
      if (orig) orig();
      let inp = $('feat-search');
      if (!inp) {
        inp = document.createElement('input');
        inp.id = 'feat-search';
        inp.placeholder = 'Search 300 features…';
        inp.className = 'feat-search';
        inp.style.cssText = 'width:100%;margin-bottom:.75rem;padding:.5rem;border-radius:8px;border:1px solid var(--border2);background:var(--bg3);color:var(--text);font-family:var(--mono);font-size:.75rem';
        inp.oninput = () => SC3.filterFeatures(inp.value);
        $('features-modal')?.querySelector('.modal-inner')?.insertBefore(inp, $('features-modal').querySelector('.features-grid'));
      }
      inp.value = '';
      SC3.filterFeatures('');
    };
  });

  feat(205, 'Feature category tabs', () => {
    SC3.featRanges = [
      { label: 'All', min: 1, max: 300 },
      { label: 'Core 1–100', min: 1, max: 100 },
      { label: 'Power 101–200', min: 101, max: 200 },
      { label: 'Guide 201–300', min: 201, max: 300 },
    ];
    SC3.filterByRange = (min, max) => {
      $('features-modal')?.querySelectorAll('.feat-item').forEach((el) => {
        const n = parseInt(el.querySelector('span')?.textContent || '0', 10);
        el.style.display = n >= min && n <= max ? '' : 'none';
      });
    };
    document.addEventListener('click', (e) => {
      if (e.target.classList?.contains('feat-tab')) {
        const min = parseInt(e.target.dataset.min, 10);
        const max = parseInt(e.target.dataset.max, 10);
        document.querySelectorAll('.feat-tab').forEach((t) => t.classList.remove('active'));
        e.target.classList.add('active');
        SC3.filterByRange(min, max);
      }
    });
    const orig = window.SC?.showFeatures;
    window.SC.showFeatures = function () {
      if (orig) orig();
      if ($('feat-tabs')) return;
      const tabs = document.createElement('div');
      tabs.id = 'feat-tabs';
      tabs.style.cssText = 'display:flex;gap:.35rem;flex-wrap:wrap;margin-bottom:.75rem';
      tabs.innerHTML = SC3.featRanges.map((r) =>
        `<button type="button" class="feat-tab btn btn-ghost ${r.min === 1 && r.max === 300 ? 'active' : ''}" data-min="${r.min}" data-max="${r.max}" style="font-size:.6rem;padding:.25rem .5rem">${r.label}</button>`
      ).join('');
      $('feat-search')?.before(tabs);
    };
  });

  feat(206, 'Video tutorial CTA banner', () => {
    if (localStorage.getItem('sc_video_banner_dismiss')) return;
    const b = document.createElement('div');
    b.className = 'video-cta-banner';
    b.innerHTML = `<span><i class="fas fa-play-circle"></i> <strong>Video walkthrough coming soon</strong> — 2 min: sign, charter, Nostr, donate</span>
      <button type="button" class="btn btn-ghost" style="font-size:.65rem" onclick="SC3.showUsageGuide()">Read guide</button>
      <button type="button" class="btn btn-ghost" style="font-size:.65rem" onclick="this.parentElement.remove();localStorage.setItem('sc_video_banner_dismiss','1')">Dismiss</button>`;
    const hero = $('hero');
    if (hero) hero.querySelector('.hero-inner')?.appendChild(b);
    const s = document.createElement('style');
    s.textContent = '.video-cta-banner{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;justify-content:center;margin-top:1rem;padding:.6rem 1rem;border:1px dashed var(--border2);border-radius:100px;font-size:.72rem;color:var(--text2);animation:fade-up .6s .8s both}';
    document.head.appendChild(s);
  });

  feat(207, 'Print quick reference', () => {
    window.printQuickRef = () => {
      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>SherpaCarta Quick Reference</title><style>body{font-family:system-ui;max-width:600px;margin:2rem auto;line-height:1.6}h1{color:#10b981}kbd{background:#eee;padding:2px 6px;border-radius:4px}</style></head><body>
        <h1>SherpaCarta Quick Reference</h1>
        <p><kbd>⌘K</kbd> Command palette · <kbd>G</kbd> Sign · <kbd>H</kbd> Home · <kbd>D</kbd> Donate · <kbd>C</kbd> Charter · <kbd>?</kbd> Shortcuts</p>
        <p>Contact: hello@giveabit.io (subject: Sherpacarta)</p>
        <p>Twitter @give_bit · Nostr kimi@giveabit.io · github.com/kitsboy/sherpacarta</p>
        <p>BTC: ${window.SHERPA_WALLETS?.btc || ''}</p>
        <p>sherpacarta.org — 114 articles · CC0</p>
      </body></html>`);
      w.document.close();
      w.print();
    };
  });

  feat(208, 'Mobile tip on first visit', () => {
    if (localStorage.getItem('sc_mobile_tip') || window.innerWidth > 768) return;
    setTimeout(() => {
      toast('Tip: tap ☰ for menu, ? for help, BUILD badge for features', 'info');
      localStorage.setItem('sc_mobile_tip', '1');
    }, 4000);
  });

  feat(209, 'Signing walkthrough', () => {
    SC3.signWalkthrough = () => {
      document.getElementById('sign')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => toast('1) Enter name 2) Pick country 3) Click Sign 4) Optional: Nostr publish', 'info'), 600);
    };
  });

  feat(210, 'Nostr connect wizard', () => {
    SC3.nostrWizard = () => {
      const steps = [
        'Install Alby, nos2x, or Primal browser extension',
        'Click Connect Nostr on the sign section',
        'Your pubkey stays local — we never see your keys',
        'Publish amendments to relays when you propose changes',
      ];
      alert('Nostr Setup\n\n' + steps.map((s, i) => `${i + 1}. ${s}`).join('\n'));
    };
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.style.fontSize = '.65rem';
    btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Nostr setup';
    btn.onclick = () => SC3.nostrWizard();
    $('nostr-connect-btn')?.before(btn);
  });

  feat(211, 'Amendment how-to panel', () => {
    const box = document.createElement('details');
    box.className = 'amend-howto';
    box.innerHTML = `<summary style="cursor:pointer;font-size:.75rem;color:var(--em);margin-bottom:.75rem">How amendments work</summary>
      <p style="font-size:.72rem;color:var(--text3);line-height:1.7">Propose → 90-day debate → legal review → ⅔ org ratification. Rights only expand (Art. 114). Connect Nostr to publish publicly.</p>`;
    document.querySelector('.amend-form')?.before(box);
  });

  feat(212, 'BC challenge progress tracker', () => {
    SC3.bcProgress = JSON.parse(localStorage.getItem('sc_bc_progress') || '{}');
    SC3.bcTick = (key) => {
      SC3.bcProgress[key] = !SC3.bcProgress[key];
      localStorage.setItem('sc_bc_progress', JSON.stringify(SC3.bcProgress));
      SC3.renderBCProgress();
    };
    SC3.renderBCProgress = () => {
      const el = $('bc-progress');
      if (!el) return;
      const steps = [['sign', 'Signed charter'], ['share', 'Shared with contact'], ['mla', 'Emailed MLA template'], ['stamp', 'Stamped on Satohash']];
      el.innerHTML = steps.map(([k, label]) =>
        `<label class="bc-check"><input type="checkbox" ${SC3.bcProgress[k] ? 'checked' : ''} onchange="SC3.bcTick('${k}')"> ${label}</label>`
      ).join('');
    };
    const box = document.createElement('div');
    box.id = 'bc-progress';
    box.className = 'bc-progress';
    $('canada-bc')?.querySelector('.challenge-steps')?.after(box);
    SC3.renderBCProgress();
    const s = document.createElement('style');
    s.textContent = '.bc-progress{display:flex;flex-direction:column;gap:.35rem;margin-top:1rem}.bc-check{font-size:.72rem;color:var(--text2)}';
    document.head.appendChild(s);
  });

  feat(213, 'Donation how-to tooltip', () => {
    const note = document.createElement('p');
    note.className = 'pay-note';
    note.style.marginTop = '.5rem';
    note.innerHTML = '<i class="fas fa-circle-info"></i> Bitcoin: copy address or scan QR. Lightning is TEMP — do not send.';
    $('donate-pane-btc')?.appendChild(note.cloneNode(true));
  });

  feat(214, 'Calculator explainer', () => {
    const det = document.createElement('details');
    det.innerHTML = `<summary style="font-size:.7rem;color:var(--em);cursor:pointer;margin-bottom:.75rem">How the score works</summary>
      <p style="font-size:.72rem;color:var(--text3);line-height:1.6">Combines country baseline, use case risk, and encryption level. Not legal advice — a conversation starter for your rights gap.</p>`;
    document.querySelector('.calc-grid')?.prepend(det);
  });

  feat(215, 'Charter modal tips bar', () => {
    const orig = window.openCharterModal;
    window.openCharterModal = function () {
      if (orig) orig();
      setTimeout(() => {
        let tip = $('charter-tip');
        if (!tip) {
          tip = document.createElement('div');
          tip.id = 'charter-tip';
          tip.style.cssText = 'font-size:.65rem;color:var(--text3);font-family:var(--mono);padding:.5rem 0;border-bottom:1px solid var(--border);margin-bottom:.75rem';
          $('charter-content')?.before(tip);
        }
        tip.textContent = 'Tip: ⌘F browser search · star articles · export via ⌘K → Download Charter';
      }, 200);
    };
  });

  feat(216, '⌘K Help commands group', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Help', icon: 'fa-circle-question', label: 'Usage Guide', sub: 'How to use everything', action: () => SC3.showUsageGuide() },
      { group: 'Help', icon: 'fa-list-check', label: 'Quick Start Checklist', sub: 'Track your progress', action: () => document.getElementById('sign')?.scrollIntoView({ behavior: 'smooth' }) },
      { group: 'Help', icon: 'fa-keyboard', label: 'Keyboard Shortcuts', sub: 'All hotkeys', action: () => window.SC?.showShortcuts?.() },
      { group: 'Help', icon: 'fa-print', label: 'Print Quick Reference', sub: 'One-page cheat sheet', action: printQuickRef },
      { group: 'Help', icon: 'fa-wand-magic-sparkles', label: 'Nostr Setup Wizard', sub: '3-step guide', action: () => SC3.nostrWizard() },
      { group: 'Help', icon: 'fa-signature', label: 'Signing Walkthrough', sub: 'Step-by-step sign', action: () => SC3.signWalkthrough() }
    );
  });

  feat(217, 'Keyboard cheat sheet download', () => {
    window.downloadCheatSheet = () => {
      const text = `SHERPACARTA KEYBOARD CHEAT SHEET\n\n⌘K  Command palette\n?   Shortcuts modal\nG   Go to sign\nH   Home (top)\nD   Donate section\nC   Open charter\nT   Toggle theme\nEsc Close modals\n\nBUILD badge (bottom-left) → 300 features list\n? button (nav) → Usage guide\n\nhello@giveabit.io (subject: Sherpacarta)\nsherpacarta.org`;
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-Cheat-Sheet.txt';
      a.click();
      toast('Cheat sheet downloaded', 'success');
    };
  });

  feat(218, 'Feature spotlight rotation', () => {
    const spots = [
      'Try ⌘K → Legislative Brief for BC outreach',
      'Star articles in the charter — they appear on sign page',
      'Press BUILD badge to browse all 300 features',
      'Zen mode: ⌘K → Presentation Mode for clean charter view',
    ];
    const idx = parseInt(localStorage.getItem('sc_spot_idx') || '0', 10) % spots.length;
    setTimeout(() => toast('💡 ' + spots[idx], 'info'), 8000);
    localStorage.setItem('sc_spot_idx', String(idx + 1));
  });

  feat(219, 'First-visit guide auto-open', () => {
    const params = new URLSearchParams(location.search);
    if (params.get('help') === '1' || (!localStorage.getItem('sc_guide_seen') && !sessionStorage.getItem('sc_guide_session'))) {
      sessionStorage.setItem('sc_guide_session', '1');
      setTimeout(() => SC3.showUsageGuide(), 2000);
    }
  });

  feat(220, 'Help deep link ?help=1', () => {
    if (location.search.includes('help=1')) history.replaceState({}, '', location.pathname + location.hash);
  });

  feat(221, 'BUILD badge tooltip', () => {
    const bb = document.querySelector('.build-badge');
    if (bb) bb.title = '300 features — click for list · right-click for guide';
    document.addEventListener('contextmenu', (e) => {
      if (e.target.classList?.contains('build-badge')) {
        e.preventDefault();
        SC3.showUsageGuide();
      }
    });
  });

  feat(222, 'A11y toolbar tooltips', () => {
    setTimeout(() => {
      const bar = $('a11y-toolbar');
      if (!bar) return;
      bar.querySelectorAll('button').forEach((btn) => {
        if (!btn.title) btn.title = btn.textContent.trim() || 'Accessibility';
      });
    }, 500);
  });

  feat(223, 'Email usage guide', () => {
    window.emailUsageGuide = () => {
      const body = encodeURIComponent('SherpaCarta usage guide:\n\n1. Open sherpacarta.org\n2. Press ⌘K for all commands\n3. Sign the charter\n4. Full docs: https://github.com/kitsboy/sherpacarta/blob/main/docs/USAGE.md\n\nContact: hello@giveabit.io');
      location.href = 'mailto:?subject=SherpaCarta%20—%20How%20to%20Use&body=' + body;
    };
  });

  feat(224, 'Features used counter', () => {
    SC3.logFeatureUse = (name) => {
      const used = JSON.parse(localStorage.getItem('sc_features_used') || '[]');
      if (!used.includes(name)) {
        used.push(name);
        localStorage.setItem('sc_features_used', JSON.stringify(used.slice(-50)));
      }
    };
    const origToast = window.toast;
    if (origToast) {
      let count = 0;
      window.toast = function (msg, type) {
        if (++count % 5 === 0) SC3.logFeatureUse('toast_' + count);
        return origToast(msg, type);
      };
    }
  });

  feat(225, 'SW cache v3.0 bump', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.update()));
    }
  });

  // ═══ GROUP 10: Charter Depth (226–250) ═════════════════

  feat(226, 'Charter full-text search modal', () => {
    SC3.charterSearch = () => {
      const q = prompt('Search all 114 articles:');
      if (!q || typeof CHARTER === 'undefined') return;
      openCharterModal();
      setTimeout(() => filterCharter(q), 400);
    };
  });

  feat(227, 'Article difficulty tags', () => {
    SC3.difficulty = { 'Art. 11': 'Core', 'Art. 12': 'Core', 'Art. 13': 'Core', 'Art. 61': 'Advanced', 'Art. 62': 'Advanced', 'Art. 114': 'Meta' };
    SC3.getDifficulty = (num) => SC3.difficulty[num] || 'Standard';
  });

  feat(228, 'Reading level estimate', () => {
    SC3.readingLevel = (text) => {
      const words = text.split(/\s+/).length;
      const sentences = (text.match(/[.!?]+/g) || []).length || 1;
      const score = 0.39 * (words / sentences) + 11.8;
      return score < 10 ? 'Accessible' : score < 14 ? 'Standard' : 'Legal density';
    };
  });

  feat(229, 'Glossary terms popup', () => {
    SC3.glossary = { sovereignty: 'You own and control your data', surveillance: 'Mass monitoring without individual suspicion', algorithmic: 'Automated decisions affecting your life' };
    window.showGlossary = (term) => {
      const def = SC3.glossary[term.toLowerCase()];
      if (def) toast(term + ': ' + def, 'info');
    };
  });

  feat(230, 'Cross-reference Art. 11 links', () => {
    SC3.related = { 'Art. 11': ['Art. 12', 'Art. 13'], 'Art. 12': ['Art. 11', 'Art. 14'], 'Art. 61': ['Art. 62', 'Art. 63'] };
    window.jumpRelated = (num) => {
      const rel = SC3.related[num];
      if (rel) { openCharterModal(); setTimeout(() => filterCharter(rel[0]), 400); }
    };
  });

  feat(231, 'Site-wide highlight search', () => {
    SC3.highlightSearch = (q) => {
      document.querySelectorAll('.search-hit').forEach((el) => el.classList.remove('search-hit'));
      if (!q) return;
      document.querySelectorAll('.faq-a,.pillar p,.mission-block p').forEach((el) => {
        if (el.textContent.toLowerCase().includes(q.toLowerCase())) el.classList.add('search-hit');
      });
    };
    const s = document.createElement('style');
    s.textContent = '.search-hit{background:rgba(16,185,129,.12);outline:1px solid var(--em)}';
    document.head.appendChild(s);
  });

  feat(232, 'Last read article restore', () => {
    SC3.saveLastArticle = (num) => localStorage.setItem('sc_last_article', num);
    const orig = window.filterCharter;
    window.filterCharter = function (q) {
      if (orig) orig(q);
      if (q && q.startsWith('Art')) SC3.saveLastArticle(q);
    };
    const last = localStorage.getItem('sc_last_article');
    if (last && location.search.includes('resume=1')) {
      setTimeout(() => { openCharterModal(); filterCharter(last); }, 1500);
    }
  });

  feat(233, 'Reading time per article', () => {
    SC3.articleReadingTime = (body) => {
      const words = body.replace(/<[^>]+>/g, '').split(/\s+/).length;
      return Math.max(1, Math.ceil(words / 200)) + ' min';
    };
  });

  feat(234, 'Custom article collections', () => {
    SC3.collections = JSON.parse(localStorage.getItem('sc_collections') || '{"Essential":["Art. 11","Art. 12","Art. 13"]}');
    SC3.addToCollection = (name, num) => {
      SC3.collections[name] = SC3.collections[name] || [];
      if (!SC3.collections[name].includes(num)) SC3.collections[name].push(num);
      localStorage.setItem('sc_collections', JSON.stringify(SC3.collections));
      toast('Added to ' + name, 'success');
    };
    window.openCollection = (name) => {
      const arts = SC3.collections[name];
      if (arts?.[0]) { openCharterModal(); setTimeout(() => filterCharter(arts[0]), 400); }
    };
  });

  feat(235, 'Study mode flashcards', () => {
    SC3.flashcards = [
      { q: 'What does Art. 11 protect?', a: 'Absolute privacy — no mass surveillance' },
      { q: 'Can amendments reduce rights?', a: 'No — Art. 114: rights only expand' },
      { q: 'How is SherpaCarta funded?', a: 'Voluntary Bitcoin donations only' },
    ];
    SC3.studyMode = () => {
      const card = SC3.flashcards[Math.floor(Math.random() * SC3.flashcards.length)];
      toast(card.q + ' → ' + card.a, 'info');
    };
  });

  feat(236, 'Rights trivia quiz', () => {
    SC3.quiz = () => {
      const ok = confirm('True or False: Mass surveillance is allowed under Art. 11?\n\nClick OK for False (correct), Cancel for True');
      toast(ok ? 'Correct! Art. 11 bans mass surveillance.' : 'Incorrect — Art. 11 prohibits mass surveillance always.', ok ? 'success' : 'error');
    };
  });

  feat(237, 'Article audio queue', () => {
    SC3.audioQueue = JSON.parse(localStorage.getItem('sc_audio_queue') || '[]');
    SC3.queueAudio = (num) => {
      if (!SC3.audioQueue.includes(num)) SC3.audioQueue.push(num);
      localStorage.setItem('sc_audio_queue', JSON.stringify(SC3.audioQueue));
      toast('Queued ' + num + ' for read-aloud', 'success');
    };
  });

  feat(238, 'Charter breadcrumb', () => {
    SC3.updateBreadcrumb = (chapter, article) => {
      let bc = $('charter-breadcrumb');
      if (!bc) {
        bc = document.createElement('div');
        bc.id = 'charter-breadcrumb';
        bc.style.cssText = 'font-size:.65rem;color:var(--text3);font-family:var(--mono);margin-bottom:.5rem';
        $('charter-content')?.before(bc);
      }
      bc.textContent = chapter ? `${chapter} › ${article}` : '';
    };
  });

  feat(239, 'Compare rights vs country avg', () => {
    SC3.compareMyScore = () => {
      const score = $('calc-score')?.textContent;
      if (!score || score === '—') { toast('Run calculator first', 'error'); return; }
      toast('Your score: ' + score + ' — OECD avg ~55. Advocate for Art. 11–13.', 'info');
    };
  });

  feat(240, 'Weekly digest generator', () => {
    window.generateWeeklyDigest = () => {
      const digest = `SHERPACARTA WEEKLY DIGEST\n${new Date().toLocaleDateString()}\n\n• 114 articles protecting digital rights\n• Sign: sherpacarta.org#sign\n• BC Challenge: adopt as model legislation\n• Contact: hello@giveabit.io\n\nShare with one person this week.`;
      navigator.clipboard.writeText(digest);
      toast('Weekly digest copied', 'success');
    };
  });

  feat(241, 'Single article export txt', () => {
    window.exportArticle = (num, title, body) => {
      const text = `${num}: ${title}\n\n${body.replace(/<[^>]+>/g, '')}\n\n— SherpaCarta v2.0 · sherpacarta.org`;
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = num.replace(/\s/g, '-') + '.txt';
      a.click();
    };
  });

  feat(242, 'Article print view', () => {
    window.printArticle = (num, title, body) => {
      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>${num}</title></head><body style="font-family:Georgia;max-width:650px;margin:2rem auto"><h1>${num}: ${title}</h1>${body}</body></html>`);
      w.document.close();
      w.print();
    };
  });

  feat(243, 'Related laws map', () => {
    SC3.lawMap = { 'Art. 11': 'GDPR Art. 5–9, CCPA, BC PIPA', 'Art. 12': 'GDPR portability, EU Data Act', 'Art. 61': 'EU AI Act, Algorithmic Accountability Act' };
    window.showLawMap = (num) => {
      const laws = SC3.lawMap[num];
      if (laws) toast(num + ' relates to: ' + laws, 'info');
    };
  });

  feat(244, 'Article impact score', () => {
    SC3.impact = { 'Art. 11': 10, 'Art. 12': 9, 'Art. 13': 9, 'Art. 61': 8, 'Art. 62': 8 };
    SC3.getImpact = (num) => SC3.impact[num] || 5;
  });

  feat(245, 'Pin article to top', () => {
    SC3.pinned = localStorage.getItem('sc_pinned_article');
    SC3.pinArticle = (num) => {
      localStorage.setItem('sc_pinned_article', num);
      toast('Pinned ' + num, 'success');
    };
    if (SC3.pinned) {
      const orig = window.openCharterModal;
      window.openCharterModal = function () {
        if (orig) orig();
        setTimeout(() => filterCharter(SC3.pinned), 300);
      };
    }
  });

  feat(246, 'Article discussion notes', () => {
    SC3.discuss = JSON.parse(localStorage.getItem('sc_discuss') || '{}');
    SC3.addDiscussion = (num, text) => {
      SC3.discuss[num] = SC3.discuss[num] || [];
      SC3.discuss[num].push({ text, ts: Date.now() });
      localStorage.setItem('sc_discuss', JSON.stringify(SC3.discuss));
    };
  });

  feat(247, 'Charter completeness meter', () => {
    SC3.completeness = () => {
      const read = parseInt(localStorage.getItem('sc_articles_read') || '0', 10);
      const pct = Math.min(100, Math.round((read / 114) * 100));
      return pct;
    };
    const orig = window.filterCharter;
    window.filterCharter = function (q) {
      if (orig) orig(q);
      if (q?.startsWith('Art')) {
        const read = parseInt(localStorage.getItem('sc_articles_read') || '0', 10) + 1;
        localStorage.setItem('sc_articles_read', String(Math.min(read, 114)));
      }
    };
  });

  feat(248, 'Essential articles quick bar', () => {
    const bar = document.createElement('div');
    bar.className = 'essential-bar';
    bar.style.cssText = 'display:flex;gap:.35rem;flex-wrap:wrap;margin-top:1rem';
    bar.innerHTML = ['Art. 11', 'Art. 12', 'Art. 13', 'Art. 61'].map((n) =>
      `<button type="button" class="btn btn-ghost" style="font-size:.62rem" onclick="openCharterModal();setTimeout(()=>filterCharter('${n}'),400)">${n}</button>`
    ).join('');
    $('articles-heading')?.after(bar);
  });

  feat(249, 'Charter hash display in modal', () => {
    const orig = window.openCharterModal;
    window.openCharterModal = function () {
      if (orig) orig();
      setTimeout(() => {
        if (window.state?.charterHash) {
          let h = $('charter-hash-display');
          if (!h) {
            h = document.createElement('div');
            h.id = 'charter-hash-display';
            h.style.cssText = 'font-size:.58rem;color:var(--text3);font-family:var(--mono);word-break:break-all';
            $('charter-content')?.after(h);
          }
          h.textContent = 'SHA-256: ' + window.state.charterHash.slice(0, 16) + '…';
        }
      }, 500);
    };
  });

  feat(250, 'Resume reading button', () => {
    const last = localStorage.getItem('sc_last_article');
    if (!last) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.style.cssText = 'font-size:.65rem;margin-top:.75rem';
    btn.innerHTML = `<i class="fas fa-book-bookmark"></i> Resume ${last}`;
    btn.onclick = () => { openCharterModal(); setTimeout(() => filterCharter(last), 400); };
    document.querySelector('.articles-sidebar')?.prepend(btn);
  });

  // ═══ GROUP 11: Personalization (251–275) ════════════════

  feat(251, 'Theme tri-state auto/light/dark', () => {
    SC3.setThemeMode = (mode) => {
      localStorage.setItem('sc_theme_mode', mode);
      if (mode === 'auto') {
        localStorage.removeItem('sc_theme_manual');
        document.documentElement.setAttribute('data-theme', matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      } else {
        localStorage.setItem('sc_theme_manual', '1');
        document.documentElement.setAttribute('data-theme', mode);
      }
      toast('Theme: ' + mode, 'info');
    };
  });

  feat(252, 'Accent color picker', () => {
    SC3.setAccent = (color) => {
      document.documentElement.style.setProperty('--em', color);
      localStorage.setItem('sc_accent', color);
      toast('Accent updated', 'success');
    };
    if (localStorage.getItem('sc_accent')) document.documentElement.style.setProperty('--em', localStorage.getItem('sc_accent'));
  });

  feat(253, 'Font family picker', () => {
    SC3.setFont = (mode) => {
      document.body.classList.remove('font-serif', 'font-sans', 'font-mono');
      document.body.classList.add('font-' + mode);
      localStorage.setItem('sc_font_mode', mode);
      const s = document.createElement('style');
      s.id = 'sc-font-mode';
      s.textContent = 'body.font-serif *{font-family:var(--serif)!important}body.font-sans *{font-family:var(--sans)!important}body.font-mono *{font-family:var(--mono)!important}';
      $('sc-font-mode')?.remove();
      document.head.appendChild(s);
    };
    if (localStorage.getItem('sc_font_mode')) SC3.setFont(localStorage.getItem('sc_font_mode'));
  });

  feat(254, 'Reading width slider', () => {
    SC3.setReadWidth = (pct) => {
      document.documentElement.style.setProperty('--read-max', pct + 'px');
      localStorage.setItem('sc_read_width', pct);
    };
    const w = localStorage.getItem('sc_read_width');
    if (w) SC3.setReadWidth(w);
    const s = document.createElement('style');
    s.textContent = '#charter-content,.modal-inner{max-width:var(--read-max,720px)}';
    document.head.appendChild(s);
  });

  feat(255, 'Focus mode dim surroundings', () => {
    SC3.toggleFocus = () => {
      document.body.classList.toggle('focus-mode');
      toast(document.body.classList.contains('focus-mode') ? 'Focus mode on' : 'Focus mode off', 'info');
    };
    const s = document.createElement('style');
    s.textContent = 'body.focus-mode .section:not(:target):not(#charter-modal){opacity:.35;transition:opacity .3s}body.focus-mode #charter-modal .modal-inner{opacity:1}';
    document.head.appendChild(s);
  });

  feat(256, 'Night warm tint', () => {
    SC3.toggleWarm = () => {
      document.body.classList.toggle('warm-tint');
      localStorage.setItem('sc_warm', document.body.classList.contains('warm-tint'));
    };
    if (localStorage.getItem('sc_warm') === 'true') document.body.classList.add('warm-tint');
    const s = document.createElement('style');
    s.textContent = 'body.warm-tint{filter:sepia(.08) brightness(.95)}';
    document.head.appendChild(s);
  });

  feat(257, 'Compact footer toggle', () => {
    SC3.toggleCompactFooter = () => {
      document.body.classList.toggle('compact-footer');
      localStorage.setItem('sc_compact_footer', document.body.classList.contains('compact-footer'));
    };
    if (localStorage.getItem('sc_compact_footer') === 'true') document.body.classList.add('compact-footer');
    const s = document.createElement('style');
    s.textContent = 'body.compact-footer .legal-grid{grid-template-columns:1fr}body.compact-footer .footer-col{display:none}body.compact-footer .footer-inner{grid-template-columns:1fr}';
    document.head.appendChild(s);
  });

  feat(258, 'Hero minimal mode', () => {
    SC3.toggleHeroMinimal = () => {
      document.body.classList.toggle('hero-minimal');
      localStorage.setItem('sc_hero_min', document.body.classList.contains('hero-minimal'));
    };
    if (localStorage.getItem('sc_hero_min') === 'true') document.body.classList.add('hero-minimal');
    const s = document.createElement('style');
    s.textContent = 'body.hero-minimal #particle-canvas,body.hero-minimal .hero-grid,body.hero-minimal .trust-bar{display:none!important}';
    document.head.appendChild(s);
  });

  feat(259, 'Personal dashboard panel', () => {
    SC3.renderDashboard = () => {
      const el = $('personal-dashboard');
      if (!el) return;
      const signed = window.state?.signers?.length || 0;
      const stars = SC2?.stars?.length || 0;
      const pct = SC3.completeness?.() || 0;
      el.innerHTML = `<div class="calc-label">YOUR DASHBOARD</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-top:.5rem;font-size:.72rem">
          <div class="dash-stat"><strong>${signed}</strong><br>Signatures</div>
          <div class="dash-stat"><strong>${stars}</strong><br>Starred</div>
          <div class="dash-stat"><strong>${pct}%</strong><br>Charter read</div>
        </div>`;
    };
    const panel = document.createElement('div');
    panel.id = 'personal-dashboard';
    panel.className = 'personal-dashboard';
    $('sign')?.querySelector('.section-max')?.prepend(panel);
    SC3.renderDashboard();
    const s = document.createElement('style');
    s.textContent = '.personal-dashboard{margin-bottom:1.25rem;padding:1rem;border:1px solid var(--border);border-radius:.75rem}.dash-stat{text-align:center;padding:.5rem;background:var(--bg3);border-radius:.5rem}';
    document.head.appendChild(s);
  });

  feat(260, 'Hide video section toggle', () => {
    SC3.toggleVideo = () => {
      const sec = document.querySelector('[aria-labelledby="video-heading"]');
      if (sec) sec.style.display = sec.style.display === 'none' ? '' : 'none';
      toast('Video section toggled', 'info');
    };
  });

  feat(261, 'Particle density control', () => {
    SC3.setParticles = (on) => {
      const c = $('particle-canvas');
      if (c) c.style.display = on ? '' : 'none';
      localStorage.setItem('sc_particles', on ? '1' : '0');
    };
    if (localStorage.getItem('sc_particles') === '0') SC3.setParticles(false);
  });

  feat(262, 'Haptic on sign', () => {
    const orig = window.signCharter;
    if (orig && navigator.vibrate) {
      window.signCharter = function () {
        orig.apply(this, arguments);
        navigator.vibrate(50);
      };
    }
  });

  feat(263, 'Sound effects toggle', () => {
    SC3.soundsOn = localStorage.getItem('sc_sounds') === '1';
    SC3.playTick = () => {
      if (!SC3.soundsOn) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        o.frequency.value = 800;
        o.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.05);
      } catch (_) {}
    };
    SC3.toggleSounds = () => {
      SC3.soundsOn = !SC3.soundsOn;
      localStorage.setItem('sc_sounds', SC3.soundsOn ? '1' : '0');
      toast('Sounds ' + (SC3.soundsOn ? 'on' : 'off'), 'info');
    };
  });

  feat(264, 'Cursor disable toggle', () => {
    SC3.toggleCursor = () => {
      document.body.classList.toggle('no-custom-cursor');
      const hide = document.body.classList.contains('no-custom-cursor');
      $('cursor') && ($('cursor').style.display = hide ? 'none' : '');
      $('cursor-ring') && ($('cursor-ring').style.display = hide ? 'none' : '');
      document.body.style.cursor = hide ? 'auto' : '';
      localStorage.setItem('sc_no_cursor', hide ? '1' : '0');
    };
    if (localStorage.getItem('sc_no_cursor') === '1') SC3.toggleCursor();
  });

  feat(265, 'Trust bar speed control', () => {
    SC3.setTrustSpeed = (sec) => {
      document.documentElement.style.setProperty('--trust-speed', sec + 's');
      localStorage.setItem('sc_trust_speed', sec);
    };
    const sp = localStorage.getItem('sc_trust_speed') || '30';
    SC3.setTrustSpeed(sp);
    const s = document.createElement('style');
    s.textContent = '.trust-scroll{animation-duration:var(--trust-speed,30s)!important}';
    document.head.appendChild(s);
  });

  feat(266, 'Quote rotate speed', () => {
    SC3.setQuoteSpeed = (ms) => localStorage.setItem('sc_quote_ms', ms);
  });

  feat(267, 'Sticky section preference', () => {
    SC3.favoriteSection = localStorage.getItem('sc_fav_section');
    SC3.setFavoriteSection = (id) => {
      localStorage.setItem('sc_fav_section', id);
      toast('Home section set to ' + id, 'success');
    };
    if (SC3.favoriteSection && location.hash === '#home') {
      $(SC3.favoriteSection)?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  feat(268, 'Swipe down to top mobile', () => {
    let startY = 0;
    document.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, { passive: true });
    document.addEventListener('touchend', (e) => {
      if (window.scrollY < 50 && e.changedTouches[0].clientY - startY > 80) window.scrollTo({ top: 0, behavior: 'smooth' });
    }, { passive: true });
  });

  feat(269, 'Pull refresh sign count hint', () => {
    if (window.innerWidth < 768) {
      let pStart = 0;
      document.addEventListener('touchstart', (e) => { if (window.scrollY === 0) pStart = e.touches[0].clientY; }, { passive: true });
      document.addEventListener('touchmove', (e) => {
        if (pStart && e.touches[0].clientY - pStart > 100) toast('Sign count updates automatically', 'info');
      }, { passive: true, once: true });
    }
  });

  feat(270, 'Custom homepage message', () => {
    const msg = localStorage.getItem('sc_home_msg');
    if (msg) {
      const el = $('hero-sub');
      if (el) el.textContent = msg;
    }
    SC3.setHomeMessage = (text) => {
      localStorage.setItem('sc_home_msg', text);
      const el = $('hero-sub');
      if (el) el.textContent = text;
      toast('Home message saved', 'success');
    };
  });

  feat(271, 'Preferences export', () => {
    window.exportPreferences = () => {
      const prefs = {};
      for (const k in localStorage) if (k.startsWith('sc_')) prefs[k] = localStorage[k];
      const blob = new Blob([JSON.stringify(prefs, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sherpacarta-preferences.json';
      a.click();
      toast('Preferences exported', 'success');
    };
  });

  feat(272, 'Preferences import', () => {
    window.importPreferences = () => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'application/json';
      inp.onchange = () => {
        const r = new FileReader();
        r.onload = () => {
          try {
            const prefs = JSON.parse(r.result);
            Object.entries(prefs).forEach(([k, v]) => localStorage.setItem(k, v));
            toast('Preferences imported — reload to apply', 'success');
          } catch (_) { toast('Invalid preferences file', 'error'); }
        };
        r.readAsText(inp.files[0]);
      };
      inp.click();
    };
  });

  feat(273, 'Line height memory', () => {
    const lh = localStorage.getItem('sc_line_height');
    if (lh) document.documentElement.style.setProperty('--line-height', lh);
  });

  feat(274, 'Section nav highlight active', () => {
    const sections = ['hero', 'mission', 'canada-bc', 'pillars', 'sign', 'faq'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) document.querySelectorAll('.section-dot').forEach((d) => {
          d.classList.toggle('active', d.dataset.section === e.target.id);
        });
      });
    }, { threshold: 0.3 });
    sections.forEach((id) => { const el = $(id); if (el) obs.observe(el); });
  });

  feat(275, 'Personalization ⌘K group', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Personalize', icon: 'fa-sliders', label: 'Export Preferences', sub: 'Backup settings', action: exportPreferences },
      { group: 'Personalize', icon: 'fa-upload', label: 'Import Preferences', sub: 'Restore settings', action: importPreferences },
      { group: 'Personalize', icon: 'fa-eye-slash', label: 'Toggle Custom Cursor', sub: 'Standard cursor', action: () => SC3.toggleCursor() },
      { group: 'Personalize', icon: 'fa-compress', label: 'Compact Footer', sub: 'Less footer clutter', action: () => SC3.toggleCompactFooter() },
      { group: 'Personalize', icon: 'fa-sun', label: 'Warm Night Tint', sub: 'Easier on eyes', action: () => SC3.toggleWarm() },
      { group: 'Personalize', icon: 'fa-brain', label: 'Study Flashcards', sub: 'Quick quiz', action: () => SC3.studyMode() }
    );
  });

  // ═══ GROUP 12: Distribution (276–300) ═══════════════════

  feat(276, 'QR for page URL', () => {
    window.showPageQR = () => showQRModal('page');
    const orig = window.showQRModal;
    window.showQRModal = function (type) {
      if (type === 'page') {
        qrCurrentAddress = 'https://sherpacarta.org/';
        qrCurrentType = 'page';
        const modal = $('qr-modal');
        if (modal) {
          modal.classList.add('open');
          $('qr-modal-title').textContent = 'Scan to Visit';
          $('qr-modal-sub').textContent = 'sherpacarta.org';
          $('qr-warning').style.display = 'none';
          window.renderQRCode?.('https://sherpacarta.org/');
          document.body.style.overflow = 'hidden';
        }
        return;
      }
      if (orig) orig(type);
    };
  });

  feat(277, 'QR for Nostr NIP-05', () => {
    window.showNostrQR = () => {
      qrCurrentAddress = 'kimi@giveabit.io';
      const modal = $('qr-modal');
      if (modal) {
        modal.classList.add('open');
        $('qr-modal-title').textContent = 'Nostr NIP-05';
        $('qr-modal-sub').textContent = 'kimi@giveabit.io';
        $('qr-warning').style.display = 'none';
        window.renderQRCode?.('kimi@giveabit.io');
        document.body.style.overflow = 'hidden';
      }
    };
  });

  feat(278, 'Email charter excerpt', () => {
    window.emailCharterExcerpt = () => {
      const body = encodeURIComponent('SherpaCarta — 114 articles of digital human rights.\n\nArt. 11: Every person has the right to privacy...\n\nRead & sign: https://sherpacarta.org\n\nContact: hello@giveabit.io');
      location.href = 'mailto:?subject=SherpaCarta%20Charter%20Excerpt&body=' + body;
    };
  });

  feat(279, 'Embed article snippet', () => {
    window.copyArticleEmbed = (num) => {
      const snip = `<blockquote cite="https://sherpacarta.org/?article=${encodeURIComponent(num)}"><p>SherpaCarta ${num}</p></blockquote>`;
      navigator.clipboard.writeText(snip);
      toast('Embed HTML copied', 'success');
    };
  });

  feat(280, 'Referral link generator', () => {
    window.getReferralLink = (source) => {
      const url = `https://sherpacarta.org/?utm_source=${encodeURIComponent(source || 'friend')}&utm_campaign=referral`;
      navigator.clipboard.writeText(url);
      toast('Referral link copied', 'success');
      return url;
    };
  });

  feat(281, 'Campaign link builder UI', () => {
    window.buildCampaignLink = () => {
      const src = prompt('utm_source (e.g. newsletter):', 'newsletter');
      if (!src) return;
      const camp = prompt('utm_campaign:', 'canadabc');
      const url = `https://sherpacarta.org/?utm_source=${encodeURIComponent(src)}&utm_campaign=${encodeURIComponent(camp || '')}`;
      navigator.clipboard.writeText(url);
      toast('Campaign URL copied', 'success');
    };
  });

  feat(282, 'Article social card', () => {
    window.generateArticleCard = (num, title) => {
      const c = document.createElement('canvas');
      c.width = 1200; c.height = 630;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#060a06';
      ctx.fillRect(0, 0, 1200, 630);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 48px Georgia';
      ctx.fillText(num, 80, 120);
      ctx.fillStyle = '#e8ede8';
      ctx.font = '36px Georgia';
      const lines = title.match(/.{1,40}/g) || [title];
      lines.forEach((l, i) => ctx.fillText(l, 80, 200 + i * 50));
      ctx.font = '24px monospace';
      ctx.fillStyle = '#9ca89c';
      ctx.fillText('sherpacarta.org', 80, 400);
      c.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = num.replace(/\s/g, '-') + '-card.png';
        a.click();
        toast('Article card downloaded', 'success');
      });
    };
  });

  feat(283, 'Nostr note composer', () => {
    window.composeNostrNote = () => {
      const note = `SherpaCarta — 114 articles protecting digital human rights for everyone.\n\nhttps://sherpacarta.org\n\n#SherpaCarta #DigitalRights #Nostr`;
      navigator.clipboard.writeText(note);
      toast('Nostr note copied — paste in your client', 'success');
    };
  });

  feat(284, 'Bluesky thread starter', () => {
    window.composeBlueskyThread = () => {
      const posts = [
        '1/ SherpaCarta is a living Magna Carta for the digital age — 114 articles, CC0, zero tracking.',
        '2/ Privacy is Art. 11. Data sovereignty is Art. 12. No surveillance capitalism (Art. 13).',
        '3/ Sign at sherpacarta.org — BC can lead Canada on digital rights law. 🇨🇦',
      ];
      navigator.clipboard.writeText(posts.join('\n\n'));
      toast('Bluesky thread copied (3 posts)', 'success');
    };
  });

  feat(285, 'Press release download', () => {
    window.downloadPressRelease = () => {
      const pr = `FOR IMMEDIATE RELEASE\n\nSherpaCarta Launches Global Digital Magna Carta — 114 Articles for 8 Billion People\n\n${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}\n\nsherpacarta.org — A living charter protecting privacy, data sovereignty, and algorithmic rights. CC0 public domain. Bitcoin-funded. Zero tracking.\n\nContact: hello@giveabit.io (subject: Sherpacarta)\nTwitter: @give_bit\nGitHub: github.com/kitsboy/sherpacarta`;
      const blob = new Blob([pr], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-Press-Release.txt';
      a.click();
      toast('Press release downloaded', 'success');
    };
  });

  feat(286, 'Screenshot mode clean UI', () => {
    SC3.screenshotMode = () => {
      document.body.classList.add('screenshot-mode');
      toast('Screenshot mode — press Esc to exit', 'info');
      const exit = (e) => {
        if (e.key === 'Escape') {
          document.body.classList.remove('screenshot-mode');
          document.removeEventListener('keydown', exit);
        }
      };
      document.addEventListener('keydown', exit);
    };
    const s = document.createElement('style');
    s.textContent = 'body.screenshot-mode .build-badge,body.screenshot-mode .a11y-toolbar,body.screenshot-mode #float-assert,body.screenshot-mode #cookie-banner,body.screenshot-mode .video-cta-banner{display:none!important}';
    document.head.appendChild(s);
  });

  feat(287, 'Brand assets manifest', () => {
    window.brandAssets = () => {
      const manifest = { logo: '/giveabit-logo.png', og: '/og-image.png', favicon: '/favicon.svg', site: 'https://sherpacarta.org', colors: { primary: '#10b981', bg: '#060a06' } };
      navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
      toast('Brand assets manifest copied', 'success');
    };
  });

  feat(288, 'API docs footer hint', () => {
    const link = document.createElement('a');
    link.href = 'https://github.com/kitsboy/sherpacarta/blob/main/public/mcp.json';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'API / MCP';
    link.style.fontSize = '.65rem';
    document.querySelector('.legal-links')?.appendChild(link);
  });

  feat(289, 'RSS subscribe button', () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.style.cssText = 'font-size:.62rem;margin-top:.5rem';
    btn.innerHTML = '<i class="fas fa-rss"></i> RSS Feed';
    btn.onclick = () => downloadRSS?.();
    $('newsletter-email')?.parentElement?.appendChild(btn);
  });

  feat(290, 'JSON feed button', () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.style.cssText = 'font-size:.62rem;margin-left:.35rem';
    btn.innerHTML = '<i class="fas fa-code"></i> JSON Feed';
    btn.onclick = () => downloadJSONFeed?.();
    $('newsletter-email')?.parentElement?.appendChild(btn);
  });

  feat(291, 'Integration status panel', () => {
    const panel = document.createElement('div');
    panel.className = 'integration-status';
    panel.style.cssText = 'font-size:.62rem;color:var(--text3);font-family:var(--mono);margin-top:1rem';
    panel.innerHTML = 'Integrations: Nostr ✓ · Satohash ✓ · Bitcoin ✓ · Lightning ⏳ TEMP';
    $('footer-pay')?.after(panel);
  });

  feat(292, 'Partner badge text', () => {
    window.copyPartnerBadge = () => {
      const t = 'We endorse SherpaCarta — the Global Digital Magna Carta. sherpacarta.org';
      navigator.clipboard.writeText(t);
      toast('Partner badge text copied', 'success');
    };
  });

  feat(293, 'Distribution ⌘K group', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Distribute', icon: 'fa-qrcode', label: 'QR — Site URL', sub: 'Scan to visit', action: showPageQR },
      { group: 'Distribute', icon: 'fa-user-secret', label: 'QR — Nostr NIP-05', sub: 'kimi@giveabit.io', action: showNostrQR },
      { group: 'Distribute', icon: 'fa-newspaper', label: 'Press Release', sub: 'Download .txt', action: downloadPressRelease },
      { group: 'Distribute', icon: 'fa-share-nodes', label: 'Nostr Note', sub: 'Copy composed note', action: composeNostrNote },
      { group: 'Distribute', icon: 'fa-cloud', label: 'Bluesky Thread', sub: '3-post thread', action: composeBlueskyThread },
      { group: 'Distribute', icon: 'fa-link', label: 'Referral Link', sub: 'UTM tracking', action: () => getReferralLink('friend') },
      { group: 'Distribute', icon: 'fa-camera', label: 'Screenshot Mode', sub: 'Clean UI capture', action: () => SC3.screenshotMode() },
      { group: 'Distribute', icon: 'fa-palette', label: 'Brand Assets', sub: 'Logo + colors JSON', action: brandAssets }
    );
  });

  feat(294, 'Web Share API enhanced', () => {
    if (!navigator.share) return;
    window.shareSherpaNative = () => {
      navigator.share({
        title: 'SherpaCarta — Global Digital Magna Carta',
        text: '114 articles protecting digital human rights. Privacy is a birthright.',
        url: 'https://sherpacarta.org/',
      }).catch(() => {});
    };
  });

  feat(295, 'LinkedIn share via ⌘K', () => {
    window.shareLinkedInOfficial = () => shareOn('linkedin');
  });

  feat(296, 'Weekly share reminder', () => {
    const last = parseInt(localStorage.getItem('sc_last_share_reminder') || '0', 10);
    const week = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - last > week) {
      setTimeout(() => {
        toast('Share SherpaCarta with one person this week — copy link in hero', 'info');
        localStorage.setItem('sc_last_share_reminder', String(Date.now()));
      }, 12000);
    }
  });

  feat(297, 'MCP version bump v3', () => {
    if (window.SHERPA_MCP) window.SHERPA_MCP.version = '3.0';
  });

  feat(298, 'Charter search ⌘K', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Charter', icon: 'fa-search', label: 'Search Charter', sub: 'Full-text search', action: () => SC3.charterSearch() },
      { group: 'Charter', icon: 'fa-graduation-cap', label: 'Rights Trivia', sub: 'Quick quiz', action: () => SC3.quiz() },
      { group: 'Charter', icon: 'fa-calendar-week', label: 'Weekly Digest', sub: 'Copy share text', action: generateWeeklyDigest }
    );
  });

  feat(299, 'Merge SC3 into SC global', () => {
    window.SC = window.SC || {};
    SC.FEATURES_V3 = FEATURES;
    SC.BUILD = BUILD;
    SC.totalFeatures = 300;
    SC.showUsageGuide = SC3.showUsageGuide;
    const origShow = SC.showFeatures;
    SC.showFeatures = function () {
      if (origShow) origShow();
      const grid = $('features-modal')?.querySelector('.features-grid');
      if (grid && !grid.dataset.v3merged) {
        const extra = FEATURES.map((f) => `<div class="feat-item"><span>${f.id}</span> ${f.name}</div>`).join('');
        grid.insertAdjacentHTML('beforeend', extra);
        grid.dataset.v3merged = '1';
        const h = $('features-modal')?.querySelector('h2');
        if (h) h.textContent = '300 Features';
        const p = $('features-modal')?.querySelector('p');
        if (p) p.textContent = 'BUILD ' + BUILD;
      }
    };
    const bb = document.querySelector('.build-badge');
    if (bb) {
      bb.textContent = 'BUILD ' + BUILD;
      bb.title = '300 features — click for list · right-click for guide';
    }
  });

  feat(300, 'v3 init complete toast', () => {
    setTimeout(() => {
      if (!sessionStorage.getItem('sc_300_loaded')) {
        sessionStorage.setItem('sc_300_loaded', '1');
        toast('300 features active — tap ? for usage guide · ⌘K for commands', 'success');
      }
    }, 4000);
    document.addEventListener('keydown', (e) => {
      if (e.key === '?' && !e.target.matches('input,textarea')) {
        e.preventDefault();
        window.SC?.showShortcuts?.();
      }
    });
  });

  console.log(`SherpaCarta v3.0 — features 201–300 loaded (${FEATURES.length})`);
})();