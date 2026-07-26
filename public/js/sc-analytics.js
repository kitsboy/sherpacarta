/**
 * SherpaCarta first-party analytics (Umami).
 * productId: sherpacarta · website: 9b6f05bf-286e-4b21-9094-1d675f9b4442
 * Privacy: no ad tech, no third-party cookies. Safe to load on all pages.
 */
(function () {
  'use strict';
  var WEBSITE_ID = '9b6f05bf-286e-4b21-9094-1d675f9b4442';
  var SCRIPT_SRC = 'https://analytics.giveabit.io/script.js';

  if (window.__SC_ANALYTICS__) return;
  window.__SC_ANALYTICS__ = true;

  function ensureUmami() {
    if (document.querySelector('script[data-website-id="' + WEBSITE_ID + '"]')) return;
    var s = document.createElement('script');
    s.defer = true;
    s.src = SCRIPT_SRC;
    s.setAttribute('data-website-id', WEBSITE_ID);
    document.head.appendChild(s);
  }

  /** @param {string} name @param {Record<string, string|number|boolean>=} data */
  function track(name, data) {
    try {
      if (typeof window.umami === 'object' && typeof window.umami.track === 'function') {
        window.umami.track(name, data || {});
      }
    } catch (_) {
      /* ignore */
    }
  }

  window.scTrack = track;

  ensureUmami();

  // Lightweight auto-events (no PII)
  document.addEventListener(
    'click',
    function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest('[data-sc-track]') : null;
      if (t) {
        var evName = t.getAttribute('data-sc-track') || 'click';
        track(evName, { path: location.pathname });
        return;
      }
      var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('/canada/sign') !== -1 || href.indexOf('sign.html') !== -1) {
        track('sign_cta_click', { path: location.pathname });
      } else if (href.indexOf('/treasury') !== -1) {
        track('treasury_click', { path: location.pathname });
      } else if (href.indexOf('mempool.space') !== -1 || href.indexOf('bitcoin:') === 0) {
        track('donate_click', { path: location.pathname, rail: 'onchain' });
      } else if (a.hasAttribute('data-share') || (a.className && String(a.className).indexOf('share') !== -1)) {
        track('share_click', { path: location.pathname });
      }
    },
    true
  );

  if (location.pathname.indexOf('/canada/sign') !== -1 || /sign\.html$/.test(location.pathname)) {
    track('sign_page_view', { path: location.pathname });
  }
  if (location.pathname.indexOf('/treasury') !== -1) {
    track('treasury_view', { path: location.pathname });
  }
})();
