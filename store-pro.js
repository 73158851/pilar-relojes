import { availability as productAvailability } from '/storefront-state.js?v=20260919-final-cf-1';
const KEY='pilar_favorites_v1',BATCH=12;
const favs=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
const save=a=>localStorage.setItem(KEY,JSON.stringify([...new Set(a)]));
const productSlug=()=>location.pathname.startsWith('/producto/')?decodeURI(location.pathname.split('/').pop()):'';
function toast(t){let n=document.querySelector('.sfp-toast');if(!n){n=document.createElement('div');n.className='sfp-toast';document.body.appendChild(n)}n.textContent=t;n.classList.add('show');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),1800)}
function availability(stock){const a=productAvailability(stock,window.__PILAR_SETTINGS__||{});return[a.label,a.className]}
function slugFromCard(c){return decodeURIComponent((c.querySelector('a[href^="/producto/"]')?.getAttribute('href')||'').split('/').pop()||'')}
function enhanceCards(){document.querySelectorAll('.sf-card').forEach(c=>{if(c.dataset.pro)return;c.dataset.pro='1';const slug=slugFromCard(c);if(!slug)return;const media=c.querySelector('.sf-card-media');if(media&&!media.querySelector('.sfp-fav')){const b=document.createElement('button');b.className='sfp-fav';b.type='button';b.setAttribute('aria-label','Agregar a favoritos');b.dataset.slug=slug;b.innerHTML='♡';media.appendChild(b)}const img=c.querySelector('img');if(img){img.loading='lazy';img.decoding='async';img.classList.add('sfp-progressive');img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});if(img.complete)img.classList.add('loaded')}updateFavButtons()})}
function updateFavButtons(){const a=favs();document.querySelectorAll('.sfp-fav').forEach(b=>{const on=a.includes(b.dataset.slug);b.classList.toggle('active',on);b.innerHTML=on?'♥':'♡';b.setAttribute('aria-label',on?'Quitar de favoritos':'Agregar a favoritos')})}
function toggleFav(slug){let a=favs();const on=a.includes(slug);a=on?a.filter(x=>x!==slug):[...a,slug];save(a);updateFavButtons();toast(on?'Quitado de favoritos':'Guardado en favoritos')}
function detailTools(){const slug=productSlug();if(!slug)return;const info=document.querySelector('.sf-detail-info');if(!info||info.querySelector('.sfp-tools'))return;const price=info.querySelector('.sf-detail-price'),stockEl=info.querySelector('.sf-detail-stock'),name=info.querySelector('h1')?.textContent.trim()||'Reloj PILAR';const stock=Number(stockEl?.dataset.productStock||0);const [label,cls]=availability(stock);if(stockEl){stockEl.textContent=label;stockEl.classList.add('sfp-status',cls)}const tools=document.createElement('div');tools.className='sfp-tools';tools.innerHTML=`<div class="sfp-actions"><button class="sfp-detail-fav sfp-fav" data-slug="${slug}" aria-label="Favorito">♡</button><button class="sfp-share">↗ <span>Compartir</span></button></div>`;if(stockEl)stockEl.after(tools);else(price||info.firstChild).after(tools);updateFavButtons();tools.querySelector('.sfp-share').onclick=()=>shareProduct(name,price?.textContent?.trim()||'',label)}
async function shareProduct(name,price,status){const url=location.href,cleanPrice=price||'Precio a consultar',cleanStatus=status||'Consultar disponibilidad',text=`⌚ ${name}\n💰 ${cleanPrice}\n● ${cleanStatus}\n\nDescubre este modelo en PILAR Relojes Sucre.`;try{if(navigator.share){await navigator.share({title:`${name} | PILAR Relojes Sucre`,text,url})}else{await navigator.clipboard.writeText(`${text}\n${url}`);toast('Información y enlace copiados')}}catch(e){if(e.name!=='AbortError')toast('No se pudo compartir')}}
function blocks(){return}
function favoriteView(){
  if(location.pathname!=='/catalogo'||location.hash!=='#favoritos')return;
  const keep=new Set(favs()),page=document.querySelector('.sf-catalog-page'),grid=page?.querySelector('.sf-grid');
  if(!page||!grid)return;
  page.classList.add('sf-favorites-page');
  const title=page.querySelector('.sf-title'),sub=page.querySelector('.sf-catalog-sub'),count=page.querySelector('.sf-catalog-count');
  if(title)title.textContent='Mis favoritos';
  if(sub)sub.textContent='Los relojes que guardaste tocando el corazón.';
  let visible=0;
  [...grid.querySelectorAll('.sf-card')].forEach(card=>{const on=keep.has(slugFromCard(card));card.hidden=!on;if(on)visible++});
  grid.querySelector('.sf-favorites-empty')?.remove();
  if(!visible){const empty=document.createElement('div');empty.className='sf-empty sf-favorites-empty';empty.innerHTML='<strong>Aún no tienes favoritos.</strong><span>Toca el corazón de un reloj para guardarlo aquí.</span>';grid.appendChild(empty)}
  if(count)count.textContent=visible+' favorito'+(visible===1?'':'s');
  document.querySelectorAll('.sf-mobile-bottom a').forEach(a=>a.classList.remove('active'));
  document.querySelector('.sf-mobile-bottom a[href="/catalogo#favoritos"]')?.classList.add('active');
}
function improveImages(){document.querySelectorAll('.sf-card img,.sf-related img,.sf-thumb img').forEach(img=>{img.loading='lazy';img.decoding='async'});const main=document.getElementById('sf-main-img');if(main){main.decoding='async';main.fetchPriority='high'}}
function metaShare(){const slug=productSlug();if(!slug)return;const name=document.querySelector('.sf-detail-info h1')?.textContent?.trim();const img=document.getElementById('sf-main-img')?.src;if(!name)return;document.title=`${name} | PILAR`;const set=(p,c)=>{let m=document.head.querySelector(`meta[property="${p}"]`);if(!m){m=document.createElement('meta');m.setAttribute('property',p);document.head.appendChild(m)}m.content=c};set('og:title',`${name} | PILAR`);set('og:description','Reloj disponible en PILAR · Sucre, Bolivia. Consulta por WhatsApp.');set('og:url',location.href);set('og:type','product');if(img)set('og:image',img)}
function favoritesView(){
  if(location.hash!=='#favoritos')return;
  const page=document.querySelector('.sf-catalog-page');
  const grid=page?.querySelector('.sf-grid');
  if(!page||!grid)return;
  const selected=new Set(favs());
  page.querySelector('.sf-title')&&(page.querySelector('.sf-title').textContent='Mis favoritos');
  page.querySelector('.sf-catalog-sub')&&(page.querySelector('.sf-catalog-sub').textContent='Los relojes que marcaste con el corazón.');
  const cards=[...grid.querySelectorAll('.sf-card')];
  cards.forEach(card=>{card.hidden=!selected.has(slugFromCard(card))});
  const visible=cards.filter(card=>!card.hidden);
  const count=page.querySelector('.sf-catalog-count');
  if(count)count.textContent=visible.length+` reloj${visible.length===1?'':'es'}`;
  let empty=grid.querySelector('.sfp-favorites-empty');
  if(!visible.length&&!empty){empty=document.createElement('div');empty.className='sf-empty sfp-favorites-empty';empty.innerHTML='Aún no marcaste ningún reloj como favorito.<br><a href="/catalogo">Explorar catálogo</a>';grid.appendChild(empty)}
  if(visible.length&&empty)empty.remove();
}
function run(){enhanceCards();detailTools();blocks();improveImages();metaShare();favoritesView()}
document.addEventListener('click',e=>{const b=e.target.closest('.sfp-fav');if(!b)return;e.preventDefault();e.stopPropagation();toggleFav(b.dataset.slug);if(location.hash==='#favoritos')favoritesView()});
window.addEventListener('hashchange',()=>requestAnimationFrame(run));
const obs=new MutationObserver(()=>requestAnimationFrame(run));obs.observe(document.getElementById('app'),{childList:true,subtree:true});setTimeout(run,250);
const st=document.createElement('style');st.textContent=`.sf-card-media{position:relative}.sfp-fav{border:0;cursor:pointer}.sf-card-media .sfp-fav{position:absolute;z-index:4;right:8px;top:8px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.94);box-shadow:0 4px 13px rgba(10,20,30,.13);font-size:20px;color:#172033;display:grid;place-items:center}.sfp-fav.active{color:#b88927}.sfp-progressive{opacity:.2;filter:blur(5px);transition:opacity .3s,filter .35s}.sfp-progressive.loaded{opacity:1;filter:none}.sfp-tools{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 0 13px}.sfp-status{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;padding:7px 10px;border-radius:999px;background:#f5f5f2}.sfp-status i{width:7px;height:7px;border-radius:50%;background:currentColor}.sfp-status.ok{color:#26754a}.sfp-status.low{color:#a26d08}.sfp-status.out{color:#a13c3c}.sfp-actions{display:flex;gap:6px}.sfp-actions button{height:34px;padding:0 10px;border:1px solid #e4dfd5;border-radius:9px;background:#fff;color:#172033;font-size:11px;font-weight:750;cursor:pointer}.sfp-actions .sfp-detail-fav.active{color:#b88927}.sfp-more-wrap{text-align:center;padding:22px 0 6px}.sfp-more{border:1px solid #c8a75b;border-radius:10px;background:#111b2c;color:#fff;padding:12px 22px;font-weight:800;cursor:pointer}.sfp-more span{color:#d5ad4e}.sfp-more-wrap small{display:block;margin-top:8px;color:#8a8275}.sfp-toast{position:fixed;z-index:10050;left:50%;bottom:22px;transform:translate(-50%,20px);background:#111b2c;color:#fff;padding:10px 16px;border-radius:999px;font:700 12px system-ui;opacity:0;pointer-events:none;transition:.2s}.sfp-toast.show{opacity:1;transform:translate(-50%,0)}@media(max-width:600px){.sfp-tools{align-items:flex-start;flex-direction:column}.sfp-actions{width:100%}.sfp-actions button{flex:1}.sf-card-media .sfp-fav{width:28px;height:28px;font-size:17px;right:5px;top:5px}}`;document.head.appendChild(st);