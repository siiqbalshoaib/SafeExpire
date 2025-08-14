/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
clientsClaim();

// Precache build assets
precacheAndRoute(self.__WB_MANIFEST || []);

// ✅ 1. Cache static assets (CSS, JS, images)
registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 }),
    ],
  })
);

// ✅ 2. Network only for SafeExpire protected content
registerRoute(
  ({ url }) => url.pathname.startsWith('/view/'), // Adjust to your protected route pattern
  new NetworkOnly()
);

// ✅ 3. API calls (cache optional)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }),
    ],
  })
);
