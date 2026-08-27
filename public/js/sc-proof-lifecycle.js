(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const idInput = $('proof-id');
  const refresh = $('proof-refresh-btn');
  const output = $('proof-status');
  if (!idInput || !refresh || !output) return;

  const MAX_POLLS = 4;
  const DELAY_MS = 2500;
  const idPattern = /^[A-Za-z0-9_-]{8,128}$/;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const setState = (kind, text) => {
    output.className = `verify-result ${kind || ''}`;
    output.textContent = text;
  };

  function publicProofUrl(id) {
    return `https://api.satohash.io/api/stamps/${encodeURIComponent(id)}`;
  }

  function qrText(id, data) {
    const url = data?.verifyUrl || data?.proofUrl || `https://satohash.io/verify/${encodeURIComponent(id)}`;
    return `SherpaCarta proof\nStamp ID: ${id}\nStatus: ${String(data?.status || 'unknown').toUpperCase()}\nVerify: ${url}`;
  }

  function addActions(id, data) {
    const row = document.createElement('div');
    row.className = 'verify-tool-row';
    const copy = document.createElement('button');
    copy.type = 'button'; copy.className = 'btn btn-ghost'; copy.textContent = 'Copy proof details';
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(qrText(id, data)); copy.textContent = 'Copied'; }
      catch (_) { setState('bad', 'Copy was unavailable. Keep the public proof URL: ' + publicProofUrl(id)); }
    });
    const download = document.createElement('button');
    download.type = 'button'; download.className = 'btn btn-ghost'; download.textContent = 'Download QR text';
    download.addEventListener('click', () => {
      const blob = new Blob([qrText(id, data)], { type: 'text/plain;charset=utf-8' });
      const href = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = href; link.download = `sherpacarta-proof-${id}.txt`; link.click(); URL.revokeObjectURL(href);
    });
    row.append(copy, download); output.appendChild(row);
  }

  async function fetchStatus(id) {
    const response = await fetch(publicProofUrl(id), { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Satohash returned HTTP ${response.status}`);
    return response.json();
  }

  refresh.addEventListener('click', async () => {
    const id = idInput.value.trim();
    if (!idPattern.test(id)) { setState('bad', 'Enter a valid public stamp ID. Nothing was sent.'); idInput.focus(); return; }
    refresh.disabled = true; output.replaceChildren(); setState('', 'Checking public proof status…');
    try {
      let data;
      for (let attempt = 0; attempt < MAX_POLLS; attempt += 1) {
        data = await fetchStatus(id);
        const status = String(data.status || 'unknown').toLowerCase();
        if (status === 'confirmed' || status === 'failed' || status === 'expired') break;
        setState('', `Status: ${status.toUpperCase()} · refresh ${attempt + 1}/${MAX_POLLS}`);
        if (attempt < MAX_POLLS - 1) await sleep(DELAY_MS);
      }
      const status = String(data?.status || 'unknown').toLowerCase();
      const confirmed = status === 'confirmed';
      setState(confirmed ? 'ok' : status === 'failed' || status === 'expired' ? 'bad' : '', confirmed ? 'CONFIRMED · Bitcoin evidence is reported by Satohash.' : `STATUS: ${status.toUpperCase()} · This is not confirmation yet. Check again later or open Satohash directly.`);
      addActions(id, data);
    } catch (error) {
      setState('bad', `Could not retrieve public proof status. ${error.message} Retry later; nothing about your document was uploaded.`);
    } finally { refresh.disabled = false; }
  });
})();
