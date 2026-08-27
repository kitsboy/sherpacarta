(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);

  function setOffline(offline) {
    const bar = $('offline-status');
    if (bar) bar.hidden = !offline;
  }
  setOffline(!navigator.onLine);
  window.addEventListener('online', () => setOffline(false));
  window.addEventListener('offline', () => setOffline(true));

  let reviewReturnFocus = null;
  let reviewCloseTimer = null;
  const SIGN_DRAFT_KEY = 'sc_sign_draft';
  const SIGN_UNDO_KEY = 'sc_last_signer_record';

  function signStatus(message, tone = '') {
    const status = $('sign-flow-status');
    if (status) { status.textContent = message; status.dataset.tone = tone; }
  }

  function normalizeName(value) { return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 40); }
  function normalizeCountry(value) { return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 30); }

  function updateSignForm() {
    const name = $('sign-name');
    const country = $('sign-country');
    const submit = $('sign-submit');
    if (!name || !submit) return;
    const normalizedName = normalizeName(name.value);
    const meaningful = normalizedName.length >= 2 && /[\p{L}\p{N}]/u.test(normalizedName);
    const valid = meaningful;
    submit.disabled = !valid;
    [['sign-name', 'sign-name-count'], ['sign-country', 'sign-country-count']].forEach(([input, counter]) => {
      const el = $(input); const out = $(counter);
      if (el && out) out.textContent = `${el.value.length} / ${el.maxLength}`;
    });
    name.setAttribute('aria-invalid', valid ? 'false' : 'true');
    const error = $('sign-name-error');
    if (error) error.textContent = name.value && !valid ? 'Enter at least two letters or numbers.' : '';
    try { localStorage.setItem(SIGN_DRAFT_KEY, JSON.stringify({ name: name.value, country: country?.value || '', savedAt: Date.now() })); } catch (_) { signStatus('Draft could not be saved on this device.', 'error'); }
  }

  function restoreSignDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(SIGN_DRAFT_KEY) || 'null');
      if (draft) { if ($('sign-name')) $('sign-name').value = draft.name || ''; if ($('sign-country')) $('sign-country').value = draft.country || ''; signStatus('Unsaved local draft restored.'); }
    } catch (_) {}
    updateSignForm();
  }

  function initSignFlow() {
    ['sign-name', 'sign-country'].forEach((id) => $(id)?.addEventListener('input', updateSignForm));
    $('sign-name')?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); if (!$('sign-submit').disabled) window.reviewSignCharter(); } });
    $('sign-country')?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); if (!$('sign-submit').disabled) window.reviewSignCharter(); } });
    restoreSignDraft();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSignFlow); else initSignFlow();

  function closeSignReview(review, restoreFocus = true) {
    if (!review) return;
    review.hidden = true;
    review.setAttribute('aria-hidden', 'true');
    review.classList.remove('open');
    document.body.classList.remove('sign-review-open');
    document.body.style.overflow = '';
    clearTimeout(reviewCloseTimer);
    if (restoreFocus) {
      const target = reviewReturnFocus || $('sign-submit');
      reviewReturnFocus = null;
      target?.focus({ preventScroll: true });
    }
  }

  function trapReviewFocus(event) {
    const review = $('sign-review');
    if (!review || review.hidden || !review.classList.contains('open') || event.key !== 'Tab') return;
    const focusable = [...review.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function onboarding() {
    if (localStorage.getItem('sc_start_seen')) return;
    const overlay = document.createElement('div');
    overlay.className = 'sign-review';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'start-dialog-title');
    overlay.innerHTML = '<div class="sign-review-card"><div class="section-label"><span>Start here</span></div><h3 id="start-dialog-title">Choose your next step</h3><p>SherpaCarta is a living civic charter. Read the source, make a local commitment, or verify what a Bitcoin timestamp actually proves.</p><div class="proof-actions"><a class="btn btn-primary" href="#articles">Read the charter</a><a class="btn btn-ghost" href="#sign">Sign locally</a><a class="btn btn-ghost" href="/verify.html">Verify a proof</a></div><button type="button" class="btn btn-ghost" id="start-dismiss">Skip for now</button></div>';
    document.body.appendChild(overlay);
    const close = () => { localStorage.setItem('sc_start_seen', '1'); overlay.remove(); };
    $('start-dismiss').addEventListener('click', close);
    overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  }
  if (location.pathname === '/' && !location.hash && !new URLSearchParams(location.search).has('help')) setTimeout(onboarding, 900);

  window.reviewSignCharter = function reviewSignCharter() {
    const name = normalizeName($('sign-name')?.value);
    const country = normalizeCountry($('sign-country')?.value);
    if (!name) { signStatus('Please enter your name or pseudonym.', 'error'); window.toast?.('Please enter your name or pseudonym', 'error'); $('sign-name')?.focus(); return; }
    if ($('review-name')) $('review-name').textContent = name;
    if ($('review-country')) $('review-country').textContent = country || 'Not provided';
    const review = $('sign-review');
    if (review) {
      reviewReturnFocus = document.activeElement;
      review.hidden = false;
      review.removeAttribute('aria-hidden');
      review.classList.add('open');
      document.body.classList.add('sign-review-open');
      review.querySelector('#sign-review-confirm')?.focus();
    }
  };
  window.cancelSignReview = function cancelSignReview(event) {
    event?.preventDefault();
    event?.stopImmediatePropagation?.();
    event?.stopPropagation();
    const review = $('sign-review');
    closeSignReview(review);
  };
  window.confirmSignCharter = function confirmSignCharter() {
    const confirm = $('sign-review-confirm');
    if (confirm) { confirm.disabled = true; confirm.setAttribute('aria-busy', 'true'); }
    closeSignReview($('sign-review'), false);
    const original = window.signCharter;
    if (typeof original === 'function') original();
    if (confirm) { confirm.disabled = false; confirm.removeAttribute('aria-busy'); }
    setTimeout(() => {
      if ($('sign-name')?.value === '' && $('sign-country')?.value === '') signStatus('Commitment saved locally on this device.', 'success');
    }, 0);
  };

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && $('sign-review')?.classList.contains('open')) {
      event.preventDefault();
      window.cancelSignReview(event);
    } else trapReviewFocus(event);
  }, true);

  document.addEventListener('click', (event) => {
    const review = $('sign-review');
    if (review?.classList.contains('open') && event.target === review) window.cancelSignReview(event);
  }, true);
  window.resetSignDraft = function resetSignDraft() {
    if (!($('sign-name')?.value || $('sign-country')?.value)) return;
    $('sign-name').value = '';
    $('sign-country').value = '';
    localStorage.removeItem(SIGN_DRAFT_KEY);
    document.querySelector('.sign-draft-note')?.remove();
    updateSignForm();
    signStatus('Draft cleared. Nothing was submitted.', 'info');
    window.toast?.('Local sign draft cleared. Nothing was submitted.', 'info');
    $('sign-name')?.focus({ preventScroll: true });
  };

  function addReceiptTools() {
    const tool = document.createElement('section');
    tool.className = 'verify-tool';
    tool.setAttribute('aria-labelledby', 'receipt-import-heading');
    tool.innerHTML = '<div class="verify-kicker">Receipt evidence</div><h2 id="receipt-import-heading" style="font-family:var(--serif);font-size:2rem;margin:.5rem 0">Inspect a proof receipt</h2><p style="color:var(--text2);font-size:.8rem;line-height:1.7">Import a JSON receipt you already have. It is checked locally for expected structure; confirm the live proof status at Satohash.</p><label for="receipt-file">Receipt JSON</label><input id="receipt-file" type="file" accept="application/json,.json"><div id="receipt-import-result" class="verify-result" role="status" aria-live="polite"></div>';
    document.querySelector('.verify-tool')?.after(tool);
    $('receipt-file').addEventListener('change', () => {
      const file = $('receipt-file').files?.[0];
      if (!file || typeof window.importProofReceipt !== 'function') return;
      window.importProofReceipt(file, ({ valid, message, receipt }) => {
        const out = $('receipt-import-result');
        out.className = `verify-result ${valid ? 'ok' : 'bad'}`;
        out.textContent = valid ? `${message} Hash: ${receipt.hash}` : message;
      });
    });
  }
  if (location.pathname.endsWith('/verify.html') || location.pathname === '/verify') setTimeout(addReceiptTools, 0);
})();
