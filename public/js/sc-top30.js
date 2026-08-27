(() => {
  'use strict';

  const storageKey = 'sc_sign_draft';
  const name = document.getElementById('sign-name');
  const country = document.getElementById('sign-country');
  const submit = document.querySelector('#sign .sign-submit');

  if (name && country) {
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch (_) { return null; }
    })();
    if (saved && !name.value && !country.value) {
      name.value = saved.name || '';
      country.value = saved.country || '';
      const note = document.createElement('p');
      note.className = 'sign-draft-note';
      note.setAttribute('role', 'status');
      note.textContent = 'Your unfinished form was restored on this device. Nothing was sent.';
      submit?.before(note);
    }
    const save = () => {
      if (!name.value && !country.value) return localStorage.removeItem(storageKey);
      try { localStorage.setItem(storageKey, JSON.stringify({ name: name.value.slice(0, 40), country: country.value.slice(0, 30) })); } catch (_) {}
    };
    name.addEventListener('input', save);
    country.addEventListener('input', save);
    submit?.addEventListener('click', () => {
      setTimeout(() => { if (!name.value && !country.value) localStorage.removeItem(storageKey); }, 0);
    });
  }

  const articleMain = document.getElementById('articles-main');
  const articleTabs = () => [...document.querySelectorAll('.article-tab')];
  if (articleMain) {
    document.addEventListener('keydown', (event) => {
      if (event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
      const tabs = articleTabs();
      const current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true' || tab.classList.contains('active'));
      if (event.key === 'ArrowRight' && current >= 0 && current < tabs.length - 1) { event.preventDefault(); tabs[current + 1].click(); tabs[current + 1].focus(); }
      if (event.key === 'ArrowLeft' && current > 0) { event.preventDefault(); tabs[current - 1].click(); tabs[current - 1].focus(); }
    });
  }

  window.exportProofReceipt = function exportProofReceipt(proof = {}) {
    const receipt = {
      service: 'Satohash',
      product: 'sherpacarta',
      hashAlgorithm: 'SHA-256',
      hash: proof.hash || window.state?.charterHash || null,
      stampId: proof.id || null,
      status: proof.status || 'unknown',
      confirmed: proof.confirmed === true,
      verifyUrl: proof.verifyUrl || null,
      exportedAt: new Date().toISOString(),
      note: 'Pending is not Bitcoin-confirmed. A timestamp proves document integrity/time evidence, not legal validity.'
    };
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sherpacarta-proof-receipt.json';
    link.click();
    URL.revokeObjectURL(link.href);
    if (typeof window.toast === 'function') window.toast('Proof receipt exported', 'success');
  };
})();
