function enhanceHero(){
  const hero=document.querySelector('.sf-hero');
  if(!hero||hero.dataset.referenceHero)return;
  hero.dataset.referenceHero='exact-v2';
  hero.classList.add('sf-hero-reference','sf-ref-exact');
  const globalWa=document.querySelector('.sf-float')?.href||document.querySelector('.sf-footer-wa')?.href||'#';
  hero.innerHTML=`<div class="sf-ref-exact-frame"><img class="sf-ref-exact-image" src="/pilar-hero-reference-mobile.webp" alt="PILAR — Tu estilo. Tu tiempo."><a class="sf-ref-hotspot catalog" href="/catalogo" aria-label="Ver catálogo"></a><a class="sf-ref-hotspot whatsapp" href="${globalWa}" target="_blank" rel="noopener" aria-label="Hablar por WhatsApp"></a><span class="sf-ref-shine" aria-hidden="true"></span></div>`;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceHero,{once:true});else enhanceHero();
