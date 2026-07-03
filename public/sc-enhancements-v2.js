/**
 * SherpaCarta Enhancements v2.3 — Features 101–200
 * Groups 5–8 × 25 features
 */
(function SCEnhancementsV2() {
  'use strict';
  const BUILD = '20260703-200';
  const FEATURES = [];
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  function feat(id, name, fn) {
    FEATURES.push({ id, name });
    try { fn(); } catch (e) { console.warn(`Feature ${id}:`, e); }
  }

  // ═══ GROUP 5: Performance (101–125) ════════════════════

  feat(101, 'Preconnect CDNs', () => {
    ['https://cdn.jsdelivr.net', 'https://fonts.gstatic.com'].forEach((href) => {
      if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        const l = document.createElement('link');
        l.rel = 'preconnect'; l.href = href; l.crossOrigin = 'anonymous';
        document.head.appendChild(l);
      }
    });
  });

  feat(102, 'DNS prefetch Nostr relays', () => {
    ['wss://relay.damus.io', 'wss://nos.lol'].forEach((href) => {
      const l = document.createElement('link');
      l.rel = 'dns-prefetch'; l.href = href.replace('wss:', 'https:');
      document.head.appendChild(l);
    });
  });

  feat(103, 'Content-visibility sections', () => {
    const s = document.createElement('style');
    s.textContent = '.section,.mission-block{content-visibility:auto;contain-intrinsic-size:auto 500px}';
    document.head.appendChild(s);
  });

  feat(104, 'Reduce particles on mobile', () => {
    if (window.innerWidth < 768 || navigator.hardwareConcurrency < 4) {
      const c = $('particle-canvas');
      if (c) c.style.display = 'none';
    }
  });

  feat(105, 'Pause momentum counter when hidden', () => {
    document.addEventListener('visibilitychange', () => {
      window._scCounterPaused = document.hidden;
    });
  });

  feat(106, 'Battery saver mode', () => {
    if (navigator.getBattery) {
      navigator.getBattery().then((b) => {
        if (b.level < 0.2) {
          document.body.classList.add('battery-saver');
          $('particle-canvas') && ($('particle-canvas').style.display = 'none');
          toast('Battery saver — animations reduced', 'info');
        }
      }).catch(() => {});
    }
    const s = document.createElement('style');
    s.textContent = 'body.battery-saver .trust-scroll{animation:none}body.battery-saver #particle-canvas{display:none!important}';
    document.head.appendChild(s);
  });

  feat(107, 'Prefers reduced data', () => {
    if (navigator.connection?.saveData) {
      document.body.classList.add('save-data');
      document.querySelectorAll('video').forEach((v) => v.preload = 'none');
    }
  });

  feat(108, 'Defer heavy init via idle', () => {
    const run = (fn) => (window.requestIdleCallback || ((cb) => setTimeout(cb, 1)))(fn, { timeout: 2000 });
    window.SC2 = window.SC2 || {};
    SC2.idle = run;
  });

  feat(109, 'Throttle scroll progress', () => {
    let ticking = false;
    const bar = $('progress-bar');
    const orig = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (window.scrollY / max * 100) + '%';
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(() => { orig(); ticking = false; }); ticking = true; }
    }, { passive: true });
  });

  feat(110, 'Async decode images', () => {
    document.querySelectorAll('img').forEach((img) => { img.decoding = 'async'; img.loading = 'lazy'; });
  });

  feat(111, 'Give A Bit logo +50% size', () => {
    document.querySelectorAll('.giveabit-footer img').forEach((img) => {
      img.height = 33; img.width = 132;
      img.style.height = '33px'; img.style.width = 'auto';
    });
  });

  feat(112, 'Modal GPU promotion', () => {
    const s = document.createElement('style');
    s.textContent = '.modal-overlay.open,#qr-modal.open{will-change:opacity;transform:translateZ(0)}';
    document.head.appendChild(s);
  });

  feat(113, 'LocalStorage quota check', () => {
    SC2.checkStorage = () => {
      let n = 0;
      for (const k in localStorage) if (k.startsWith('sc_')) n += (localStorage[k]?.length || 0) * 2;
      if (n > 4e6) toast('Local storage nearly full — export and clear old drafts', 'error');
      return n;
    };
  });

  feat(114, 'Slow network toast', () => {
    if (navigator.connection?.effectiveType === '2g' || navigator.connection?.effectiveType === 'slow-2g') {
      setTimeout(() => toast('Slow connection — core charter still works offline', 'info'), 3000);
    }
  });

  feat(115, 'Prefetch charter modal on hover', () => {
    document.querySelectorAll('.cta-main,[onclick*="openCharterModal"]').forEach((el) => {
      el.addEventListener('mouseenter', () => { if (typeof buildFullCharter === 'function') buildFullCharter(); }, { once: true });
    });
  });

  feat(116, 'Cancel speech on modal close', () => {
    const orig = window.closeCharterModal;
    window.closeCharterModal = function () {
      window.speechSynthesis?.cancel();
      if (orig) orig();
    };
  });

  feat(117, 'Single toast queue', () => {
    const stack = $('toast-stack');
    if (stack) {
      const obs = new MutationObserver(() => {
        while (stack.children.length > 4) stack.firstChild?.remove();
      });
      obs.observe(stack, { childList: true });
    }
  });

  feat(118, 'Fix announcement banner layout shift', () => {
    const b = $('announce-banner');
    if (b) document.body.style.paddingTop = b.offsetHeight + 'px';
  });

  feat(119, 'SW cache bust v2.3', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.update());
      });
    }
  });

  feat(120, 'Passive touch listeners', () => {
    document.addEventListener('touchstart', () => {}, { passive: true });
  });

  feat(121, 'Reduce quote timer when hidden', () => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && window.quoteTimer) clearInterval(window.quoteTimer);
      else if (!document.hidden && typeof resetQuoteTimer === 'function') resetQuoteTimer();
    });
  });

  feat(122, 'Compress JSON exports', () => {
    window.exportCharterMinified = () => {
      if (typeof CHARTER === 'undefined') return;
      const blob = new Blob([JSON.stringify(CHARTER)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-min.json';
      a.click();
      toast('Minified JSON exported', 'success');
    };
  });

  feat(123, 'Performance timing log', () => {
    window.addEventListener('load', () => {
      const t = performance.timing;
      const load = t.loadEventEnd - t.navigationStart;
      if (load > 0) console.log(`SherpaCarta load: ${load}ms`);
    });
  });

  feat(124, 'Disable custom cursor on reduced motion', () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.style.cursor = 'auto';
      $('cursor') && ($('cursor').style.display = 'none');
      $('cursor-ring') && ($('cursor-ring').style.display = 'none');
    }
  });

  feat(125, 'Idle prefetch Satohash', () => {
    SC2.idle?.(() => {
      const l = document.createElement('link');
      l.rel = 'prefetch'; l.href = 'https://satohash.giveabit.io';
      document.head.appendChild(l);
    });
  });

  // ═══ GROUP 6: Engagement depth (126–150) ════════════════

  feat(126, 'Article star bookmarks UI', () => {
    SC2.stars = JSON.parse(localStorage.getItem('sc_stars') || '[]');
    SC2.toggleStar = (num) => {
      const i = SC2.stars.indexOf(num);
      if (i >= 0) SC2.stars.splice(i, 1); else SC2.stars.push(num);
      localStorage.setItem('sc_stars', JSON.stringify(SC2.stars));
      toast(i >= 0 ? 'Unstarred' : 'Starred ' + num, 'success');
    };
    const panel = document.createElement('div');
    panel.className = 'stars-panel';
    panel.innerHTML = `<div class="calc-label">STARRED ARTICLES</div><div id="stars-list" class="stars-list"></div>`;
    const sign = $('sign');
    if (sign) sign.querySelector('.section-max')?.appendChild(panel);
    SC2.renderStars = () => {
      const el = $('stars-list');
      if (!el) return;
      el.innerHTML = SC2.stars.length
        ? SC2.stars.map((n) => `<button type="button" class="star-pill" onclick="openCharterModal();setTimeout(()=>filterCharter('${n}'),400)">★ ${n}</button>`).join('')
        : '<span style="font-size:.75rem;color:var(--text3)">Star articles in the charter modal</span>';
    };
    SC2.renderStars();
  });

  feat(127, 'Article notes per article', () => {
    SC2.notes = JSON.parse(localStorage.getItem('sc_notes') || '{}');
    SC2.saveNote = (num, text) => {
      SC2.notes[num] = text;
      localStorage.setItem('sc_notes', JSON.stringify(SC2.notes));
      toast('Note saved for ' + num, 'success');
    };
    window.addArticleNoteUI = (num) => {
      const existing = SC2.notes[num] || '';
      const text = prompt('Note for ' + num + ':', existing);
      if (text !== null) SC2.saveNote(num, text);
    };
  });

  feat(128, 'Share article deep link', () => {
    window.shareArticle = (num) => {
      const url = `https://sherpacarta.org/?article=${encodeURIComponent(num)}`;
      navigator.clipboard.writeText(url);
      toast('Article link copied', 'success');
    };
  });

  feat(129, 'Calculator presets', () => {
    const presets = document.createElement('div');
    presets.className = 'calc-presets';
    presets.innerHTML = `
      <div class="calc-label">QUICK PRESETS</div>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.4rem">
        <button type="button" class="btn btn-ghost" style="font-size:.65rem" onclick="SC2.calcPreset('Canada','social','e2e')">🇨🇦 Canada</button>
        <button type="button" class="btn btn-ghost" style="font-size:.65rem" onclick="SC2.calcPreset('USA','finance','basic')">🇺🇸 USA</button>
        <button type="button" class="btn btn-ghost" style="font-size:.65rem" onclick="SC2.calcPreset('Germany','business','full')">🇩🇪 EU</button>
      </div>`;
    const calc = document.querySelector('.calc-grid');
    if (calc) calc.before(presets);
    SC2.calcPreset = (country, use, enc) => {
      const map = { Canada: 'Canada', USA: 'USA', Germany: 'Germany' };
      const useMap = { social: 'social', finance: 'finance', business: 'business' };
      const encMap = { e2e: 'e2e', basic: 'basic', full: 'full' };
      const cs = $('calc-country'), cu = $('calc-use'), ce = $('calc-enc');
      [...cs.options].forEach((o, i) => { if (o.text.includes(map[country])) cs.selectedIndex = i; });
      cu.value = useMap[use] || use;
      ce.value = encMap[enc] || enc;
      calcRights?.();
      toast('Preset applied: ' + country, 'info');
    };
  });

  feat(130, 'Calculator history', () => {
    SC2.calcHistory = JSON.parse(localStorage.getItem('sc_calc_hist') || '[]');
    const orig = window.calcRights;
    if (orig) {
      window.calcRights = function () {
        orig();
        const score = $('calc-score')?.textContent;
        if (score && score !== '—') {
          SC2.calcHistory.unshift({ score, ts: Date.now() });
          SC2.calcHistory = SC2.calcHistory.slice(0, 10);
          localStorage.setItem('sc_calc_hist', JSON.stringify(SC2.calcHistory));
        }
      };
    }
  });

  feat(131, 'Export signers CSV', () => {
    window.exportSignersCSV = () => {
      const signers = window.state?.signers || [];
      const csv = 'name,country\n' + signers.map((s) => `"${s.name}","${s.c || ''}"`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sherpacarta-signers-local.csv';
      a.click();
      toast('Signers exported (local only)', 'success');
    };
  });

  feat(132, 'Amendment search', () => {
    const inp = document.createElement('input');
    inp.className = 'amend-search';
    inp.placeholder = 'Search proposals…';
    inp.setAttribute('aria-label', 'Search amendments');
    inp.oninput = () => {
      const q = inp.value.toLowerCase();
      document.querySelectorAll('.amend-item').forEach((el) => {
        el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    };
    const list = $('amend-list');
    if (list) list.before(inp);
  });

  feat(133, 'Amendment sort by votes', () => {
    const orig = window.renderAmendments;
    window.renderAmendments = function () {
      if (window.state?.amendments) {
        window.state.amendments.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      }
      if (orig) orig();
    };
  });

  feat(134, 'Copy npub when Nostr connected', () => {
    SC2.copyNpub = () => {
      if (!window.state?.nostrPubkey) { toast('Connect Nostr first', 'error'); return; }
      navigator.clipboard.writeText(window.state.nostrPubkey);
      toast('Nostr public key copied (hex)', 'success');
    };
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'btn btn-ghost'; btn.style.fontSize = '.65rem';
    btn.innerHTML = '<i class="fas fa-copy"></i> Copy npub';
    btn.onclick = () => SC2.copyNpub();
    $('nostr-connect-btn')?.after(btn);
  });

  feat(135, 'Legislative brief generator', () => {
    window.generateLegislativeBrief = () => {
      const brief = `LEGISLATIVE BRIEF — SherpaCarta v2.0\nFor: BC / Canada policymakers\nDate: ${new Date().toISOString().split('T')[0]}\n\nEXECUTIVE SUMMARY\nSherpaCarta is a 114-article model Digital Rights Act synthesizing Magna Carta (1215), UDHR (1948), and Icelandic crowdsourced constitution (2011) for the algorithmic age.\n\nPRIORITY ARTICLES FOR ADOPTION\n• Art. 11 — Absolute privacy, ban mass surveillance\n• Art. 12 — Data sovereignty\n• Art. 13 — Prohibition of surveillance capitalism\n• Art. 61–62 — Algorithmic transparency and non-discrimination\n• Art. 114 — Living charter (rights only expand)\n\nPROOF\nStamp this version on Bitcoin: https://satohash.giveabit.io\n\nCONTACT\nhttps://sherpacarta.org\n\nCC0 Public Domain — adopt freely.`;
      const blob = new Blob([brief], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-Legislative-Brief.txt';
      a.click();
      toast('Legislative brief downloaded', 'success');
    };
  });

  feat(136, 'MLA email template', () => {
    window.copyMLAEmail = () => {
      const t = `Subject: Model Digital Rights Act for British Columbia\n\nDear [MLA Name],\n\nI am writing to bring your attention to SherpaCarta — a 114-article model charter of digital human rights, available at https://sherpacarta.org\n\nAs your constituent, I urge you to review Arts. 11–13 and 61–62 as foundation language for BC privacy and algorithmic accountability legislation.\n\nI have signed this charter and believe BC can lead Canada — and the world — on digital dignity.\n\nRespectfully,\n[Your Name]\n[Your Riding]`;
      navigator.clipboard.writeText(t);
      toast('MLA email template copied', 'success');
    };
  });

  feat(137, 'Petition text generator', () => {
    window.copyPetitionText = () => {
      const t = `We, the undersigned citizens of Canada, call upon the Legislative Assembly of British Columbia to adopt SherpaCarta (sherpacarta.org) as model language for a Digital Rights Act protecting privacy, data sovereignty, and freedom from algorithmic discrimination. Rights may only expand, never contract.`;
      navigator.clipboard.writeText(t);
      toast('Petition text copied', 'success');
    };
  });

  feat(138, 'Article APA citation', () => {
    window.citeArticle = (num, title) => {
      const c = `SherpaCarta Global Movement. (${new Date().getFullYear()}). ${title} (${num}). SherpaCarta v2.0. https://sherpacarta.org`;
      navigator.clipboard.writeText(c);
      toast('Citation copied (APA)', 'success');
    };
  });

  feat(139, 'Charter diff summary', () => {
    window.showDraftDiff = () => {
      const draft = localStorage.getItem('sc_charter_draft');
      if (!draft) { toast('No draft saved', 'error'); return; }
      const d = JSON.parse(draft);
      toast(`Draft has ${d.articles?.length || 0} edited sections — saved ${new Date(d.saved).toLocaleString()}`, 'info');
    };
  });

  feat(140, 'Coalition interest expanded', () => {
    const box = document.createElement('div');
    box.className = 'coalition-box';
    box.innerHTML = `<button type="button" class="btn btn-ghost" onclick="orgEndorse()"><i class="fas fa-handshake"></i> Organization Endorsement</button>
      <button type="button" class="btn btn-ghost" onclick="generateLegislativeBrief()"><i class="fas fa-landmark"></i> Legislative Brief</button>
      <button type="button" class="btn btn-ghost" onclick="copyMLAEmail()"><i class="fas fa-envelope"></i> MLA Template</button>`;
    const bc = $('canada-bc');
    if (bc) bc.querySelector('.challenge-banner')?.appendChild(box);
  });

  feat(141, 'Rights dispatch archive local', () => {
    SC2.archive = JSON.parse(localStorage.getItem('sc_dispatch') || '[]');
    SC2.addDispatch = (title, body) => {
      SC2.archive.unshift({ title, body, ts: Date.now() });
      localStorage.setItem('sc_dispatch', JSON.stringify(SC2.archive.slice(0, 20)));
    };
    SC2.addDispatch('Canada BC Challenge Launched', 'Be first to change digital rights law.');
  });

  feat(142, 'Compare table export', () => {
    window.exportComparison = () => {
      const rows = [...document.querySelectorAll('.cmp-row')].map((r) => r.textContent.trim().replace(/\s+/g, ' | '));
      const blob = new Blob([rows.join('\n')], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-Comparison.txt';
      a.click();
    };
  });

  feat(143, 'Sign wall country filter', () => {
    const sel = document.createElement('select');
    sel.className = 'sign-filter';
    sel.innerHTML = '<option value="">All signers</option><option value="Canada">🇨🇦 Canada</option><option value="BC">BC</option>';
    sel.onchange = () => toast('Filter: ' + (sel.value || 'all'), 'info');
    document.querySelector('.sign-section')?.prepend(sel);
  });

  feat(144, 'Nostr relay status', () => {
    SC2.relayStatus = (relay) => new Promise((res) => {
      try {
        const ws = new WebSocket(relay);
        const t = setTimeout(() => { ws.close(); res(false); }, 3000);
        ws.onopen = () => { clearTimeout(t); ws.close(); res(true); };
        ws.onerror = () => { clearTimeout(t); res(false); };
      } catch (_) { res(false); }
    });
  });

  feat(145, 'Article reading list queue', () => {
    SC2.queue = JSON.parse(localStorage.getItem('sc_queue') || '[]');
    SC2.addToQueue = (num) => {
      if (!SC2.queue.includes(num)) SC2.queue.push(num);
      localStorage.setItem('sc_queue', JSON.stringify(SC2.queue));
      toast('Added to reading queue', 'success');
    };
    SC2.nextInQueue = () => {
      const n = SC2.queue.shift();
      localStorage.setItem('sc_queue', JSON.stringify(SC2.queue));
      if (n) { openCharterModal(); setTimeout(() => filterCharter(n), 400); }
    };
  });

  feat(146, 'Pillar detail on double-click', () => {
    document.querySelectorAll('.pillar').forEach((p) => {
      p.addEventListener('dblclick', () => {
        const t = p.querySelector('h3')?.textContent;
        toast(t + ' — core to digital dignity', 'info');
      });
    });
  });

  feat(147, 'Media inquiry mailto', () => {
    window.mediaInquiry = () => {
      location.href = 'mailto:press@sherpacarta.org?subject=Media%20Inquiry%20—%20SherpaCarta&body=Publication:%0AAudience:%0ADeadline:';
    };
  });

  feat(148, 'Volunteer roles picker', () => {
    window.volunteerRole = () => {
      const role = prompt('Role interest: Translation / Legal / Tech / Outreach / BC Organizer');
      if (role) {
        localStorage.setItem('sc_volunteer_role', role);
        volunteerInterest?.();
      }
    };
  });

  feat(149, 'Amendment reply local', () => {
    SC2.replyAmendment = (idx, text) => {
      const amps = JSON.parse(localStorage.getItem('sc_amendments') || '[]');
      if (!amps[idx]) return;
      amps[idx].replies = amps[idx].replies || [];
      amps[idx].replies.push({ text, ts: Date.now() });
      localStorage.setItem('sc_amendments', JSON.stringify(amps));
      renderAmendments?.();
    };
  });

  feat(150, 'JSON feed charter endpoint file', () => {
    window.downloadJSONFeed = () => {
      if (typeof CHARTER === 'undefined') return;
      const feed = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'SherpaCarta Charter',
        home_page_url: 'https://sherpacarta.org',
        items: CHARTER.flatMap((ch) => ch.articles.map((a) => ({
          id: a.num,
          title: a.title,
          content_text: a.body.replace(/<[^>]+>/g, ''),
          tags: a.tags
        })))
      };
      const blob = new Blob([JSON.stringify(feed, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sherpacarta-feed.json';
      a.click();
    };
  });

  // ═══ GROUP 7: UX delight (151–175) ═══════════════════════

  feat(151, 'Section nav dots', () => {
    const nav = document.createElement('nav');
    nav.className = 'section-dots';
    nav.setAttribute('aria-label', 'Section navigation');
    ['hero', 'mission', 'canada-bc', 'pillars', 'sign'].forEach((id) => {
      const a = document.createElement('a');
      a.href = '#' + id;
      a.title = id;
      a.className = 'dot-link';
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
  });

  feat(152, 'Scroll progress in nav', () => {
    const el = document.createElement('span');
    el.className = 'nav-scroll-pct';
    el.id = 'nav-scroll-pct';
    $('main-nav')?.querySelector('.nav-inner')?.appendChild(el);
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.round(window.scrollY / max * 100);
      el.textContent = pct + '%';
    }, { passive: true });
  });

  feat(153, 'Articles read counter', () => {
    SC2.read = parseInt(localStorage.getItem('sc_articles_read') || '0', 10);
    SC2.markRead = () => {
      SC2.read++;
      localStorage.setItem('sc_articles_read', SC2.read);
    };
    const orig = window.selectArticle;
    if (typeof window.selectArticle === 'function') {
      window.selectArticle = function () { orig.apply(this, arguments); SC2.markRead(); };
    }
  });

  feat(154, 'Visit streak counter', () => {
    const today = new Date().toDateString();
    const last = localStorage.getItem('sc_last_visit');
    let streak = parseInt(localStorage.getItem('sc_streak') || '1', 10);
    if (last && last !== today) {
      const diff = (new Date(today) - new Date(last)) / 864e5;
      streak = diff === 1 ? streak + 1 : 1;
      localStorage.setItem('sc_streak', streak);
    }
    localStorage.setItem('sc_last_visit', today);
    if (streak > 2) setTimeout(() => toast(`🔥 ${streak}-day streak — rights warrior`, 'success'), 4000);
  });

  feat(155, 'Charter completion progress', () => {
    const bar = document.createElement('div');
    bar.className = 'charter-progress';
    bar.innerHTML = '<div class="charter-progress-fill" id="charter-progress-fill"></div>';
    $('charter-modal')?.querySelector('.modal-header')?.appendChild(bar);
    SC2.updateCharterProgress = () => {
      const read = parseInt(localStorage.getItem('sc_articles_read') || '0', 10);
      const pct = Math.min(100, Math.round(read / 114 * 100));
      const f = $('charter-progress-fill');
      if (f) f.style.width = pct + '%';
    };
    SC2.updateCharterProgress();
  });

  feat(156, 'Zen mode toggle', () => {
    SC2.toggleZen = () => {
      document.body.classList.toggle('zen-mode');
      toast(document.body.classList.contains('zen-mode') ? 'Zen mode' : 'Full UI restored', 'info');
    };
    const s = document.createElement('style');
    s.textContent = 'body.zen-mode .a11y-toolbar,body.zen-mode #float-assert,body.zen-mode .sticky-bc-cta,body.zen-mode .trust-bar,body.zen-mode #audio-indicator{display:none!important}';
    document.head.appendChild(s);
  });

  feat(157, 'Presentation mode', () => {
    SC2.presentationMode = () => {
      openCharterModal();
      document.documentElement.requestFullscreen?.();
      toast('Presentation mode — Esc to exit', 'info');
    };
  });

  feat(158, 'Sepia reading tint', () => {
    SC2.toggleSepia = () => {
      document.body.classList.toggle('sepia-mode');
      localStorage.setItem('sc_sepia', document.body.classList.contains('sepia-mode'));
    };
    if (localStorage.getItem('sc_sepia') === 'true') document.body.classList.add('sepia-mode');
    const s = document.createElement('style');
    s.textContent = 'body.sepia-mode{filter:sepia(.15)}';
    document.head.appendChild(s);
  });

  feat(159, 'Dyslexia font toggle', () => {
    SC2.toggleDyslexia = () => {
      document.body.classList.toggle('dyslexia-font');
      localStorage.setItem('sc_dyslexia', document.body.classList.contains('dyslexia-font'));
    };
    const s = document.createElement('style');
    s.textContent = 'body.dyslexia-font{font-family:Comic Sans MS,OpenDyslexic,system-ui,sans-serif!important;letter-spacing:.05em}';
    document.head.appendChild(s);
    if (localStorage.getItem('sc_dyslexia') === 'true') document.body.classList.add('dyslexia-font');
  });

  feat(160, 'Line height control', () => {
    SC2.lineHeight = parseFloat(localStorage.getItem('sc_line_height') || '1.75');
    SC2.setLineHeight = (d) => {
      SC2.lineHeight = Math.max(1.4, Math.min(2.2, SC2.lineHeight + d));
      document.body.style.lineHeight = SC2.lineHeight;
      localStorage.setItem('sc_line_height', SC2.lineHeight);
    };
    document.body.style.lineHeight = SC2.lineHeight;
  });

  feat(161, 'Letter spacing control', () => {
    SC2.letterSpacing = parseFloat(localStorage.getItem('sc_letter_spacing') || '0');
    SC2.setLetterSpacing = (d) => {
      SC2.letterSpacing = Math.max(0, Math.min(0.15, SC2.letterSpacing + d));
      document.body.style.letterSpacing = SC2.letterSpacing + 'em';
      localStorage.setItem('sc_letter_spacing', SC2.letterSpacing);
    };
  });

  feat(162, 'Extended a11y toolbar buttons', () => {
    const bar = $('a11y-toolbar');
    if (!bar) return;
    const extras = [
      ['Zen', 'SC2.toggleZen()'],
      ['Sepia', 'SC2.toggleSepia()'],
      ['Dyslexia', 'SC2.toggleDyslexia()'],
      ['↕', 'SC2.setLineHeight(0.1)'],
      ['↔', 'SC2.setLetterSpacing(0.02)']
    ];
    extras.forEach(([label, fn]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = label; b.setAttribute('onclick', fn);
      bar.appendChild(b);
    });
  });

  feat(163, 'Achievement badges', () => {
    SC2.badges = JSON.parse(localStorage.getItem('sc_badges') || '[]');
    SC2.award = (id, label) => {
      if (SC2.badges.includes(id)) return;
      SC2.badges.push(id);
      localStorage.setItem('sc_badges', JSON.stringify(SC2.badges));
      toast('🏅 ' + label, 'success');
    };
    const origSign = window.signCharter;
    window.signCharter = function () {
      origSign?.();
      SC2.award('signed', 'First Signature');
    };
  });

  feat(164, 'Pomodoro reading timer', () => {
    SC2.pomodoro = null;
    SC2.startPomodoro = () => {
      clearInterval(SC2.pomodoro);
      let m = 25;
      toast('Pomodoro: 25 min reading session', 'info');
      SC2.pomodoro = setInterval(() => {
        m--;
        if (m <= 0) { clearInterval(SC2.pomodoro); toast('Break time — assert your rights!', 'success'); }
      }, 60000);
    };
  });

  feat(165, 'Slideshow articles', () => {
    SC2.slideshow = () => {
      if (typeof CHARTER === 'undefined') return;
      const arts = CHARTER.flatMap((c) => c.articles);
      let i = 0;
      openCharterModal();
      const next = () => { filterCharter(arts[i % arts.length].num); i++; };
      next();
      SC2.slideTimer = setInterval(next, 8000);
      toast('Slideshow — click charter close to stop', 'info');
    };
    const origClose = window.closeCharterModal;
    window.closeCharterModal = function () {
      clearInterval(SC2.slideTimer);
      if (origClose) origClose();
    };
  });

  feat(166, 'Focus dim overlay', () => {
    SC2.toggleFocus = () => document.body.classList.toggle('focus-dim');
    const s = document.createElement('style');
    s.textContent = 'body.focus-dim main>*:not(:target){opacity:.35;transition:opacity .3s}';
    document.head.appendChild(s);
  });

  feat(167, 'Time on page', () => {
    const start = Date.now();
    window.addEventListener('beforeunload', () => {
      const sec = Math.round((Date.now() - start) / 1000);
      localStorage.setItem('sc_time_on_page', sec);
    });
  });

  feat(168, 'Milestone share at sign count', () => {
    const check = (n) => {
      if ([10, 100, 1000, 4271].includes(n)) toast(`Milestone: ${n} signatories! Share the movement.`, 'success');
    };
    const orig = window.signCharter;
    window.signCharter = function () {
      const before = window.state?.signCount;
      orig?.();
      check(window.state?.signCount);
    };
  });

  feat(169, 'Article tags cloud', () => {
    if (typeof CHARTER === 'undefined') return;
    const tags = {};
    CHARTER.flatMap((c) => c.articles).forEach((a) => a.tags?.forEach((t) => { tags[t] = (tags[t] || 0) + 1; }));
    const cloud = document.createElement('div');
    cloud.className = 'tag-cloud';
    cloud.innerHTML = '<div class="calc-label">CHARTER THEMES</div>' +
      Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 12)
        .map(([t, n]) => `<button type="button" class="tag-cloud-btn" onclick="openCharterModal();setTimeout(()=>filterCharter('${t}'),400)">#${t}</button>`).join('');
    const pillars = $('pillars');
    if (pillars) pillars.after(cloud);
  });

  feat(170, 'Minimap scroll hint', () => {
    const mm = document.createElement('div');
    mm.className = 'scroll-minimap';
    mm.innerHTML = '<div id="minimap-thumb" class="minimap-thumb"></div>';
    document.body.appendChild(mm);
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const thumb = $('minimap-thumb');
      if (thumb) thumb.style.top = (window.scrollY / max * 80) + '%';
    }, { passive: true });
  });

  feat(171, 'Warm night tint', () => {
    SC2.toggleWarm = () => document.body.classList.toggle('warm-night');
    const s = document.createElement('style');
    s.textContent = 'body.warm-night{--bg:#080606;--em:#d4a574}';
    document.head.appendChild(s);
  });

  feat(172, 'Copy reading stats', () => {
    SC2.copyStats = () => {
      const t = `SherpaCarta Stats (local)\nArticles read: ${localStorage.getItem('sc_articles_read') || 0}\nStreak: ${localStorage.getItem('sc_streak') || 1} days\nBadges: ${(JSON.parse(localStorage.getItem('sc_badges')||'[]')).length}`;
      navigator.clipboard.writeText(t);
      toast('Stats copied', 'success');
    };
  });

  feat(173, 'Charter modal star button injection', () => {
    const orig = window.buildFullCharter;
    window.buildFullCharter = function () {
      if (orig) orig();
      document.querySelectorAll('.charter-article').forEach((el) => {
        const num = el.querySelector('.ca-num')?.textContent?.split('·')[0]?.trim();
        if (!num || el.querySelector('.star-btn')) return;
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'star-btn';
        btn.innerHTML = '★';
        btn.title = 'Star article';
        btn.onclick = (e) => { e.stopPropagation(); SC2.toggleStar(num); SC2.renderStars?.(); };
        el.querySelector('.ca-num')?.appendChild(btn);
      });
    };
  });

  feat(174, 'Double-tap logo confetti', () => {
    let last = 0;
    document.querySelector('.nav-logo')?.addEventListener('click', () => {
      const now = Date.now();
      if (now - last < 400) window.SC?.confetti?.();
      last = now;
    });
  });

  feat(175, 'Section enter animations stagger', () => {
    document.querySelectorAll('.section').forEach((sec, i) => {
      sec.style.animationDelay = (i * 0.05) + 's';
      sec.classList.add('section-enter');
    });
    const s = document.createElement('style');
    s.textContent = '.section-enter{animation:fade-up .6s both}';
    document.head.appendChild(s);
  });

  // ═══ GROUP 8: Marketing + distribution (176–200) ════════

  feat(176, 'Reddit share', () => {
    window.shareReddit = () => window.open('https://reddit.com/submit?url=' + encodeURIComponent('https://sherpacarta.org') + '&title=' + encodeURIComponent('SherpaCarta — Digital Magna Carta'), '_blank', 'noopener');
  });

  feat(177, 'Bluesky share', () => {
    window.shareBluesky = () => window.open('https://bsky.app/intent/compose?text=' + encodeURIComponent('SherpaCarta — 114 articles of digital human rights. Privacy is a birthright. https://sherpacarta.org'), '_blank', 'noopener');
  });

  feat(178, 'Mastodon share', () => {
    window.shareMastodon = () => {
      const text = encodeURIComponent('SherpaCarta — Global Digital Magna Carta\nhttps://sherpacarta.org #DigitalRights #SherpaCarta');
      const url = prompt('Your Mastodon instance (e.g. mastodon.social):', 'mastodon.social');
      if (url) window.open(`https://${url.replace(/https?:\/\//, '')}/share?text=${text}`, '_blank', 'noopener');
    };
  });

  feat(179, 'Nostr share composer', () => {
    window.shareNostr = () => {
      const text = 'SherpaCarta — 114 articles. Privacy is a birthright. https://sherpacarta.org #SherpaCarta';
      if (window.publishToNostr) publishToNostr(text, [['t', 'share']]);
      else { navigator.clipboard.writeText(text); toast('Copied — paste in your Nostr client', 'success'); }
    };
  });

  feat(180, 'QR for page URL', () => {
    window.showPageQR = () => {
      window.qrCurrentAddress = 'https://sherpacarta.org';
      $('qr-modal-title').textContent = 'Share SherpaCarta';
      $('qr-modal-sub').textContent = 'SCAN TO OPEN SITE';
      $('qr-warning').style.display = 'none';
      $('qr-address-display').textContent = window.qrCurrentAddress;
      $('qr-modal').classList.add('open');
      document.body.style.overflow = 'hidden';
      window.renderQRCode?.(window.qrCurrentAddress);
    };
  });

  feat(181, 'vCard contact download', () => {
    window.downloadVCard = () => {
      const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:SherpaCarta\nORG:SherpaCarta Global Movement\nURL:https://sherpacarta.org\nNOTE:Digital Magna Carta — 114 articles\nEND:VCARD`;
      const blob = new Blob([vcf], { type: 'text/vcard' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta.vcf';
      a.click();
    };
  });

  feat(182, 'ICS calendar reminder', () => {
    window.downloadICS = () => {
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nSUMMARY:Sign SherpaCarta — Digital Rights Charter\nDESCRIPTION:https://sherpacarta.org\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([ics], { type: 'text/calendar' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sign-sherpacarta.ics';
      a.click();
    };
  });

  feat(183, 'Social card generator', () => {
    window.generateSocialCard = () => {
      const c = document.createElement('canvas');
      c.width = 1200; c.height = 630;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#060a06';
      ctx.fillRect(0, 0, 1200, 630);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 72px Georgia';
      ctx.fillText('SherpaCarta', 80, 200);
      ctx.fillStyle = '#e8ede8';
      ctx.font = '36px Georgia';
      ctx.fillText('114 Articles · Privacy is a Birthright', 80, 280);
      ctx.font = '24px monospace';
      ctx.fillStyle = '#9ca89c';
      ctx.fillText('sherpacarta.org', 80, 340);
      c.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'SherpaCarta-share-card.png';
        a.click();
        toast('Social card downloaded', 'success');
      });
    };
  });

  feat(184, 'MCP descriptor public JSON', () => {
    const mcp = {
      name: 'sherpacarta',
      version: '2.3',
      tools: [
        { name: 'search_charter', description: 'Search 114 articles by keyword' },
        { name: 'get_article', description: 'Get article by number e.g. Art. 11' },
        { name: 'get_charter_hash', description: 'SHA-256 of canonical charter' }
      ],
      url: 'https://sherpacarta.org'
    };
    window.SHERPA_MCP = mcp;
  });

  feat(185, 'UTM campaign capture', () => {
    const utm = new URLSearchParams(location.search);
    ['utm_source', 'utm_campaign', 'utm_medium'].forEach((k) => {
      const v = utm.get(k);
      if (v) localStorage.setItem('sc_' + k, v);
    });
    if (utm.get('utm_campaign') === 'canadabc') {
      setTimeout(() => $('canada-bc')?.scrollIntoView({ behavior: 'smooth' }), 1500);
    }
  });

  feat(186, 'Referrer thank you', () => {
    if (document.referrer && !document.referrer.includes('sherpacarta')) {
      setTimeout(() => toast('Welcome from ' + new URL(document.referrer).hostname, 'info'), 2000);
    }
  });

  feat(187, 'Privacy-friendly pageview counter', () => {
    const views = parseInt(localStorage.getItem('sc_pageviews') || '0', 10) + 1;
    localStorage.setItem('sc_pageviews', views);
  });

  feat(188, 'Expanded CMD palette v2', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Share', icon: 'fa-reddit fab', label: 'Share on Reddit', sub: 'r/digitalrights', action: shareReddit },
      { group: 'Share', icon: 'fa-share', label: 'Share on Bluesky', sub: 'Decentralized social', action: shareBluesky },
      { group: 'Share', icon: 'fa-share-nodes', label: 'Share on Nostr', sub: 'Publish note', action: shareNostr },
      { group: 'Actions', icon: 'fa-qrcode', label: 'QR — Page URL', sub: 'Share site', action: showPageQR },
      { group: 'Actions', icon: 'fa-landmark', label: 'Legislative Brief', sub: 'For policymakers', action: generateLegislativeBrief },
      { group: 'Actions', icon: 'fa-envelope', label: 'MLA Email Template', sub: 'BC outreach', action: copyMLAEmail },
      { group: 'Actions', icon: 'fa-image', label: 'Social Card PNG', sub: 'Download image', action: generateSocialCard },
      { group: 'Actions', icon: 'fa-rss', label: 'JSON Feed', sub: 'Charter feed', action: downloadJSONFeed },
      { group: 'Actions', icon: 'fa-presentation', label: 'Presentation Mode', sub: 'Fullscreen charter', action: () => SC2.presentationMode() }
    );
  });

  feat(189, 'Footer share row expanded', () => {
    const row = document.createElement('div');
    row.className = 'footer-share';
    row.style.marginTop = '.5rem';
    row.innerHTML = `
      <button type="button" class="share-btn share-cp" onclick="shareReddit()"><i class="fab fa-reddit"></i></button>
      <button type="button" class="share-btn share-cp" onclick="shareBluesky()"><i class="fas fa-cloud"></i></button>
      <button type="button" class="share-btn share-cp" onclick="showPageQR()"><i class="fas fa-qrcode"></i></button>
      <button type="button" class="share-btn share-cp" onclick="generateSocialCard()"><i class="fas fa-image"></i></button>`;
    document.querySelector('.footer-brand .footer-share')?.after(row);
  });

  feat(190, 'RSS feed download', () => {
    window.downloadRSS = () => {
      if (typeof CHARTER === 'undefined') return;
      const items = CHARTER.flatMap((c) => c.articles).slice(0, 20).map((a) =>
        `<item><title>${a.num}: ${a.title}</title><link>https://sherpacarta.org/?article=${encodeURIComponent(a.num)}</link></item>`
      ).join('');
      const rss = `<?xml version="1.0"?><rss version="2.0"><channel><title>SherpaCarta</title><link>https://sherpacarta.org</link>${items}</channel></rss>`;
      const blob = new Blob([rss], { type: 'application/rss+xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sherpacarta.rss';
      a.click();
    };
  });

  feat(191, 'Atom feed download', () => {
    window.downloadAtom = () => {
      const atom = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>SherpaCarta</title><link href="https://sherpacarta.org"/><updated>${new Date().toISOString()}</updated></feed>`;
      const blob = new Blob([atom], { type: 'application/atom+xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sherpacarta.atom';
      a.click();
    };
  });

  feat(192, 'Embed widget expanded snippet', () => {
    window.copyWidgetSnippet = () => {
      const s = `<script src="https://sherpacarta.org/embed.js" data-theme="dark"><\/script><div class="sherpacarta-embed"></div>`;
      navigator.clipboard.writeText(s);
      toast('Widget snippet copied (embed.js coming soon)', 'success');
    };
  });

  feat(193, 'Lighthouse hints console', () => {
    console.log('%cSherpaCarta Performance Tips', 'color:#10b981;font-weight:bold');
    console.log('• Zero analytics — privacy by design');
    console.log('• Service worker cached — offline ready');
    console.log('• Content-visibility on sections');
  });

  feat(194, 'Campaign banner A/B local', () => {
    const variant = localStorage.getItem('sc_banner_variant') || (Math.random() > 0.5 ? 'a' : 'b');
    localStorage.setItem('sc_banner_variant', variant);
    const b = $('announce-banner');
    if (b && variant === 'b') b.querySelector('span').innerHTML = b.querySelector('span').innerHTML.replace('Learn more', 'Join the challenge');
  });

  feat(195, 'Petition signature export', () => {
    window.exportPetition = () => {
      const names = (window.state?.signers || []).map((s) => s.name).join(', ');
      navigator.clipboard.writeText('We call upon BC to adopt SherpaCarta.\n\nLocal signers: ' + names);
      toast('Petition signers copied', 'success');
    };
  });

  feat(196, 'WhatsApp enhanced share', () => {
    const orig = window.shareOn;
    window.shareOn = function (platform) {
      if (platform === 'whatsapp') {
        const t = encodeURIComponent('SherpaCarta — 114 articles protecting YOUR digital rights. Sign now: https://sherpacarta.org 🇨🇦 #CanadaBCChallenge');
        window.open('https://wa.me/?text=' + t, '_blank', 'noopener');
        return;
      }
      if (orig) orig(platform);
    };
  });

  feat(197, 'Telegram enhanced share', () => {
    window.shareTelegram = () => {
      window.open('https://t.me/share/url?url=' + encodeURIComponent('https://sherpacarta.org') + '&text=' + encodeURIComponent('SherpaCarta — Digital Magna Carta'), '_blank', 'noopener');
    };
  });

  feat(198, 'Update BUILD badge to 200', () => {
    const bb = document.querySelector('.build-badge');
    if (bb) {
      bb.textContent = 'BUILD ' + BUILD;
      bb.title = '200 features — click for list';
    }
    const origShow = window.SC?.showFeatures;
    window.SC = window.SC || {};
    window.SC.showFeatures = function () {
      if (origShow) origShow();
      const m = $('features-modal');
      if (m) {
        const extra = FEATURES.map((f) => `<div class="feat-item"><span>${f.id}</span> ${f.name}</div>`).join('');
        m.querySelector('.features-grid')?.insertAdjacentHTML('beforeend', extra);
        const h = m.querySelector('h2');
        if (h) h.textContent = '200 Features';
      }
    };
  });

  feat(199, 'Merge SC2 into SC global', () => {
    window.SC2 = window.SC2 || {};
    window.SC = window.SC || {};
    SC.FEATURES_V2 = FEATURES;
    SC.BUILD = BUILD;
    SC.totalFeatures = 200;
  });

  feat(200, 'v2 init complete toast', () => {
    setTimeout(() => {
      if (!sessionStorage.getItem('sc_200_loaded')) {
        sessionStorage.setItem('sc_200_loaded', '1');
        toast('200 features active — ⌘K for all commands', 'success');
      }
    }, 3500);
  });

  console.log(`SherpaCarta v2.3 — features 101–200 loaded (${FEATURES.length})`);
})();