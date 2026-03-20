var CACHE_VERSION = 'appetyt-v1';
var STATIC_CACHE = CACHE_VERSION + '-static';
var DYNAMIC_CACHE = CACHE_VERSION + '-dynamic';

var PRECACHE_URLS = [
  '/',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap'
];

/* Install — precache shell assets */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

/* Activate — clean up old caches */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== STATIC_CACHE && key !== DYNAMIC_CACHE;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* Fetch — route requests to the right strategy */
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  /* Network-first for API calls */
  if (url.pathname.startsWith('/.netlify/functions/')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(DYNAMIC_CACHE).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  /* Cache-first for static assets (fonts, icons, CSS, JS, images) */
  if (
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com' ||
    /\.(js|css|png|jpg|jpeg|svg|webp|woff2?|ttf|eot|ico)(\?.*)?$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          var clone = response.clone();
          caches.open(STATIC_CACHE).then(function(cache) {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
    return;
  }

  /* Network-first for navigation / HTML (handles the large index.html) */
  event.respondWith(
    fetch(event.request).then(function(response) {
      /* Only cache successful same-origin responses */
      if (response.ok && url.origin === self.location.origin) {
        var clone = response.clone();
        caches.open(STATIC_CACHE).then(function(cache) {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
