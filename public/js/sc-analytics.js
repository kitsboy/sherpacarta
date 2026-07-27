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
      var payload = data || {};
      // Always attach product id for HQ / suite rollups (no PII)
      if (payload.productId == null) payload.productId = 'sherpacarta';
      if (typeof window.umami === 'object' && typeof window.umami.track === 'function') {
        window.umami.track(name, payload);
      }
    } catch (_) {
      /* ignore */
    }
  }

  /**
   * Canada public-mandate events for HQ (Umami → Analytics tab).
   * Never send names, emails, full hashes, or IP.
   * @param {string} event
   * @param {{ method?: string, province?: string, shared?: boolean, duplicate?: boolean, remote?: boolean, path?: string }=} meta
   */
  function trackCanada(event, meta) {
    meta = meta || {};
    track(event, {
      productId: 'sherpacarta',
      track: 'public_mandate',
      method: meta.method || 'unknown',
      province: meta.province || 'none',
      shared: meta.shared === true,
      duplicate: meta.duplicate === true,
      remote: meta.remote === true,
      path: meta.path || (typeof location !== 'undefined' ? location.pathname : '/canada/sign'),
    });
  }

  window.scTrack = track;
  window.scTrackCanada = trackCanada;

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
    trackCanada('canada_sign_page', { path: location.pathname });
  }
  if (location.pathname.indexOf('/canada/official') !== -1) {
    trackCanada('canada_official_page', { path: location.pathname });
  }
  if (location.pathname.indexOf('/canada/paper') !== -1) {
    trackCanada('canada_paper_page', { path: location.pathname });
  }
  if (location.pathname.indexOf('/canada/join') !== -1) {
    trackCanada('canada_join_page', { path: location.pathname });
  }
  if (location.pathname.indexOf('/treasury') !== -1) {
    track('treasury_view', { path: location.pathname });
  }
})();
