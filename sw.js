const CACHE='stc-logistics-v1-21-1-business-20261103';
const ASSETS=['./','./index.html','./app.js','./calc-engine.js','./geo-zones.js','./quick.js','./calendar.js','./security.js','./widgets.js','./enterprise.js','./service-engine.js','./stc-extensions.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./tariffs.json'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==location.origin)return;
 const path=new URL(request.url).pathname;
 const mustRefresh=request.mode==='navigate'||/\.(?:js|html|webmanifest)$/i.test(path);
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(!mustRefresh){const cached=await cache.match(request);if(cached)return cached}
  try{const response=await fetch(request);
   if(response.ok&&response.type==='basic')event.waitUntil(cache.put(request,response.clone()).catch(()=>{}));
   return response;
  }catch(error){const cached=await cache.match(request);if(cached)return cached;
   if(request.mode==='navigate'){const fallback=await cache.match('./index.html');if(fallback)return fallback}
   throw error;
  }
 })());
});
