/**
 * SherpaCarta Canada Petition Engine v2
 * Dual-track: campaign (local + optional API + Nostr) vs official (Parliament / paper)
 * Zero tracking · privacy-first
 */
(function SCPetitionCanada() {
  'use strict';

  const STORAGE_KEY = 'sc_petition_ca_v2';
  const STORAGE_KEY_LEGACY = 'sc_petition_ca_v1';
  const CAMPAIGN_ID = 'sherpacarta-canada-v1';
  const API_SIGN = '/api/canada/sign';
  const API_STATS = '/api/canada/stats';
  const PROVINCES = [
    { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' }, { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' }, { code: 'NS', name: 'Nova Scotia' },
    { code: 'NT', name: 'Northwest Territories' }, { code: 'NU', name: 'Nunavut' },
    { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' },
    { code: 'YT', name: 'Yukon' }, { code: 'ABROAD', name: 'Canadian citizen abroad' },
  ];

  window.SHERPA_PETITION = window.SHERPA_PETITION || {};
  SHERPA_PETITION.PROVINCES = PROVINCES;
  SHERPA_PETITION.CAMPAIGN_ID = CAMPAIGN_ID;

  function load() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const legacy = localStorage.getItem(STORAGE_KEY_LEGACY);
        if (legacy) {
          localStorage.setItem(STORAGE_KEY, legacy);
          raw = legacy;
        }
      }
      return JSON.parse(raw || '{}');
    } catch {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function initStore() {
    const d = load();
    if (!d.campaignId) {
      Object.assign(d, {
        campaignId: CAMPAIGN_ID,
        jurisdiction: { country: 'CA', countryName: 'Canada', province: null, provinceName: null },
        signatures: [],
        proofs: [],
        created: Date.now(),
      });
      save(d);
    }
    return d;
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function detectProvince() {
    const params = new URLSearchParams(location.search);
    if (params.get('province') === 'BC' || location.pathname.includes('/bc')) {
      return { province: 'BC', provinceName: 'British Columbia' };
    }
    return { province: null, provinceName: null };
  }

  function provinceMeta(code) {
    const p = PROVINCES.find((x) => x.code === code);
    if (!p) return { province: code || null, provinceName: null };
    return { province: p.code, provinceName: p.name };
  }

  SHERPA_PETITION.init = function () {
    const store = initStore();
    const prov = detectProvince();
    if (prov.province && !store.jurisdiction?.province) {
      store.jurisdiction = { country: 'CA', countryName: 'Canada', ...prov };
      save(store);
    }
    return store;
  };

  SHERPA_PETITION.getCampaign = async function () {
    if (SHERPA_PETITION._campaign) return SHERPA_PETITION._campaign;
    try {
      const d = await fetch('/data/campaign-canada.json').then((r) => r.json());
      SHERPA_PETITION._campaign = d;
      return d;
    } catch {
      return null;
    }
  };

  SHERPA_PETITION.getPetitionHash = async function (petitionText) {
    const text = petitionText
      || (await SHERPA_PETITION.getCampaign())?.prayers?.campaign
      || (await SHERPA_PETITION.getCampaign())?.petitionText
      || '';
    return sha256(`CA|${CAMPAIGN_ID}|${text}`);
  };

  SHERPA_PETITION.officialStatus = async function () {
    const c = await SHERPA_PETITION.getCampaign();
    const fed = c?.officialChannels?.federal || {};
    const live = fed.status === 'live' && fed.ePetitionId && fed.url && !fed.url.includes('Home/Index');
    return {
      live: !!live,
      ePetitionId: fed.ePetitionId,
      url: fed.url,
      status: fed.status || 'seeking_mp',
      threshold: fed.threshold || 500,
    };
  };

  /** Sync campaign receipt to privacy-first API (optional; fails soft) */
  SHERPA_PETITION.syncRemote = async function (sig) {
    try {
      const body = {
        campaignId: CAMPAIGN_ID,
        receiptHash: sig.receiptHash,
        method: (sig.methods || [])[0] || 'moral',
        methods: sig.methods || [],
        province: sig.province || null,
        attestation: true,
        displayName: sig.shareName ? sig.displayName : null,
        nostrEventId: sig.nostrEventId || null,
        ts: sig.ts,
      };
      const res = await fetch(API_SIGN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, status: res.status, error: err.error || res.statusText };
      }
      const data = await res.json();
      sig.remote = true;
      sig.remoteId = data.id;
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: e.message || 'network' };
    }
  };

  SHERPA_PETITION.fetchRemoteStats = async function () {
    try {
      const res = await fetch(API_STATS, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  /**
   * Primary campaign sign
   * @param {string} displayName
   * @param {{ province?: string, attestation?: boolean, petitionText?: string, shareName?: boolean }} opts
   */
  SHERPA_PETITION.signMoral = async function (displayName, opts = {}) {
    if (!opts.attestation) {
      throw new Error('Please confirm you are a Canadian citizen or resident of Canada.');
    }
    const store = initStore();
    const prov = opts.province ? provinceMeta(opts.province) : detectProvince();
    const name = (displayName || 'Canadian Citizen').replace(/[<>]/g, '').trim().slice(0, 40);
    if (!name) throw new Error('Please enter a name or pseudonym.');

    const petitionText = opts.petitionText || '';
    const petitionHash = await SHERPA_PETITION.getPetitionHash(petitionText);

    const commitment = JSON.stringify({
      campaign: CAMPAIGN_ID,
      track: 'campaign',
      country: 'CA',
      province: prov.province,
      name,
      attestation: true,
      ts: Date.now(),
      petitionHash,
    });
    const receiptHash = await sha256(commitment);

    if (store.signatures.some((s) => s.receiptHash === receiptHash || (s.displayName === name && s.province === prov.province))) {
      const existing = store.signatures.find((s) => s.displayName === name && s.province === prov.province) || store.signatures.find((s) => s.receiptHash === receiptHash);
      return { duplicate: true, signature: existing };
    }

    const sig = {
      id: receiptHash.slice(0, 16),
      receiptHash,
      displayName: name,
      shareName: !!opts.shareName,
      country: 'CA',
      countryName: 'Canada',
      province: prov.province,
      provinceName: prov.provinceName,
      attestation: true,
      track: 'campaign',
      legalNote: 'Campaign commitment only — not a Parliamentary e-petition signature',
      methods: ['moral', 'sha256-receipt'],
      petitionHash,
      ts: Date.now(),
    };

    store.signatures.push(sig);
    store.jurisdiction = { country: 'CA', countryName: 'Canada', ...prov };
    save(store);

    const remote = await SHERPA_PETITION.syncRemote(sig);
    sig.remoteSync = remote;
    // re-save with remote flags
    const idx = store.signatures.findIndex((s) => s.id === sig.id);
    if (idx >= 0) store.signatures[idx] = sig;
    save(store);

    return { duplicate: false, signature: sig, remote };
  };

  SHERPA_PETITION.signPasskey = async function (opts = {}) {
    if (!window.PublicKeyCredential) throw new Error('Passkeys not supported in this browser');
    if (!opts.attestation) throw new Error('Please confirm you are a Canadian citizen or resident.');
    const store = initStore();
    const prov = opts.province ? provinceMeta(opts.province) : detectProvince();
    const petitionHash = await SHERPA_PETITION.getPetitionHash();
    const challenge = new TextEncoder().encode(petitionHash);

    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'SherpaCarta Canada', id: location.hostname === 'localhost' ? 'localhost' : 'sherpacarta.org' },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: `ca-signer-${Date.now()}`,
          displayName: opts.displayName || 'Canadian Signer',
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        authenticatorSelection: { userVerification: 'preferred', residentKey: 'preferred' },
        timeout: 60000,
      },
    });

    const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
    const receiptHash = await sha256(`passkey|${credId}|${petitionHash}|${prov.province || ''}`);

    const sig = {
      id: receiptHash.slice(0, 16),
      receiptHash,
      displayName: opts.displayName || 'Passkey Signer',
      country: 'CA',
      countryName: 'Canada',
      province: prov.province,
      provinceName: prov.provinceName,
      attestation: true,
      track: 'campaign',
      legalNote: 'Campaign commitment only — not a Parliamentary e-petition signature',
      methods: ['passkey', 'sha256-receipt'],
      credentialId: credId.slice(0, 24) + '…',
      petitionHash,
      ts: Date.now(),
    };

    store.signatures.push(sig);
    save(store);
    const remote = await SHERPA_PETITION.syncRemote(sig);
    return { signature: sig, remote };
  };

  SHERPA_PETITION.signNostr = async function (displayName, opts = {}) {
    if (!window.nostr) throw new Error('Install a Nostr extension (Alby, nos2x, or Primal)');
    if (!opts.attestation) throw new Error('Please confirm you are a Canadian citizen or resident.');
    const pk = await window.nostr.getPublicKey();
    const petitionHash = await SHERPA_PETITION.getPetitionHash();
    const prov = opts.province ? provinceMeta(opts.province) : detectProvince();
    const content = `[SherpaCarta Canada Campaign]\n${displayName || 'Canadian Citizen'} · ${prov.provinceName || 'Canada'}\nTrack: campaign (not Parliamentary e-petition)\nPetition: ${petitionHash.slice(0, 16)}…\nhttps://sherpacarta.org/canada/`;
    const event = {
      kind: 1978,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['t', 'sherpacarta'],
        ['t', 'canada'],
        ['t', 'petition'],
        ['t', 'campaign'],
        ['petition', petitionHash],
        ['jurisdiction', 'CA'],
        ...(prov.province ? [['province', prov.province]] : []),
      ],
      content,
      pubkey: pk,
    };
    const signed = await window.nostr.signEvent(event);
    const relays = window.NOSTR_RELAYS || ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.snort.social'];
    relays.forEach((relay) => {
      try {
        const ws = new WebSocket(relay);
        ws.onopen = () => { ws.send(JSON.stringify(['EVENT', signed])); setTimeout(() => ws.close(), 1000); };
      } catch (_) { /* */ }
    });

    const receiptHash = await sha256(`nostr|${pk}|${petitionHash}|${prov.province || ''}`);
    const store = initStore();
    const sig = {
      id: receiptHash.slice(0, 16),
      receiptHash,
      displayName: displayName || 'Nostr Signer',
      country: 'CA',
      countryName: 'Canada',
      province: prov.province,
      provinceName: prov.provinceName,
      attestation: true,
      track: 'campaign',
      legalNote: 'Campaign commitment only — not a Parliamentary e-petition signature',
      methods: ['nostr', 'sha256-receipt'],
      nostrPubkey: pk,
      nostrEventId: signed.id,
      petitionHash,
      ts: Date.now(),
    };
    store.signatures.push(sig);
    if (window.state) { window.state.nostrPubkey = pk; localStorage.setItem('sc_nostr_pk', pk); }
    save(store);
    const remote = await SHERPA_PETITION.syncRemote(sig);
    return { signature: sig, remote };
  };

  SHERPA_PETITION.signEd25519 = async function (displayName, opts = {}) {
    if (!opts.attestation) throw new Error('Please confirm you are a Canadian citizen or resident.');
    const store = initStore();
    const prov = opts.province ? provinceMeta(opts.province) : detectProvince();
    // Ephemeral key: sign once in memory, never persist private key (XSS-safe)
    let publicKeyB64;
    try {
      const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
      const pub = await crypto.subtle.exportKey('raw', keyPair.publicKey);
      publicKeyB64 = btoa(String.fromCharCode(...new Uint8Array(pub)));
      const petitionHashEarly = await SHERPA_PETITION.getPetitionHash();
      const msg = `SherpaCarta-CA|${petitionHashEarly}|${(displayName || 'Signer').slice(0, 40)}|${prov.province || ''}`;
      await crypto.subtle.sign('Ed25519', keyPair.privateKey, new TextEncoder().encode(msg));
      // privateKey falls out of scope — never written to storage
    } catch {
      throw new Error('Ed25519 not supported in this browser — try Passkey or moral sign');
    }
    // Purge any legacy private keys from older app versions
    if (store.ed25519Key) {
      delete store.ed25519Key;
    }
    const petitionHash = await SHERPA_PETITION.getPetitionHash();
    const receiptHash = await sha256(`ed25519|${publicKeyB64}|${petitionHash}|${prov.province || ''}`);

    if (store.signatures.some((s) => s.receiptHash === receiptHash || (s.methods || []).includes('ed25519'))) {
      const existing = store.signatures.find((s) => s.receiptHash === receiptHash)
        || store.signatures.find((s) => (s.methods || []).includes('ed25519'));
      return { duplicate: true, signature: existing };
    }

    const sig = {
      id: receiptHash.slice(0, 16),
      receiptHash,
      displayName: (displayName || 'Ed25519 Signer').replace(/[<>]/g, '').slice(0, 40),
      country: 'CA',
      countryName: 'Canada',
      province: prov.province,
      provinceName: prov.provinceName,
      attestation: true,
      track: 'campaign',
      legalNote: 'Campaign commitment only — not a Parliamentary e-petition signature',
      methods: ['ed25519', 'sha256-receipt'],
      publicKey: publicKeyB64.slice(0, 24) + '…',
      petitionHash,
      ts: Date.now(),
    };
    store.signatures.push(sig);
    save(store);
    const remote = await SHERPA_PETITION.syncRemote(sig);
    return { signature: sig, remote };
  };

  SHERPA_PETITION.computeMerkleRoot = async function () {
    const store = initStore();
    const hashes = store.signatures.map((s) => s.receiptHash).sort();
    if (!hashes.length) return null;
    let layer = hashes;
    while (layer.length > 1) {
      const next = [];
      for (let i = 0; i < layer.length; i += 2) {
        const left = layer[i];
        const right = layer[i + 1] || left;
        next.push(await sha256(left + right));
      }
      layer = next;
    }
    store.merkleRoot = layer[0];
    store.merkleCount = hashes.length;
    store.merkleUpdated = Date.now();
    save(store);
    return layer[0];
  };

  SHERPA_PETITION.stampOnSatohash = async function () {
    const root = await SHERPA_PETITION.computeMerkleRoot();
    const petitionHash = await SHERPA_PETITION.getPetitionHash();
    const hash = root || petitionHash;
    const url = `https://satohash.giveabit.io?ref=sherpacarta-canada&hash=${hash}&campaign=${CAMPAIGN_ID}`;
    window.open(url, '_blank', 'noopener');
    return { hash, url };
  };

  SHERPA_PETITION.getStats = function () {
    const store = initStore();
    return {
      total: store.signatures?.length || 0,
      country: 'Canada',
      province: store.jurisdiction?.province || 'all',
      merkleRoot: store.merkleRoot || null,
      methods: [...new Set((store.signatures || []).flatMap((s) => s.methods || []))],
      track: 'campaign',
    };
  };

  SHERPA_PETITION.getReceiptUrl = function (sig) {
    return `https://sherpacarta.org/canada/sign?receipt=${sig.id}`;
  };

  SHERPA_PETITION.shareText = function (sig) {
    const prov = sig?.provinceName || (sig?.province ? sig.province : 'Canada');
    return `I signed the SherpaCarta Canada campaign (${prov}) — 114 articles for digital human rights. Campaign commitment + cryptographic receipt. Privacy is a birthright. #CanadaBCChallenge #SherpaCarta https://sherpacarta.org/canada/`;
  };

  SHERPA_PETITION.downloadReceipt = function (sig) {
    const blob = new Blob([JSON.stringify(sig, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sherpacarta-canada-receipt-${sig.id}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  SHERPA_PETITION.wrapSignCharter = function () {
    // Do not auto-attest citizenship or auto-sync Canada campaign from home sign.
    // Home charter sign stays local; Canada campaign uses /canada/sign with explicit attestation.
    return;
  };

  // Init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SHERPA_PETITION.init());
  } else {
    SHERPA_PETITION.init();
  }
})();
