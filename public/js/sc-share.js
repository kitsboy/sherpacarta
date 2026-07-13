/**
 * SherpaCarta — Rich social share (WhatsApp, X, Telegram, Facebook, LinkedIn, copy, native)
 * Privacy-first: opens platform intent URLs; no tracking pixels.
 */
(function SCShareModule() {
  'use strict';

  const PRESETS = {
    home: {
      url: 'https://sherpacarta.org/',
      title: 'SherpaCarta — Global Digital Magna Carta',
      text: 'I signed SherpaCarta — 114 articles protecting privacy, data sovereignty, and freedom for all 8 billion people. Zero tracking. Bitcoin-funded. Privacy is a human right.',
      image: 'https://sherpacarta.org/og/default.png?v=732',
      hashtags: ['SherpaCarta', 'DigitalRights', 'PrivacyFirst'],
    },
    canada: {
      url: 'https://sherpacarta.org/canada/sign',
      title: 'Sign for Canada — SherpaCarta',
      text: 'I signed the SherpaCarta Canada campaign — 114 articles for digital privacy and data sovereignty. Privacy is a birthright.',
      image: 'https://sherpacarta.org/og/sign.png?v=732',
      hashtags: ['CanadaBCChallenge', 'SherpaCarta', 'DigitalRights', 'Canada'],
    },
    canadaJoin: {
      url: 'https://sherpacarta.org/canada/join',
      title: 'Join the Canada campaign — SherpaCarta',
      text: 'Join the SherpaCarta Canada digital rights campaign. Scan, sign, share — privacy-first.',
      image: 'https://sherpacarta.org/og/join.png?v=732',
      hashtags: ['CanadaBCChallenge', 'SherpaCarta', 'Canada'],
    },
    paper: {
      url: 'https://sherpacarta.org/canada/paper',
      title: 'Print federal petition sheet — SherpaCarta',
      text: 'Collect ink signatures for Canada digital rights — one federal sheet for all provinces.',
      image: 'https://sherpacarta.org/og/paper.png?v=732',
      hashtags: ['SherpaCarta', 'Canada', 'DigitalRights'],
    },
  };

  const PLATFORMS = [
    { id: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', cls: 'sc-share-wa', build: (p) => `https://wa.me/?text=${enc(p.text + ' ' + p.url)}` },
    { id: 'x', label: 'X / Twitter', icon: 'fab fa-x-twitter', cls: 'sc-share-x', build: (p) => `https://twitter.com/intent/tweet?text=${enc(p.text)}&url=${enc(p.url)}&hashtags=${enc((p.hashtags || []).join(','))}` },
    { id: 'telegram', label: 'Telegram', icon: 'fab fa-telegram', cls: 'sc-share-tg', build: (p) => `https://t.me/share/url?url=${enc(p.url)}&text=${enc(p.text)}` },
    { id: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f', cls: 'sc-share-fb', build: (p) => `https://www.facebook.com/sharer/sharer.php?u=${enc(p.url)}&quote=${enc(p.text)}` },
    { id: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin-in', cls: 'sc-share-li', build: (p) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(p.url)}` },
    { id: 'reddit', label: 'Reddit', icon: 'fab fa-reddit-alien', cls: 'sc-share-rd', build: (p) => `https://www.reddit.com/submit?url=${enc(p.url)}&title=${enc(p.title)}` },
    { id: 'sms', label: 'Text SMS', icon: 'fas fa-comment-sms', cls: 'sc-share-sms', build: (p) => `sms:?&body=${enc(p.text + ' ' + p.url)}` },
    { id: 'copy', label: 'Copy link', icon: 'fas fa-link', cls: 'sc-share-cp', action: 'copy' },
    { id: 'native', label: 'More…', icon: 'fas fa-share-nodes', cls: 'sc-share-native', action: 'native' },
  ];

  function enc(s) {
    return encodeURIComponent(s || '');
  }

  function mergePreset(preset, overrides) {
    const base = typeof preset === 'string' ? PRESETS[preset] || PRESETS.home : preset;
    return { ...base, ...overrides };
  }

  function toast(msg, type) {
    if (typeof window.toast === 'function') window.toast(msg, type || 'success');
    else if (type === 'error') console.warn(msg);
  }

  function openPopup(url) {
    if (!url) return;
    if (url.startsWith('sms:')) {
      window.location.href = url;
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer,width=640,height=560');
  }

  async function copyLink(p) {
    const full = `${p.text}\n\n${p.url}`;
    try {
      await navigator.clipboard.writeText(full);
      toast('Share text + link copied!', 'success');
    } catch {
      toast('Could not copy — try again', 'error');
    }
  }

  async function nativeShare(p) {
    if (!navigator.share) {
      await copyLink(p);
      return;
    }
    try {
      await navigator.share({ title: p.title, text: p.text, url: p.url });
    } catch (e) {
      if (e.name !== 'AbortError') await copyLink(p);
    }
  }

  function dispatch(platform, payload) {
    if (platform.action === 'copy') return copyLink(payload);
    if (platform.action === 'native') return nativeShare(payload);
    openPopup(platform.build(payload));
  }

  function ensureModal() {
    let el = document.getElementById('sc-share-modal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'sc-share-modal';
    el.className = 'sc-share-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'sc-share-title');
    el.innerHTML = `
      <div class="sc-share-backdrop" data-sc-share-close aria-hidden="true"></div>
      <div class="sc-share-panel">
        <button type="button" class="sc-share-close" data-sc-share-close aria-label="Close share panel"><i class="fas fa-times"></i></button>
        <div class="sc-share-preview">
          <img class="sc-share-og" id="sc-share-og" alt="" width="120" height="63" loading="lazy" decoding="async">
          <div class="sc-share-preview-text">
            <div class="sc-share-kicker">Share preview</div>
            <h2 id="sc-share-title" class="sc-share-h2"></h2>
            <p id="sc-share-desc" class="sc-share-desc"></p>
            <div class="sc-share-url" id="sc-share-url"></div>
          </div>
        </div>
        <div class="sc-share-tags" id="sc-share-tags"></div>
        <div class="sc-share-grid" id="sc-share-grid" role="group" aria-label="Share destinations"></div>
        <p class="sc-share-foot">Rich cards on WhatsApp, X, and Telegram use our OG images — no trackers.</p>
      </div>`;
    document.body.appendChild(el);
    el.querySelectorAll('[data-sc-share-close]').forEach((n) => {
      n.addEventListener('click', () => SCShare.close());
    });
    return el;
  }

  function renderTags(container, tags) {
    container.replaceChildren();
    (tags || []).forEach((t) => {
      const span = document.createElement('span');
      span.className = 'sc-share-tag';
      span.textContent = '#' + t.replace(/^#/, '');
      container.appendChild(span);
    });
  }

  function renderGrid(container, payload) {
    container.replaceChildren();
    PLATFORMS.forEach((plat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `sc-share-platform ${plat.cls}`;
      btn.innerHTML = `<i class="${plat.icon}" aria-hidden="true"></i><span>${plat.label}</span>`;
      btn.addEventListener('click', () => dispatch(plat, payload));
      container.appendChild(btn);
    });
  }

  const SCShare = {
    PRESETS,
    open(preset, overrides) {
      const payload = mergePreset(preset, overrides);
      const modal = ensureModal();
      document.getElementById('sc-share-title').textContent = payload.title;
      document.getElementById('sc-share-desc').textContent = payload.text;
      document.getElementById('sc-share-url').textContent = payload.url;
      const img = document.getElementById('sc-share-og');
      img.src = payload.image || PRESETS.home.image;
      img.alt = payload.title;
      renderTags(document.getElementById('sc-share-tags'), payload.hashtags);
      renderGrid(document.getElementById('sc-share-grid'), payload);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.SCA11y?.trap) {
        SCShare._untrap = SCA11y.trap(modal.querySelector('.sc-share-panel'), {
          onEscape: () => SCShare.close(),
          initialFocus: '.sc-share-platform',
        });
      } else {
        modal.querySelector('.sc-share-close')?.focus();
      }
    },
    close() {
      const modal = document.getElementById('sc-share-modal');
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (SCShare._untrap) {
        SCShare._untrap();
        SCShare._untrap = null;
      }
    },
    quick(platform, preset, overrides) {
      const payload = mergePreset(preset, overrides);
      const plat = PLATFORMS.find((p) => p.id === platform);
      if (plat) dispatch(plat, payload);
    },
    mountStrip(container, preset, overrides) {
      const host = typeof container === 'string' ? document.getElementById(container) : container;
      if (!host) return;
      const payload = mergePreset(preset, overrides);
      host.classList.add('hero-share');
      host.setAttribute('role', 'group');
      host.setAttribute('aria-label', 'Share SherpaCarta');
      const strip = [
        { id: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', cls: 'share-wa' },
        { id: 'x', label: 'Post on X', icon: 'fab fa-x-twitter', cls: 'share-x' },
        { id: 'telegram', label: 'Telegram', icon: 'fab fa-telegram', cls: 'share-tg' },
        { id: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f', cls: 'share-fb' },
        { id: 'copy', label: 'Copy', icon: 'fas fa-link', cls: 'share-cp' },
      ];
      host.replaceChildren();
      strip.forEach((s) => {
        const plat = PLATFORMS.find((p) => p.id === s.id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `share-btn ${s.cls}`;
        btn.innerHTML = `<i class="${s.icon}" aria-hidden="true"></i> ${s.label}`;
        btn.addEventListener('click', () => {
          if (s.id === 'copy') copyLink(payload);
          else if (plat) dispatch(plat, payload);
        });
        host.appendChild(btn);
      });
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'share-btn share-cp';
      more.innerHTML = '<i class="fas fa-share-nodes" aria-hidden="true"></i> All shares';
      more.addEventListener('click', () => SCShare.open(preset, overrides));
      host.appendChild(more);
    },
    textForCanada(sig) {
      const prov = sig?.provinceName || sig?.province || 'Canada';
      return `I signed the SherpaCarta Canada campaign (${prov}) — 114 articles for digital human rights. Campaign commitment + cryptographic receipt. Privacy is a birthright.`;
    },
  };

  window.SCShare = SCShare;

  // Back-compat wrappers
  window.shareOn = (platform) => SCShare.quick(platform, 'home');
  window.shareCharter = () => {
    if (navigator.share) {
      const p = PRESETS.home;
      navigator.share({ title: p.title, text: p.text, url: p.url }).catch(() => SCShare.open('home'));
    } else SCShare.open('home');
  };
  window.shareArticle = (title) => {
    SCShare.open('home', {
      text: `I just signed "${title}" in SherpaCarta — the Global Digital Magna Carta. Privacy is a human right.`,
      title: `${title} — SherpaCarta`,
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const strip = document.getElementById('hero-share-strip');
    if (strip) SCShare.mountStrip(strip, 'home');
  });
})();