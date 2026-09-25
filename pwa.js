// PILAR storefront: remove legacy PWA workers/caches so old storefront assets cannot keep controlling the site.
if(!location.pathname.startsWith('/admin')){
  (async()=>{
    try{
      if('serviceWorker' in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(reg=>reg.unregister()));
      }
      if('caches' in window){
        const keys=await caches.keys();
        await Promise.all(keys.filter(key=>key.startsWith('pilar-')).map(key=>caches.delete(key)));
      }
    }catch(error){
      console.warn('PILAR: no se pudo limpiar el cache PWA antiguo.',error);
    }
  })();
}
