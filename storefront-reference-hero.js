function enhanceHero(){
  const hero=document.querySelector('.sf-hero');
  if(!hero||hero.dataset.referenceHero)return;
  hero.dataset.referenceHero='exact-crop-v1';
  hero.classList.add('sf-hero-reference','sf-ref-exact');
  const globalWa=document.querySelector('.sf-float')?.href||document.querySelector('.sf-footer-wa')?.href||'#';
  hero.innerHTML=`<div class="sf-ref-exact-frame"><img class="sf-ref-exact-image" src="/pilar-hero-exact-reference.webp?v=20260917-exact-crop-1" alt="PILAR — Tu estilo. Tu tiempo." decoding="sync" fetchpriority="high"><a class="sf-ref-hotspot catalog" href="/catalogo" aria-label="Ver catálogo"></a><a class="sf-ref-hotspot whatsapp" href="${globalWa}" target="_blank" rel="noopener" aria-label="Hablar por WhatsApp"></a><span class="sf-ref-shine" aria-hidden="true"></span></div>`;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceHero,{once:true});else enhanceHero();
