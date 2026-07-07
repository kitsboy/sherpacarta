/**
 * SherpaCarta Sprint 7 — Trust & Transparency (608–627)
 */
(function SCUpgradesB10() {
  'use strict';
  const BUILD = '20260707-627';
  const BTC = 'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b10 = { BUILD, items: [] };
  window.SHERPA_TREASURY = window.SHERPA_TREASURY || { address: BTC, txs: null, balance: null };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b10.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B10 #${id}:`, e); }
  }

  async function fetchMempool() {
    const res = await fetch(`https://mempool.space/api/address/${BTC}`);
    if (!res.ok) throw new Error('mempool fetch failed');
    const data = await res.json();
    const funded = data.chain_stats?.funded_txo_sum || 0;
    const spent = data.chain_stats?.spent_txo_sum || 0;
    const balance = (funded - spent) / 1e8;
    const txs = (data.chain_stats?.tx_count || 0) + (data.mempool_stats?.tx_count || 0);
    SHERPA_TREASURY.balance = balance;
    SHERPA_TREASURY.txs = txs;
    SHERPA_TREASURY.updated = new Date().toISOString();
    return { balance, txs };
  }

  feat(608, 'Treasury dashboard page link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML(
      'beforeend',
      '<a href="/treasury.html">Treasury</a>'
    );
  });

  feat(609, 'Live mempool treasury fetch', () => {
    fetchMempool().catch(() => {});
  });

  feat(610, 'Treasury widget on donate section', () => {
    const donate = document.getElementById('donate');
    if (!donate || document.getElementById('sc-treasury-widget')) return;
    const w = document.createElement('div');
    w.id = 'sc-treasury-widget';
    w.className = 'treasury-widget';
    w.innerHTML = `
      <style>
        .treasury-widget{margin-top:1.5rem;padding:1rem 1.25rem;border:1px solid var(--border);border-radius:12px;background:var(--bg2);font-family:var(--mono);font-size:.75rem}
        .treasury-widget h4{font-family:var(--sans);font-size:.85rem;color:var(--em2);margin:0 0 .75rem}
        .treasury-stat{display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid var(--border)}
        .treasury-stat:last-child{border:none}
        .treasury-stat span:last-child{color:var(--em)}
      </style>
      <h4><i class="fas fa-scale-balanced"></i> Live Treasury (on-chain)</h4>
      <div class="treasury-stat"><span>Balance</span><span id="sc-treasury-bal">Loading…</span></div>
      <div class="treasury-stat"><span>Transactions</span><span id="sc-treasury-txs">—</span></div>
      <div class="treasury-stat"><span>Address</span><span style="font-size:.6rem;word-break:break-all">${BTC.slice(0, 12)}…</span></div>
      <a href="/treasury.html" style="display:block;margin-top:.75rem;color:var(--em2);font-size:.7rem">Full treasury dashboard →</a>`;
    donate.appendChild(w);
    fetchMempool().then(({ balance, txs }) => {
      const bal = document.getElementById('sc-treasury-bal');
      const tx = document.getElementById('sc-treasury-txs');
      if (bal) bal.textContent = balance.toFixed(8) + ' BTC';
      if (tx) tx.textContent = String(txs);
    }).catch(() => {
      const bal = document.getElementById('sc-treasury-bal');
      if (bal) bal.textContent = 'View on mempool →';
    });
  });

  feat(611, 'Treasury tx count API', () => {
    window.getTreasuryStats = () => ({ ...SHERPA_TREASURY });
  });

  feat(612, 'Balance display in status dock', () => {
    fetchMempool().then(({ balance }) => {
      const dock = document.querySelector('.status-dock');
      if (!dock || dock.querySelector('.treasury-pill')) return;
      const p = document.createElement('span');
      p.className = 'treasury-pill';
      p.title = 'On-chain treasury balance';
      p.style.cssText = 'font-size:.55rem;opacity:.7;margin-left:.5rem';
      p.textContent = `₿ ${balance.toFixed(4)}`;
      dock.appendChild(p);
    }).catch(() => {});
  });

  feat(613, 'Recent txs on treasury page hook', () => {
    window.SHERPA_TREASURY.fetchTxs = async () => {
      const res = await fetch(`https://mempool.space/api/address/${BTC}/txs`);
      if (!res.ok) return [];
      return res.json();
    };
  });

  feat(614, 'Bug bounty security page link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML(
      'beforeend',
      '<a href="/security.html">Bug Bounty</a>'
    );
  });

  feat(615, 'Bug bounty scope CMD', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push({
      group: 'Trust',
      icon: 'fa-shield-halved',
      label: 'Bug Bounty Program',
      sub: 'Responsible disclosure — security.html',
      action: () => { window.location.href = '/security.html'; },
    });
  });

  feat(616, 'Reward tiers metadata', () => {
    window.SHERPA_BOUNTY = {
      contact: 'hello@giveabit.io',
      pgp: null,
      tiers: [
        { severity: 'Critical', reward: 'Recognition + priority fix + public thanks' },
        { severity: 'High', reward: 'Recognition + public thanks' },
        { severity: 'Medium', reward: 'Public thanks in security hall of fame' },
        { severity: 'Low', reward: 'Acknowledgment' },
      ],
      scope: ['sherpacarta.org', 'github.com/kitsboy/sherpacarta', 'Public API /api/v1/*'],
      outOfScope: ['Third-party CDNs', 'Social engineering', 'DDoS'],
    };
  });

  feat(617, 'Safe harbor policy', () => {
    window.SHERPA_BOUNTY = window.SHERPA_BOUNTY || {};
    SHERPA_BOUNTY.safeHarbor = 'Good-faith security research that follows our disclosure policy will not face legal action from Give A Bit.';
  });

  feat(618, 'security.txt policy URL', () => {
    window.SHERPA_SECURITY_TXT = {
      contact: 'mailto:hello@giveabit.io',
      expires: '2027-07-07T00:00:00.000Z',
      policy: 'https://sherpacarta.org/security.html',
      acknowledgments: 'https://sherpacarta.org/security.html#hall-of-fame',
    };
  });

  feat(619, 'Footer security link update', () => {
    document.querySelector('a[href="/.well-known/security.txt"]')?.setAttribute('href', '/security.html');
  });

  feat(620, 'CMD Open Treasury', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push({
      group: 'Trust',
      icon: 'fa-bitcoin-sign',
      label: 'Treasury Dashboard',
      sub: 'Live on-chain transparency',
      action: () => { window.location.href = '/treasury.html'; },
    });
  });

  feat(621, 'CMD Report vulnerability', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push({
      group: 'Trust',
      icon: 'fa-bug',
      label: 'Report Vulnerability',
      sub: 'hello@giveabit.io',
      action: () => { window.location.href = 'mailto:hello@giveabit.io?subject=SherpaCarta%20Security%20Report'; },
    });
  });

  feat(622, 'Treasury transparency JSON', () => {
    fetchMempool().then(({ balance, txs }) => {
      window.SHERPA_TREASURY.public = {
        address: BTC,
        balanceBtc: balance,
        txCount: txs,
        explorer: `https://mempool.space/address/${BTC}`,
        updated: new Date().toISOString(),
        note: 'Live data from mempool.space — not audited financial statement',
      };
    }).catch(() => {});
  });

  feat(623, 'Report page treasury embed link', () => {
    document.querySelector('a[href*="mempool.space"]')?.insertAdjacentHTML(
      'afterend',
      ' · <a href="/treasury.html">Live dashboard</a>'
    );
  });

  feat(624, 'Donate treasury dashboard CTA', () => {
    const link = document.querySelector('.treasury-link');
    if (link) link.insertAdjacentHTML('afterend', ' · <a href="/treasury.html" class="treasury-link">Dashboard</a>');
  });

  feat(625, 'Bug bounty hall of fame placeholder', () => {
    window.SHERPA_BOUNTY = window.SHERPA_BOUNTY || {};
    SHERPA_BOUNTY.hallOfFame = [];
  });

  feat(626, 'Responsible disclosure timeline', () => {
    window.SHERPA_BOUNTY = window.SHERPA_BOUNTY || {};
    SHERPA_BOUNTY.timeline = [
      'Report to hello@giveabit.io with reproduction steps',
      'Acknowledgment within 5 business days',
      'Fix timeline communicated based on severity',
      'Public disclosure coordinated with reporter',
    ];
  });

  feat(627, 'Sprint 7 BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 7;
    SC.UPGRADES_B10 = SHERPA_UPGRADES.b10.items;
    SC.totalFeatures = 627;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    setTimeout(() => toast('Sprint 7 trust & transparency live — BUILD 627', 'success'), 3400);
    console.log(`SherpaCarta Sprint 7 — BUILD ${BUILD}`);
  });
})();