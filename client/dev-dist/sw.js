import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

self.skipWaiting();
clientsClaim();

// 🧹 Clear all old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    )
  );
});

// 📦 Precache only minimal files for PWA installability
precacheAndRoute([
  { url: 'index.html', revision: '1' },
  { url: 'registerSW.js', revision: '1' }
]);

// 🌐 Force all other requests to go to network (no cache)
registerRoute(
  ({ url }) => !url.pathname.endsWith('index.html') && !url.pathname.endsWith('registerSW.js'),
  new NetworkOnly()
);
