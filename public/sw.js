const CACHE = 'sherpacarta-v5.2';
const ASSETS = [
  '/', '/index.html', '/changelog.html', '/comparison.html', '/press.html',
  '/report/2026-report.html', '/status.html', '/accessibility.html',
  '/treasury.html', '/security.html',
  '/canada/index.html', '/canada/sign.html', '/canada/proof.html', '/canada/about.html', '/canada/bc/index.html',
  '/js/sc-petition-canada.js', '/data/campaign-canada.json', '/data/proof-canada.json',
  '/data/satohash-templates/sherpacarta-canada-referendum.json',
  '/favicon.svg', '/og-image.svg', '/og-image.png',
  '/giveabit-logo.png', '/giveabit-parent-logo.jpg', '/manifest.json', '/mcp.json',
  '/.well-known/security.txt', '/feed/podcast.xml', '/sitemap.xml',
  '/sc-main.css', '/sc-core.js', '/sc-bundle.js', '/embed.js', '/data/charter.json',
  '/locales/de.json', '/locales/pt.json', '/locales/sw.json',
  '/locales/es-charter.json', '/locales/fr-charter.json', '/locales/ar-charter.json',
  '/bc/model-bill.html', '/bc/safe-harbour.html', '/bc/indigenous-data.html', '/bc/town-hall-kit.html',
  '/api/v1/charter.json', '/api/v1/hash.json', '/api/v1/openapi.json', '/api/v1/index.json',
  '/embed/sign-widget.html',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
      if (res.ok && e.request.url.includes(self.location.origin)) {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
      }
      return res;
    }).catch(() => cached))
  );
});