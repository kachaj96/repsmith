/* Repsmith service worker: app shell offline, network-first for the shell so updates arrive. */
const CACHE = 'repsmith-v0.10.0';
const NET_WAIT = 4000;
const SHELL = ['./', 'index.html', 'app.css', 'app.js', 'bodymap.js', 'plans.js', 'blocks.js', 'gear.js', 'coach.js', 'runs.js', 'data/exercises.json', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // network first so new versions show up on next open; cache fallback keeps it working offline.
    // cache: 'no-cache' revalidates with the server. Only good responses are stored, and a slow or
    // failing network falls back to the cached copy after NET_WAIT ms (bad signal at the gym).
    e.respondWith((async () => {
      const hit = await caches.match(req, { ignoreSearch: true });
      const net = fetch(req, { cache: 'no-cache' }).then(res => {
        if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; }
        return hit || res;
      });
      if (!hit) return net.catch(() => caches.match('index.html').then(r => r || Response.error()));
      return Promise.race([net, new Promise(ok => setTimeout(() => ok(hit), NET_WAIT))]).catch(() => hit);
    })());
  } else if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    // fonts: cache first
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return res;
    })));
  }
});
