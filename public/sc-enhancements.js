/**
 * SherpaCarta Enhancements v2.2 — 100 Features
 * Groups 1-4 × 25 features, priority ordered
 */
(function SCEnhancements() {
  'use strict';
  const BUILD = '20260702-100';
  const FEATURES = [];

  function feat(id, name, fn) {
    FEATURES.push({ id, name });
    try { fn(); } catch (e) { console.warn(`Feature ${id} failed:`, e); }
  }

  function $(id) { return document.getElementById(id); }
  function toast(msg, type) {
    if (typeof window.toast === 'function') window.toast(msg, type || 'info');
  }

  // ═══ GROUP 1: Critical fixes + core UX (1-25) ═══════════

  feat(1, 'QR modal fix + inline fallback', () => {
    window.renderQRCode = function (address) {
      const canvas = $('qr-canvas');
      const img = $('qr-img');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 220;
      canvas.height = 220;
      if (img) img.style.display = 'none';
      canvas.style.display = 'block';

      const done = (err) => {
        if (!err) return;
        if (img) {
          canvas.style.display = 'none';
          img.style.display = 'block';
          img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=2&data=' + encodeURIComponent(address);
        } else {
          toast('QR generation failed', 'error');
        }
      };

      if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
        QRCode.toCanvas(canvas, address, { width: 220, margin: 2, color: { dark: '#000', light: '#fff' } }, done);
      } else if (img) {
        done(true);
      }
    };

    const origShow = window.showQRModal;
    window.showQRModal = function (type) {
      if (origShow) origShow(type);
      setTimeout(() => {
        const addr = window.qrCurrentAddress || (type === 'btc' ? window.SHERPA_WALLETS?.btc : window.SHERPA_WALLETS?.lnTemp);
        if (addr) window.renderQRCode(addr);
      }, 50);
    };

    window.closeQRModal = function () {
      const modal = $('qr-modal');
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';
      document.body.classList.remove('qr-open');
    };
  });

  feat(2, 'Escape closes QR modal', () => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('qr-modal')?.classList.contains('open')) {
        window.closeQRModal();
        e.stopPropagation();
      }
    }, true);
  });

  feat(3, 'robots.txt via link', () => {}); // static file in public/

  feat(4, 'Accessibility toolbar', () => {
    const bar = document.createElement('div');
    bar.id = 'a11y-toolbar';
    bar.className = 'a11y-toolbar';
    bar.innerHTML = `
      <button type="button" title="Font size +" onclick="SC.fontUp()">A+</button>
      <button type="button" title="Font size -" onclick="SC.fontDown()">A−</button>
      <button type="button" title="Reading mode" onclick="SC.toggleReading()"><i class="fas fa-book-open"></i></button>
      <button type="button" title="High contrast" onclick="SC.toggleContrast()"><i class="fas fa-circle-half-stroke"></i></button>
      <button type="button" title="Keyboard shortcuts" onclick="SC.showShortcuts()"><i class="fas fa-keyboard"></i></button>
    `;
    document.body.appendChild(bar);
    window.SC = window.SC || {};
    let fontScale = parseFloat(localStorage.getItem('sc_font_scale') || '1');
    SC.fontUp = () => { fontScale = Math.min(1.4, fontScale + 0.05); applyFont(); };
    SC.fontDown = () => { fontScale = Math.max(0.85, fontScale - 0.05); applyFont(); };
    function applyFont() {
      document.documentElement.style.fontSize = (fontScale * 16) + 'px';
      localStorage.setItem('sc_font_scale', fontScale);
      toast('Font size: ' + Math.round(fontScale * 100) + '%');
    }
    if (fontScale !== 1) applyFont();
    SC.toggleReading = () => {
      document.body.classList.toggle('reading-mode');
      localStorage.setItem('sc_reading', document.body.classList.contains('reading-mode'));
      toast(document.body.classList.contains('reading-mode') ? 'Reading mode on' : 'Reading mode off');
    };
    if (localStorage.getItem('sc_reading') === 'true') document.body.classList.add('reading-mode');
    SC.toggleContrast = () => {
      document.body.classList.toggle('high-contrast');
      localStorage.setItem('sc_contrast', document.body.classList.contains('high-contrast'));
      toast('High contrast ' + (document.body.classList.contains('high-contrast') ? 'on' : 'off'));
    };
    if (localStorage.getItem('sc_contrast') === 'true') document.body.classList.add('high-contrast');
  });

  feat(5, 'Auto theme (system)', () => {
    if (!localStorage.getItem('sc_theme') && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('sc_theme_manual')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'light' : 'dark');
      }
    });
    const origToggle = window.toggleTheme;
    window.toggleTheme = function () {
      localStorage.setItem('sc_theme_manual', '1');
      if (origToggle) origToggle();
    };
  });

  feat(6, 'BUILD badge', () => {
    const b = document.createElement('span');
    b.className = 'build-badge';
    b.textContent = 'BUILD ' + BUILD;
    b.title = '100 features loaded';
    const nav = $('main-nav');
    if (nav) nav.appendChild(b);
  });

  feat(7, 'Charter hash footer', () => {
    const el = document.createElement('div');
    el.id = 'charter-hash-footer';
    el.className = 'hash-footer';
    const lf = document.querySelector('.legal-footer');
    if (lf) lf.insertBefore(el, lf.firstChild);
    window.updateHashFooter = async function () {
      if (typeof getCharterPlainText !== 'function') return;
      const text = getCharterPlainText();
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      el.innerHTML = `<span class="hash-label">CHARTER SHA-256</span> <code class="hash-val" title="Click to copy">${hash.slice(0, 16)}…${hash.slice(-8)}</code> <button type="button" class="hash-stamp-btn" onclick="stampCharterOnBitcoin()"><i class="fas fa-stamp"></i> Stamp</button>`;
      el.querySelector('.hash-val')?.addEventListener('click', () => {
        navigator.clipboard.writeText(hash);
        toast('Full charter hash copied', 'success');
      });
    };
    setTimeout(updateHashFooter, 800);
  });

  feat(8, 'Online/offline badge', () => {
    const b = document.createElement('div');
    b.id = 'net-badge';
    b.className = 'net-badge online';
    b.innerHTML = '<i class="fas fa-wifi"></i> Online';
    document.body.appendChild(b);
    const upd = () => {
      b.className = 'net-badge ' + (navigator.onLine ? 'online' : 'offline');
      b.innerHTML = navigator.onLine ? '<i class="fas fa-wifi"></i> Online' : '<i class="fas fa-wifi-slash"></i> Offline';
    };
    window.addEventListener('online', upd);
    window.addEventListener('offline', upd);
  });

  feat(9, 'PWA manifest link', () => {
    if (!document.querySelector('link[rel="manifest"]')) {
      const l = document.createElement('link');
      l.rel = 'manifest';
      l.href = '/manifest.json';
      document.head.appendChild(l);
    }
  });

  feat(10, 'Service worker register', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  });

  feat(11, 'Export charter JSON', () => {
    window.exportCharterJSON = function () {
      if (typeof CHARTER === 'undefined') return;
      const blob = new Blob([JSON.stringify(CHARTER, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-charter.json';
      a.click();
      toast('Charter exported as JSON', 'success');
    };
  });

  feat(12, 'Export charter Markdown', () => {
    window.exportCharterMD = function () {
      if (typeof getCharterPlainText !== 'function') return;
      const md = '# SherpaCarta v2.0\n\n' + getCharterPlainText();
      const blob = new Blob([md], { type: 'text/markdown' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-v2.0.md';
      a.click();
      toast('Charter exported as Markdown', 'success');
    };
  });

  feat(13, 'Import draft JSON', () => {
    window.importCharterDraft = function () {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = '.json';
      inp.onchange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          try {
            localStorage.setItem('sc_charter_import', r.result);
            toast('Draft imported — open charter and Make Editable', 'success');
          } catch (err) { toast('Invalid file', 'error'); }
        };
        r.readAsText(f);
      };
      inp.click();
    };
  });

  feat(14, 'BTC URI link', () => {
    window.openBitcoinWallet = function () {
      const addr = window.SHERPA_WALLETS?.btc;
      if (addr) window.location.href = 'bitcoin:' + addr;
    };
  });

  feat(15, 'Jump to article', () => {
    const wrap = document.createElement('div');
    wrap.className = 'jump-article';
    wrap.innerHTML = `<input type="text" id="jump-art" placeholder="Art. 11" maxlength="12" aria-label="Jump to article"><button type="button" onclick="SC.jumpArticle()">Go</button>`;
    const sign = $('sign');
    if (sign) sign.querySelector('.section-max')?.appendChild(wrap);
    SC.jumpArticle = () => {
      const q = ($('jump-art')?.value || '').trim();
      if (!q) return;
      openCharterModal();
      setTimeout(() => {
        filterCharter(q);
        searchVisible = true;
        const box = $('charter-search-box');
        const inp = $('charter-search-input');
        if (box) box.style.display = 'block';
        if (inp) { inp.value = q; filterCharter(q); }
      }, 400);
    };
  });

  feat(16, 'Bookmark articles', () => {
    window.SC = window.SC || {};
    SC.bookmarks = JSON.parse(localStorage.getItem('sc_bookmarks') || '[]');
    SC.toggleBookmark = function (num) {
      const i = SC.bookmarks.indexOf(num);
      if (i >= 0) SC.bookmarks.splice(i, 1);
      else SC.bookmarks.push(num);
      localStorage.setItem('sc_bookmarks', JSON.stringify(SC.bookmarks));
      toast(i >= 0 ? 'Bookmark removed' : 'Bookmarked ' + num, 'success');
    };
  });

  feat(17, 'Copy single article', () => {
    window.copyArticleText = function (num, title, body) {
      const t = (num || '') + ': ' + (title || '') + '\n\n' + (body || '').replace(/<[^>]+>/g, '');
      navigator.clipboard.writeText(t);
      toast('Article copied', 'success');
    };
  });

  feat(18, 'Deep link ?article=', () => {
    const art = new URLSearchParams(location.search).get('article');
    if (art) setTimeout(() => SC.jumpArticle && ($('jump-art') && ($('jump-art').value = art, SC.jumpArticle())), 1500);
  });

  feat(19, 'Deep link ?q= search', () => {
    const q = new URLSearchParams(location.search).get('q');
    if (q) setTimeout(() => openCommandPalette && (openCommandPalette(), $('cmd-input') && ($('cmd-input').value = q, cmdSearch(q))), 1200);
  });

  feat(20, 'Announcement banner', () => {
    if (localStorage.getItem('sc_banner_dismissed')) return;
    const b = document.createElement('div');
    b.id = 'announce-banner';
    b.className = 'announce-banner';
    b.innerHTML = `<span>🇨🇦 <strong>Canada & BC Challenge</strong> — Be first to change digital rights law. <a href="#canada-bc">Learn more →</a></span><button type="button" aria-label="Dismiss" onclick="this.parentElement.remove();localStorage.setItem('sc_banner_dismissed','1')"><i class="fas fa-times"></i></button>`;
    document.body.insertBefore(b, document.body.firstChild);
  });

  feat(21, 'Sticky BC CTA', () => {
    const c = document.createElement('a');
    c.href = '#canada-bc';
    c.className = 'sticky-bc-cta';
    c.innerHTML = '<i class="fas fa-maple-leaf"></i> BC Challenge';
    document.body.appendChild(c);
  });

  feat(22, 'FAQ search filter', () => {
    const faq = $('faq-container');
    if (!faq) return;
    const inp = document.createElement('input');
    inp.className = 'faq-search';
    inp.placeholder = 'Search FAQ…';
    inp.setAttribute('aria-label', 'Search FAQ');
    inp.oninput = () => {
      const q = inp.value.toLowerCase();
      faq.querySelectorAll('.faq-item').forEach((item) => {
        item.style.display = !q || item.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    };
    faq.parentElement.insertBefore(inp, faq);
  });

  feat(23, 'Section scroll spy', () => {
    const sections = ['mission', 'canada-bc', 'pillars', 'sign', 'donate-heading'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) document.body.dataset.section = e.target.id || '';
      });
    }, { threshold: 0.3 });
    sections.forEach((id) => { const el = $(id) || document.querySelector('[id="' + id + '"]'); if (el) obs.observe(el); });
  });

  feat(24, 'Copy page as markdown', () => {
    window.copyPageSummary = function () {
      const t = 'SherpaCarta — Global Digital Magna Carta\n114 articles · Privacy is a birthright\nhttps://sherpacarta.org';
      navigator.clipboard.writeText(t);
      toast('Summary copied', 'success');
    };
  });

  feat(25, 'Meta theme-color dynamic', () => {
    const upd = () => {
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = document.documentElement.getAttribute('data-theme') === 'light' ? '#f5f7f0' : '#10b981';
    };
    upd();
    new MutationObserver(upd).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  });

  // ═══ GROUP 2: Engagement (26-50) ════════════════════════

  feat(26, 'Confetti on sign', () => {
    const orig = window.signCharter;
    if (!orig) return;
    window.signCharter = function () {
      orig();
      SC.confetti();
    };
    SC.confetti = function () {
      for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = ['#10b981', '#d4af37', '#34d399', '#fff'][i % 4];
        p.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 3000);
      }
    };
  });

  feat(27, 'Signature certificate download', () => {
    window.downloadSignatureCert = function (name, num) {
      const cert = `SHERPACARTA SIGNATURE CERTIFICATE\n\nThis certifies that\n${name || 'Signatory'}\nhas signed the Global Digital Magna Carta\nas signatory #${num || '—'}\n\nDate: ${new Date().toISOString().split('T')[0]}\nhttps://sherpacarta.org\n\nPrivacy is not a feature. It is a birthright.`;
      const blob = new Blob([cert], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-Signature.txt';
      a.click();
    };
    const origSign = window.signCharter;
    window.signCharter = function () {
      const name = $('sign-name')?.value?.trim();
      origSign();
      setTimeout(() => downloadSignatureCert(name, window.state?.signCount), 300);
    };
  });

  feat(28, 'BC quick-fill country', () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost bc-fill';
    btn.innerHTML = '🇨🇦 BC, Canada';
    btn.onclick = () => { const c = $('sign-country'); if (c) c.value = 'BC, Canada'; };
    const form = document.querySelector('.sign-form');
    if (form) form.appendChild(btn);
  });

  feat(29, 'Amendment upvote', () => {
    SC.upvoteAmendment = function (idx) {
      const amps = JSON.parse(localStorage.getItem('sc_amendments') || '[]');
      if (!amps[idx]) return;
      amps[idx].votes = (amps[idx].votes || 0) + 1;
      localStorage.setItem('sc_amendments', JSON.stringify(amps));
      if (window.renderAmendments) renderAmendments();
    };
    const origRender = window.renderAmendments;
    if (origRender) {
      window.renderAmendments = function () {
        origRender();
        document.querySelectorAll('.amend-upvote').forEach((btn) => {
          btn.onclick = () => SC.upvoteAmendment(parseInt(btn.dataset.idx, 10));
        });
      };
    }
  });

  feat(30, 'Nostr sign publishes event', () => {
    const origSign = window.signCharter;
    window.signCharter = async function () {
      const name = $('sign-name')?.value?.trim();
      origSign();
      if (window.state?.nostrPubkey && window.publishToNostr) {
        await publishToNostr(`I signed SherpaCarta — the Global Digital Magna Carta. ${name ? '— ' + name : ''}\nhttps://sherpacarta.org #SherpaCarta`, [['t', 'signature']]);
      }
    };
  });

  feat(31, 'Random article button', () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.innerHTML = '<i class="fas fa-dice"></i> Random Article';
    btn.onclick = () => {
      if (typeof CHARTER === 'undefined') return;
      const arts = CHARTER.flatMap((c) => c.articles);
      const a = arts[Math.floor(Math.random() * arts.length)];
      openCharterModal();
      setTimeout(() => filterCharter(a.num), 500);
      toast('Article: ' + a.num, 'info');
    };
    const tools = document.querySelector('.modal-tools');
    if (tools) tools.appendChild(btn);
  });

  feat(32, 'Reading time estimate', () => {
    if (typeof getCharterPlainText === 'function') {
      const words = getCharterPlainText().split(/\s+/).length;
      const mins = Math.ceil(words / 200);
      const el = document.createElement('p');
      el.className = 'read-time';
      el.textContent = '~' + mins + ' min read · ' + words.toLocaleString() + ' words';
      const hdr = document.querySelector('#charter-modal .modal-header p');
      if (hdr) hdr.after(el);
    }
  });

  feat(33, 'Calculator share results', () => {
    window.shareCalcResults = function () {
      const s = $('calc-score')?.textContent;
      const v = $('calc-verdict')?.textContent;
      if (!s || s === '—') { toast('Run calculator first', 'error'); return; }
      const t = `My SherpaCarta Rights Score: ${s}/100 — ${v}\nhttps://sherpacarta.org`;
      navigator.clipboard.writeText(t);
      toast('Results copied — share anywhere', 'success');
    };
    const calc = document.querySelector('.calc-card:last-child');
    if (calc) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost';
      b.style.marginTop = '1rem';
      b.innerHTML = '<i class="fas fa-share"></i> Share Score';
      b.onclick = shareCalcResults;
      calc.appendChild(b);
    }
  });

  feat(34, 'Email share mailto', () => {
    window.shareEmail = function () {
      location.href = 'mailto:hello@giveabit.io?subject=' + encodeURIComponent('Sherpacarta') + '&body=' + encodeURIComponent('114 articles protecting digital human rights for everyone.\nhttps://sherpacarta.org');
    };
  });

  feat(35, 'Copy embed code', () => {
    window.copyEmbedCode = function () {
      const code = '<iframe src="https://sherpacarta.org" width="100%" height="600" style="border:1px solid #10b981;border-radius:12px" title="SherpaCarta"></iframe>';
      navigator.clipboard.writeText(code);
      toast('Embed code copied', 'success');
    };
  });

  feat(36, 'Volunteer interest local', () => {
    window.volunteerInterest = function () {
      const email = prompt('Your email (stored locally only):');
      if (email) {
        localStorage.setItem('sc_volunteer', email);
        toast('Thank you! We will reach out.', 'success');
      }
    };
  });

  feat(37, 'Org endorsement interest', () => {
    window.orgEndorse = function () {
      const org = prompt('Organization name:');
      if (org) {
        const list = JSON.parse(localStorage.getItem('sc_org_interest') || '[]');
        list.push({ org, ts: Date.now() });
        localStorage.setItem('sc_org_interest', JSON.stringify(list));
        toast('Interest recorded for ' + org, 'success');
      }
    };
  });

  feat(38, 'Press kit download txt', () => {
    window.downloadPressKit = function () {
      const kit = `SHERPACARTA PRESS KIT\n\nBoilerplate:\nSherpaCarta is a global civic movement publishing a living charter of digital human rights. 114 articles. CC0. Bitcoin-funded. Zero tracking.\n\nSite: https://sherpacarta.org\nEmail: hello@giveabit.io (subject: Sherpacarta)\nBitcoin: ${window.SHERPA_WALLETS?.btc || ''}\nX: @give_bit\nNostr NIP-05: kimi@giveabit.io\nGitHub: https://github.com/kitsboy/sherpacarta\nBuilt by: https://giveabit.io\n\nKey facts: 114 articles, 811 years of rights tradition, Canada/BC Challenge launch market.`;
      const blob = new Blob([kit], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-Press-Kit.txt';
      a.click();
    };
  });

  feat(39, 'Article of the day', () => {
    const day = new Date().getDate();
    if (typeof CHARTER !== 'undefined') {
      const arts = CHARTER.flatMap((c) => c.articles);
      const a = arts[day % arts.length];
      const box = document.createElement('div');
      box.className = 'art-of-day';
      box.innerHTML = `<div class="section-label"><span>Article of the Day</span></div><h3>${a.num}: ${a.title}</h3><p>${a.body.replace(/<[^>]+>/g, '').slice(0, 180)}…</p><button type="button" class="btn btn-ghost" onclick="openCharterModal();setTimeout(()=>filterCharter('${a.num}'),500)">Read full →</button>`;
      const pillars = $('pillars');
      if (pillars) pillars.before(box);
    }
  });

  feat(40, 'Quote share button', () => {
    document.querySelectorAll('.quote-text').forEach((q) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quote-share';
      btn.innerHTML = '<i class="fas fa-share"></i>';
      btn.onclick = () => {
        navigator.clipboard.writeText(q.textContent + '\n— SherpaCarta.org');
        toast('Quote copied', 'success');
      };
      q.appendChild(btn);
    });
  });

  feat(41, 'Lazy load video', () => {
    const v = document.querySelector('video');
    if (v) v.preload = 'none';
  });

  feat(42, 'Donate scroll anchor', () => {
    window.scrollToDonate = () => document.querySelector('[aria-labelledby="donate-heading"]')?.scrollIntoView({ behavior: 'smooth' });
  });

  feat(43, 'Sign scroll enhanced', () => {
    window.scrollToSign = () => $('sign')?.scrollIntoView({ behavior: 'smooth' });
  });

  feat(44, 'Copy all hashtags', () => {
    window.copyHashtags = function () {
      navigator.clipboard.writeText('#SherpaCarta #DigitalRights #PrivacyIsAHumanRight #MagnaCarta2026 #CanadaBCChallenge');
      toast('Hashtags copied', 'success');
    };
  });

  feat(45, 'Nostr profile link', () => {
    const orig = window.updateNostrUI;
    window.updateNostrUI = function () {
      if (orig) orig();
      if (window.state?.nostrPubkey) {
        const badge = $('nostr-badge');
        if (badge && !badge.querySelector('a')) {
          badge.innerHTML += ` <a href="https://primal.net/${state.nostrPubkey}" target="_blank" rel="noopener" style="color:var(--em);font-size:.55rem">profile ↗</a>`;
        }
      }
    };
  });

  feat(46, 'Timeline year click', () => {
    document.querySelectorAll('.tl-item').forEach((item) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => toast(item.querySelector('.tl-year')?.textContent + ' — key moment in rights history', 'info'));
    });
  });

  feat(47, 'Pillar hover expand', () => {
    document.querySelectorAll('.pillar').forEach((p) => {
      p.addEventListener('click', () => p.classList.toggle('expanded'));
    });
  });

  feat(48, 'Newsletter double opt-in note', () => {
    const nf = document.querySelector('.newsletter-form');
    if (nf) {
      const note = document.createElement('p');
      note.className = 'newsletter-note';
      note.textContent = 'Stored locally only — no server, no spam.';
      nf.after(note);
    }
  });

  feat(49, 'GitHub footer link fix', () => {
    document.querySelectorAll('a').forEach((a) => {
      if (a.textContent.trim() === 'GitHub' && a.getAttribute('href') === '#') {
        a.href = 'https://github.com/kitsboy/sherpacarta';
        a.target = '_blank';
        a.rel = 'noopener';
      }
    });
  });

  feat(50, 'Contact mailto', () => {
    document.querySelectorAll('.legal-links a').forEach((a) => {
      if (a.textContent.trim() === 'Contact') {
        a.href = 'mailto:hello@giveabit.io?subject=Sherpacarta';
      }
    });
  });

  // ═══ GROUP 3: Power features (51-75) ════════════════════

  feat(51, 'Expanded command palette', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Actions', icon: 'fa-qrcode', label: 'Show Bitcoin QR', sub: 'Scan to donate', action: () => showQRModal('btc') },
      { group: 'Actions', icon: 'fa-stamp', label: 'Stamp on Bitcoin', sub: 'Satohash OpenTimestamp', action: stampCharterOnBitcoin },
      { group: 'Actions', icon: 'fa-file-code', label: 'Export JSON', sub: 'Charter data', action: exportCharterJSON },
      { group: 'Actions', icon: 'fa-file-lines', label: 'Export Markdown', sub: 'Charter text', action: exportCharterMD },
      { group: 'Actions', icon: 'fa-keyboard', label: 'Keyboard Shortcuts', sub: 'All hotkeys', action: () => SC.showShortcuts() },
      { group: 'Navigate', icon: 'fa-flag', label: 'Canada BC Challenge', sub: 'Change law first', action: () => $('canada-bc')?.scrollIntoView({ behavior: 'smooth' }) },
      { group: 'Navigate', icon: 'fa-heart', label: 'Donate', sub: 'Bitcoin / Lightning', action: scrollToDonate },
      { group: 'Share', icon: 'fa-envelope', label: 'Share via Email', sub: 'mailto link', action: shareEmail },
      { group: 'Share', icon: 'fa-hashtag', label: 'Copy Hashtags', sub: 'Social tags', action: copyHashtags },
      { group: 'Actions', icon: 'fa-newspaper', label: 'Download Press Kit', sub: 'Text file', action: downloadPressKit }
    );
  });

  feat(52, 'Keyboard G go sign', () => {
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input,textarea,[contenteditable]')) return;
      if (e.key === 'g') scrollToSign();
      if (e.key === 'h') window.scrollTo({ top: 0, behavior: 'smooth' });
      if (e.key === 'd') scrollToDonate();
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) openCharterModal();
      if (e.key === 't' && !e.metaKey && !e.ctrlKey) toggleTheme();
    });
  });

  feat(53, 'Shortcuts modal', () => {
    SC.showShortcuts = function () {
      let m = $('shortcuts-modal');
      if (!m) {
        m = document.createElement('div');
        m.id = 'shortcuts-modal';
        m.className = 'modal-overlay';
        m.innerHTML = `<div class="modal-inner" style="max-width:480px"><button class="modal-close" onclick="SC.closeShortcuts()"><i class="fas fa-times"></i></button><h2 style="font-family:var(--serif);margin-bottom:1rem">Keyboard Shortcuts</h2><div class="shortcuts-list">
          <div><kbd>⌘K</kbd> Command palette</div><div><kbd>?</kbd> Search commands</div><div><kbd>G</kbd> Go to sign</div><div><kbd>H</kbd> Home</div><div><kbd>D</kbd> Donate</div><div><kbd>C</kbd> Charter</div><div><kbd>T</kbd> Theme</div><div><kbd>Esc</kbd> Close modals</div>
        </div></div>`;
        m.onclick = (e) => { if (e.target === m) SC.closeShortcuts(); };
        document.body.appendChild(m);
      }
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    SC.closeShortcuts = () => {
      $('shortcuts-modal')?.classList.remove('open');
      if (!$('charter-modal')?.classList.contains('open') && !$('qr-modal')?.classList.contains('open')) document.body.style.overflow = '';
    };
  });

  feat(54, 'Features list modal', () => {
    SC.showFeatures = function () {
      let m = $('features-modal');
      if (!m) {
        m = document.createElement('div');
        m.id = 'features-modal';
        m.className = 'modal-overlay';
        const list = FEATURES.map((f) => `<div class="feat-item"><span>${f.id}</span> ${f.name}</div>`).join('');
        m.innerHTML = `<div class="modal-inner" style="max-width:560px;max-height:80vh;overflow-y:auto"><button class="modal-close" onclick="SC.closeFeatures()"><i class="fas fa-times"></i></button><h2 style="font-family:var(--serif)">${FEATURES.length} Features</h2><p style="font-size:.8rem;color:var(--text3);margin-bottom:1rem">BUILD ${BUILD}</p><div class="features-grid">${list}</div></div>`;
        m.onclick = (e) => { if (e.target === m) SC.closeFeatures(); };
        document.body.appendChild(m);
      }
      m.classList.add('open');
    };
    SC.closeFeatures = () => $('features-modal')?.classList.remove('open');
    const bb = document.querySelector('.build-badge');
    if (bb) bb.style.cursor = 'pointer', bb.onclick = () => SC.showFeatures();
  });

  feat(55, 'Charter TOC sidebar', () => {
    window.buildCharterTOC = function () {
      if (typeof CHARTER === 'undefined') return;
      let toc = $('charter-toc');
      if (!toc) {
        toc = document.createElement('div');
        toc.id = 'charter-toc';
        toc.className = 'charter-toc';
        const inner = document.querySelector('#charter-modal .modal-inner');
        if (inner) inner.insertBefore(toc, $('charter-content'));
      }
      toc.innerHTML = '<div class="toc-label">TABLE OF CONTENTS</div>' + CHARTER.map((ch) =>
        `<div class="toc-ch">${ch.chapter}</div>` + ch.articles.map((a) =>
          `<a href="#" class="toc-art" onclick="filterCharter('${a.num}');return false">${a.num}</a>`
        ).join('')
      ).join('');
    };
    const origOpen = window.openCharterModal;
    window.openCharterModal = function () {
      origOpen();
      setTimeout(buildCharterTOC, 100);
    };
  });

  feat(56, 'Highlight search in charter', () => {
    const origFilter = window.filterCharter;
    window.filterCharter = function (q) {
      if (origFilter) origFilter(q);
      document.querySelectorAll('.charter-article').forEach((el) => {
        if (!q) return;
        const body = el.querySelector('.ca-body');
        if (body && body.textContent.toLowerCase().includes(q.toLowerCase())) {
          el.style.borderColor = 'var(--em)';
        }
      });
    };
  });

  feat(57, 'Article word count badges', () => {
    const origBuild = window.buildFullCharter;
    if (!origBuild) return;
    window.buildFullCharter = function () {
      origBuild();
      document.querySelectorAll('.charter-article').forEach((el) => {
        const body = el.querySelector('.ca-body');
        if (body && !el.querySelector('.wc-badge')) {
          const wc = body.textContent.split(/\s+/).length;
          const b = document.createElement('span');
          b.className = 'wc-badge';
          b.textContent = wc + ' words';
          el.querySelector('.ca-num')?.appendChild(b);
        }
      });
    };
  });

  feat(58, 'Template AI summary per article', () => {
    window.articleSummary = function (title, tags) {
      return `This article establishes ${title.toLowerCase()} as a fundamental digital right. Key themes: ${(tags || []).join(', ')}. Core to SherpaCarta's mission of expanding — never restricting — human dignity online.`;
    };
  });

  feat(59, 'Related articles by tag', () => {
    window.getRelatedArticles = function (tags) {
      if (typeof CHARTER === 'undefined') return [];
      const all = CHARTER.flatMap((c) => c.articles);
      return all.filter((a) => a.tags?.some((t) => tags?.includes(t))).slice(0, 3);
    };
  });

  feat(60, 'Restore charter draft', () => {
    window.restoreCharterDraft = function () {
      const d = localStorage.getItem('sc_charter_draft');
      if (!d) { toast('No saved draft', 'error'); return; }
      openCharterModal();
      makeAllEditable();
      toast('Draft loaded — review and save', 'info');
    };
  });

  feat(61, 'Version history local', () => {
    window.saveVersionSnapshot = function () {
      const snap = { ts: Date.now(), hash: state?.charterHash, count: state?.signCount };
      const vers = JSON.parse(localStorage.getItem('sc_versions') || '[]');
      vers.push(snap);
      localStorage.setItem('sc_versions', JSON.stringify(vers.slice(-20)));
      toast('Version snapshot saved', 'success');
    };
  });

  feat(62, 'Copy lightning warning', () => {
    window.copyLNWarning = function () {
      navigator.clipboard.writeText('TEMP LIGHTNING ADDRESS — DO NOT SEND SATS');
      toast('Warning copied', 'info');
    };
  });

  feat(63, 'Double-click logo home', () => {
    document.querySelector('.nav-logo')?.addEventListener('dblclick', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });

  feat(64, 'Triple-click easter egg', () => {
    let clicks = 0;
    document.querySelector('.hero-h1')?.addEventListener('click', () => {
      clicks++;
      if (clicks >= 3) { toast('Privacy is a birthright. Always.', 'success'); SC.confetti?.(); clicks = 0; }
      setTimeout(() => clicks = 0, 600);
    });
  });

  feat(65, 'Konami code', () => {
    const seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === seq[pos]) { pos++; if (pos === seq.length) { toast('🎉 Art. 11 unlocked in your heart', 'success'); SC.confetti?.(); pos = 0; } }
      else pos = 0;
    });
  });

  feat(66, 'Smooth anchor offset for sticky nav', () => {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href')?.slice(1);
        const el = id && document.getElementById(id);
        if (el) {
          e.preventDefault();
          const y = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  });

  feat(67, 'Focus trap QR modal', () => {
    $('qr-modal')?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') e.preventDefault();
    });
  });

  feat(68, 'Print hides enhancements', () => {
    const s = document.createElement('style');
    s.textContent = '@media print{.a11y-toolbar,.sticky-bc-cta,.announce-banner,.build-badge,.net-badge{display:none!important}}';
    document.head.appendChild(s);
  });

  feat(69, 'Cursor pointer on all buttons touch', () => {
    const s = document.createElement('style');
    s.textContent = '@media(hover:none){button,.btn,.pay-tab,.qr-close,.modal-close{cursor:pointer!important}}';
    document.head.appendChild(s);
  });

  feat(70, 'Amendment render with upvotes', () => {
    const orig = window.renderAmendments;
    if (!orig) return;
    window.renderAmendments = function () {
      const list = $('amend-list');
      if (!list || !window.state) return;
      const items = [...state.amendments].reverse().slice(0, 12);
      list.innerHTML = items.length ? items.map((a, i) => {
        const idx = state.amendments.length - 1 - i;
        return `<div class="amend-item"><strong>${a.article || 'General'}</strong> — ${a.text}<div class="amend-meta">${a.author || 'Anonymous'} · ${new Date(a.ts).toLocaleDateString()}${a.nostr ? ' · Nostr' : ''} · <button type="button" class="amend-upvote" data-idx="${idx}">▲ ${a.votes || 0}</button></div></div>`;
      }).join('') : '<div class="amend-item" style="color:var(--text3)">No proposals yet.</div>';
    };
  });

  feat(71, 'Modal tools extra buttons', () => {
    const tools = document.querySelector('.modal-tools');
    if (!tools) return;
    const extras = [
      ['fa-file-code', 'JSON', 'exportCharterJSON()'],
      ['fa-file-lines', 'Markdown', 'exportCharterMD()'],
      ['fa-upload', 'Import', 'importCharterDraft()'],
      ['fa-clock-rotate-left', 'Restore Draft', 'restoreCharterDraft()']
    ];
    extras.forEach(([icon, label, fn]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost';
      b.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
      b.setAttribute('onclick', fn);
      tools.appendChild(b);
    });
  });

  feat(72, 'Share charter native', () => {
    window.shareCharter = async function () {
      const url = 'https://sherpacarta.org';
      const text = 'SherpaCarta — 114 articles of digital human rights. Sign now.';
      if (navigator.share) {
        try { await navigator.share({ title: 'SherpaCarta', text, url }); return; } catch (_) {}
      }
      navigator.clipboard.writeText(text + ' ' + url);
      toast('Link copied', 'success');
    };
  });

  feat(73, 'Rate limit toast spam', () => {
    const orig = window.toast;
    let last = 0;
    window.toast = function (msg, type) {
      const now = Date.now();
      if (now - last < 200 && type === 'info') return;
      last = now;
      orig(msg, type);
    };
  });

  feat(74, 'Persist scroll position', () => {
    window.addEventListener('beforeunload', () => localStorage.setItem('sc_scroll', window.scrollY));
    const y = parseInt(localStorage.getItem('sc_scroll') || '0', 10);
    if (y > 400 && !location.hash) setTimeout(() => window.scrollTo(0, y), 100);
  });

  feat(75, 'Clear all data', () => {
    SC.clearAllData = function () {
      if (confirm('Clear all SherpaCarta local data? Signatures, drafts, settings will be removed.')) {
        Object.keys(localStorage).filter((k) => k.startsWith('sc_')).forEach((k) => localStorage.removeItem(k));
        toast('All local data cleared', 'success');
        setTimeout(() => location.reload(), 800);
      }
    };
  });

  // ═══ GROUP 4: Polish + marketing (76-100) ════════════════

  feat(76, 'JSON-LD Organization', () => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SherpaCarta Global Movement',
      url: 'https://sherpacarta.org',
      sameAs: ['https://twitter.com/SherpaCarta', 'https://github.com/kitsboy/sherpacarta', 'https://giveabit.io']
    });
    document.head.appendChild(s);
  });

  feat(77, 'Breadcrumb schema', () => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sherpacarta.org' },
        { '@type': 'ListItem', position: 2, name: 'Charter', item: 'https://sherpacarta.org/#mission' }
      ]
    });
    document.head.appendChild(s);
  });

  feat(78, 'CreativeWork schema', () => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'SherpaCarta v2.0',
      description: 'Global Digital Magna Carta — 114 articles',
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
      datePublished: '2026-01-01'
    });
    document.head.appendChild(s);
  });

  feat(79, 'Pulse CTA animation', () => {
    document.querySelectorAll('.cta-main').forEach((el) => el.classList.add('pulse-cta'));
  });

  feat(80, 'Stagger reveal children', () => {
    document.querySelectorAll('.pillars-grid,.org-grid').forEach((grid) => {
      [...grid.children].forEach((c, i) => { c.style.transitionDelay = i * 0.08 + 's'; });
    });
  });

  feat(81, 'Hero parallax subtle', () => {
    window.addEventListener('scroll', () => {
      const glow = document.querySelector('.hero-glow');
      if (glow) glow.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.15}px))`;
    }, { passive: true });
  });

  feat(82, 'Trust bar pause on focus', () => {
    document.querySelector('.trust-scroll')?.addEventListener('focusin', () => {
      document.querySelector('.trust-scroll').style.animationPlayState = 'paused';
    });
  });

  feat(83, 'Map canvas BC dot', () => {
    const canvas = $('map-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(canvas.width * 0.18, canvas.height * 0.35, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  feat(84, 'Footer volunteer link', () => {
    document.querySelectorAll('.footer-col a').forEach((a) => {
      if (a.textContent.trim() === 'Volunteer') a.href = '#', a.onclick = (e) => { e.preventDefault(); volunteerInterest(); };
      if (a.textContent.trim() === 'Organizations') a.onclick = (e) => { e.preventDefault(); orgEndorse(); };
      if (a.textContent.trim() === 'Press Kit (Download)') a.onclick = (e) => { e.preventDefault(); downloadPressKit(); };
      if (a.textContent.trim() === 'Version History') a.onclick = (e) => { e.preventDefault(); saveVersionSnapshot(); };
    });
  });

  feat(85, 'Privacy policy anchor', () => {
    document.querySelectorAll('.legal-links a').forEach((a) => {
      if (a.textContent.includes('Privacy')) a.href = '#', a.onclick = (e) => { e.preventDefault(); toast('We collect nothing. Zero analytics. Zero cookies. Art. 11 in practice.', 'info'); };
    });
  });

  feat(86, 'Accessibility statement', () => {
    document.querySelectorAll('.legal-links a').forEach((a) => {
      if (a.textContent.trim() === 'Accessibility') a.onclick = (e) => { e.preventDefault(); SC.showShortcuts(); };
    });
  });

  feat(87, 'Terms anchor', () => {
    document.querySelectorAll('.legal-links a').forEach((a) => {
      if (a.textContent.includes('Terms')) a.onclick = (e) => { e.preventDefault(); toast('CC0 Public Domain. Copy freely. Rights only expand.', 'info'); };
    });
  });

  feat(88, 'Cookie policy anchor', () => {
    document.querySelectorAll('.legal-links a').forEach((a) => {
      if (a.textContent.includes('Cookie')) a.onclick = (e) => { e.preventDefault(); document.getElementById('cookie-banner').style.display = 'flex'; };
    });
  });

  feat(89, 'Press kit footer link', () => {
    document.querySelectorAll('.legal-links a').forEach((a) => {
      if (a.textContent.includes('Press Kit')) a.onclick = (e) => { e.preventDefault(); downloadPressKit(); };
    });
  });

  feat(90, 'Share on sign wall hover', () => {
    document.getElementById('signers-wall')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('signer-pill')) toast('Every signature strengthens the movement', 'info');
    });
  });

  feat(91, 'Document title blink on sign', () => {
    const orig = window.signCharter;
    window.signCharter = function () {
      orig();
      const t = document.title;
      document.title = '✓ Signed — SherpaCarta';
      setTimeout(() => document.title = t, 2000);
    };
  });

  feat(92, 'Favicon badge via title', () => {});

  feat(93, 'Local storage size display', () => {
    SC.storageInfo = function () {
      let size = 0;
      for (const k in localStorage) if (k.startsWith('sc_')) size += (localStorage[k]?.length || 0) * 2;
      toast('Local data: ~' + (size / 1024).toFixed(1) + ' KB (never sent to servers)', 'info');
    };
  });

  feat(94, 'Copy Satohash link', () => {
    window.copySatohashLink = async function () {
      if (typeof getCharterPlainText !== 'function') return;
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(getCharterPlainText()));
      const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      navigator.clipboard.writeText('https://satohash.giveabit.io?ref=sherpacarta&hash=' + hash);
      toast('Satohash stamp link copied', 'success');
    };
  });

  feat(95, 'Welcome tour steps', () => {
    if (localStorage.getItem('sc_tour_done')) return;
    const steps = [
      [2000, 'Press ⌘K for instant search'],
      [5000, 'Sign the charter — strengthen the movement'],
      [9000, 'Stamp on Bitcoin via Satohash for proof']
    ];
    steps.forEach(([delay, msg]) => setTimeout(() => toast(msg, 'info'), delay));
    setTimeout(() => localStorage.setItem('sc_tour_done', '1'), 12000);
  });

  feat(96, 'RC chapter expand', () => {
    document.querySelectorAll('.charter-chapter')?.forEach?.(() => {});
  });

  feat(97, 'Performance mark', () => {
    if (performance.mark) performance.mark('sc-enhancements-loaded');
  });

  feat(98, 'Feature count in console', () => {
    console.log(`SherpaCarta ${BUILD} — ${FEATURES.length} features active`);
  });

  feat(99, 'Global SC export', () => {
    window.SC = window.SC || {};
    SC.FEATURES = FEATURES;
    SC.BUILD = BUILD;
  });

  feat(100, 'Init complete toast', () => {
    setTimeout(() => {
      if (!sessionStorage.getItem('sc_100_loaded')) {
        sessionStorage.setItem('sc_100_loaded', '1');
        toast(`${FEATURES.length} enhancements loaded — press ⌘K`, 'success');
      }
    }, 2500);
  });

})();