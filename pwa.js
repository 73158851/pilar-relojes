const isAdmin=location.pathname.startsWith('/admin');

if(!isAdmin&&'serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  });
}
