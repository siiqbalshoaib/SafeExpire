// service-worker.js

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Clone the request and append a cache-busting param
  const noCacheRequest = new Request(url.toString() + '?_t=' + Date.now(), {
    method: event.request.method,
    headers: event.request.headers,
    body: event.request.body,
    mode: 'cors',
    credentials: event.request.credentials,
    redirect: 'follow',
    cache: 'no-store' // Ensures browser does not cache
  });

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(noCacheRequest);
        // Force no-store headers in the response
        const modifiedResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        return modifiedResponse;
      } catch (err) {
        return new Response('You are offline. Please check your internet connection.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});

// Optional: Clear all caches when message received
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});
