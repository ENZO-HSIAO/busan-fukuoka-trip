// Minimal app-shell cache so the PWA installs cleanly and opens instantly.
// Trip data itself always comes live from Firestore (needs network), this
// only caches the static shell (HTML/CSS/JS/icons).
const CACHE_NAME = "trip-app-shell-v1";
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
  if (event.request.url.includes("firestore.googleapis.com") ||
      event.request.url.includes("googleapis.com") ||
      event.request.url.includes("gstatic.com")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
