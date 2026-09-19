// PILAR storefront header: preserve the approved WhatsApp shortcut shown in the reference design.
function preserveHeaderWhatsApp(){
  document.querySelectorAll('.sf-head-wa').forEach(el=>{
    el.hidden=false;
    el.removeAttribute('aria-hidden');
  });
}
preserveHeaderWhatsApp();
const app=document.getElementById('app');
if(app)new MutationObserver(preserveHeaderWhatsApp).observe(app,{childList:true,subtree:true});
