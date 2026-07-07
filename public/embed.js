/**
 * SherpaCarta Embed Widget — Sprint 8
 * Usage: SherpaCartaEmbed.init({ selector: '#sherpacarta-embed', theme: 'dark' })
 */
(function () {
  'use strict';
  const WIDGET = 'https://sherpacarta.org/embed/sign-widget.html';

  window.SherpaCartaEmbed = {
    version: '1.0.0',
    init(opts) {
      const sel = (opts && opts.selector) || '#sherpacarta-embed';
      const el = document.querySelector(sel);
      if (!el) {
        console.warn('[SherpaCartaEmbed] Element not found:', sel);
        return;
      }
      const theme = (opts && opts.theme) || 'dark';
      const iframe = document.createElement('iframe');
      iframe.src = `${WIDGET}?theme=${encodeURIComponent(theme)}`;
      iframe.title = 'SherpaCarta — Sign the Charter';
      iframe.style.cssText = 'width:100%;min-height:360px;border:none;border-radius:12px;background:transparent';
      iframe.loading = 'lazy';
      iframe.setAttribute('allow', 'clipboard-write');
      el.innerHTML = '';
      el.appendChild(iframe);
    },
  };
})();