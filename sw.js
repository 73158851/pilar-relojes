// PILAR legacy service worker retirement.
self.addEventListener('install',event=>{
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    try{
      const keys=await caches.keys();
      await Promise.all(keys.filter(key=>key.startsWith('pilar-')).map(key=>caches.delete(key)));
      await self.registration.unregister();
      const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      clients.forEach(client=>client.navigate(client.url));
    }catch(error){
      // Intentionally silent: this worker only exists to retire previous cached versions.
    }
  })());
});
