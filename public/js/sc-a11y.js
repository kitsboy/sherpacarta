/**
 * SherpaCarta a11y — modal focus trap + system cursor on touch/coarse pointers
 */
(function SCA11yModule() {
  'use strict';

  const FOCUSABLE =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function getFocusable(root) {
    return [...root.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null && !el.getAttribute('aria-hidden')
    );
  }

  function trap(container, opts = {}) {
    const root = typeof container === 'string' ? document.querySelector(container) : container;
    if (!root) return () => {};
    const prev = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        opts.onEscape?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = getFocusable(root);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const initial = opts.initialFocus
      ? root.querySelector(opts.initialFocus) || getFocusable(root)[0]
      : getFocusable(root)[0];
    initial?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      if (opts.returnFocus !== false && prev?.focus) prev.focus();
    };
  }

  function shouldUseSystemCursor() {
    if (localStorage.getItem('sc_no_cursor') === '1') return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (window.matchMedia('(pointer: coarse)').matches) return true;
    if (navigator.maxTouchPoints > 0 && window.innerWidth < 1024) return true;
    return false;
  }

  function applyCursorPolicy() {
    const useSystem = shouldUseSystemCursor();
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (useSystem) {
      document.body.classList.add('no-custom-cursor');
      document.body.style.cursor = 'auto';
      if (cursor) cursor.style.display = 'none';
      if (ring) ring.style.display = 'none';
    }
  }

  function wireModal(id, panelSel, onOpen, onClose) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    let untrap = null;
    const obs = new MutationObserver(() => {
      const open = overlay.classList.contains('open');
      if (open && !untrap) {
        const panel = overlay.querySelector(panelSel) || overlay;
        untrap = trap(panel, { onEscape: onClose });
        onOpen?.();
      } else if (!open && untrap) {
        untrap();
        untrap = null;
        onClose?.();
      }
    });
    obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
  }

  const SCA11y = {
    trap,
    shouldUseSystemCursor,
    applyCursorPolicy,
    init() {
      applyCursorPolicy();
      window.matchMedia('(pointer: coarse)').addEventListener?.('change', applyCursorPolicy);
      wireModal('charter-modal', '.modal-inner', null, () => {
        document.body.style.overflow = '';
      });
      wireModal('cmd-overlay', '.cmd-box', null, null);
      wireModal('qr-modal', '.qr-box', null, () => {
        document.body.style.overflow = '';
      });
    },
  };

  window.SCA11y = SCA11y;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SCA11y.init());
  } else {
    SCA11y.init();
  }
})();