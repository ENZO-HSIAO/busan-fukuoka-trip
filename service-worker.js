// Minimal app-shell cache so the PWA installs cleanly and opens instantly.
// Trip data itself always comes live from Firestore (needs network), this
// only caches the static shell (HTML/CSS/JS/icons) as an offline fallback.
//
// IMPORTANT: this uses a "network-first" strategy for the shell files, so
// every time you update app.js / style.css / index.html on GitHub, the
// next reload picks up the new version immediately instead of getting
// stuck showing an old cached copy.
const CACHE_NAME = "trip-app-shell-v2";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./firebase-config.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Never intercept Firestore/Firebase network calls — always go live.
  const url = event.request.url;
  if (url.includes("firestore.googleapis.com") || url.includes("googleapis.com") || url.includes("gstatic.com")) {
    return;
  }
  // Network-first: always try to get the latest file; only fall back to
  // the cached copy if there's no network (offline).
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
