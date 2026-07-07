/**
 * SherpaCarta Sprint 8 — Distribution & Integrations (628–647)
 */
(function SCUpgradesB11() {
  'use strict';
  const BUILD = '20260707-647';
  const $ = (id) => document.getElementById(id);
  const toast = (msg, type) => window.toast?.(msg, type || 'info');

  window.SHERPA_UPGRADES = window.SHERPA_UPGRADES || {};
  SHERPA_UPGRADES.b11 = { BUILD, items: [] };

  function feat(id, name, fn) {
    SHERPA_UPGRADES.b11.items.push({ id, name });
    try { fn(); } catch (e) { console.warn(`B11 #${id}:`, e); }
  }

  feat(628, 'Embed.js widget loader', () => {
    window.SHERPA_EMBED = {
      version: '1.0.0',
      scriptUrl: 'https://sherpacarta.org/embed.js',
      widgetUrl: 'https://sherpacarta.org/embed/sign-widget.html',
      init: (opts) => {
        const el = document.querySelector(opts?.selector || '#sherpacarta-embed');
        if (!el) return;
        const iframe = document.createElement('iframe');
        iframe.src = `${SHERPA_EMBED.widgetUrl}?theme=${opts?.theme || 'dark'}`;
        iframe.title = 'SherpaCarta Sign Widget';
        iframe.style.cssText = 'width:100%;min-height:320px;border:none;border-radius:12px';
        iframe.loading = 'lazy';
        el.appendChild(iframe);
      },
    };
  });

  feat(629, 'MCP server descriptor', () => {
    window.SHERPA_MCP_SERVER = {
      version: '3.0.0',
      package: '@giveabit/sherpacarta-mcp',
      npm: 'https://www.npmjs.com/package/@giveabit/sherpacarta-mcp',
      run: 'npx @giveabit/sherpacarta-mcp',
      transport: 'stdio',
    };
  });

  feat(630, 'npm SDK descriptor', () => {
    window.SHERPA_SDK = {
      name: '@giveabit/sherpacarta',
      version: '1.0.0',
      cdn: 'https://esm.sh/@giveabit/sherpacarta',
      npm: 'https://www.npmjs.com/package/@giveabit/sherpacarta',
    };
  });

  feat(631, 'API articles endpoint awareness', () => {
    window.SHERPA_API = window.SHERPA_API || {};
    SHERPA_API.articles = '/api/v1/articles/';
    SHERPA_API.catalog = '/api/v1/index.json';
  });

  feat(632, 'MCP v3 tools expansion', () => {
    window.SHERPA_MCP = window.SHERPA_MCP || {};
    SHERPA_MCP.version = '3.0.0';
    SHERPA_MCP.tools = ['search_charter', 'get_article', 'get_charter_hash', 'list_articles'];
    SHERPA_MCP.server = SHERPA_MCP_SERVER;
  });

  feat(633, 'OpenAPI articles path', () => {
    window.SHERPA_API = window.SHERPA_API || {};
    SHERPA_API.openapi = '/api/v1/openapi.json';
  });

  feat(634, 'Client SDK getArticle', () => {
    window.SherpaCarta = window.SherpaCarta || {};
    SherpaCarta.getArticle = async (num) => {
      const s = String(num).trim();
      const slug = /^\d+$/.test(s) ? `art-${s}` : s.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
      const res = await fetch(`/api/v1/articles/${slug}.json`);
      if (!res.ok) throw new Error(`Article ${n} not found`);
      return res.json();
    };
  });

  feat(635, 'Client SDK search', () => {
    window.SherpaCarta = window.SherpaCarta || {};
    SherpaCarta.search = async (query) => {
      const res = await fetch('/api/v1/charter.json');
      const data = await res.json();
      const q = String(query).toLowerCase();
      return (data.articles || []).filter(
        (a) => a.title.toLowerCase().includes(q) || String(a.num).includes(q) || (a.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    };
  });

  feat(636, 'Client SDK getHash', () => {
    window.SherpaCarta = window.SherpaCarta || {};
    SherpaCarta.getHash = async () => {
      const res = await fetch('/api/v1/hash.json');
      return res.json();
    };
  });

  feat(637, 'Embed sign widget enhancement', () => {
    const btn = document.querySelector('#sign .btn-primary, #sign button');
    if (btn && !document.getElementById('sc-embed-code')) {
      const code = document.createElement('details');
      code.id = 'sc-embed-code';
      code.style.cssText = 'margin-top:1rem;font-family:var(--mono);font-size:.7rem;color:var(--text2)';
      code.innerHTML = `<summary>Embed this sign widget on your site</summary>
        <pre style="margin-top:.5rem;padding:.75rem;background:var(--bg3);border-radius:8px;overflow:auto">&lt;div id="sherpacarta-embed"&gt;&lt;/div&gt;
&lt;script src="https://sherpacarta.org/embed.js"&gt;&lt;/script&gt;
&lt;script&gt;SherpaCartaEmbed.init({ selector: '#sherpacarta-embed' })&lt;/script&gt;</pre>`;
      btn.parentElement?.appendChild(code);
    }
  });

  feat(638, 'MCP search_charter client', () => {
    window.SHERPA_MCP = window.SHERPA_MCP || {};
    SHERPA_MCP.search_charter = (query) => window.SherpaCarta?.search(query);
  });

  feat(639, 'MCP get_article client', () => {
    window.SHERPA_MCP = window.SHERPA_MCP || {};
    SHERPA_MCP.get_article = (num) => window.SherpaCarta?.getArticle(num);
  });

  feat(640, 'MCP get_charter_hash client', () => {
    window.SHERPA_MCP = window.SHERPA_MCP || {};
    SHERPA_MCP.get_charter_hash = () => window.SherpaCarta?.getHash();
  });

  feat(641, 'SDK usage docs link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML(
      'beforeend',
      '<a href="https://github.com/kitsboy/sherpacarta/tree/main/packages/sherpacarta" target="_blank" rel="noopener">SDK</a>'
    );
  });

  feat(642, 'Footer MCP link', () => {
    document.querySelector('.legal-links')?.insertAdjacentHTML(
      'beforeend',
      '<a href="/mcp.json" target="_blank" rel="noopener">MCP</a>'
    );
  });

  feat(643, 'CMD API docs', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push({
      group: 'Developers',
      icon: 'fa-code',
      label: 'API Documentation',
      sub: '/api/v1/openapi.json',
      action: () => { window.open('/api/v1/openapi.json', '_blank'); },
    });
  });

  feat(644, 'CMD Embed widget code', () => {
    if (typeof CMD_ITEMS === 'undefined') return;
    CMD_ITEMS.push({
      group: 'Developers',
      icon: 'fa-puzzle-piece',
      label: 'Copy Embed Code',
      sub: 'Sign widget for your site',
      action: () => {
        const code = '<div id="sherpacarta-embed"></div>\n<script src="https://sherpacarta.org/embed.js"></script>\n<script>SherpaCartaEmbed.init()</script>';
        navigator.clipboard?.writeText(code);
        toast('Embed code copied', 'success');
      },
    });
  });

  feat(645, 'API catalog fetch', () => {
    fetch('/api/v1/index.json').then((r) => r.json()).then((d) => {
      window.SHERPA_API = window.SHERPA_API || {};
      SHERPA_API.catalogData = d;
    }).catch(() => {});
  });

  feat(646, 'Integration self-test', () => {
    window.SHERPA_INTEGRATION_TEST = async () => {
      const results = [];
      try { results.push({ test: 'charter', ok: !!(await fetch('/api/v1/charter.json')).ok }); } catch { results.push({ test: 'charter', ok: false }); }
      try { results.push({ test: 'hash', ok: !!(await fetch('/api/v1/hash.json')).ok }); } catch { results.push({ test: 'hash', ok: false }); }
      try { results.push({ test: 'mcp', ok: !!(await fetch('/mcp.json')).ok }); } catch { results.push({ test: 'mcp', ok: false }); }
      console.log('[SherpaCarta integration]', results);
      return results;
    };
  });

  feat(647, 'Sprint 8 BUILD merge', () => {
    window.SC = window.SC || {};
    SC.BUILD = BUILD;
    SC.SPRINT = 8;
    SC.UPGRADES_B11 = SHERPA_UPGRADES.b11.items;
    SC.totalFeatures = 647;
    const bb = document.querySelector('.build-badge');
    if (bb) bb.textContent = 'BUILD ' + BUILD;
    setTimeout(() => toast('Sprint 8 distribution & integrations live — BUILD 647', 'success'), 3600);
    console.log(`SherpaCarta Sprint 8 — BUILD ${BUILD}`);
  });
})();