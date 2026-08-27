(() => {
  'use strict';
  const taxonomyUrl = '/data/rights-taxonomy.json';
  const stateKey = 'sc_reader_progress_v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch (_) { return {}; } };
  const write = (value) => { try { localStorage.setItem(stateKey, JSON.stringify(value)); } catch (_) {} };
  const articleNumber = (article) => Number(String(article.num || '').replace(/\D/g, '')) || null;
  const cleanText = (html) => String(html || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const categoryFor = (number, taxonomy) => taxonomy.categories.filter((category) => category.articles.includes(number));

  async function mount() {
    const host = document.getElementById('articles-sidebar');
    const main = document.getElementById('articles-main');
    if (!host || !main || !Array.isArray(window.CHARTER)) return;
    let taxonomy;
    try { taxonomy = await fetch(taxonomyUrl, { cache: 'no-cache' }).then((r) => r.ok ? r.json() : null); } catch (_) { taxonomy = null; }
    if (!taxonomy) return;

    const articles = window.CHARTER.flatMap((chapter) => chapter.articles || []).filter((article) => articleNumber(article));
    const progress = read();
    const toolbar = document.createElement('div'); toolbar.className = 'rights-reader-tools'; toolbar.setAttribute('aria-label', 'Filter articles by right');
    const label = document.createElement('span'); label.textContent = 'Filter by right'; toolbar.appendChild(label);
    const select = document.createElement('select'); select.className = 'calc-select'; select.setAttribute('aria-label', 'Filter charter articles by right');
    select.innerHTML = '<option value="">All rights</option>' + taxonomy.categories.map((category) => `<option value="${category.id}">${category.label}</option>`).join('');
    toolbar.appendChild(select); host.before(toolbar);

    function renderList(filter = '') {
      host.replaceChildren();
      const visible = articles.filter((article) => !filter || categoryFor(articleNumber(article), taxonomy).some((category) => category.id === filter));
      visible.forEach((article, index) => {
        const number = articleNumber(article); const categories = categoryFor(number, taxonomy);
        const button = document.createElement('button'); button.type = 'button'; button.className = 'article-filter-item'; button.setAttribute('role', 'tab'); button.setAttribute('aria-label', `${article.num}: ${article.title}`); button.dataset.articleNumber = String(number);
        button.innerHTML = `<span>${article.num}</span><strong>${article.title}</strong><small>${categories.map((category) => category.label).join(' · ') || article.chapter || 'Charter'}</small>`;
        button.addEventListener('click', () => renderArticle(article)); host.appendChild(button);
        if (index === 0 && !main.dataset.readerMounted) renderArticle(article);
      });
    }
    function renderArticle(article) {
      const number = articleNumber(article); const categories = categoryFor(number, taxonomy); const text = cleanText(article.body);
      progress.lastArticle = number; write(progress); main.dataset.readerMounted = '1';
      main.replaceChildren();
      const meta = document.createElement('div'); meta.className = 'article-provenance'; meta.innerHTML = `<span>Article ${number}</span><span>${categories.map((category) => category.label).join(' · ') || 'Digital rights'}</span><span>Source release 2.0</span>`;
      const title = document.createElement('h3'); title.textContent = `${article.num}: ${article.title}`;
      const subtitle = document.createElement('p'); subtitle.className = 'article-subtitle'; subtitle.textContent = article.subtitle || '';
      const body = document.createElement('div'); body.className = 'article-body'; body.innerHTML = article.body || '';
      const info = document.createElement('aside'); info.className = 'article-why'; info.innerHTML = `<strong>Why this matters</strong><p>${categories[0]?.description || 'This article describes a proposed principle for human dignity in digital life.'}</p>`;
      const actions = document.createElement('div'); actions.className = 'article-actions';
      const cite = document.createElement('button'); cite.type = 'button'; cite.className = 'btn btn-ghost'; cite.textContent = 'Copy citation'; cite.addEventListener('click', async () => { const value = `SherpaCarta, ${article.num}: ${article.title}, release 2.0, https://sherpacarta.org/?article=${number}`; try { await navigator.clipboard.writeText(value); cite.textContent = 'Citation copied'; } catch (_) { cite.textContent = value; } });
      const share = document.createElement('a'); share.className = 'btn btn-ghost'; share.href = `/share.html?article=${number}`; share.textContent = 'Share context';
      actions.append(cite, share); main.append(meta, title, subtitle, body, info, actions);
    }
    select.addEventListener('change', () => renderList(select.value));
    renderList();
    if (progress.lastArticle) setTimeout(() => { const button = host.querySelector(`[data-article-number="${progress.lastArticle}"]`); button?.focus(); }, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
