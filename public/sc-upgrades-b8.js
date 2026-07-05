/**
 * SherpaCarta Sprint 5 — i18n Expansion (568–587)
 */
(function SCUpgradesB8() {
  'use strict';
  const BUILD = '20260704-587';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b8 = { BUILD, items: [] };
  window.SHERPA_LOCALES = window.SHERPA_LOCALES || {};
  window.SHERPA_CHARTER_I18N = window.SHERPA_CHARTER_I18N || {};

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b8.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B8 #${id}:`, e); }
  }

  const EXTRA_LANGS = ['de', 'pt', 'sw'];
  const UI_KEYS = ['navSign', 'navDonate', 'missionLabel', 'signHeading', 'donateHeading', 'faqHeading'];

  // 568 — Add de, pt, sw to nav select
  feat(568, 'Nav langs de pt sw', () => {
    const sel = $('nav-lang');
    if (!sel) return;
    const opts = { de: '🇩🇪 Deutsch', pt: '🇧🇷 Português', sw: '🇰🇪 Kiswahili' };
    Object.entries(opts).forEach(([code, label]) => {
      if (!sel.querySelector(`option[value="${code}"]`)) {
        const o = document.createElement('option');
        o.value = code;
        o.textContent = label;
        sel.appendChild(o);
      }
    });
  });

  // 569 — Load locale JSON packs
  feat(569, 'Load locale JSON packs', () => {
    const packs = ['de', 'pt', 'sw'];
    packs.forEach((code) => {
      fetch(`/locales/${code}.json`)
        .then((r) => r.json())
        .then((data) => {
          SHERPA_LOCALES[code] = data;
          window.TRANSLATIONS = window.TRANSLATIONS || {};
          window.TRANSLATIONS[code] = {
            ...(window.TRANSLATIONS[code] || {}),
            heroH1: data.ui?.heroH1,
            heroSub: data.ui?.heroSub,
            ctaCharter: data.ui?.ctaCharter,
            ctaSign: data.ui?.ctaSign,
            langName: data.name,
            ...data.ui,
          };
          if (window.state?.lang === code) window.applyTranslation?.(code);
        })
        .catch(() => {});
    });
    ['es-charter', 'fr-charter', 'ar-charter'].forEach((file) => {
      fetch(`/locales/${file}.json`)
        .then((r) => r.json())
        .then((data) => { SHERPA_CHARTER_I18N[data.code] = data.articles || {}; })
        .catch(() => {});
    });
  });

  // 570–571 — Spanish & French charter overlays
  feat(570, 'Spanish charter overlay', () => {
    window.applyCharterI18n = (lang) => {
      const articles = SHERPA_CHARTER_I18N[lang];
      if (!articles) return;
      Object.entries(articles).forEach(([num, tr]) => {
        document.querySelectorAll(`[data-art-num="${num}"],#art-${num}`).forEach((el) => {
          const title = el.querySelector('h3,h4,.art-title');
          if (title && tr.title) {
            if (!title.dataset.enTitle) title.dataset.enTitle = title.textContent;
            title.textContent = tr.title;
            title.style.color = 'var(--em2)';
          }
          if (tr.summary) {
            let sum = el.querySelector('.i18n-summary');
            if (!sum) {
              sum = document.createElement('p');
              sum.className = 'i18n-summary';
              sum.style.cssText = 'font-size:.75rem;color:var(--text2);font-style:italic;margin-top:.35rem';
              title?.after(sum);
            }
            sum.textContent = tr.summary;
          }
          if (tr.body) {
            const body = el.querySelector('.art-body,.ca-body');
            if (body) {
              if (!body.dataset.enBody) body.dataset.enBody = body.innerHTML;
              body.innerHTML = tr.body;
            }
          }
        });
      });
    };
    const orig = window.applyTranslation;
    window.applyTranslation = function (lang) {
      if (orig) orig(lang);
      UI_KEYS.forEach((key) => {
        const t = window.TRANSLATIONS?.[lang];
        if (!t?.[key]) return;
        document.querySelectorAll(`[data-i18n="${key}"]`).forEach((el) => { el.textContent = t[key]; });
      });
      const headings = {
        missionLabel: '#mission .section-label span',
        signHeading: '#sign-heading',
        donateHeading: '#donate-heading',
        faqHeading: '#faq-heading',
      };
      Object.entries(headings).forEach(([key, sel]) => {
        const t = window.TRANSLATIONS?.[lang];
        const el = document.querySelector(sel);
        if (t?.[key] && el) el.textContent = t[key];
      });
      if (lang === 'es' || lang === 'fr' || lang === 'ar') {
        setTimeout(() => window.applyCharterI18n?.(lang), 500);
      } else {
        document.querySelectorAll('[data-en-title]').forEach((el) => {
          if (el.dataset.enTitle) el.textContent = el.dataset.enTitle;
        });
        document.querySelectorAll('.i18n-summary').forEach((el) => el.remove());
      }
    };
  });

  feat(571, 'French charter overlay hook', () => { /* merged in 570 */ });

  // 572–574 — DE, PT, SW UI (via JSON load 569)

  // 575 — Arabic Art 11 body
  feat(575, 'Arabic charter body sample', () => {
    const orig = window.applyTranslation;
    window.applyTranslation = function (lang) {
      if (orig) orig(lang);
      if (lang === 'ar') setTimeout(() => window.applyCharterI18n?.('ar'), 600);
    };
  });

  // 576 — Translation coverage v2
  feat(576, 'Translation coverage v2', () => {
    const panel = $('i18n-status-panel');
    if (!panel) return;
    const extra = document.createElement('div');
    extra.style.cssText = 'margin-top:.75rem;font-size:.62rem;color:var(--text2)';
    extra.innerHTML = `<strong>Sprint 5:</strong> de/pt/sw UI packs · es/fr charter overlays · ar Art.11 body<br>
      <a href="/locales/de.json" style="color:var(--em)">Locale files →</a>`;
    panel.appendChild(extra);
  });

  // 577 — i18n audit in console
  feat(577, 'i18n audit command', () => {
    window.runI18nAudit = () => {
      const langs = ['en', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'sw'];
      const loaded = langs.filter((l) => window.TRANSLATIONS?.[l]);
      const charter = Object.keys(SHERPA_CHARTER_I18N).map((k) => `${k}:${Object.keys(SHERPA_CHARTER_I18N[k]).length} arts`);
      console.table(langs.map((l) => ({ lang: l, ui: !!window.TRANSLATIONS?.[l], charter: SHERPA_CHARTER_I18N[l] ? Object.keys(SHERPA_CHARTER_I18N[l]).length : 0 })));
      toast(`i18n: ${loaded.length} UI langs, charter overlays: ${charter.join(', ') || 'loading…'}`, 'info');
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Personalize', icon: 'fa-language', label: 'Run i18n Audit', sub: 'Locale coverage', action: () => window.runI18nAudit() });
    }
  });

  // 578 — Glossary modal
  feat(578, 'Glossary modal', () => {
    window.showGlossary = (lang) => {
      const loc = SHERPA_LOCALES[lang] || {};
      const glossary = loc.glossary || { privacy: 'privacy', 'data sovereignty': 'data sovereignty', algorithm: 'algorithm' };
      const modal = document.createElement('div');
      modal.className = 'modal open';
      modal.innerHTML = `<div class="modal-inner" style="max-width:420px"><button class="modal-close" onclick="this.closest('.modal').remove()"><i class="fas fa-times"></i></button>
        <h2 style="font-family:var(--serif)">Glossary — ${lang}</h2>
        <div style="font-size:.82rem;line-height:1.8">${Object.entries(glossary).map(([k, v]) => `<div><strong style="color:var(--em)">${k}</strong> → ${v}</div>`).join('')}</div></div>`;
      document.body.appendChild(modal);
    };
    if (typeof CMD_ITEMS !== 'undefined') {
      CMD_ITEMS.push({ group: 'Personalize', icon: 'fa-book', label: 'Legal Glossary', sub: 'Current language', action: () => window.showGlossary?.(window.state?.lang || 'en') });
    }
  });

  // 579 — Locale URL hint
  feat(579, 'Locale URL hint', () => {
    const sel = $('nav-lang');
    if (!sel?.parentElement) return;
    const hint = document.createElement('span');
    hint.id = 'locale-url-hint';
    hint.style.cssText = 'font-family:var(--mono);font-size:.5rem;color:var(--text3);display:block;margin-top:.15rem';
    const update = () => {
      const l = window.state?.lang || 'en';
      hint.textContent = l === 'en' ? 'sherpacarta.org' : `sherpacarta.org/?lang=${l}`;
    };
    update();
    sel.parentElement.appendChild(hint);
    const orig = window.switchNavLang;
    window.switchNavLang = function (lang) {
      if (orig) orig(lang);
      update();
    };
  });

  // 580 — Charter modal lang toggle
  feat(580, 'Charter modal lang toggle', () => {
    const orig = window.openCharterModal;
    window.openCharterModal = function () {
      if (orig) orig();
      setTimeout(() => {
        const tools = document.querySelector('.charter-tools,.modal-tools') || document.querySelector('#charter-modal .modal-inner');
        if (!tools || tools.querySelector('.charter-lang-toggle')) return;
        const bar = document.createElement('div');
        bar.className = 'charter-lang-toggle';
        bar.style.cssText = 'display:flex;gap:.35rem;margin-bottom:.75rem;flex-wrap:wrap';
        ['en', 'es', 'fr', 'ar'].forEach((l) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'star-pill';
          b.textContent = l.toUpperCase();
          b.onclick = () => {
            if (l === 'en') {
              document.querySelectorAll('[data-en-title]').forEach((el) => { if (el.dataset.enTitle) el.textContent = el.dataset.enTitle; });
              document.querySelectorAll('.art-body[data-en-body],.ca-body[data-en-body]').forEach((el) => { el.innerHTML = el.dataset.enBody; });
              document.querySelectorAll('.i18n-summary').forEach((el) => el.remove());
            } else window.applyCharterI18n?.(l);
          };
          bar.appendChild(b);
        });
        tools.prepend(bar);
      }, 400);
    };
  });

  // 581 — Missing keys report
  feat(581, 'Missing translation keys report', () => {
    window.exportMissingI18n = () => {
      const required = ['heroH1', 'heroSub', 'ctaCharter', 'ctaSign'];
      const langs = ['en', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'sw'];
      const missing = langs.map((l) => ({
        lang: l,
        missing: required.filter((k) => !window.TRANSLATIONS?.[l]?.[k]),
      })).filter((x) => x.missing.length);
      const report = JSON.stringify({ missing, charter: SHERPA_CHARTER_I18N, at: new Date().toISOString() }, null, 2);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([report], { type: 'application/json' }));
      a.download = 'i18n-missing-report.json';
      a.click();
      toast('i18n report downloaded', 'success');
    };
  });

  // 582 — Community contribute banner
  feat(582, 'Community translate CTA', () => {
    const faq = $('faq');
    if (!faq || faq.querySelector('.translate-cta')) return;
    const cta = document.createElement('div');
    cta.className = 'translate-cta';
    cta.style.cssText = 'margin-top:1.5rem;padding:1rem;background:rgba(16,185,129,.08);border:1px solid var(--border2);border-radius:.75rem;text-align:center';
    cta.innerHTML = `<p style="font-size:.82rem;color:var(--text2)">Help translate the charter — human review required for legal text.</p>
      <a href="https://github.com/kitsboy/sherpacarta/blob/main/docs/TRANSLATION-WORKFLOW.md" class="btn btn-primary" style="margin-top:.5rem;font-size:.75rem" target="_blank" rel="noopener"><i class="fas fa-globe"></i> Contribute translations</a>`;
    faq.querySelector('.section-max')?.appendChild(cta);
  });

  // 583 — RTL form fixes
  feat(583, 'RTL form fixes', () => {
    const s = document.createElement('style');
    s.textContent = `html[dir=rtl] .sign-input,html[dir=rtl] .sign-form,html[dir=rtl] textarea{text-align:right;direction:rtl}
      html[dir=rtl] .charter-lang-toggle{direction:ltr}`;
    document.head.appendChild(s);
  });

  // 584 — Locale donate copy
  feat(584, 'Locale donate copy', () => {
    const copy = {
      es: 'Financiado exclusivamente por donaciones voluntarias en Bitcoin.',
      fr: 'Financé exclusivement par des dons volontaires en Bitcoin.',
      de: 'Ausschließlich durch freiwillige Bitcoin-Spenden finanziert.',
      pt: 'Financiado exclusivamente por doações voluntárias em Bitcoin.',
      ar: 'ممول حصرياً بتبرعات بيتكوين الطوعية.',
      sw: 'Inafadhiliwa kwa michango ya hiari ya Bitcoin pekee.',
    };
    const orig = window.applyTranslation;
    window.applyTranslation = function (lang) {
      if (orig) orig(lang);
      const note = document.querySelector('#donate-heading')?.parentElement?.querySelector('p');
      if (note && copy[lang]) {
        if (!note.dataset.enText) note.dataset.enText = note.textContent;
        note.textContent = copy[lang];
      } else if (note?.dataset.enText) note.textContent = note.dataset.enText;
    };
  });

  // 585 — Read aloud lang
  feat(585, 'TTS language attribute', () => {
    const orig = window.readAloud;
    window.readAloud = function () {
      if (orig) orig();
      if (window.state?.utterance && window.state?.lang) {
        const map = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', ar: 'ar-SA', zh: 'zh-CN', sw: 'sw-KE' };
        window.state.utterance.lang = map[window.state.lang] || 'en-US';
      }
    };
  });

  // 586 — ⌘K language switchers
  feat(586, 'i18n CMD language switch', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    ['en', 'es', 'fr', 'de', 'ar', 'zh', 'pt', 'sw'].forEach((l) => {
      CMD_ITEMS.push({
        group: 'Personalize',
        icon: 'fa-globe',
        label: `Language: ${l.toUpperCase()}`,
        sub: window.TRANSLATIONS?.[l]?.langName || l,
        action: () => { $('nav-lang').value = l; window.switchNavLang?.(l); },
      });
    });
  });

  // 587 — BUILD merge
  feat(587, 'Sprint 5 BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 5;
    SC.UPGRADES_B8 = SHERPA_UPGRADES.b8.items;
    SC.totalFeatures = 587;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    setTimeout(() => toast('Sprint 5 i18n expansion live — BUILD 587', 'success'), 3200);
    console.log(`SherpaCarta Sprint 5 — BUILD ${BUILD}`);
  });
})();