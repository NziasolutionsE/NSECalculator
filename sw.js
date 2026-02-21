/**
 * NSE Fee Calculator — Service Worker
 *
 * Enables offline capability for the calculator.
 * Uses cache-first for static assets and stale-while-revalidate for data.
 *
 * Version: 1.0.0
 */

const CACHE_NAME = 'nse-fee-calc-v4';
const CACHE_VERSION = '2026-02-21';

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/calculator.js',
    '/js/ui.js',
    '/js/data.js',
    '/js/share.js',
    '/data/stocks.json',
    '/data/fees.json',
    '/data/brokers.json',
    '/manifest.json'
];

// External fonts (cache but don't fail if unavailable)
const FONT_ASSETS = [
    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap'
];

// Install event — cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event — serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests except for Google Fonts
    if (url.origin !== self.location.origin) {
        // Allow Google Fonts to be cached but don't block on them
        if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
            event.respondWith(
                caches.open('fonts-cache').then((cache) => {
                    return cache.match(event.request).then((response) => {
                        return response || fetch(event.request).then((networkResponse) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    });
                })
            );
        }
        return;
    }

    // Cache-first strategy for static assets
    if (STATIC_ASSETS.some(asset => url.pathname.includes(asset.replace('/', ''))) ||
        event.request.destination === 'document') {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) {
                    // Return cached version immediately
                    return cached;
                }

                // Not in cache, fetch from network
                return fetch(event.request).then((networkResponse) => {
                    // Cache the new response for future
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    // Network failed, return a basic offline page for HTML requests
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
        );
        return;
    }

    // Stale-while-revalidate for data files
    if (url.pathname.startsWith('/data/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cached) => {
                    // Always fetch from network to get fresh data
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        // Update cache with fresh data
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(() => {
                        // Network failed, return cached data
                        return cached;
                    });

                    // Return cached immediately, update in background
                    return cached || fetchPromise;
                });
            })
        );
        return;
    }

    // Default: network-first for anything else
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
