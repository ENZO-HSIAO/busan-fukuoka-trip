// App-shell cache so the PWA installs cleanly and opens instantly.
// Trip data itself always comes live from Firestore (needs network).
// Network-first for the shell files so every update on GitHub is picked
// up on the next reload instead of getting stuck on an old cached copy.
const CACHE_NAME = "trip-app-react-shell-v1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./app.jsx",
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
  const url = event.request.url;
  // Never intercept Firebase/Firestore or the CDN script calls — always go live.
  if (url.includes("firestore.googleapis.com") || url.includes("googleapis.com") ||
      url.includes("gstatic.com") || url.includes("unpkg.com")) {
    return;
  }
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
