const CACHE='pilar-admin-shell-v1';
const SHELL=['/admin','/admin-manifest.webmanifest','/pilar-admin-icon.svg','/offline-admin.html'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k.startsWith('pilar-admin-shell-')&&k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);

  // Los datos del negocio y autenticación siempre se consultan en línea.
  if(url.hostname.includes('supabase.co')||url.hostname.includes('wa.me'))return;

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(res=>res)
        .catch(()=>caches.match('/offline-admin.html'))
    );
    return;
  }

  // Código del panel: network-first para recibir actualizaciones rápidamente.
  if(url.origin===self.location.origin&&['script','style'].includes(req.destination)){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(res=>{
          if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
          return res;
        })
        .catch(()=>caches.match(req))
    );
    return;
  }

  // Iconos e imágenes estáticas pueden aprovechar caché.
  if(url.origin===self.location.origin&&['image','font'].includes(req.destination)){
    event.respondWith(
      caches.match(req).then(cached=>cached||fetch(req).then(res=>{
        if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
        return res;
      }))
    );
  }
});