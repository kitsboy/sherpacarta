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

  function closeSignReview(review) {
    if (!review) return;
    review.hidden = true;
    review.setAttribute('aria-hidden', 'true');
    review.classList.remove('open');
    document.body.classList.remove('sign-review-open');
    document.body.style.overflow = '';
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
    const name = ($('sign-name')?.value || '').trim();
    const country = ($('sign-country')?.value || '').trim();
    if (!name) { window.toast?.('Please enter your name or pseudonym', 'error'); $('sign-name')?.focus(); return; }
    if ($('review-name')) $('review-name').textContent = name;
    if ($('review-country')) $('review-country').textContent = country || 'Not provided';
    if ($('sign-review')) { $('sign-review').hidden = false; $('sign-review').removeAttribute('aria-hidden'); $('sign-review').classList.add('open'); document.body.classList.add('sign-review-open'); }
    $('sign-review')?.querySelector('button')?.focus();
  };
  window.cancelSignReview = function cancelSignReview(event) {
    event?.preventDefault();
    event?.stopImmediatePropagation?.();
    event?.stopPropagation();
    const review = $('sign-review');
    closeSignReview(review);
    $('sign-submit')?.focus({ preventScroll: true });
  };
  window.confirmSignCharter = function confirmSignCharter() {
    closeSignReview($('sign-review'));
    const original = window.signCharter;
    if (typeof original === 'function') original();
  };
  window.resetSignDraft = function resetSignDraft() {
    $('sign-name') && ($('sign-name').value = '');
    $('sign-country') && ($('sign-country').value = '');
    localStorage.removeItem('sc_sign_draft');
    document.querySelector('.sign-draft-note')?.remove();
    window.toast?.('Local sign draft cleared. Nothing was submitted.', 'info');
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
