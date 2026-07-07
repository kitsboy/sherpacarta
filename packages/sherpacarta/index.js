/**
 * @giveabit/sherpacarta — JavaScript SDK
 * @see https://sherpacarta.org/api/v1/openapi.json
 */

const DEFAULT_BASE = 'https://sherpacarta.org/api/v1';

export class SherpaCartaClient {
  constructor(baseUrl = DEFAULT_BASE) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async _fetch(path) {
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) throw new Error(`SherpaCarta API ${path}: ${res.status}`);
    return res.json();
  }

  async getCharter() {
    return this._fetch('/charter.json');
  }

  async getArticle(num) {
    const s = String(num).trim();
    const slug = /^\d+$/.test(s)
      ? `art-${s}`
      : s.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
    return this._fetch(`/articles/${slug}.json`);
  }

  async search(query) {
    const data = await this.getCharter();
    const q = String(query).toLowerCase();
    return (data.articles || []).filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        String(a.num).includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  async getHash() {
    return this._fetch('/hash.json');
  }

  async getCatalog() {
    return this._fetch('/index.json');
  }
}

export const SherpaCarta = new SherpaCartaClient();
export default SherpaCarta;