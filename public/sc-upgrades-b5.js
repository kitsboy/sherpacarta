/**
 * SherpaCarta Sprint 2 — SEO & Growth (508–527)
 */
(function SCUpgradesB5() {
  'use strict';
  const BUILD = '20260704-527';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b5 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b5.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B5 #${id}:`, e); }
  }

  function findArticle(num) {
    const n = String(num).replace(/^Art\.\s*/i, '');
    return window.CHARTER?.flatMap((ch) => ch.articles.map((a) => ({ ...a, chapter: ch.chapter })))
      .find((a) => a.num === `Art. ${n}` || a.num === n || a.num.replace('Art. ', '') === n);
  }

  function setMeta(name, content, attr = 'name') {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
    el.setAttribute('content', content);
  }

  // 508–512 — Per-article SEO meta on load
  feat(508, 'Article page meta tags', () => {
    window.applyArticleSEO = (num) => {
      const art = findArticle(num);
      if (!art) return;
      const slug = art.num.replace('Art. ', '');
      const title = `${art.title} — SherpaCarta ${art.num}`;
      const desc = `${art.num}: ${art.title}. Part of the SherpaCarta Global Digital Magna Carta. CC0.`;
      const url = `https://sherpacarta.org/?article=${slug}`;
      document.title = title;
      setMeta('description', desc);
      setMeta('og:title', title, 'property');
      setMeta('og:description', desc, 'property');
      setMeta('og:url', url, 'property');
      setMeta('twitter:title', title);
      setMeta('twitter:description', desc);
      let canon = document.querySelector('link[rel=canonical]');
      if (canon) canon.href = url;
    };
    const p = new URLSearchParams(location.search).get('article') || new URLSearchParams(location.search).get('art');
    if (p) setTimeout(() => window.applyArticleSEO?.(p), 300);
  });

  feat(509, 'Article canonical URLs', () => {
    if (!location.search.includes('article=')) return;
    const p = new URLSearchParams(location.search).get('article');
    if (p) window.applyArticleSEO?.(p);
  });

  feat(510, 'Dynamic Article JSON-LD', () => {
    window.injectArticleSchema = (num) => {
      const art = findArticle(num);
      if (!art) return;
      document.getElementById('article-schema-dynamic')?.remove();
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = 'article-schema-dynamic';
      s.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: art.title,
        articleSection: art.chapter,
        identifier: art.num,
        url: `https://sherpacarta.org/?article=${art.num.replace('Art. ', '')}`,
        author: { '@type': 'Organization', name: 'SherpaCarta Global Movement' },
        license: 'https://creativecommons.org/publicdomain/zero/1.0/',
        keywords: (art.tags || []).join(', '),
      });
      document.head.appendChild(s);
    };
    const p = new URLSearchParams(location.search).get('article');
    if (p) setTimeout(() => window.injectArticleSchema?.(p), 400);
  });

  feat(511, 'Article OG image params', () => {
    window.articleOgUrl = (num) => `https://sherpacarta.org/og-image.png?article=${num}`;
    const p = new URLSearchParams(location.search).get('article');
    if (p) setMeta('og:image', window.articleOgUrl(p), 'property');
  });

  feat(512, 'Sitemap discoverability footer', () => {
    /* sitemap expanded via scripts/generate-sitemap.mjs at build */
  });

  // 513 — Journalist FAQ
  feat(513, 'Journalist FAQ section', () => {
    const faq = $('faq');
    if (!faq || document.getElementById('journalist-faq')) return;
    const sec = document.createElement('div');
    sec.id = 'journalist-faq';
    sec.style.cssText = 'margin-top:2.5rem;padding:1.5rem;background:var(--bg2);border:1px solid var(--border);border-radius:1rem;max-width:720px';
    sec.innerHTML = `<div class="section-label" style="margin-bottom:.5rem"><span>For Journalists</span></div>
      <h3 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:1rem">Media FAQ</h3>
      <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">What is the headline? <i class="fas fa-chevron-down"></i></div>
        <div class="faq-a">A living 114-article global charter of digital human rights — CC0, Bitcoin-funded, zero tracking — positioned as a Magna Carta for the algorithmic age.</div></div>
      <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">Who can I interview? <i class="fas fa-chevron-down"></i></div>
        <div class="faq-a">Email hello@giveabit.io with subject "Sherpacarta Press". Response within 48 hours.</div></div>
      <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">Is this legally binding? <i class="fas fa-chevron-down"></i></div>
        <div class="faq-a">Not yet — it is a moral declaration on the path Magna Carta took before becoming law. Canada/BC is the first legislative beachhead.</div></div>
      <a href="/press.html" class="btn btn-ghost" style="margin-top:1rem;font-size:.75rem"><i class="fas fa-newspaper"></i> Full press room →</a>`;
    faq.querySelector('.section-max')?.appendChild(sec);
  });

  // 514–515 — Comparison page links + GDPR row
  feat(514, 'Comparison page link', () => {
    const cmp = document.getElementById('compare-heading')?.closest('section');
    if (cmp) {
      const a = document.createElement('a');
      a.href = '/comparison.html';
      a.className = 'btn btn-ghost';
      a.style.cssText = 'margin-top:1rem;display:inline-flex';
      a.innerHTML = '<i class="fas fa-scale-balanced"></i> SherpaCarta vs GDPR vs UN →';
      cmp.querySelector('.section-max')?.appendChild(a);
    }
  });

  feat(515, 'GDPR comparison row', () => {
    const table = document.querySelector('.comparison-table');
    if (!table || table.querySelector('.gdpr-row')) return;
    const row = document.createElement('div');
    row.className = 'cmp-row gdp-row';
    row.innerHTML = '<div class="cmp-cell">vs GDPR</div><div class="cmp-cell cmp-part" colspan="3" style="grid-column:span 3;font-size:.78rem;color:var(--text2)">SherpaCarta goes further on algorithmic rights (Art. 61–62), surveillance capitalism ban (Art. 13), and universal scope — not EU-only. <a href="/comparison.html" style="color:var(--em)">Full comparison →</a></div>';
    table.appendChild(row);
  });

  // 516 — Social card generator
  feat(516, 'Social card generator', () => {
    window.generateSocialCard = () => {
      const text = `SherpaCarta — The Global Digital Magna Carta\n114 articles · Privacy is a birthright\nhttps://sherpacarta.org\n#DigitalRights #Privacy #SherpaCarta`;
      navigator.clipboard.writeText(text);
      toast('Social card text copied — paste over og-image.png in your post', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Distribute', icon: 'fa-image', label: 'Social Card Text', sub: 'Copy share copy + hashtags', action: () => window.generateSocialCard() });
    }
  });

  // 517 — UTM referral builder
  feat(517, 'UTM referral builder', () => {
    window.buildUtmLink = (source, medium, campaign) => {
      const u = new URL('https://sherpacarta.org/');
      u.searchParams.set('utm_source', source || 'partner');
      u.searchParams.set('utm_medium', medium || 'referral');
      u.searchParams.set('utm_campaign', campaign || 'rights2026');
      navigator.clipboard.writeText(u.toString());
      toast('UTM link copied: ' + u.searchParams.get('utm_campaign'), 'success');
      return u.toString();
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push(
        { group: 'Distribute', icon: 'fa-link', label: 'UTM Link — Newsletter', sub: 'utm_newsletter', action: () => window.buildUtmLink('newsletter', 'email', 'rights_dispatch') },
        { group: 'Distribute', icon: 'fa-link', label: 'UTM Link — Partner', sub: 'utm_partner', action: () => window.buildUtmLink('partner', 'referral', 'coalition2026') },
        { group: 'Distribute', icon: 'fa-link', label: 'UTM Link — Social', sub: 'utm_social', action: () => window.buildUtmLink('social', 'share', 'sherpacarta_viral') }
      );
    }
    const utm = new URLSearchParams(location.search);
    if (utm.get('utm_source')) localStorage.setItem('sc_utm', JSON.stringify(Object.fromEntries(utm)));
  });

  // 518 — Podcast RSS link
  feat(518, 'Podcast RSS link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML('beforeend', '<a href="/feed/podcast.xml">Podcast RSS</a>');
  });

  // 519 — Annual report link
  feat(519, 'Annual report link', () => {
    const mission = $('mission');
    if (mission) {
      const a = document.createElement('a');
      a.href = '/report/2026-report.html';
      a.className = 'btn btn-ghost';
      a.style.marginLeft = '.5rem';
      a.innerHTML = '<i class="fas fa-file-lines"></i> 2026 Report';
      mission.querySelector('.mission-inner')?.querySelector('.btn')?.after(a) ||
        mission.querySelector('.mission-inner')?.appendChild(a);
    }
  });

  // 520 — Press photo pack
  feat(520, 'Press photo pack', () => {
    window.downloadPressPhotos = () => {
      const pack = `SHERPACARTA PRESS ASSETS\n\nLogo: https://sherpacarta.org/giveabit-logo.png\nParent: https://sherpacarta.org/giveabit-parent-logo.jpg\nOG Image: https://sherpacarta.org/og-image.png (1200×630)\nOG SVG: https://sherpacarta.org/og-image.svg\n\nFull press room: https://sherpacarta.org/press.html`;
      navigator.clipboard.writeText(pack);
      toast('Press asset URLs copied', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Distribute', icon: 'fa-camera', label: 'Press Photo Pack', sub: 'Asset URLs', action: () => window.downloadPressPhotos() });
    }
  });

  // 521–522 — Related articles + read next
  feat(521, 'Related articles by tag', () => {
    window.getRelatedArticles = (art) => {
      if (!art?.tags) return [];
      const all = window.CHARTER?.flatMap((ch) => ch.articles) || [];
      return all.filter((a) => a.num !== art.num && a.tags?.some((t) => art.tags.includes(t))).slice(0, 3);
    };
  });

  feat(522, 'Read next article links', () => {
    const orig = window.openCharterModal;
    window.openCharterModal = function () {
      if (orig) orig();
      setTimeout(() => {
        document.querySelectorAll('.charter-article').forEach((el) => {
          if (el.querySelector('.read-next')) return;
          const num = el.dataset?.artNum || el.id?.replace('art-', '');
          const art = findArticle(num);
          const related = window.getRelatedArticles?.(art) || [];
          if (!related.length) return;
          const div = document.createElement('div');
          div.className = 'read-next';
          div.style.cssText = 'margin-top:1rem;padding-top:.75rem;border-top:1px solid var(--border);font-size:.72rem';
          div.innerHTML = '<span style="color:var(--text3);font-family:var(--mono);font-size:.58rem">READ NEXT</span><br>' +
            related.map((r) => `<button type="button" class="star-pill" style="margin:.25rem .25rem 0 0" onclick="jumpToArticle('${r.num.replace('Art. ', '')}')">${r.num}</button>`).join('');
          el.appendChild(div);
        });
      }, 800);
    };
  });

  // 523 — Press contact strip
  feat(523, 'Press contact strip', () => {
    const press = document.querySelector('.press-bar')?.closest('.section-max');
    if (!press || press.querySelector('.press-contact')) return;
    const c = document.createElement('div');
    c.className = 'press-contact';
    c.style.cssText = 'margin-top:1.5rem;text-align:center;font-size:.82rem;color:var(--text2)';
    c.innerHTML = 'Press inquiries: <a href="mailto:hello@giveabit.io?subject=Sherpacarta%20Press" style="color:var(--em)">hello@giveabit.io</a> · Response within 48h · <a href="/press.html" style="color:var(--em2)">Press room →</a>';
    press.appendChild(c);
  });

  // 524 — robots.txt sitemap note (static file)

  // 525 — Article keywords meta
  feat(525, 'Article keywords meta', () => {
    const p = new URLSearchParams(location.search).get('article');
    if (!p) return;
    const art = findArticle(p);
    if (art?.tags) setMeta('keywords', [...art.tags, 'SherpaCarta', art.num].join(', '));
  });

  // 526 — Article share deep link copy
  feat(526, 'Copy article link', () => {
    window.copyArticleLink = (num) => {
      const url = `https://sherpacarta.org/?article=${num}`;
      navigator.clipboard.writeText(url);
      toast('Article link copied', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Share', icon: 'fa-bookmark', label: 'Copy Article Link', sub: '?article=11 etc', action: () => {
        const n = prompt('Article number (e.g. 11):', '11');
        if (n) window.copyArticleLink(n.replace(/\D/g, ''));
      }});
    }
  });

  feat(527, 'Sprint 2 BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 2;
    SC.UPGRADES_B5 = SHERPA_UPGRADES.b5.items;
    SC.totalFeatures = 527;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    setTimeout(() => toast('Sprint 2 SEO & growth upgrades live — BUILD 527', 'success'), 2500);
    console.log(`SherpaCarta Sprint 2 — BUILD ${BUILD}`);
  });
})();