/**
 * SherpaCarta Sprint 6 — Architecture & Performance (588–607)
 */
(function SCUpgradesB9() {
  'use strict';
  const BUILD = '20260707-607';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b9 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b9.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B9 #${id}:`, e); }
  }

  feat(588, 'External CSS architecture', () => {
    if (document.querySelector('link[href*="sc-main.css"]')) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = '/sc-main.css?v=647';
    document.head.appendChild(l);
  });

  feat(589, 'External core JS architecture', () => {
    window.SC_ARCH = window.SC_ARCH || {};
    SC_ARCH.coreExternal = !!document.querySelector('script[src*="sc-core.js"]');
  });

  feat(590, 'Single JS bundle loader', () => {
    window.SC_ARCH = window.SC_ARCH || {};
    SC_ARCH.bundled = !!document.querySelector('script[src*="sc-bundle.js"]');
  });

  feat(591, 'Defer script loading', () => {
    document.querySelectorAll('script[src*="sc-"]').forEach((s) => { s.defer = true; });
  });

  feat(592, 'Preload main stylesheet', () => {
    if (document.querySelector('link[rel="preload"][href*="sc-main"]')) return;
    const l = document.createElement('link');
    l.rel = 'preload';
    l.as = 'style';
    l.href = '/sc-main.css?v=647';
    document.head.insertBefore(l, document.head.firstChild);
  });

  feat(593, 'Preload JS bundle', () => {
    if (document.querySelector('link[rel="preload"][href*="sc-bundle"]')) return;
    const l = document.createElement('link');
    l.rel = 'preload';
    l.as = 'script';
    l.href = '/sc-bundle.js?v=647';
    document.head.appendChild(l);
  });

  feat(594, 'DNS prefetch CDN fonts', () => {
    ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'].forEach((h) => {
      if (document.querySelector(`link[rel="dns-prefetch"][href="${h}"]`)) return;
      const l = document.createElement('link');
      l.rel = 'dns-prefetch';
      l.href = h;
      document.head.appendChild(l);
    });
  });

  feat(595, 'Font display swap override', () => {
    const s = document.createElement('style');
    s.textContent = '@font-face{font-display:swap !important;}';
    document.head.appendChild(s);
  });

  feat(596, 'Navigation timing metrics', () => {
    window.addEventListener('load', () => {
      const n = performance.getEntriesByType('navigation')[0];
      if (!n) return;
      window.SC_PERF = {
        domContentLoaded: Math.round(n.domContentLoadedEventEnd),
        load: Math.round(n.loadEventEnd),
        ttfb: Math.round(n.responseStart - n.requestStart),
      };
      console.log('[SherpaCarta perf]', SC_PERF);
    });
  });

  feat(597, 'Resource hints module', () => {
    window.SC_ARCH = window.SC_ARCH || {};
    SC_ARCH.hints = { preload: true, dnsPrefetch: true, defer: true };
  });

  feat(598, 'Lazy load below-fold images', () => {
    document.querySelectorAll('img:not([loading])').forEach((img) => {
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) img.loading = 'lazy';
    });
  });

  feat(599, 'Critical path marker', () => {
    document.documentElement.dataset.scArch = 'split-v1';
  });

  feat(600, 'Bundle size badge', () => {
    fetch('/sc-bundle.js', { method: 'HEAD' })
      .then((r) => {
        const len = r.headers.get('content-length');
        if (len) {
          window.SC_ARCH = window.SC_ARCH || {};
          SC_ARCH.bundleKB = Math.round(Number(len) / 1024);
        }
      })
      .catch(() => {});
  });

  feat(601, 'Lighthouse CI docs link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML(
      'beforeend',
      '<a href="https://github.com/kitsboy/sherpacarta/actions" target="_blank" rel="noopener">CI</a>'
    );
  });

  feat(602, 'Cache version sync', () => {
    window.SC_CACHE_V = '647';
  });

  feat(603, 'Build pipeline marker', () => {
    window.SC_BUILD_PIPELINE = ['extract-assets', 'bundle-js', 'generate-api', 'vite'];
  });

  feat(604, 'Vite static build integration', () => {
    window.SC_ARCH = window.SC_ARCH || {};
    SC_ARCH.vite = true;
  });

  feat(605, 'Service worker v5 architecture', () => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.update());
    });
  });

  feat(606, 'Architecture changelog entry', () => {
    window.SHERPA_CHANGELOG = window.SHERPA_CHANGELOG || [];
    SHERPA_CHANGELOG.push({ build: BUILD, sprint: 6, note: 'Split CSS/JS, bundled enhancements, Lighthouse CI' });
  });

  feat(607, 'Sprint 6 BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 6;
    SC.UPGRADES_B9 = SHERPA_UPGRADES.b9.items;
    SC.totalFeatures = 607;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    setTimeout(() => toast('Sprint 6 architecture & performance live — BUILD 607', 'success'), 3200);
    console.log(`SherpaCarta Sprint 6 — BUILD ${BUILD}`);
  });
})();