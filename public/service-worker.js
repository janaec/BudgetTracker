const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/assets/css/styles.css",
    "/public/"
];

const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        })
    )
    self.ClientRectList.claim();
});

self.addEventListener("fetch", (evt) => {
    if (evt.request.url.includes("/api") && evt.request.method === "GET") {
        evt.respondWith(
            caches
                .open(DATA_CACHE_NAME)
                .then((cache) => {
                    return fetch(evt.request)
                        .then((response) => {
                            if (response.status === 200) {
                                cache.put(evt.request, response.clone());
                            }
                            return cachematch(evt.request);
                        })
                        .catch((err) => {
                            return cache.match(evt.request);
                        });
                    )}
                    .catch ((err) => console.log(err))
                );
                return;
    }
    // offline 
    evt.respondWith(
         caches.match(evt.request).then((response) => {
            return response || fetch(evt.request);
         })
    );
});