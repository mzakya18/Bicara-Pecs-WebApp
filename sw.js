const CACHE_NAME = 'bicara-pecs-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png' // Pastikan nama ini sama dengan nama file logo di GitHub Anda
];

// Install Service Worker dan simpan file ke memori HP (Cache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Hapus memori (Cache) lama jika ada update versi baru
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Ambil data dari memori (Offline) saat tidak ada internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kembalikan file dari cache jika ada, jika tidak ambil dari internet
        return response || fetch(event.request);
      })
  );
});
