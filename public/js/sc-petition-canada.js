/**
 * SherpaCarta Canada Petition Engine
 * Zero-server · localStorage · SHA-256 · Nostr · Passkey · Ed25519
 * All signatures default to jurisdiction: Canada (CA)
 */
(function SCPetitionCanada() {
  'use strict';

  const STORAGE_KEY = 'sc_petition_ca_v1';
  const CAMPAIGN_ID = 'sherpacarta-canada-v1';

  window.SHERPA_PETITION = window.SHERPA_PETITION || {};

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
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

  SHERPA_PETITION.init = function () {
    const store = initStore();
    const prov = detectProvince();
    store.jurisdiction = {
      country: 'CA',
      countryName: 'Canada',
      ...prov,
    };
    save(store);
    return store;
  };

  SHERPA_PETITION.getPetitionHash = async function (petitionText) {
    const text = petitionText || (await fetch('/data/campaign-canada.json').then((r) => r.json()).then((d) => d.petitionText).catch(() => ''));
    return sha256(`CA|${CAMPAIGN_ID}|${text}`);
  };

  SHERPA_PETITION.signMoral = async function (displayName, opts = {}) {
    const store = initStore();
    const prov = detectProvince();
    const name = (displayName || 'Canadian Citizen').trim().slice(0, 40);
    const petitionText = opts.petitionText || '';
    const petitionHash = await SHERPA_PETITION.getPetitionHash(petitionText);

    const commitment = JSON.stringify({
      campaign: CAMPAIGN_ID,
      country: 'CA',
      province: prov.province,
      name,
      ts: Date.now(),
      petitionHash,
    });
    const receiptHash = await sha256(commitment);

    const sig = {
      id: receiptHash.slice(0, 16),
      receiptHash,
      displayName: name,
      country: 'CA',
      countryName: 'Canada',
      province: prov.province,
      provinceName: prov.provinceName,
      methods: ['moral', 'sha256-receipt'],
      petitionHash,
      ts: Date.now(),
    };

    if (store.signatures.some((s) => s.receiptHash === receiptHash)) {
      return { duplicate: true, signature: sig };
    }

    store.signatures.push(sig);
    store.jurisdiction = { country: 'CA', countryName: 'Canada', ...prov };
    save(store);

    if (window.signCharter) {
      const countryInput = document.getElementById('sign-country');
      if (countryInput) countryInput.value = prov.province ? 'Canada, BC' : 'Canada';
      const nameInput = document.getElementById('sign-name');
      if (nameInput && !nameInput.value) nameInput.value = name;
    }

    return { duplicate: false, signature: sig };
  };

  SHERPA_PETITION.signPasskey = async function () {
    if (!window.PublicKeyCredential) throw new Error('Passkeys not supported in this browser');
    const store = initStore();
    const petitionHash = await SHERPA_PETITION.getPetitionHash();
    const challenge = new TextEncoder().encode(petitionHash);

    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'SherpaCarta Canada', id: location.hostname },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: `ca-signer-${Date.now()}`,
          displayName: 'Canadian Signer',
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        authenticatorSelection: { userVerification: 'preferred', residentKey: 'preferred' },
        timeout: 60000,
      },
    });

    const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
    const receiptHash = await sha256(`passkey|${credId}|${petitionHash}`);

    const sig = {
      id: receiptHash.slice(0, 16),
      receiptHash,
      displayName: 'Passkey Signer',
      country: 'CA',
      countryName: 'Canada',
      methods: ['passkey', 'sha256-receipt'],
      credentialId: credId.slice(0, 24) + '…',
      petitionHash,
      ts: Date.now(),
    };

    store.signatures.push(sig);
    save(store);
    return sig;
  };

  SHERPA_PETITION.signNostr = async function (displayName) {
    if (!window.nostr) throw new Error('Install Nostr extension (Alby, nos2x)');
    const pk = await window.nostr.getPublicKey();
    const petitionHash = await SHERPA_PETITION.getPetitionHash();
    const prov = detectProvince();
    const content = `[SherpaCarta Canada Petition]\n${displayName || 'Canadian Citizen'} · ${prov.province ? 'BC, ' : ''}Canada\nPetition: ${petitionHash.slice(0, 16)}…\nhttps://sherpacarta.org/canada/`;
    const event = {
      kind: 1978,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['t', 'sherpacarta'],
        ['t', 'canada'],
        ['t', 'petition'],
        ['petition', petitionHash],
        ['jurisdiction', 'CA'],
        ...(prov.province ? [['province', prov.province]] : []),
      ],
      content,
      pubkey: pk,
    };
    const signed = await window.nostr.signEvent(event);
    const relays = window.NOSTR_RELAYS || ['wss://relay.damus.io', 'wss://nos.lol'];
    relays.forEach((relay) => {
      try {
        const ws = new WebSocket(relay);
        ws.onopen = () => { ws.send(JSON.stringify(['EVENT', signed])); setTimeout(() => ws.close(), 800); };
      } catch (_) {}
    });

    const receiptHash = await sha256(`nostr|${pk}|${petitionHash}`);
    const store = initStore();
    const sig = {
      id: receiptHash.slice(0, 16),
      receiptHash,
      displayName: displayName || 'Nostr Signer',
      country: 'CA',
      countryName: 'Canada',
      province: prov.province,
      methods: ['nostr', 'sha256-receipt'],
      nostrPubkey: pk,
      nostrEventId: signed.id,
      petitionHash,
      ts: Date.now(),
    };
    store.signatures.push(sig);
    if (window.state) { window.state.nostrPubkey = pk; localStorage.setItem('sc_nostr_pk', pk); }
    save(store);
    return sig;
  };

  SHERPA_PETITION.signEd25519 = async function (displayName) {
    const store = initStore();
    let keyPair = store.ed25519Key;
    if (!keyPair) {
      keyPair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
      const pub = await crypto.subtle.exportKey('raw', keyPair.publicKey);
      const priv = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      store.ed25519Key = {
        publicKey: btoa(String.fromCharCode(...new Uint8Array(pub))),
        privateKey: btoa(String.fromCharCode(...new Uint8Array(priv))),
      };
      keyPair = store.ed25519Key;
    }
    const petitionHash = await SHERPA_PETITION.getPetitionHash();
    const msg = `SherpaCarta-CA|${petitionHash}|${displayName || 'Signer'}`;
    const privKey = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(store.ed25519Key.privateKey), (c) => c.charCodeAt(0)), { name: 'Ed25519' }, false, ['sign']);
    const sigBuf = await crypto.subtle.sign('Ed25519', privKey, new TextEncoder().encode(msg));
    const receiptHash = await sha256(`ed25519|${store.ed25519Key.publicKey}|${petitionHash}`);

    const sig = {
      id: receiptHash.slice(0, 16),
      receiptHash,
      displayName: displayName || 'Ed25519 Signer',
      country: 'CA',
      countryName: 'Canada',
      methods: ['ed25519', 'sha256-receipt'],
      publicKey: store.ed25519Key.publicKey.slice(0, 24) + '…',
      petitionHash,
      ts: Date.now(),
    };
    store.signatures.push(sig);
    save(store);
    return sig;
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
      methods: [...new Set((store.signatures || []).flatMap((s) => s.methods))],
    };
  };

  SHERPA_PETITION.getReceiptUrl = function (sig) {
    return `https://sherpacarta.org/canada/sign.html?receipt=${sig.id}`;
  };

  SHERPA_PETITION.shareText = function (sig) {
    const prov = sig?.province ? 'BC, ' : '';
    return `I signed SherpaCarta for ${prov}Canada — 114 articles for digital human rights. Privacy is a birthright. Proof: ${sig?.id || ''} #CanadaBCChallenge #SherpaCarta #DigitalRights https://sherpacarta.org/canada/`;
  };

  SHERPA_PETITION.wrapSignCharter = function () {
    const orig = window.signCharter;
    window.signCharter = async function () {
      const name = document.getElementById('sign-name')?.value?.trim();
      const countryEl = document.getElementById('sign-country');
      if (countryEl) {
        const prov = detectProvince();
        countryEl.value = prov.province ? 'Canada, BC' : 'Canada';
      }
      const result = await SHERPA_PETITION.signMoral(name);
      if (orig) orig();
      if (result.duplicate) {
        window.toast?.('You already signed this Canada petition on this device', 'info');
      } else {
        window.toast?.(`Signed as Canadian${result.signature.province ? ' (BC)' : ''} · Receipt ${result.signature.id}`, 'success');
      }
      return result;
    };
  };

  SHERPA_PETITION.init();
  SHERPA_PETITION.wrapSignCharter();
})();