/**
 * SherpaCarta Sprint 4 — Canada & BC Legal (548–567)
 */
(function SCUpgradesB7() {
  'use strict';
  const BUILD = '20260704-567';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b7 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b7.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B7 #${id}:`, e); }
  }

  const MLA_TARGETS = [
    { name: 'BC MLA — Privacy portfolio', riding: 'TBD', status: 'research' },
    { name: 'BC MLA — Technology portfolio', riding: 'TBD', status: 'research' },
    { name: 'BC MLA — Civil liberties', riding: 'TBD', status: 'research' },
    { name: 'MP — Federal PIPEDA', riding: 'TBD', status: 'research' },
    { name: 'MP — Digital government', riding: 'TBD', status: 'research' },
  ];

  // 548 — MLA CRM tracker
  feat(548, 'MLA CRM tracker', () => {
    window.BC_CRM = {
      load: () => JSON.parse(localStorage.getItem('sc_bc_crm') || 'null') || MLA_TARGETS.map((m) => ({ ...m })),
      save: (data) => localStorage.setItem('sc_bc_crm', JSON.stringify(data)),
      update: (i, field, val) => {
        const d = window.BC_CRM.load();
        if (d[i]) { d[i][field] = val; window.BC_CRM.save(d); }
      },
    };
    const bc = $('canada-bc');
    if (!bc || $('bc-crm-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'bc-crm-panel';
    panel.style.cssText = 'margin-top:1.5rem;padding:1.25rem;background:var(--bg2);border:1px solid var(--border);border-radius:1rem';
    const render = () => {
      const data = window.BC_CRM.load();
      panel.innerHTML = `<div style="font-family:var(--mono);font-size:.58rem;color:var(--text3);letter-spacing:.12em;margin-bottom:.75rem">MLA / MP OUTREACH TRACKER (local)</div>
        <div style="display:grid;gap:.4rem">${data.map((m, i) => `
          <div style="display:grid;grid-template-columns:1fr 100px 90px;gap:.35rem;font-size:.72rem;align-items:center;padding:.4rem;background:var(--bg3);border-radius:.5rem">
            <span>${m.name}</span>
            <select onchange="BC_CRM.update(${i},'status',this.value)" style="font-size:.65rem;background:var(--bg2);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:.2rem">
              ${['research', 'emailed', 'meeting', 'champion', 'declined'].map((s) => `<option value="${s}" ${m.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <input value="${m.riding || ''}" placeholder="Riding" onchange="BC_CRM.update(${i},'riding',this.value)" style="font-size:.65rem;background:var(--bg2);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:.2rem">
          </div>`).join('')}</div>
        <p style="font-size:.6rem;color:var(--text3);margin-top:.5rem">Stored locally only — your outreach notes never leave your device.</p>`;
    };
    render();
    bc.querySelector('.section-max')?.appendChild(panel);
  });

  // 549 — Model bill export
  feat(549, 'Model bill text export', () => {
    window.downloadModelBill = () => {
      const bill = `BRITISH COLUMBIA DIGITAL RIGHTS ACT (MODEL)\nDrafted from SherpaCarta v2.0 — CC0\n\nPREAMBLE\nRecognizing that digital platforms exercise power exceeding many statutes, BC adopts the following principles.\n\nSECTION 1 — RIGHT TO PRIVACY (SherpaCarta Art. 11)\nNo person shall be subject to surveillance, profiling, or data collection without informed, specific, revocable consent.\n\nSECTION 2 — DATA SOVEREIGNTY (Art. 12)\nIndividuals retain ownership and portability rights over personal data held by any processor.\n\nSECTION 3 — SURVEILLANCE CAPITALISM PROHIBITION (Art. 13)\nSale or trade of behavioural data without explicit consent is prohibited.\n\nSECTION 4 — ALGORITHMIC TRANSPARENCY (Arts. 61–62)\nAny automated decision affecting legal rights requires plain-language explanation and appeal.\n\nSECTION 5 — LIVING REVIEW (Art. 114)\nAnnual review by a digital rights council; amendments may only expand protections.\n\n— Model language only. Not legal advice. sherpacarta.org/bc/model-bill.html`;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([bill], { type: 'text/plain' }));
      a.download = 'BC-Digital-Rights-Act-Model.txt';
      a.click();
      toast('Model bill downloaded — print to PDF for meetings', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-gavel', label: 'Download Model Bill', sub: 'BC Digital Rights Act', action: () => window.downloadModelBill() });
    }
  });

  // 550 — Parliamentary petition export
  feat(550, 'Parliamentary petition export', () => {
    window.exportParliamentaryPetition = () => {
      const count = parseInt(localStorage.getItem('sc_count') || '0', 10);
      const text = `PETITION TO THE HOUSE OF COMMONS / LEGISLATIVE ASSEMBLY OF BC\n\nWe, the undersigned citizens of Canada, call upon the Government to adopt SherpaCarta model language for digital rights legislation, including algorithmic transparency and data sovereignty provisions.\n\nPetition text based on SherpaCarta Arts. 11–13, 47, 61–62.\n\nLocal signature count (illustrative): ${count.toLocaleString()}\n\nhttps://sherpacarta.org/#canada-bc\n\n[Attach certified signature pages per parliamentary rules]`;
      navigator.clipboard.writeText(text);
      toast('Petition template copied', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-file-signature', label: 'Parliamentary Petition Text', sub: 'Copy template', action: () => window.exportParliamentaryPetition() });
    }
  });

  // 551 — Indigenous data brief link
  feat(551, 'Indigenous data sovereignty brief', () => {
    const bc = $('canada-bc');
    if (!bc || bc.querySelector('.indigenous-brief-link')) return;
    const box = document.createElement('div');
    box.className = 'indigenous-brief-link';
    box.style.cssText = 'margin-top:1.25rem;padding:1rem;background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.25);border-radius:.75rem';
    box.innerHTML = `<h4 style="font-family:var(--serif);font-size:1.1rem;margin-bottom:.4rem">Indigenous Data Sovereignty</h4>
      <p style="font-size:.78rem;color:var(--text2);line-height:1.65">Arts. 12 &amp; 47 with cultural context — community data held by nations, not platforms. Essential for coalition Track C.</p>
      <a href="/bc/indigenous-data.html" class="btn btn-ghost" style="margin-top:.5rem;font-size:.72rem"><i class="fas fa-feather"></i> Read brief →</a>`;
    bc.querySelector('.challenge-banner')?.appendChild(box);
  });

  // 552 — Safe Harbour kit
  feat(552, 'Municipal Safe Harbour kit', () => {
    const steps = document.querySelector('.challenge-steps');
    if (steps && !steps.querySelector('.safe-harbour-step')) {
      const link = document.createElement('a');
      link.href = '/bc/safe-harbour.html';
      link.className = 'btn btn-ghost safe-harbour-step';
      link.style.cssText = 'margin-top:1rem;display:inline-flex;font-size:.72rem';
      link.innerHTML = '<i class="fas fa-city"></i> Municipal Safe Harbour kit';
      steps.parentElement?.appendChild(link);
    }
  });

  // 553 — OPC letter template
  feat(553, 'OPC letter template', () => {
    window.openOpcLetter = () => {
      const body = encodeURIComponent(`Dear Privacy Commissioner,\n\nWe respectfully submit SherpaCarta as a reference framework for PIPEDA modernization and algorithmic accountability in Canada.\n\nKey articles: 11 (Privacy), 12 (Data Sovereignty), 61–62 (Algorithmic Rights).\n\nFull charter: https://sherpacarta.org\nBC Challenge: https://sherpacarta.org/#canada-bc\n\nWe request the opportunity to brief your office.\n\nRespectfully,\n[Your name / organization]`);
      location.href = `mailto:privacy@priv.gc.ca?subject=${encodeURIComponent('SherpaCarta — Reference Framework for PIPEDA Modernization')}&body=${body}`;
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-envelope', label: 'Email OPC Template', sub: 'Federal commissioner', action: () => window.openOpcLetter() });
    }
  });

  // 554 — FIPPA gap report
  feat(554, 'FIPPA gap report panel', () => {
    const bc = $('canada-bc');
    if (!bc || $('fippa-gap-report')) return;
    const report = document.createElement('div');
    report.id = 'fippa-gap-report';
    report.style.cssText = 'margin-top:1.25rem';
    report.innerHTML = `<details style="background:var(--bg3);border:1px solid var(--border);border-radius:.75rem;padding:1rem">
      <summary style="cursor:pointer;font-family:var(--mono);font-size:.65rem;color:var(--em);letter-spacing:.1em">BC FIPPA GAP REPORT (expand)</summary>
      <div style="margin-top:.75rem;font-size:.75rem;color:var(--text2);line-height:1.7">
        <p><strong>Gap 1:</strong> Public sector data in US clouds — Art. 12 sovereignty</p>
        <p><strong>Gap 2:</strong> Automated government decisions — Art. 61 transparency</p>
        <p><strong>Gap 3:</strong> Default surveillance in ed-tech — Art. 13</p>
        <p><strong>Gap 4:</strong> Records retention vs. digital dignity — Art. 47</p>
      </div></details>`;
    bc.querySelector('.section-max')?.appendChild(report);
  });

  // 555 — Coalition signup
  feat(555, 'Coalition signup form', () => {
    const bc = $('canada-bc');
    if (!bc || $('coalition-signup')) return;
    const form = document.createElement('div');
    form.id = 'coalition-signup';
    form.style.cssText = 'margin-top:1.5rem;padding:1.25rem;background:var(--bg2);border:1px dashed var(--border2);border-radius:1rem';
    form.innerHTML = `<h4 style="font-family:var(--serif);font-size:1.2rem;margin-bottom:.5rem">Coalition Endorsement Interest</h4>
      <p style="font-size:.78rem;color:var(--text2);margin-bottom:.75rem">NGOs, universities, municipalities — express interest. Verified endorsements Q4 2026.</p>
      <input class="sign-input" id="coalition-org" placeholder="Organization name" style="margin-bottom:.5rem">
      <input class="sign-input" id="coalition-contact" placeholder="Contact email" type="email" style="margin-bottom:.5rem">
      <button type="button" class="btn btn-primary" id="coalition-submit"><i class="fas fa-handshake"></i> Express Interest</button>`;
    bc.querySelector('.section-max')?.appendChild(form);
    $('coalition-submit')?.addEventListener('click', () => {
      const org = $('coalition-org')?.value?.trim();
      const email = $('coalition-contact')?.value?.trim();
      if (!org) { toast('Enter organization name', 'error'); return; }
      const list = JSON.parse(localStorage.getItem('sc_coalition_interest') || '[]');
      list.push({ org, email, at: Date.now() });
      localStorage.setItem('sc_coalition_interest', JSON.stringify(list));
      const mail = `mailto:hello@giveabit.io?subject=${encodeURIComponent('Coalition Endorsement: ' + org)}&body=${encodeURIComponent(`Organization: ${org}\nContact: ${email || 'not provided'}\n\nInterested in endorsing SherpaCarta Canada/BC Challenge.`)}`;
      location.href = mail;
      toast('Interest saved locally — email draft opened', 'success');
    });
  });

  // 556 — Endorsement badge
  feat(556, 'Endorsement badge generator', () => {
    window.downloadEndorsementBadge = () => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80">
        <rect width="320" height="80" rx="12" fill="#0b110b" stroke="#10b981" stroke-width="2"/>
        <text x="20" y="35" fill="#10b981" font-family="system-ui" font-size="14" font-weight="700">We endorse SherpaCarta</text>
        <text x="20" y="58" fill="#9ca89c" font-family="system-ui" font-size="11">Canada &amp; BC Digital Rights Challenge</text>
      </svg>`;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      a.download = 'SherpaCarta-Endorsement-Badge.svg';
      a.click();
      toast('Endorsement badge SVG downloaded', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-award', label: 'Endorsement Badge SVG', sub: 'For partner sites', action: () => window.downloadEndorsementBadge() });
    }
  });

  // 557 — Town hall kit
  feat(557, 'Town hall facilitator kit', () => {
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-people-group', label: 'Town Hall Kit', sub: 'Facilitator guide', action: () => window.open('/bc/town-hall-kit.html', '_blank') });
    }
  });

  // 558 — BC MLA target list export
  feat(558, 'BC MLA target list', () => {
    window.exportMlaTargets = () => {
      const data = window.BC_CRM?.load() || MLA_TARGETS;
      const csv = 'name,riding,status\n' + data.map((m) => `"${m.name}","${m.riding || ''}","${m.status}"`).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = 'bc-mla-targets.csv';
      a.click();
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-list', label: 'Export MLA Target CSV', sub: 'CRM tracker', action: () => window.exportMlaTargets() });
    }
  });

  // 559 — Champion tracker highlight
  feat(559, 'Champion MLA highlight', () => {
    const data = window.BC_CRM?.load() || [];
    const champions = data.filter((m) => m.status === 'champion');
    if (champions.length && $('canada-bc')) {
      const note = document.createElement('p');
      note.style.cssText = 'font-size:.7rem;color:var(--em);margin-top:.5rem';
      note.textContent = `★ ${champions.length} champion contact(s) tracked locally`;
      $('bc-crm-panel')?.appendChild(note);
    }
  });

  // 560 — #CanadaBCChallenge social
  feat(560, 'CanadaBCChallenge hashtag', () => {
    window.shareCanadaChallenge = () => {
      const text = encodeURIComponent('I support the Canada & BC Digital Rights Challenge 🇨🇦\n\nAdopt SherpaCarta as model law for privacy & algorithmic rights.\n\nhttps://sherpacarta.org/#canada-bc\n\n#CanadaBCChallenge #DigitalRights');
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener');
    };
    const banner = document.querySelector('.challenge-banner');
    if (banner && !banner.querySelector('.hashtag-btn')) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost hashtag-btn';
      b.innerHTML = '<i class="fab fa-x-twitter"></i> #CanadaBCChallenge';
      b.onclick = () => window.shareCanadaChallenge();
      banner.querySelector('div[style*="flex"]')?.appendChild(b);
    }
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-hashtag', label: 'Share #CanadaBCChallenge', sub: 'X / Twitter', action: () => window.shareCanadaChallenge() });
    }
  });

  // 561 — Satohash stamp reminder
  feat(561, 'Satohash stamp before outreach', () => {
    window.bcOutreachChecklist = () => {
      const hash = localStorage.getItem('sc_charter_hash');
      const items = [
        { ok: !!hash, label: 'Charter stamped (SHA-256 saved)' },
        { ok: !!localStorage.getItem('sc_nostr_pk'), label: 'Nostr connected (optional)' },
        { ok: parseInt(localStorage.getItem('sc_count') || '0') > 0, label: 'At least one local signature' },
      ];
      const msg = items.map((i) => `${i.ok ? '✓' : '○'} ${i.label}`).join('\n');
      alert(`BC Outreach Checklist:\n\n${msg}\n\nStamp charter: Satohash button in charter modal`);
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-clipboard-check', label: 'BC Outreach Checklist', sub: 'Before MLA meetings', action: () => window.bcOutreachChecklist() });
    }
  });

  // 562 — BC landing CTA row
  feat(562, 'BC CTA enhancements', () => {
    const banner = document.querySelector('.challenge-banner');
    if (!banner || banner.querySelector('.bc-cta-row')) return;
    const row = document.createElement('div');
    row.className = 'bc-cta-row';
    row.style.cssText = 'margin-top:1rem;display:flex;flex-wrap:wrap;gap:.5rem';
    row.innerHTML = `<a href="/bc/model-bill.html" class="btn btn-ghost" style="font-size:.7rem"><i class="fas fa-gavel"></i> Model Bill</a>
      <button type="button" class="btn btn-ghost" style="font-size:.7rem" onclick="downloadModelBill()"><i class="fas fa-download"></i> Download Bill</button>
      <button type="button" class="btn btn-ghost" style="font-size:.7rem" onclick="bcOutreachChecklist()"><i class="fas fa-clipboard-check"></i> Checklist</button>`;
    banner.appendChild(row);
  });

  // 563 — PMB draft language
  feat(563, 'Private Member Bill clauses', () => {
    window.copyPmbClauses = () => {
      const clauses = `PRIVATE MEMBER'S BILL — SAMPLE CLAUSES (BC)\n\n1. Definitions — "automated decision system," "personal data," "data processor"\n2. Right to privacy — no collection without informed consent (Art. 11)\n3. Data portability — export in machine-readable format within 30 days (Art. 12)\n4. Prohibition on behavioural advertising in public services (Art. 13)\n5. Algorithmic impact assessments for government systems (Art. 61)\n6. Right of explanation for adverse automated decisions (Art. 61)\n7. Annual public report on digital rights compliance (Art. 114)`;
      navigator.clipboard.writeText(clauses);
      toast('PMB clauses copied', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-paragraph', label: 'Copy PMB Clauses', sub: 'Private Member Bill', action: () => window.copyPmbClauses() });
    }
  });

  // 564 — Procurement template
  feat(564, 'BC procurement requirement', () => {
    window.copyProcurementClause = () => {
      const text = `BC PROCUREMENT REQUIREMENT (MODEL CLAUSE)\n\nVendors providing digital services to the Province of British Columbia must:\n(a) Comply with SherpaCarta Arts. 11–13 minimum privacy standards;\n(b) Provide algorithmic transparency for any automated decision affecting citizens;\n(c) Store BC public data in Canadian jurisdiction unless explicit consent and risk assessment;\n(d) Submit annual data protection report to the contracting ministry.\n\n— Model clause for RFPs. Not legal advice.`;
      navigator.clipboard.writeText(text);
      toast('Procurement clause copied', 'success');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-file-contract', label: 'Procurement Clause', sub: 'BC vendor RFPs', action: () => window.copyProcurementClause() });
    }
  });

  // 565 — Committee testimony talking points
  feat(565, 'Committee testimony points', () => {
    window.openTestimonyPoints = () => {
      const w = window.open('', '_blank');
      if (!w) return;
      w.document.write(`<!DOCTYPE html><html><head><title>Committee Testimony — SherpaCarta</title><style>body{font-family:Georgia,serif;max-width:700px;margin:2rem auto;padding:1rem;line-height:1.7}h1{color:#10b981}</style></head><body>
        <h1>Committee Testimony Talking Points</h1>
        <ol>
          <li><strong>Hook:</strong> Magna Carta limited kings; SherpaCarta limits platforms.</li>
          <li><strong>Problem:</strong> PIPEDA/FIPPA gaps on algorithms and surveillance capitalism.</li>
          <li><strong>Solution:</strong> 114-article CC0 model — adopt subset as BC Digital Rights Act.</li>
          <li><strong>Proof:</strong> OpenTimestamp on Bitcoin, Nostr public deliberation, zero-tracking site.</li>
          <li><strong>Ask:</strong> Reference framework for committee study or model bill introduction.</li>
          <li><strong>Close:</strong> Adoption costs nothing; inaction costs public trust.</li>
        </ol>
        <p><em>Print Cmd+P for hearing folder.</em></p></body></html>`);
      w.document.close();
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'BC Outreach', icon: 'fa-microphone', label: 'Committee Testimony Points', sub: 'Printable', action: () => window.openTestimonyPoints() });
    }
  });

  // 566 — Track A/B/C progress dashboard
  feat(566, 'Three-track progress dashboard', () => {
    window.toggleBcTrack = (key, item, checked) => {
      const prog = JSON.parse(localStorage.getItem(key) || '{}');
      prog[item] = checked;
      localStorage.setItem(key, JSON.stringify(prog));
      window.renderBcTracks?.();
    };
    window.renderBcTracks = () => {
      const dash = $('bc-tracks-dash');
      if (!dash) return;
      const tracks = [
        { id: 'A', name: 'Political', key: 'sc_track_a', items: ['Briefing kit', 'MLA meetings', 'Model bill', 'Petition'] },
        { id: 'B', name: 'Regulatory', key: 'sc_track_b', items: ['OPC letter', 'BC OIPC', 'CHRC brief'] },
        { id: 'C', name: 'Coalition', key: 'sc_track_c', items: ['BCCLA outreach', 'University endorse', 'Municipal Safe Harbour'] },
      ];
      dash.innerHTML = tracks.map((t) => {
        const prog = JSON.parse(localStorage.getItem(t.key) || '{}');
        const done = t.items.filter((i) => prog[i]).length;
        return `<div style="padding:1rem;background:var(--bg3);border:1px solid var(--border);border-radius:.75rem">
          <div style="font-family:var(--mono);font-size:.58rem;color:var(--em)">TRACK ${t.id} — ${t.name}</div>
          <div style="font-size:1.25rem;color:var(--text);margin:.35rem 0">${done}/${t.items.length}</div>
          ${t.items.map((i) => `<label style="display:flex;gap:.35rem;font-size:.65rem;color:var(--text2);margin:.2rem 0;cursor:pointer">
            <input type="checkbox" ${prog[i] ? 'checked' : ''} onchange="toggleBcTrack('${t.key}','${i}',this.checked)"> ${i}
          </label>`).join('')}
        </div>`;
      }).join('');
    };
    const bc = $('canada-bc');
    if (!bc || $('bc-tracks-dash')) return;
    const dash = document.createElement('div');
    dash.id = 'bc-tracks-dash';
    dash.style.cssText = 'margin-top:1.25rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.5rem';
    bc.querySelector('.section-max')?.appendChild(dash);
    window.renderBcTracks();
  });

  // 567 — BUILD merge
  feat(567, 'Sprint 4 BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 4;
    SC.UPGRADES_B7 = SHERPA_UPGRADES.b7.items;
    SC.totalFeatures = 567;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    setTimeout(() => toast('Sprint 4 Canada & BC legal tools live — BUILD 567', 'success'), 3000);
    console.log(`SherpaCarta Sprint 4 — BUILD ${BUILD}`);
  });
})();