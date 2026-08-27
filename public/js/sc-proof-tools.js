(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const hashPattern = /^[a-f0-9]{64}$/;

  function renderReceiptResult(result) {
    const out = $('receipt-import-result');
    if (!out) return;
    out.className = `verify-result ${result.valid ? 'ok' : 'bad'}`;
    out.textContent = result.message;
  }

  window.SCProof = {
    async currentHash() {
      const response = await fetch('/api/v1/hash.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Hash record unavailable (${response.status})`);
      const data = await response.json();
      return hashPattern.test(data.hash || '') ? data.hash : null;
    },
    inspectReceipt(receipt, currentHash) {
      const validShape = receipt && receipt.product === 'sherpacarta' && receipt.hashAlgorithm === 'SHA-256' && hashPattern.test(receipt.hash || '');
      if (!validShape) return { valid: false, message: 'This is not a valid SherpaCarta receipt.' };
      if (currentHash && receipt.hash !== currentHash) return { valid: false, message: 'Receipt is validly shaped, but its hash does not match the current release.' };
      return { valid: true, message: currentHash ? 'Receipt matches the current release hash. Confirm live Satohash status separately.' : 'Receipt is validly shaped. Current release hash was unavailable; confirm manually.' };
    },
    exportRedacted(receipt) {
      const safe = { service: receipt.service || 'Satohash', product: receipt.product, hashAlgorithm: receipt.hashAlgorithm, hash: receipt.hash, stampId: receipt.stampId || null, status: receipt.status || 'unknown', confirmed: receipt.confirmed === true, verifyUrl: receipt.verifyUrl || null, exportedAt: new Date().toISOString(), note: 'Redacted export: no signer name, email, private key, or local-only fields.' };
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([JSON.stringify(safe, null, 2)], { type: 'application/json' }));
      link.download = 'sherpacarta-proof-receipt-redacted.json'; link.click(); URL.revokeObjectURL(link.href);
    }
  };

  const fileInput = $('receipt-file');
  if (fileInput) fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file || typeof window.importProofReceipt !== 'function') return;
    window.importProofReceipt(file, async ({ valid, receipt, message }) => {
      if (!valid) return renderReceiptResult({ valid: false, message });
      try {
        const current = await window.SCProof.currentHash();
        const inspected = window.SCProof.inspectReceipt(receipt, current);
        renderReceiptResult(inspected);
        if (inspected.valid) {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'btn btn-ghost'; button.textContent = 'Export redacted receipt'; button.onclick = () => window.SCProof.exportRedacted(receipt); $('receipt-import-result').appendChild(document.createElement('br')); $('receipt-import-result').appendChild(button);
        }
      } catch (_) { renderReceiptResult({ valid: true, message: `${message} Current release hash unavailable; confirm manually.` }); }
    });
  });
})();
