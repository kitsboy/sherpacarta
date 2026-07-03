/**
 * SherpaCarta Enhancements v3.3 — Features 376–405
 * UI dock fixes + 30 enhancements
 */
(function SCEnhancementsV6() {
  'use strict';
  const BUILD = '20260703-405';
  const FEATURES = [];
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  function feat(id, name, fn) {
    FEATURES.push({ id, name });
    try { fn(); } catch (e) { console.warn(`Feature ${id}:`, e); }
  }

  window.SC6 = window.SC6 || {};

  // ═══ GROUP 16: UI Dock Fixes (376–390) ═══════════════════

  feat(376, 'Left UI dock — pin a11y + BC tab', () => {
    let dock = $('left-ui-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'left-ui-dock';
      dock.setAttribute('aria-label', 'Accessibility and quick links');
      document.body.appendChild(dock);
    }
    const bc = document.querySelector('.sticky-bc-cta');
    const a11y = $('a11y-toolbar');
    if (bc && bc.parentElement !== dock) dock.appendChild(bc);
    if (a11y && a11y.parentElement !== dock) dock.appendChild(a11y);
  });

  feat(377, 'Status dock — BUILD + Online visible', () => {
    let dock = $('status-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'status-dock';
      dock.setAttribute('aria-label', 'Build and connection status');
      document.body.appendChild(dock);
    }
    const bb = document.querySelector('.build-badge');
    const net = $('net-badge');
    if (bb) {
      if (bb.parentElement === $('main-nav')) bb.remove();
      if (bb.parentElement !== dock) dock.appendChild(bb);
    }
    if (net && net.parentElement !== dock) dock.appendChild(net);
  });

  feat(378, 'Remove BUILD from nav containing block', () => {
    $('main-nav')?.querySelectorAll('.build-badge').forEach((el) => {
      $('status-dock')?.appendChild(el);
    });
  });

  feat(379, 'BC tab above a11y — no overlap', () => {
    const dock = $('left-ui-dock');
    const bc = document.querySelector('.sticky-bc-cta');
    const a11y = $('a11y-toolbar');
    if (dock && bc && a11y) {
      dock.insertBefore(bc, a11y);
    }
  });

  feat(380, 'Dock scroll containment', () => {
    const dock = $('left-ui-dock');
    if (dock) dock.style.overscrollBehavior = 'contain';
  });

  feat(381, 'Status dock click-through fix', () => {
    document.querySelectorAll('#status-dock .build-badge, #status-dock .net-badge').forEach((el) => {
      el.style.pointerEvents = 'auto';
      el.style.zIndex = '461';
    });
  });

  feat(382, 'A11y dock collapse toggle', () => {
    SC6.toggleA11yDock = () => {
      const a11y = $('a11y-toolbar');
      if (!a11y) return;
      a11y.classList.toggle('collapsed');
      const collapsed = a11y.classList.contains('collapsed');
      a11y.style.display = collapsed ? 'none' : 'flex';
      localStorage.setItem('sc_a11y_collapsed', collapsed ? '1' : '0');
      toast(collapsed ? 'A11y toolbar hidden' : 'A11y toolbar shown', 'info');
    };
    if (localStorage.getItem('sc_a11y_collapsed') === '1') {
      const a11y = $('a11y-toolbar');
      if (a11y) { a11y.style.display = 'none'; a11y.classList.add('collapsed'); }
    }
    const bc = document.querySelector('.sticky-bc-cta');
    if (bc && !$('a11y-toggle-chip')) {
      const chip = document.createElement('button');
      chip.id = 'a11y-toggle-chip';
      chip.type = 'button';
      chip.className = 'btn btn-ghost';
      chip.style.cssText = 'font-size:.55rem;padding:.2rem .4rem;margin-top:.15rem;width:40px';
      chip.title = 'Toggle accessibility toolbar';
      chip.innerHTML = '<i class="fas fa-universal-access"></i>';
      chip.onclick = () => SC6.toggleA11yDock();
      $('left-ui-dock')?.appendChild(chip);
    }
  });

  feat(383, 'BC tab reposition on resize', () => {
    const sync = () => {
      const dock = $('left-ui-dock');
      if (!dock) return;
      dock.style.top = `calc(var(--announce-h, 0px) + ${window.innerWidth < 768 ? 68 : 76}px)`;
    };
    sync();
    window.addEventListener('resize', sync);
  });

  feat(384, 'Status dock above float-assert', () => {
    const s = document.createElement('style');
    s.textContent = '#status-dock{z-index:460}#float-assert{z-index:400;bottom:calc(4.5rem + env(safe-area-inset-bottom,0))}#back-top{z-index:401}';
    document.head.appendChild(s);
  });

  feat(385, 'Net badge brighter online state', () => {
    const net = $('net-badge');
    if (net && navigator.onLine) {
      net.style.color = 'var(--em)';
      net.style.borderColor = 'var(--em)';
    }
  });

  feat(386, 'BUILD badge brighter + clickable', () => {
    const bb = document.querySelector('.build-badge');
    if (bb) {
      bb.style.opacity = '1';
      bb.style.color = 'var(--text2)';
      if (!bb.onclick) bb.onclick = () => window.SC?.showFeatures?.();
    }
  });

  feat(387, 'Dock hides in zen mode', () => {
    const s = document.createElement('style');
    s.textContent = 'body.zen-mode #left-ui-dock{display:none!important}body.zen-mode #status-dock{opacity:.5}';
    document.head.appendChild(s);
  });

  feat(388, 'Screenshot mode dock rules', () => {
    const s = document.createElement('style');
    s.textContent = 'body.screenshot-mode #left-ui-dock,body.screenshot-mode #status-dock{display:none!important}';
    document.head.appendChild(s);
  });

  feat(389, '⌘K dock commands', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push(
      { group: 'Personalize', icon: 'fa-universal-access', label: 'Toggle A11y Toolbar', sub: 'Show/hide left dock', action: () => SC6.toggleA11yDock?.() },
      { group: 'Navigate', icon: 'fa-maple-leaf', label: 'BC Challenge', sub: 'Canada section', action: () => $('canada-bc')?.scrollIntoView({ behavior: 'smooth' }) }
    );
  });

  feat(390, 'Dock layout init guard', () => {
    setTimeout(() => {
      if (!$('left-ui-dock') || !$('status-dock')) console.warn('SherpaCarta: dock layout pending');
    }, 100);
  });

  // ═══ GROUP 17: Polish (391–405) ══════════════════════════

  feat(391, 'Section dots avoid left dock', () => {
    const s = document.createElement('style');
    s.textContent = '@media(min-width:769px){.section-dots{right:max(.6rem,env(safe-area-inset-right))}}@media(max-width:768px){.section-dots{right:calc(3.5rem + env(safe-area-inset-right,0))}}';
    document.head.appendChild(s);
  });

  feat(392, 'Footer clear status dock margin', () => {
    const s = document.createElement('style');
    s.textContent = 'footer{padding-bottom:1rem}@media(min-width:769px){body{padding-bottom:5rem}}';
    document.head.appendChild(s);
  });

  feat(393, 'Nav backdrop filter isolate fix', () => {
    const s = document.createElement('style');
    s.textContent = '#main-nav .build-badge{display:none!important}';
    document.head.appendChild(s);
  });

  feat(394, 'Touch devices show status dock', () => {
    const s = document.createElement('style');
    s.textContent = '@media(hover:none){#status-dock{opacity:1;background:rgba(11,17,11,.95)}.build-badge{font-size:.6rem}}';
    document.head.appendChild(s);
  });

  feat(395, 'Left dock keyboard focus trap skip', () => {
    $('left-ui-dock')?.querySelectorAll('button,a').forEach((el) => {
      el.tabIndex = 0;
    });
  });

  feat(396, 'BC tab aria label', () => {
    const bc = document.querySelector('.sticky-bc-cta');
    if (bc) bc.setAttribute('aria-label', 'Go to Canada and BC Challenge section');
  });

  feat(397, 'Status dock aria live', () => {
    $('status-dock')?.setAttribute('role', 'status');
  });

  feat(398, 'Prevent dock jump on scroll', () => {
    ['left-ui-dock', 'status-dock'].forEach((id) => {
      const el = $(id);
      if (el) {
        el.style.position = 'fixed';
        el.style.willChange = 'auto';
      }
    });
  });

  feat(399, 'SW cache v3.3', () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((r) => r.forEach((reg) => reg.update()));
  });

  feat(400, 'Charter modal clears dock overlap', () => {
    const orig = window.openCharterModal;
    window.openCharterModal = function () {
      if (orig) orig();
      $('left-ui-dock') && ($('left-ui-dock').style.opacity = '0.3');
      $('status-dock') && ($('status-dock').style.opacity = '0.3');
    };
    const origClose = window.closeCharterModal;
    window.closeCharterModal = function () {
      if (origClose) origClose();
      $('left-ui-dock')?.style.removeProperty('opacity');
      $('status-dock')?.style.removeProperty('opacity');
    };
  });

  feat(401, 'Double-tap status dock expand', () => {
    $('status-dock')?.addEventListener('dblclick', () => {
      window.SC?.showFeatures?.();
    });
  });

  feat(402, 'Usage guide dock section', () => {
    const orig = window.SC3?.showUsageGuide;
    if (orig) {
      window.SC3.showUsageGuide = function () {
        orig();
        const sec = $('usage-guide-modal')?.querySelector('.usage-sections');
        if (sec && !sec.querySelector('.dock-note')) {
          sec.insertAdjacentHTML('beforeend', '<section class="dock-note"><h3>📌 Pinned UI</h3><p style="font-size:.82rem;color:var(--text2)"><strong>Left dock:</strong> BC Challenge tab + accessibility tools (pinned, scrollable).<br><strong>Bottom-left:</strong> BUILD badge + Online status — always visible, clickable.</p></section>');
        }
      };
    }
  });

  feat(403, 'Feature range 376–405 tab', () => {
    if (SC3?.featRanges) {
      SC3.featRanges.push({ label: 'Dock 376–405', min: 376, max: 405 });
    }
  });

  feat(404, 'Merge SC6 global BUILD 405', () => {
    window.SC = window.SC || {};
    SC.FEATURES_V6 = FEATURES;
    SC.BUILD = BUILD;
    SC.totalFeatures = 405;
    SC.toggleA11yDock = SC6.toggleA11yDock;
    const origShow = SC.showFeatures;
    SC.showFeatures = function () {
      if (origShow) origShow();
      const grid = $('features-modal')?.querySelector('.features-grid');
      if (grid && !grid.dataset.v6merged) {
        grid.insertAdjacentHTML('beforeend', FEATURES.map((f) => `<div class="feat-item"><span>${f.id}</span> ${f.name}</div>`).join(''));
        grid.dataset.v6merged = '1';
        $('features-modal')?.querySelector('h2').textContent = '405 Features';
        $('features-modal')?.querySelector('p').textContent = 'BUILD ' + BUILD;
      }
    };
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
  });

  feat(405, 'v6 init toast', () => {
    setTimeout(() => {
      if (!sessionStorage.getItem('sc_405_loaded')) {
        sessionStorage.setItem('sc_405_loaded', '1');
        toast('405 features — UI docks pinned · BUILD + Online now visible', 'success');
      }
    }, 5200);
  });

  console.log(`SherpaCarta v3.3 — features 376–405 loaded (${FEATURES.length})`);
})();