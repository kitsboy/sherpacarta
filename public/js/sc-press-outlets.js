/**
 * Press outlets — Simple Icons, marquee clone, reduced-motion
 */
(function SCPressOutlets() {
  'use strict';

  const ICON_CDN = 'https://cdn.simpleicons.org';
  const CDN_SLUGS = new Set(['theguardian', 'ycombinator']);
  const LOCAL_SVGS = {
    wired: (c) =>
      `<svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"><text x="12" y="17" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="700" fill="${c}">W</text></svg>`,
    eff: (c) =>
      `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true"><path d="M12 3l8 4v6c0 4.5-3 8.5-8 10-5-1.5-8-5.5-8-10V7l8-4z" stroke="${c}" stroke-width="1.6"/><path d="M10 12h4M12 10v4" stroke="${c}" stroke-width="1.6"/></svg>`,
    vice: (c) =>
      `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true"><rect x="5" y="5" width="5" height="5" stroke="${c}" stroke-width="1.6"/><rect x="14" y="5" width="5" height="5" stroke="${c}" stroke-width="1.6"/><rect x="5" y="14" width="5" height="5" stroke="${c}" stroke-width="1.6"/><rect x="14" y="14" width="5" height="5" stroke="${c}" stroke-width="1.6"/></svg>`,
    restofworld: (c) =>
      `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="${c}" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="3.5" ry="8" stroke="${c}" stroke-width="1.4"/><path d="M4 12h16M6.5 8h11M6.5 16h11" stroke="${c}" stroke-width="1.2"/></svg>`,
    privacyinternational: (c) =>
      `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true"><rect x="8" y="11" width="8" height="7" rx="1.5" stroke="${c}" stroke-width="1.6"/><path d="M10 11V9a2 2 0 014 0v2" stroke="${c}" stroke-width="1.6"/></svg>`,
  };
  const FALLBACK_ICON = (color) =>
    `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="${color}" stroke-width="2"/><path d="M8 12h8" stroke="${color}" stroke-width="2"/></svg>`;

  function brandImg(slug, color, alt) {
    const img = document.createElement('img');
    img.className = 'press-brand-icon';
    img.src = `${ICON_CDN}/${slug}/${color.replace('#', '')}`;
    img.alt = alt;
    img.width = 32;
    img.height = 32;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = function () {
      const wrap = img.parentElement;
      if (!wrap) return;
      wrap.innerHTML = FALLBACK_ICON(color);
      wrap.classList.add('press-icon-fallback');
    };
    return img;
  }

  function initIcons() {
    document.querySelectorAll('.press-card[data-icon]').forEach((card) => {
      const icon = card.querySelector('.press-card-icon');
      if (!icon || icon.querySelector('img,.press-brand-icon,svg')) return;
      const slug = card.dataset.icon;
      const color = card.dataset.accent || '#10b981';
      icon.innerHTML = '';
      if (LOCAL_SVGS[slug]) {
        icon.innerHTML = LOCAL_SVGS[slug](color);
        return;
      }
      if (!CDN_SLUGS.has(slug)) {
        icon.innerHTML = FALLBACK_ICON(color);
        icon.classList.add('press-icon-fallback');
        return;
      }
      icon.appendChild(brandImg(slug, color, card.dataset.name || ''));
    });
  }

  function initMarquee() {
    const grid = document.querySelector('.press-grid');
    const track = document.querySelector('.press-marquee-track');
    if (!grid || !track || track.children.length) return;

    const cards = [...grid.querySelectorAll('.press-card')];
    const cloneSet = (el) => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.tabIndex = -1;
      return c;
    };
    [...cards, ...cards].forEach((card) => track.appendChild(cloneSet(card)));

    const mq = window.matchMedia('(max-width:640px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const marquee = document.querySelector('.press-marquee');
      if (!marquee) return;
      marquee.classList.toggle('is-paused', reduced.matches);
      marquee.style.display = mq.matches ? 'block' : 'none';
      grid.style.display = mq.matches ? 'none' : 'grid';
    };
    update();
    mq.addEventListener('change', update);
    reduced.addEventListener('change', update);
  }

  function init() {
    initIcons();
    initMarquee();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();