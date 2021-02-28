const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/assets/css/styles.css",
    "/public/"
];

const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install",(evt) =>{
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>{
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches.keys().then((keyList) =>{
            return Promise.all(
                keyList.map((key) =>{
                    if (key !==CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);                   
                     }
                })
            )
        })
    )
    self.ClientRectList.claim();
});

self.addEventListener