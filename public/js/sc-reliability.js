(() => {
  'use strict';
  window.SC_REL = {
    async fetchJson(url, options = {}, attempts = 2) {
      let lastError;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
          const response = await fetch(url, { ...options, headers: { Accept: 'application/json', ...(options.headers || {}) } });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return await response.json();
        } catch (error) {
          lastError = error;
          if (attempt + 1 < attempts) await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
        }
      }
      throw lastError || new Error('Request failed');
    },
    isOffline() { return typeof navigator !== 'undefined' && navigator.onLine === false; }
  };
})();
