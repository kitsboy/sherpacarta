const CACHE = 'sherpacarta-v6.3';
const ASSETS = [
  '/', '/index.html', '/changelog.html', '/comparison.html', '/press.html', '/press-kit.html',
  '/briefing.html', '/briefing-fr.html', '/leave-behind.html',
  '/report/2026-report.html', '/status.html', '/accessibility.html',
  '/treasury.html', '/security.html', '/jurisdictions.html',
  '/data/wallets.json', '/data/jurisdictions.json',
  '/canada/index.html', '/canada/sign', '/canada/proof', '/canada/about', '/canada/bc/index.html',
  '/canada/paper', '/canada/official', '/canada/join', '/canada/organizer',
  '/canada/qr/join-federal.png', '/canada/qr/join-bc.png', '/canada/qr/join.png',
  '/js/sc-petition-canada.js', '/js/sc-press-outlets.js', '/data/campaign-canada.json', '/data/proof-canada.json',
  '/data/satohash-templates/sherpacarta-canada-referendum.json',
  '/favicon.svg', '/og-image.svg', '/og-image.png',
  '/og/default.png', '/og/canada.png', '/og/sign.png', '/og/paper.png',
  '/og/join.png', '/og/treasury.png', '/og/security.png',
  '/giveabit-logo.png', '/giveabit-parent-logo.jpg', '/manifest.json', '/mcp.json',
  '/.well-known/security.txt', '/feed/podcast.xml', '/sitemap.xml',
  '/humans.txt', '/charter.txt', '/offline.html',
  '/sc-main.css', '/sc-core.js', '/sc-bundle.js', '/embed.js', '/data/charter.json',
  '/fonts/fonts.css',
  '/fonts/outfit-400.woff2', '/fonts/outfit-600.woff2', '/fonts/outfit-700.woff2',
  '/fonts/cormorant-400.woff2', '/fonts/cormorant-700.woff2', '/fonts/cormorant-400i.woff2',
  '/fonts/dmmono-400.woff2', '/fonts/dmmono-500.woff2',
  '/vendor/fontawesome/css/all.min.css',
  '/vendor/fontawesome/webfonts/fa-solid-900.woff2',
  '/vendor/fontawesome/webfonts/fa-brands-400.woff2',
  '/vendor/fontawesome/webfonts/fa-regular-400.woff2',
  '/locales/de.json', '/locales/pt.json', '/locales/sw.json',
  '/locales/es-charter.json', '/locales/fr-charter.json', '/locales/ar-charter.json',
  '/bc/model-bill.html', '/bc/safe-harbour.html', '/bc/indigenous-data.html', '/bc/town-hall-kit.html',
  '/api/v1/charter.json', '/api/v1/hash.json', '/api/v1/openapi.json', '/api/v1/index.json',
  '/embed/sign-widget.html',
];

function isApiRequest(url) {
  return url.pathname.startsWith('/api/canada') || url.pathname.startsWith('/api/v1');
}

function isDocumentRequest(request) {
  const accept = request.headers.get('accept') || '';
  return request.mode === 'navigate' || accept.includes('text/html');
}

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache dynamic campaign APIs — always network
  if (isApiRequest(url) && url.pathname.startsWith('/api/canada')) {
    e.respondWith(
      fetch(e.request).catch(() => new Response(JSON.stringify({ error: 'offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }))
    );
    return;
  }

  // HTML / navigation: network-first so deploys stick
  if (isDocumentRequest(e.request) || url.pathname.endsWith('.html') || url.pathname === '/') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request).then((c) => c || caches.match('/offline.html') || caches.match('/')))
    );
    return;
  }

  // Static assets: cache-first, revalidate in background
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
