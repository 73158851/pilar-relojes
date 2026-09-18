const HERO_IMAGE='https://wallpapers.com/images/hd/gold-watch-png-bix-4fdga3mzspf496kp.png';
function enhanceHero(){
  const hero=document.querySelector('.sf-hero');
  if(!hero||hero.dataset.premiumHero)return !!hero;
  const globalWa=document.querySelector('.sf-float')?.href||document.querySelector('.sf-footer-wa')?.href||'#';
  hero.dataset.premiumHero='stable-icons-v1';
  hero.className='sf-hero sf-premium-hero';
  hero.innerHTML=`<div class="sf-premium-orbit" aria-hidden="true"></div>
  <div class="sf-premium-hero-inner">
    <div class="sf-premium-copy">
      <div class="sf-premium-kicker">RELOJERÍA · SUCRE, BOLIVIA <span></span></div>
      <h1><span class="sf-title-line">Tu estilo.</span><em class="sf-title-line">Tu tiempo.</em></h1>
      <p>Una selección de relojes pensada para distintos estilos y momentos. Encuentra el modelo que encaje contigo y consulta disponibilidad directamente por WhatsApp.</p>
      <div class="sf-premium-actions">
        <a class="sf-premium-catalog" href="/catalogo"><span aria-hidden="true"><svg aria-label="Catálogo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l-1 14H6L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg></span><b>Ver catálogo</b><i>→</i></a>
        <a class="sf-premium-wa" href="${globalWa}" target="_blank" rel="noopener"><span aria-hidden="true"><svg aria-label="WhatsApp" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.5 3 2 4.5 5 5"/></svg></span><b>Hablar por WhatsApp</b><i>→</i></a>
      </div>
    </div>
    <div class="sf-premium-visual">
      <div class="sf-premium-script">Más que<br>relojes, <em>historias</em><br>contigo.</div>
      <img src="${HERO_IMAGE}" alt="Reloj destacado PILAR" fetchpriority="high">
      <span class="sf-premium-glow" aria-hidden="true"></span>
    </div>
    <div class="sf-premium-benefits">
      <div><strong><svg aria-label="Producto original" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.5 7 10 4-2.5 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg></strong><span>Productos<br>originales</span></div>
      <div><strong><svg aria-label="Entrega" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg></strong><span>Entrega<br>a coordinar</span></div>
      <div><strong><svg aria-label="Pago seguro" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg></strong><span>Pagos<br>seguros</span></div>
      <div><strong><svg aria-label="Asesoría" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4Zm16 0h-3v5h2a1 1 0 0 0 1-1v-4Z"/><path d="M17 19c-1 2-3 2-5 2"/></svg></strong><span>Asesoría<br>personalizada</span></div>
    </div>
    <div class="sf-premium-info">
      <div><strong><svg aria-label="Atención" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg></strong><span>Atención<br><b>07:00 – 22:00</b></span></div>
      <div><strong><svg aria-label="Ubicación" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg></strong><span>Sucre · Bolivia</span></div>
      <div><strong><svg aria-label="Entrega" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg></strong><span>Delivery<br>a consultar</span></div>
      <div class="sf-premium-sign">Tu mejor<br>momento, aquí.</div>
    </div>
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
