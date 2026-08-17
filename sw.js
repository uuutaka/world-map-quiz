const CACHE_NAME='world-map-quiz-rebuilt-v4';
const LOCAL=['./','./index.html','./countries.json','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'];
const EXTERNAL=[
 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js',
 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json',
 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json',
 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-10m.json'
];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.addAll(LOCAL);await Promise.allSettled(EXTERNAL.map(u=>cache.add(u)));await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);const isMap=EXTERNAL.includes(url.href);if(event.request.mode==='navigate'||url.pathname.endsWith('/countries.json')||isMap){event.respondWith((async()=>{try{const r=await fetch(event.request,{cache:'no-store'});if(r&&r.ok){const c=await caches.open(CACHE_NAME);c.put(event.request,r.clone())}return r}catch(e){return (await caches.match(event.request))||(event.request.mode==='navigate'?await caches.match('./index.html'):Response.error())}})());return}event.respondWith(caches.match(event.request).then(c=>c||fetch(event.request).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy))}return r})))})
