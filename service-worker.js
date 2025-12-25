const CACHE_NAME = 'horologium-romanum-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=IM+Fell+English:ital@0;1&display=swap',
  'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
  'https://www.transparenttextures.com/patterns/aged-paper.png',
  'https://www.transparenttextures.com/patterns/wood-pattern.png',
  'https://www.transparenttextures.com/patterns/stardust.png',
  'https://aistudiocdn.com/react@^19.2.1',
  'https://aistudiocdn.com/react-dom@^19.2.1',
  'https://aistudiocdn.com/lucide-react@^0.556.0'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          // Allow caching opaque responses (status 0) for CDNs that might not send CORS
          if (!response || (response.status !== 200 && response.status !== 0)) {
            return response;
          }

          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              try {
                  cache.put(event.request, responseToCache);
              } catch (err) {
                  console.warn('Cache put failed', err);
              }
            });

          return response;
        }).catch((error) => {
            console.log('Fetch failed; returning offline page instead.', error);
            // Optional: You could return a custom offline page here if navigation fails
            // for now we just let it fail if not in cache
            throw error;
        });
      })
  );
});