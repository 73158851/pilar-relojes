const CACHE='pilar-cloudflare-shell-v1';
const SHELL=['/offline.html','/pilar-icon.svg','/manifest.webmanifest'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pilar-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.hostname.includes('supabase.co')||url.hostname.includes('wa.me'))return;

  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match('/offline.html')));
    return;
  }

  if(url.origin===self.location.origin&&(url.pathname==='/pilar-hero-watch-approved.webp'||url.pathname==='/pilar-hero-approved-v3.webp'||url.pathname==='/pilar-hero-approved-v2.webp'||url.pathname==='/pilar-hero-approved.webp'||url.pathname==='/pilar-hero-exact-reference.webp'||url.pathname==='/pilar-hero-reference-mobile.webp')){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
      return res;
    }).catch(()=>caches.match(req)));
    return;
  }

  if(url.origin===self.location.origin&&['style','script'].includes(req.destination)){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
      return res;
    }).catch(()=>caches.match(req)));
    return;
  }

  if(url.origin===self.location.origin&&['image','font'].includes(req.destination)){
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
      return res;
    })));
  }
});
