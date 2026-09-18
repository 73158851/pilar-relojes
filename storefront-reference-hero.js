function enhanceHero(){
  const hero=document.querySelector('.sf-hero');
  if(!hero||hero.dataset.referenceHero)return;
  const globalWa=document.querySelector('.sf-float')?.href||document.querySelector('.sf-footer-wa')?.href||'#';
  hero.dataset.referenceHero='approved-v1';
  hero.className='sf-hero sf-hero-reference sf-ref-exact';
  hero.innerHTML=`<div class="sf-ref-exact-frame">
    <img class="sf-ref-exact-image" src="/pilar-hero-approved.webp?v=20260918-approved-1" alt="PILAR — Tu estilo. Tu tiempo." decoding="sync" fetchpriority="high">
    <a class="sf-ref-hotspot catalog" href="/catalogo" aria-label="Ver catálogo"></a>
    <a class="sf-ref-hotspot whatsapp" href="${globalWa}" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp"></a>
  </div>`;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceHero,{once:true});else enhanceHero();
