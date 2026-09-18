function enhanceHero(){
  const hero=document.querySelector('.sf-hero');
  if(!hero||hero.dataset.premiumHero)return;
  const productImage=document.querySelector('.sf-card-media img')?.src||'';
  const globalWa=document.querySelector('.sf-float')?.href||document.querySelector('.sf-footer-wa')?.href||'#';
  hero.dataset.premiumHero='v1';
  hero.className='sf-hero sf-premium-hero';
  hero.innerHTML=`<div class="sf-premium-orbit" aria-hidden="true"></div>
  <div class="sf-premium-hero-inner">
    <div class="sf-premium-copy">
      <div class="sf-premium-kicker">RELOJERÍA · SUCRE, BOLIVIA <span></span></div>
      <h1><span class="sf-title-line">Tu estilo.</span><em class="sf-title-line">Tu tiempo.</em></h1>
      <p>Una selección de relojes pensada para distintos estilos y momentos. Encuentra el modelo que encaje contigo y consulta disponibilidad directamente por WhatsApp.</p>
      <div class="sf-premium-actions">
        <a class="sf-premium-catalog" href="/catalogo"><span aria-hidden="true">▣</span><b>Ver catálogo</b><i>→</i></a>
        <a class="sf-premium-wa" href="${globalWa}" target="_blank" rel="noopener"><span aria-hidden="true">◉</span><b>Hablar por WhatsApp</b><i>→</i></a>
      </div>
    </div>
    <div class="sf-premium-visual">
      <div class="sf-premium-script">Más que<br>relojes, <em>historias</em><br>contigo.</div>
      ${productImage?`<img src="${productImage}" alt="Reloj destacado PILAR" fetchpriority="high">`:'<div class="sf-premium-watch-placeholder" aria-hidden="true">PILAR</div>'}
      <span class="sf-premium-glow" aria-hidden="true"></span>
    </div>
    <div class="sf-premium-benefits">
      <div><strong>♢</strong><span>Productos<br>originales</span></div>
      <div><strong>▱</strong><span>Entrega<br>a coordinar</span></div>
      <div><strong>▭</strong><span>Pagos<br>seguros</span></div>
      <div><strong>♧</strong><span>Asesoría<br>personalizada</span></div>
    </div>
    <div class="sf-premium-info">
      <div><strong>◷</strong><span>Atención<br><b>07:00 – 22:00</b></span></div>
      <div><strong>⌖</strong><span>Sucre · Bolivia</span></div>
      <div><strong>▱</strong><span>Delivery<br>a consultar</span></div>
      <div class="sf-premium-sign">Tu mejor<br>momento, aquí.</div>
    </div>
  </div>`;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceHero,{once:true});else enhanceHero();
