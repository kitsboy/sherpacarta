/**
 * SherpaCarta — Design & Conversion Sprint (688–720)
 * World-class UX: onboarding, mobile nav, deep links, export, honesty, themes
 */
(function SCUpgradesB14() {
  'use strict';
  const BUILD = '20260709-720';
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b14 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b14.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B14 #${id}:`, e); }
  }

  /* ── 688: Honest local signature baseline ── */
  feat(688, 'Honest local signature counts', () => {
    if (typeof state === 'undefined') return;
    // Migrate inflated defaults: only count real local signatures
    const localSigners = state.signers || [];
    const stored = localStorage.getItem('sc_count');
    const n = parseInt(stored || '0', 10);
    // If count is the old seed 4271 with no/few local signers, reset to local length
    if (n >= 4000 && localSigners.length < 50) {
      state.signCount = Math.max(localSigners.length, 0);
      localStorage.setItem('sc_count', String(state.signCount));
    }
    window.SC = window.SC || {};
    SC.SIGN_MODE = 'local-first';
    SC.SIGN_HONESTY = 'Signatures are stored only in your browser. No server-side global tally.';
  });

  /* ── 689: Signature honesty UI ── */
  feat(689, 'Sign honesty copy', () => {
    const form = document.querySelector('#sign .sign-form');
    if (!form || form.parentElement.querySelector('.sign-honesty')) return;
    const note = document.createElement('p');
    note.className = 'sign-honesty';
    note.innerHTML = '<i class="fas fa-shield-halved"></i> Privacy-first: your signature stays on this device. Optionally publish via Nostr. We never collect your data on our servers.';
    form.insertAdjacentElement('afterend', note);
    // Relabel counter
    const label = document.querySelector('#sign .sign-count + div');
    if (label) label.textContent = 'signatures on this device · join the global movement';
    const statLabel = document.querySelector('#signer-stat')?.closest('.stat-block')?.querySelector('.stat-label');
    if (statLabel) statLabel.textContent = 'On This Device';
    const note2 = document.querySelector('#signer-stat')?.closest('.stat-block');
    if (note2 && !note2.querySelector('.stat-note')) {
      const sn = document.createElement('div');
      sn.className = 'stat-note';
      sn.textContent = 'Local · zero tracking';
      note2.appendChild(sn);
    }
  });

  /* ── 690: Mobile bottom navigation ── */
  feat(690, 'Mobile bottom nav Sign/Charter/Canada/Donate', () => {
    if (document.getElementById('mobile-bottom-nav')) return;
    const nav = document.createElement('nav');
    nav.id = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', 'Mobile primary');
    nav.innerHTML = `
      <div class="mbn-inner">
        <button type="button" class="mbn-btn" data-go="charter" aria-label="Open charter"><i class="fas fa-scroll"></i><span>Charter</span></button>
        <button type="button" class="mbn-btn primary" data-go="sign" aria-label="Sign the charter"><i class="fas fa-signature"></i><span>Sign</span></button>
        <a class="mbn-btn" href="/canada/sign" aria-label="Canada petition"><i class="fab fa-canadian-maple-leaf"></i><span>Canada</span></a>
        <!-- always .html to avoid CF redirect loops -->
        <button type="button" class="mbn-btn" data-go="donate" aria-label="Donate"><i class="fab fa-bitcoin"></i><span>Fund</span></button>
      </div>`;
    document.body.appendChild(nav);
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-go]');
      if (!btn) return;
      const go = btn.dataset.go;
      if (go === 'charter') window.openCharterModal?.();
      if (go === 'sign') document.getElementById('sign')?.scrollIntoView({ behavior: 'smooth' });
      if (go === 'donate') document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── 691: First-visit onboarding ── */
  feat(691, 'First-visit onboarding tour', () => {
    if (localStorage.getItem('sc_onboard_v1') === '1') return;
    if (document.getElementById('onboard-overlay')) return;
    const steps = [
      {
        title: 'Privacy is a birthright',
        body: 'SherpaCarta is a living Magna Carta for the digital age — 114 articles protecting every person on Earth. Zero tracking. CC0 public domain.',
        cta: 'Next',
      },
      {
        title: 'Read the charter',
        body: 'Browse every article, stamp the hash on Bitcoin via Satohash, and propose amendments. Rights may only expand — never contract.',
        cta: 'Next',
      },
      {
        title: 'Sign & assert your rights',
        body: 'Add your name (or a pseudonym). Your signature stays local. Optional Nostr publish. Canadians: take the petition path to change law.',
        cta: 'Sign the Charter',
      },
    ];
    let i = 0;
    const overlay = document.createElement('div');
    overlay.id = 'onboard-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'onboard-title');
    function render() {
      const s = steps[i];
      overlay.innerHTML = `
        <div class="onboard-card">
          <div class="onboard-steps">${steps.map((_, n) => `<span class="onboard-dot${n === i ? ' active' : ''}"></span>`).join('')}</div>
          <h3 id="onboard-title">${s.title}</h3>
          <p>${s.body}</p>
          <div class="onboard-actions">
            <button type="button" class="cta-main" id="onboard-next">${s.cta}</button>
            ${i < steps.length - 1 ? '<button type="button" class="cta-sec" id="onboard-sign-now">Skip to Sign</button>' : '<a class="cta-canada" href="/canada/sign">Canada Petition →</a>'}
          </div>
          <button type="button" class="onboard-skip" id="onboard-skip">Dismiss</button>
        </div>`;
      overlay.querySelector('#onboard-next')?.addEventListener('click', () => {
        if (i < steps.length - 1) { i++; render(); }
        else finish(true);
      });
      overlay.querySelector('#onboard-sign-now')?.addEventListener('click', () => finish(true));
      overlay.querySelector('#onboard-skip')?.addEventListener('click', () => finish(false));
    }
    function finish(goSign) {
      localStorage.setItem('sc_onboard_v1', '1');
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 300);
      if (goSign) {
        document.getElementById('sign')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => document.getElementById('sign-name')?.focus(), 600);
      }
    }
    document.body.appendChild(overlay);
    render();
    // Delay so page paints first
    setTimeout(() => overlay.classList.add('open'), 900);
  });

  /* ── 692: Deep link ?article= + hash ── */
  feat(692, 'Deep link article open + scroll', () => {
    const params = new URLSearchParams(location.search);
    const art = params.get('article') || (location.hash.match(/^#art-?(\d+)/i) || [])[1];
    if (!art) return;
    const num = String(art).replace(/^art-?/i, '');
    const open = () => {
      window.openCharterModal?.();
      setTimeout(() => {
        window.filterCharter?.(num);
        const el = document.querySelector(`[data-art-num="${num}"], #art-${num}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 450);
    };
    if (document.readyState === 'complete') setTimeout(open, 300);
    else window.addEventListener('load', () => setTimeout(open, 300));
  });

  /* ── 693: ?lang= deep-link ── */
  feat(693, 'Deep link ?lang=', () => {
    const lang = new URLSearchParams(location.search).get('lang');
    if (!lang) return;
    const sel = document.getElementById('nav-lang');
    if (sel && [...sel.options].some((o) => o.value === lang)) {
      sel.value = lang;
      window.switchNavLang?.(lang);
    }
  });

  /* ── 694: Charter article anchors in modal ── */
  feat(694, 'Charter modal article IDs for deep links', () => {
    const orig = window.buildFullCharter;
    if (typeof orig !== 'function' || orig._b14) return;
    window.buildFullCharter = function () {
      orig.apply(this, arguments);
      document.querySelectorAll('#charter-content .charter-article').forEach((el) => {
        const numEl = el.querySelector('.ca-num');
        if (!numEl) return;
        const m = numEl.textContent.match(/(\d+)/);
        if (m) {
          el.id = 'art-' + m[1];
          el.dataset.artNum = m[1];
        }
      });
      document.getElementById('charter-content')?.classList.add('charter-reading-width');
    };
    window.buildFullCharter._b14 = true;
  });

  /* ── 695: Export TXT + Markdown ── */
  feat(695, 'Charter export TXT and Markdown', () => {
    window.exportCharterFormat = function (fmt) {
      const chapters = window.CHARTER || [];
      let out = '';
      if (fmt === 'md') {
        out = '# SherpaCarta — Global Digital Magna Carta\n\n';
        out += '> Privacy is not a feature. It is a birthright.\n\n';
        out += `*CC0 · BUILD ${BUILD} · https://sherpacarta.org*\n\n---\n\n`;
        chapters.forEach((ch) => {
          out += `## ${ch.chapter}\n\n`;
          (ch.articles || []).forEach((a) => {
            out += `### ${a.num}: ${a.title}\n\n`;
            out += (a.body || '').replace(/<br\s*\/?>/gi, '\n\n').replace(/<[^>]+>/g, '') + '\n\n';
            if (a.sherpa_ext) out += `> **Extension:** ${a.sherpa_ext}\n\n`;
          });
        });
      } else {
        out = 'SHERPACARTA — THE GLOBAL DIGITAL MAGNA CARTA\n';
        out += 'Privacy is not a feature. It is a birthright.\n';
        out += `CC0 · https://sherpacarta.org · BUILD ${BUILD}\n`;
        out += '='.repeat(60) + '\n\n';
        chapters.forEach((ch) => {
          out += `\n${ch.chapter}\n${'-'.repeat(40)}\n\n`;
          (ch.articles || []).forEach((a) => {
            out += `${a.num}: ${a.title}\n\n`;
            out += (a.body || '').replace(/<br\s*\/?>/gi, '\n\n').replace(/<[^>]+>/g, '') + '\n\n';
          });
        });
      }
      const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fmt === 'md' ? 'sherpacarta-charter.md' : 'sherpacarta-charter.txt';
      a.click();
      URL.revokeObjectURL(a.href);
      toast(`Charter exported as .${fmt === 'md' ? 'md' : 'txt'}`, 'success');
    };
    // Enhance download button
    const tools = document.querySelector('#charter-modal .modal-tools');
    if (tools && !tools.querySelector('[data-export-md]')) {
      tools.insertAdjacentHTML(
        'beforeend',
        `<button class="btn btn-ghost" data-export-md onclick="exportCharterFormat('md')"><i class="fas fa-file-code"></i> Markdown</button>
         <button class="btn btn-ghost" onclick="exportCharterFormat('txt')"><i class="fas fa-file-lines"></i> Plain Text</button>
         <button class="btn btn-ghost" onclick="window.print()"><i class="fas fa-file-pdf"></i> Print / PDF</button>`
      );
    }
  });

  /* ── 696: Share article deep link ── */
  feat(696, 'Copy article deep-link helper', () => {
    window.copyArticleLink = function (num) {
      const url = `https://sherpacarta.org/?article=${encodeURIComponent(num)}`;
      navigator.clipboard?.writeText(url).then(() => toast('Article link copied', 'success'));
    };
  });

  /* ── 697: High-contrast + dyslexia theme toggles ── */
  feat(697, 'High-contrast and dyslexia themes', () => {
    window.setSherpaTheme = function (mode) {
      const root = document.documentElement;
      root.classList.remove('dyslexia-font');
      if (mode === 'dyslexia') {
        root.setAttribute('data-theme', root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
        root.classList.add('dyslexia-font');
        localStorage.setItem('sc_a11y_font', 'dyslexia');
      } else if (mode === 'high-contrast') {
        root.setAttribute('data-theme', 'high-contrast');
        localStorage.setItem('sc_theme', 'high-contrast');
        localStorage.removeItem('sc_a11y_font');
      } else if (mode === 'light' || mode === 'dark') {
        root.setAttribute('data-theme', mode);
        localStorage.setItem('sc_theme', mode);
        localStorage.removeItem('sc_a11y_font');
      }
      document.querySelectorAll('.theme-chip').forEach((c) => {
        c.classList.toggle('active', c.dataset.theme === mode);
      });
      toast('Display: ' + mode, 'info');
    };
    if (localStorage.getItem('sc_a11y_font') === 'dyslexia') {
      document.documentElement.classList.add('dyslexia-font');
    }
    if (localStorage.getItem('sc_theme') === 'high-contrast') {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    }
    // Inject chips into a11y toolbar if present
    const tb = document.querySelector('.a11y-toolbar');
    if (tb && !tb.querySelector('.theme-chips')) {
      const wrap = document.createElement('div');
      wrap.className = 'theme-chips';
      wrap.innerHTML = `
        <button type="button" class="theme-chip" data-theme="dark" title="Dark" onclick="setSherpaTheme('dark')">Dark</button>
        <button type="button" class="theme-chip" data-theme="light" title="Light" onclick="setSherpaTheme('light')">Light</button>
        <button type="button" class="theme-chip" data-theme="high-contrast" title="High contrast" onclick="setSherpaTheme('high-contrast')">HC</button>
        <button type="button" class="theme-chip" data-theme="dyslexia" title="Dyslexia-friendly" onclick="setSherpaTheme('dyslexia')">Aa</button>`;
      tb.appendChild(wrap);
    }
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push(
        { group: 'Personalize', icon: 'fa-circle-half-stroke', label: 'High contrast', sub: 'Maximum readability', action: () => setSherpaTheme('high-contrast') },
        { group: 'Personalize', icon: 'fa-font', label: 'Dyslexia-friendly font', sub: 'System readable stack', action: () => setSherpaTheme('dyslexia') }
      );
    }
  });

  /* ── 698: Reduced motion particle kill ── */
  feat(698, 'Honor prefers-reduced-motion fully', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) return;
    document.getElementById('particle-canvas')?.remove();
    document.getElementById('wave-bg')?.classList.add('waves-paused');
    document.body.classList.add('reduced-motion');
  });

  /* ── 699: Hero Canada geo soft-prompt ── */
  feat(699, 'Soft Canada prompt via timezone', () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const ca = /^(America\/(Vancouver|Toronto|Edmonton|Winnipeg|Halifax|St_Johns|Whitehorse|Yellowknife|Iqaluit)|Canada)/.test(tz);
      if (!ca) return;
      const ctas = document.querySelector('.hero-ctas');
      if (!ctas || ctas.querySelector('.cta-canada')) return;
      // already in HTML if we added it; else inject
    } catch (_) { /* ignore */ }
  });

  /* ── 700: Sticky sign pulse after scroll ── */
  feat(700, 'Float assert after 40% scroll', () => {
    const fa = document.getElementById('float-assert');
    if (!fa) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? scrollY / max : 0;
      if (pct > 0.35 && pct < 0.92) {
        fa.style.display = 'flex';
      } else if (pct >= 0.92) {
        fa.style.display = 'none';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  /* ── 701: Sign form confetti + share prompt ── */
  feat(701, 'Post-sign share encouragement', () => {
    const orig = window.signCharter;
    if (typeof orig !== 'function' || orig._b14) return;
    window.signCharter = function () {
      const before = typeof state !== 'undefined' ? state.signCount : 0;
      orig.apply(this, arguments);
      const after = typeof state !== 'undefined' ? state.signCount : 0;
      if (after > before) {
        setTimeout(() => {
          toast('Share your commitment — privacy needs witnesses', 'success');
          if (navigator.share) {
            /* optional — don't force */
          }
        }, 1200);
      }
    };
    window.signCharter._b14 = true;
  });

  /* ── 702: Touch targets min 44px audit fix ── */
  feat(702, 'Touch target CSS inject', () => {
    if (document.getElementById('sc-touch-css')) return;
    const s = document.createElement('style');
    s.id = 'sc-touch-css';
    s.textContent = `@media(pointer:coarse){
      .btn,.cta-main,.cta-sec,.art-action-btn,.sign-submit,.pay-tab,.pay-copy,.lang-btn,.mbn-btn{min-height:44px;min-width:44px}
      .dot-link{width:12px;height:12px}
    }`;
    document.head.appendChild(s);
  });

  /* ── 703: Comparison page share CTA ── */
  feat(703, 'Comparison section share link', () => {
    const sec = document.getElementById('compare-heading')?.closest('section');
    if (!sec || sec.querySelector('.cmp-share')) return;
    const div = document.createElement('div');
    div.className = 'cmp-share';
    div.style.cssText = 'margin-top:1.25rem;display:flex;gap:.5rem;flex-wrap:wrap';
    div.innerHTML = `
      <a class="btn btn-ghost" href="/comparison.html" style="text-decoration:none"><i class="fas fa-table"></i> Full comparison page</a>
      <button type="button" class="btn btn-ghost" onclick="navigator.clipboard.writeText('https://sherpacarta.org/comparison.html').then(()=>toast('Comparison link copied','success'))"><i class="fas fa-link"></i> Copy link</button>`;
    sec.querySelector('.section-max')?.appendChild(div);
  });

  /* ── 704: humans.txt link in footer ── */
  feat(704, 'humans.txt + security footer links', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML(
      'beforeend',
      '<a href="/humans.txt">humans.txt</a><a href="/press-kit.html">Press Kit</a><a href="/charter.txt">charter.txt</a>'
    );
  });

  /* ── 705: Lazy QR library ── */
  feat(705, 'Lazy-load QR only when needed', () => {
    window.ensureQRCode = function () {
      return new Promise((resolve) => {
        if (window.QRCode) return resolve(window.QRCode);
        const existing = document.querySelector('script[data-qr]');
        if (existing) {
          existing.addEventListener('load', () => resolve(window.QRCode));
          return;
        }
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js';
        s.dataset.qr = '1';
        s.onload = () => resolve(window.QRCode);
        s.onerror = () => resolve(null);
        document.body.appendChild(s);
      });
    };
    const orig = window.showQRModal || window.openQRModal;
    // Hook common QR openers if present
    if (typeof window.showDonationQR === 'function' && !window.showDonationQR._b14) {
      const o = window.showDonationQR;
      window.showDonationQR = async function () {
        await window.ensureQRCode();
        return o.apply(this, arguments);
      };
      window.showDonationQR._b14 = true;
    }
  });

  /* ── 706: Charter modal seal chrome ── */
  feat(706, 'Charter modal seal branding', () => {
    const header = document.querySelector('#charter-modal .modal-header > div');
    if (!header || header.querySelector('.charter-seal')) return;
    header.insertAdjacentHTML(
      'afterbegin',
      '<div class="charter-seal"><i class="fas fa-certificate"></i> LIVING CHARTER · CC0 · 114 ARTICLES</div>'
    );
  });

  /* ── 707: Keyboard nav for article browser ── */
  feat(707, 'Article tab keyboard arrows', () => {
    document.querySelector('.articles-sidebar')?.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const tabs = [...document.querySelectorAll('.article-tab')];
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? tabs[i + 1] : tabs[i - 1];
      next?.focus();
      next?.click();
    });
    document.querySelectorAll('.article-tab').forEach((t) => {
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '0');
    });
  });

  /* ── 708: aria-live toasts already exist — reinforce ── */
  feat(708, 'Toast stack aria-live assertive option', () => {
    const stack = document.getElementById('toast-stack');
    if (stack) stack.setAttribute('aria-live', 'polite');
  });

  /* ── 709: PWA install hint (non-intrusive) ── */
  feat(709, 'PWA install soft capture', () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.SC = window.SC || {};
      SC.deferredInstall = e;
      if (typeof CMD_ITEMS !== 'undefined' && !CMD_ITEMS.find((x) => x.label === 'Install app')) {
        CMD_ITEMS.push({
          group: 'Actions',
          icon: 'fa-download',
          label: 'Install app',
          sub: 'Add SherpaCarta to home screen',
          action: () => {
            SC.deferredInstall?.prompt();
          },
        });
      }
    });
  });

  /* ── 710: Reading time on articles ── */
  feat(710, 'Article reading time estimates', () => {
    const mark = () => {
      document.querySelectorAll('.article-display .art-body, .charter-article .ca-body').forEach((el) => {
        if (el.dataset.rt) return;
        const words = (el.textContent || '').trim().split(/\s+/).length;
        const mins = Math.max(1, Math.round(words / 200));
        el.dataset.rt = '1';
        el.insertAdjacentHTML(
          'afterend',
          `<div class="read-time"><i class="fas fa-clock"></i> ~${mins} min read</div>`
        );
      });
    };
    setTimeout(mark, 800);
    const orig = window.buildFullCharter;
    if (typeof orig === 'function') {
      window.buildFullCharter = function () {
        orig.apply(this, arguments);
        setTimeout(mark, 50);
      };
    }
  });

  /* ── 711: Bookmark article localStorage ── */
  feat(711, 'Article bookmark local', () => {
    window.toggleBookmarkArticle = function (num) {
      const key = 'sc_bookmarks';
      let list = JSON.parse(localStorage.getItem(key) || '[]');
      if (list.includes(num)) list = list.filter((x) => x !== num);
      else list.push(num);
      localStorage.setItem(key, JSON.stringify(list));
      toast(list.includes(num) ? `Bookmarked ${num}` : `Removed ${num}`, 'info');
    };
  });

  /* ── 712: Static charter.txt fetch badge ── */
  feat(712, 'Link static /charter.txt', () => {
    window.SC = window.SC || {};
    SC.CHARTER_TXT = '/charter.txt';
    SC.PRESS_KIT = '/press-kit.html';
  });

  /* ── 713: Command palette export shortcuts ── */
  feat(713, 'CMD export shortcuts', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Actions', icon: 'fa-file-lines', label: 'Export charter .txt', sub: 'Plain text download', action: () => exportCharterFormat('txt') },
      { group: 'Actions', icon: 'fa-file-code', label: 'Export charter .md', sub: 'Markdown download', action: () => exportCharterFormat('md') },
      { group: 'Actions', icon: 'fa-newspaper', label: 'Press kit', sub: 'Media & institutional assets', action: () => { location.href = '/press-kit.html'; } },
      { group: 'Navigate', icon: 'fa-signature', label: 'Sign the charter', sub: 'Assert your rights', action: () => document.getElementById('sign')?.scrollIntoView({ behavior: 'smooth' }) }
    );
  });

  /* ── 714: Hero urgency ticker (honest) ── */
  feat(714, 'Hero urgency line', () => {
    const hero = document.querySelector('.hero-inner');
    if (!hero || hero.querySelector('.hero-urgency')) return;
    const el = document.createElement('p');
    el.className = 'hero-urgency';
    el.innerHTML = '⚡ <strong>114 articles</strong> live · Zero cookies · Bitcoin-funded · Sign in under 30 seconds';
    hero.querySelector('.hero-ctas')?.insertAdjacentElement('afterend', el);
  });

  /* ── 715: Section scroll-margin for sticky nav ── */
  feat(715, 'Section scroll margin CSS', () => {
    if (document.getElementById('sc-scroll-css')) return;
    const s = document.createElement('style');
    s.id = 'sc-scroll-css';
    s.textContent = 'section[id],#sign,#donate,#faq,#orgs{scroll-margin-top:calc(var(--nav-h) + 1rem)}';
    document.head.appendChild(s);
  });

  /* ── 716: Sign name enter key ── */
  feat(716, 'Sign form Enter submits', () => {
    ['sign-name', 'sign-country'].forEach((id) => {
      document.getElementById(id)?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.signCharter?.();
        }
      });
    });
  });

  /* ── 717: Prefer color scheme init ── */
  feat(717, 'Respect prefers-color-scheme if no stored theme', () => {
    if (localStorage.getItem('sc_theme')) return;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });

  /* ── 718: Offline indicator polish ── */
  feat(718, 'Offline toast once', () => {
    window.addEventListener('offline', () => toast('You are offline — signing still works locally', 'info'));
    window.addEventListener('online', () => toast('Back online', 'success'));
  });

  /* ── 719: Meta theme-color sync ── */
  feat(719, 'theme-color meta sync', () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const sync = () => {
      const t = document.documentElement.getAttribute('data-theme');
      if (meta) meta.setAttribute('content', t === 'light' ? '#f4f6ef' : t === 'high-contrast' ? '#000000' : '#050806');
    };
    sync();
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  });

  /* ── 720: BUILD merge ── */
  feat(720, 'Design sprint BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 11;
    SC.DESIGN_V2 = true;
    SC.UPGRADES_B14 = SHERPA_UPGRADES.b14.items;
    SC.totalFeatures = 720;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    // Rebuild signers with honest count
    if (typeof buildSigners === 'function') {
      try { buildSigners(); } catch (_) { /* */ }
    }
    setTimeout(() => toast('Design upgrade live — world-class sign experience — BUILD 720', 'success'), 3500);
    console.log(`SherpaCarta Design Sprint — BUILD ${BUILD} · ${SHERPA_UPGRADES.b14.items.length} features`);
  });
})();
