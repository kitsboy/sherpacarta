/**
 * SherpaCarta BUILD 732 — share polish, footer share, Canada join strip
 */
(function () {
  'use strict';
  const BUILD = '20260713-732';
  const items = [];
  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b15 = { BUILD, items };

  function feat(id, name, fn) {
    items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B15 #${id}:`, e); }
  }

  feat(721, 'Footer rich share row', () => {
    const foot = document.querySelector('footer .footer-social-official');
    if (!foot || document.getElementById('footer-share-strip')) return;
    const strip = document.createElement('div');
    strip.id = 'footer-share-strip';
    strip.className = 'footer-share-strip';
    foot.parentElement?.insertBefore(strip, foot);
    if (window.SCShare) SCShare.mountStrip(strip, 'home');
  });

  feat(722, 'Nav share shortcut', () => {
    if (!window.SCShare) return;
    const nav = document.querySelector('.nav-actions');
    if (!nav || nav.querySelector('[data-sc-nav-share]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost';
    btn.dataset.scNavShare = '1';
    btn.title = 'Share SherpaCarta';
    btn.innerHTML = '<i class="fas fa-share-nodes"></i>';
    btn.onclick = () => SCShare.open('home');
    nav.insertBefore(btn, nav.firstChild);
  });

  feat(723, 'Sign section share CTA', () => {
    const sign = document.getElementById('sign');
    if (!sign || sign.querySelector('.sign-share-cta') || !window.SCShare) return;
    const row = document.createElement('div');
    row.className = 'sign-share-cta';
    row.style.cssText = 'margin-top:1rem;display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center';
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'btn btn-ghost';
    open.innerHTML = '<i class="fas fa-share-nodes"></i> Share after signing';
    open.onclick = () => SCShare.open('home');
    row.appendChild(open);
    sign.querySelector('.sign-form')?.appendChild(row);
  });

  feat(724, 'OG meta cache bust v732', () => {
    document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]').forEach((m) => {
      const v = m.getAttribute('content');
      if (v && v.includes('sherpacarta.org') && !v.includes('v=732')) {
        m.setAttribute('content', v.replace(/v=\d+/, 'v=732'));
      }
    });
  });
})();