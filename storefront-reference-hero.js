function enhanceHero(){
  const hero=document.querySelector('.sf-hero');
  if(!hero||hero.dataset.referenceHero)return false;
  const globalWa=document.querySelector('.sf-float')?.href||document.querySelector('.sf-footer-wa')?.href||'#';
  hero.dataset.referenceHero='refresh-stable-v1';
  hero.className='sf-hero sf-hero-reference sf-ref-exact';
  hero.innerHTML=`<div class="sf-ref-exact-frame">
    <img class="sf-ref-exact-image" src="/pilar-hero-approved-v3.webp?v=20260918-localvalidated-3" alt="PILAR — Tu estilo. Tu tiempo." decoding="async" fetchpriority="high">
    <a class="sf-ref-hotspot catalog" href="/catalogo" aria-label="Ver catálogo"></a>
    <a class="sf-ref-hotspot whatsapp" href="${globalWa}" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp"></a>
  </div>`;
  return true;
}
function ensureHero(){
  if(enhanceHero())return;
  const observer=new MutationObserver(()=>{
    if(enhanceHero())observer.disconnect();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
}
ensureHero();
