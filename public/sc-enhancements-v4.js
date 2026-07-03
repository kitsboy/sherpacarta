/**
 * SherpaCarta Enhancements v3.1 — Features 301–325
 * Group 13: Visual polish + parent brand + waves
 */
(function SCEnhancementsV4() {
  'use strict';
  const BUILD = '20260703-325';
  const FEATURES = [];
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  function feat(id, name, fn) {
    FEATURES.push({ id, name });
    try { fn(); } catch (e) { console.warn(`Feature ${id}:`, e); }
  }

  window.SC4 = window.SC4 || {};

  feat(301, 'Parent company logo in copyright', () => {
    document.querySelectorAll('.giveabit-footer-parent img').forEach((img) => {
      if (!img.src.includes('giveabit-parent-logo')) img.src = '/giveabit-parent-logo.jpg';
      img.alt = 'giveaBit.io — parent company';
    });
  });

  feat(302, 'Wave background 36% opacity', () => {
    const wb = $('wave-bg');
    if (wb) wb.style.opacity = '0.36';
  });

  feat(303, 'Waves respect reduced motion', () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $('wave-bg')?.classList.add('waves-paused');
    }
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      $('wave-bg')?.classList.toggle('waves-paused', e.matches);
    });
  });

  feat(304, 'Wave theme sync light/dark', () => {
    SC4.syncWaveTheme = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      document.querySelectorAll('#wave-bg path').forEach((p, i) => {
        const fills = light
          ? ['rgba(16,185,129,0.08)', 'rgba(16,185,129,0.05)', 'rgba(52,211,153,0.04)']
          : ['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.08)', 'rgba(52,211,153,0.06)'];
        p.setAttribute('fill', fills[i] || fills[0]);
      });
    };
    SC4.syncWaveTheme();
    const orig = window.toggleTheme;
    window.toggleTheme = function () {
      if (orig) orig();
      setTimeout(SC4.syncWaveTheme, 50);
    };
  });

  feat(305, 'Parent logo hover glow', () => {
    document.querySelectorAll('.giveabit-footer-parent').forEach((a) => {
      a.title = 'A Give A Bit project — giveabit.io';
    });
  });

  feat(306, 'Preload parent logo', () => {
    const l = document.createElement('link');
    l.rel = 'preload';
    l.as = 'image';
    l.href = '/giveabit-parent-logo.jpg';
    document.head.appendChild(l);
  });

  feat(307, 'JSON-LD parent org logo', () => {
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      try {
        const j = JSON.parse(s.textContent);
        if (j.publisher?.name === 'Give A Bit') {
          j.publisher.logo = { '@type': 'ImageObject', 'url': 'https://sherpacarta.org/giveabit-parent-logo.jpg' };
          s.textContent = JSON.stringify(j);
        }
      } catch (_) {}
    });
  });

  feat(308, 'SW cache v3.1 bump', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((r) => r.forEach((reg) => reg.update()));
    }
  });

  feat(309, 'Toggle waves via ⌘K', () => {
    SC4.toggleWaves = () => {
      document.body.classList.toggle('waves-off');
      const off = document.body.classList.contains('waves-off');
      localStorage.setItem('sc_waves_off', off ? '1' : '0');
      toast(off ? 'Wave background off' : 'Wave background on (36%)', 'info');
    };
    if (localStorage.getItem('sc_waves_off') === '1') document.body.classList.add('waves-off');
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push(
        { group: 'Personalize', icon: 'fa-water', label: 'Toggle Wave Background', sub: '36% motion backdrop', action: () => SC4.toggleWaves() }
      );
    }
  });

  feat(310, 'Wave parallax on scroll', () => {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking || document.body.classList.contains('waves-off')) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.04;
        const wb = $('wave-bg');
        if (wb) wb.style.transform = `translateY(${y}px)`;
        ticking = false;
      });
    }, { passive: true });
  });

  feat(311, 'Mobile reduce wave layers', () => {
    if (window.innerWidth < 768) {
      $('wave-bg')?.querySelector('.wave-3')?.remove();
    }
  });

  feat(312, 'Battery saver disable waves', () => {
    if (navigator.getBattery) {
      navigator.getBattery().then((b) => {
        if (b.level < 0.15) $('wave-bg')?.classList.add('waves-paused');
        b.addEventListener('levelchange', () => {
          $('wave-bg')?.classList.toggle('waves-paused', b.level < 0.15);
        });
      }).catch(() => {});
    }
  });

  feat(313, 'Screenshot mode hides waves', () => {
    const orig = window.SC3?.screenshotMode;
    if (orig) {
      window.SC3.screenshotMode = function () {
        $('wave-bg')?.style.setProperty('display', 'none');
        orig();
      };
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('screenshot-mode')) {
        $('wave-bg')?.style.removeProperty('display');
      }
    });
  });

  feat(314, 'Copyright Give A Bit attribution line', () => {
    const p = document.querySelector('.legal-bottom p');
    if (p && !p.textContent.includes('Give A Bit project')) {
      const span = document.createElement('span');
      span.style.cssText = 'display:block;margin-top:.35rem;font-size:.52rem;opacity:.75';
      span.textContent = 'A Give A Bit project · giveabit.io';
      p.appendChild(span);
    }
  });

  feat(315, 'Parent logo in press kit', () => {
    window.downloadPressKit = function () {
      const kit = `SHERPACARTA PRESS KIT\n\nParent company: giveaBit.io (https://giveabit.io)\nParent logo: https://sherpacarta.org/giveabit-parent-logo.jpg\nMovement logo: https://sherpacarta.org/giveabit-logo.png\n\nBoilerplate:\nSherpaCarta is a global civic movement publishing a living charter of digital human rights. 114 articles. CC0. Bitcoin-funded. Zero tracking.\n\nSite: https://sherpacarta.org\nEmail: hello@giveabit.io (subject: Sherpacarta)\nBitcoin: ${window.SHERPA_WALLETS?.btc || ''}\nX: @give_bit\nNostr NIP-05: kimi@giveabit.io\nGitHub: https://github.com/kitsboy/sherpacarta\n\nKey facts: 114 articles, 811 years of rights tradition, Canada/BC Challenge launch market.`;
      const blob = new Blob([kit], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'SherpaCarta-Press-Kit.txt';
      a.click();
      toast('Press kit downloaded (includes parent branding)', 'success');
    };
  });

  feat(316, 'Parent link in ⌘K', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Contact', icon: 'fa-bitcoin fab', label: 'Visit Give A Bit', sub: 'giveabit.io parent', action: () => window.open('https://giveabit.io', '_blank', 'noopener') }
    );
  });

  feat(317, 'Dual brand tooltip', () => {
    document.querySelectorAll('.giveabit-brand-logo').forEach((img) => {
      img.title = 'Give A Bit movement logo';
    });
    document.querySelectorAll('.giveabit-footer-parent img').forEach((img) => {
      img.title = 'giveaBit.io — parent company';
    });
  });

  feat(318, 'Wave opacity preference', () => {
    SC4.setWaveOpacity = (pct) => {
      const v = Math.min(1, Math.max(0, pct / 100));
      $('wave-bg') && ($('wave-bg').style.opacity = String(v));
      localStorage.setItem('sc_wave_opacity', String(v));
    };
    const saved = localStorage.getItem('sc_wave_opacity');
    if (saved) $('wave-bg') && ($('wave-bg').style.opacity = saved);
  });

  feat(319, 'Hero wave synergy boost', () => {
    const hero = $('hero');
    if (hero && $('wave-bg')) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !document.body.classList.contains('waves-off')) {
            $('wave-bg').style.opacity = localStorage.getItem('sc_wave_opacity') || '0.42';
          } else {
            $('wave-bg').style.opacity = localStorage.getItem('sc_wave_opacity') || '0.36';
          }
        });
      }, { threshold: 0.2 });
      obs.observe(hero);
    }
  });

  feat(320, 'Footer parent logo lazy high priority', () => {
    document.querySelectorAll('.giveabit-footer-parent img').forEach((img) => {
      img.loading = 'eager';
      img.fetchPriority = 'low';
    });
  });

  feat(321, 'Wave CSS print hide', () => {
    const s = document.createElement('style');
    s.textContent = '@media print{#wave-bg{display:none!important}}';
    document.head.appendChild(s);
  });

  feat(322, 'Local parent link clicks counter', () => {
    document.querySelectorAll('.giveabit-footer-parent').forEach((a) => {
      a.addEventListener('click', () => {
        const n = parseInt(localStorage.getItem('sc_giveabit_clicks') || '0', 10) + 1;
        localStorage.setItem('sc_giveabit_clicks', String(n));
      });
    });
  });

  feat(323, 'Brand assets manifest parent logo', () => {
    const orig = window.brandAssets;
    window.brandAssets = function () {
      const manifest = {
        movementLogo: '/giveabit-logo.png',
        parentLogo: '/giveabit-parent-logo.jpg',
        parentUrl: 'https://giveabit.io',
        og: '/og-image.png',
        favicon: '/favicon.svg',
        site: 'https://sherpacarta.org',
        colors: { primary: '#10b981', parent: '#FF8C00', bg: '#060a06' },
      };
      navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
      toast('Brand manifest copied (movement + parent)', 'success');
    };
  });

  feat(324, 'Merge SC4 into SC global', () => {
    window.SC = window.SC || {};
    SC.FEATURES_V4 = FEATURES;
    SC.BUILD = BUILD;
    SC.totalFeatures = 325;
    SC.toggleWaves = SC4.toggleWaves;
    const origShow = SC.showFeatures;
    SC.showFeatures = function () {
      if (origShow) origShow();
      const grid = $('features-modal')?.querySelector('.features-grid');
      if (grid && !grid.dataset.v4merged) {
        const extra = FEATURES.map((f) => `<div class="feat-item"><span>${f.id}</span> ${f.name}</div>`).join('');
        grid.insertAdjacentHTML('beforeend', extra);
        grid.dataset.v4merged = '1';
        const h = $('features-modal')?.querySelector('h2');
        if (h) h.textContent = '325 Features';
        const p = $('features-modal')?.querySelector('p');
        if (p) p.textContent = 'BUILD ' + BUILD;
      }
    };
    SC3.featRanges = SC3.featRanges || [];
    if (!SC3.featRanges.find((r) => r.label === 'Visual 301–325')) {
      SC3.featRanges.push({ label: 'Visual 301–325', min: 301, max: 325 });
    }
    const bb = document.querySelector('.build-badge');
    if (bb) {
      bb.textContent = 'BUILD ' + BUILD;
      bb.title = '325 features — click for list · right-click for guide';
    }
  });

  feat(325, 'v4 init toast', () => {
    setTimeout(() => {
      if (!sessionStorage.getItem('sc_325_loaded')) {
        sessionStorage.setItem('sc_325_loaded', '1');
        toast('325 features — wave backdrop + giveaBit.io parent logo live', 'success');
      }
    }, 4500);
  });

  console.log(`SherpaCarta v3.1 — features 301–325 loaded (${FEATURES.length})`);
})();