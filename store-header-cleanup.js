function removeHeaderWhatsApp(){
  document.querySelectorAll('.sf-head-wa').forEach(el=>el.remove());
}

removeHeaderWhatsApp();

const app=document.getElementById('app');
if(app){
  const observer=new MutationObserver(removeHeaderWhatsApp);
  observer.observe(app,{childList:true,subtree:true});
}
