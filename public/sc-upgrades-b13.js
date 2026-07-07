/**
 * SherpaCarta — Canada Petition System (668–687)
 */
(function SCUpgradesB13() {
  'use strict';
  const BUILD = '20260707-687';
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b13 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b13.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B13 #${id}:`, e); }
  }

  feat(668, 'Canada petition engine load', () => {
    if (document.querySelector('script[src*="sc-petition-canada"]')) return;
    const s = document.createElement('script');
    s.src = '/js/sc-petition-canada.js?v=687';
    s.defer = true;
    document.body.appendChild(s);
  });

  feat(669, 'Auto-Canadian sign country default', () => {
    const country = document.getElementById('sign-country');
    if (country && !country.value) {
      const isBC = location.pathname.includes('/bc') || new URLSearchParams(location.search).get('province') === 'BC';
      country.value = isBC ? 'Canada, BC' : 'Canada';
      country.placeholder = 'Canada (auto)';
    }
  });

  feat(670, 'Canada nav links', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML(
      'beforeend',
      '<a href="/canada/">Canada</a>'
    );
  });

  feat(671, 'Canada BC challenge CTA update', () => {
    const section = document.getElementById('canada-bc');
    if (!section || section.querySelector('.ca-petition-cta')) return;
    const cta = document.createElement('div');
    cta.className = 'ca-petition-cta';
    cta.style.cssText = 'margin-top:1rem;display:flex;gap:.5rem;flex-wrap:wrap';
    cta.innerHTML = `
      <a href="/canada/sign.html" class="btn btn-primary" style="text-decoration:none"><i class="fas fa-signature"></i> Sign Canada Petition</a>
      <a href="/canada/bc/" class="btn btn-ghost" style="text-decoration:none"><i class="fas fa-map-location-dot"></i> BC Challenge</a>
      <a href="/canada/proof.html" class="btn btn-ghost" style="text-decoration:none"><i class="fas fa-stamp"></i> SHA-256 Proof</a>`;
    section.querySelector('.challenge-banner')?.appendChild(cta);
  });

  feat(672, 'Federal e-petition info CMD', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push({
      group: 'Canada',
      icon: 'fa-flag',
      label: 'Canada Petition',
      sub: 'Sign as Canadian · zero server data',
      action: () => { window.location.href = '/canada/sign.html'; },
    });
  });

  feat(673, 'BC challenge CMD', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push({
      group: 'Canada',
      icon: 'fa-map',
      label: 'BC Digital Rights',
      sub: 'British Columbia beachhead',
      action: () => { window.location.href = '/canada/bc/'; },
    });
  });

  feat(674, 'Satohash template metadata', () => {
    window.SHERPA_SATOHASH_TEMPLATE = {
      id: 'sherpacarta-canada-referendum-v1',
      url: '/data/satohash-templates/sherpacarta-canada-referendum.json',
      submitTo: 'https://satohash.io/templates/',
      status: 'beta',
    };
  });

  feat(675, 'Referendum mode flag', () => {
    window.SHERPA_REFERENDUM = {
      enabled: true,
      jurisdiction: 'CA',
      methods: ['moral', 'sha256-receipt', 'passkey', 'nostr', 'ed25519', 'opentimestamps'],
      future: ['eidas-eu'],
    };
  });

  feat(676, 'Campaign JSON endpoint', () => {
    window.SHERPA_CAMPAIGN = { url: '/data/campaign-canada.json', id: 'sherpacarta-canada-v1' };
  });

  feat(677, 'Nostr kind 1978 petition', () => {
    window.SHERPA_NOSTR_PETITION_KIND = 1978;
  });

  feat(678, 'Share Canada OG URLs', () => {
    window.SHERPA_SHARE_URLS = {
      canada: 'https://sherpacarta.org/canada/',
      sign: 'https://sherpacarta.org/canada/sign.html',
      bc: 'https://sherpacarta.org/canada/bc/',
      proof: 'https://sherpacarta.org/canada/proof.html',
    };
  });

  feat(679, 'Press kit Canada facts', () => {
    window.SHERPA_PRESS_CA = {
      headline: 'SherpaCarta Canada — Digital Rights Petition',
      hashtags: ['CanadaBCChallenge', 'SherpaCarta', 'DigitalRights', 'PrivacyFirst'],
    };
  });

  feat(680, 'About page link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML(
      'beforeend',
      '<a href="/canada/about.html">About</a>'
    );
  });

  feat(681, 'Official Parliament bridge', () => {
    window.SHERPA_OFFICIAL_CA = {
      federal: 'https://www.ourcommons.ca/petitions/en/Home/Index',
      bc: 'https://www.leg.bc.ca/parliamentary-business/parliamentary-procedure/petitions',
    };
  });

  feat(682, 'Merkle root public API stub', () => {
    window.SHERPA_PROOF_API = '/canada/proof.html';
  });

  feat(683, 'Sign section Canada badge', () => {
    const sign = document.getElementById('sign-heading');
    if (sign && !sign.dataset.ca) {
      sign.insertAdjacentHTML('afterend', '<p style="font-size:.75rem;color:var(--em);margin-top:-.5rem">🇨🇦 All signatures count as Canadian · <a href="/canada/sign.html" style="color:var(--em2)">Full petition flow →</a></p>');
      sign.dataset.ca = '1';
    }
  });

  feat(684, 'Petition hash sync with charter', () => {
    fetch('/data/campaign-canada.json').then((r) => r.json()).then((d) => {
      window.SHERPA_CAMPAIGN_DATA = d;
    }).catch(() => {});
  });

  feat(685, 'Town hall kit cross-link', () => {
    document.querySelector('a[href*="CANADA-BC-CHALLENGE"]')?.insertAdjacentHTML(
      'afterend',
      ' · <a href="/bc/town-hall-kit.html">Town Hall Kit</a>'
    );
  });

  feat(686, 'Zero-knowledge petition pledge', () => {
    window.SHERPA_PRIVACY_PLEDGE = 'SherpaCarta collects zero petition data on servers. Canadian signatures are local-first. Official government petitions are a separate voluntary step.';
  });

  feat(687, 'Canada petition BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 10;
    SC.CANADA_PETITION = true;
    SC.UPGRADES_B13 = SHERPA_UPGRADES.b13.items;
    SC.totalFeatures = 687;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    setTimeout(() => toast('Canada petition system live — all signs auto-Canadian — BUILD 687', 'success'), 4000);
    console.log(`SherpaCarta Canada — BUILD ${BUILD}`);
  });
})();