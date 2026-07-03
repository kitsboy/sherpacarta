const CACHE = 'sherpacarta-v3.6';
const ASSETS = ['/', '/index.html', '/favicon.svg', '/og-image.svg', '/og-image.png', '/giveabit-logo.png', '/giveabit-parent-logo.jpg', '/sc-enhancements.js', '/sc-enhancements-v2.js', '/sc-enhancements-v3.js', '/sc-enhancements-v4.js', '/sc-enhancements-v5.js', '/sc-enhancements-v6.js', '/manifest.json'];

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