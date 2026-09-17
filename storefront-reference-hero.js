function enhanceHero(){
  const hero=document.querySelector('.sf-hero');
  if(!hero||hero.dataset.referenceHero)return;
  hero.dataset.referenceHero='exact-v3';
  hero.classList.add('sf-hero-reference','sf-ref-exact');
  const globalWa=document.querySelector('.sf-float')?.href||document.querySelector('.sf-footer-wa')?.href||'#';
  hero.innerHTML=`<div class="sf-ref-exact-frame"><img class="sf-ref-exact-image" src="/pilar-hero-reference-mobile.webp?v=20260917-hero-fresh-3" alt="PILAR — Tu estilo. Tu tiempo." decoding="async" fetchpriority="high"><div class="sf-ref-image-fallback" aria-hidden="true"><strong>PILAR</strong><span>Tu estilo. Tu tiempo.</span></div><a class="sf-ref-hotspot catalog" href="/catalogo" aria-label="Ver catálogo"></a><a class="sf-ref-hotspot whatsapp" href="${globalWa}" target="_blank" rel="noopener" aria-label="Hablar por WhatsApp"></a><span class="sf-ref-shine" aria-hidden="true"></span></div>`;
  const image=hero.querySelector('.sf-ref-exact-image');
  image.onerror=()=>hero.classList.add('sf-ref-image-error');
  image.onload=()=>hero.classList.remove('sf-ref-image-error');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceHero,{once:true});else enhanceHero();
