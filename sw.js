// Nama cache unik. Setiap kali kamu mengubah kode app, cukup naikkan angkanya (misal: v5, v6, dst.)
const CACHE_NAME = 'bicara-pecs-v5';

// Daftar file utama yang disimpan untuk akses offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Tahap Install: Simpan file awal ke cache dan langsung aktifkan tanpa menunggu
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Memaksa Service Worker baru langsung aktif
  );
});

// 2. Tahap Aktivasi: Hapus cache versi lama secara otomatis
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Menghapus cache versi v4, v3, dst.
          }
        })
      );
    }).then(() => self.clients.claim()) // Langsung mengendalikan halaman yang sedang dibuka
  );
});

// 3. Tahap Fetch (Network-First): Coba ambil dari internet dulu, jika offline baru ambil dari cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Jika berhasil mengambil file dari internet, perbarui file tersebut di cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Jika internet terputus (offline), ambil file dari cache HP
        return caches.match(event.request);
      })
  );
});
