// sw.js - No caching, everything online
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
  clients.claim(); // Take control without reload
});

// Intercept fetch requests and always go to network
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
