// Service worker to satisfy PWA installability requirements
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Passive fetch handler
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
