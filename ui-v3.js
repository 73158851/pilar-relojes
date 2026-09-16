import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const S=createClient('https://lsuigiuthuycddlcvrds.supabase.co','sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const LOGO='https://lsuigiuthuycddlcvrds.supabase.co/storage/v1/object/public/product-images/87b25917-0e2e-46d1-92ab-f17b25d30d8f/1789530951622-1000503226.webp';

function installLogo(){
  $$('.brand').forEach(el=>{
    if(el.dataset.logoV3)return;
    el.dataset.logoV3='1';
    el.innerHTML=`<img class="pilar-logo-full" src="${LOGO}" alt="PILAR">`;
  });
}

function simplifyHome(){
  if(location.pathname!=='/'&&location.pathname!=='')return;
  const hero=$('.hero');
  if(hero){
    const image=hero.querySelector('.heroimg');
    if(image)image.remove();
    hero.classList.add('hero-no-watch');
    const h1=hero.querySelector('h1');
    if(h1)h1.innerHTML='Relojes con <b>presencia.</b>';
    const lead=hero.querySelector('.lead');
    if(lead)lead.textContent='Una selección curada para acompañar tu estilo. Explora el catálogo y consulta disponibilidad directamente por WhatsApp.';
  }
  $$('.benefits,.pilar-trust').forEach(x=>x.remove());
  const firstSection=$('main .section');
  if(firstSection){
    const eyebrow=firstSection.querySelector('.eyebrow');
    const title=firstSection.querySelector('h2');
    if(eyebrow)eyebrow.textContent='COLECCIÓN PILAR';
    if(title)title.textContent='Descubre la colección';
  }
}

async function rebuildFilters(){
  if(!['/catalogo','/nuevos','/ofertas'].includes(location.pathname))return;
  const tools=$('.tools');
  const grid=$('#grid');
  const count=$('#cnt');
  if(!tools||!grid||tools.dataset.v3)return;
  tools.dataset.v3='1';
  const {data:products}=await S.from('products').select('id,name,slug,brand,sku,price,previous_price,stock,color,featured,is_new,on_sale,visible,deleted_at,category_id,categories(name),product_images(*)').eq('visible',true).is('deleted_at',null).order('created_at',{ascending:false});
  const items=products||[];
  const brands=[...new Set(items.map(p=>p.brand).filter(Boolean))].sort();
  const styles=[...new Set(items.map(p=>p.categories?.name).filter(Boolean))].sort();
  tools.innerHTML=`<div class="filter-card"><div><span class="filter-label">MARCA</span><select id="v3brand" class="input"><option value="">Todas las marcas</option>${brands.map(x=>`<option value="${x}">${x}</option>`).join('')}</select></div><div><span class="filter-label">ESTILO</span><select id="v3style" class="input"><option value="">Todos los estilos</option>${styles.map(x=>`<option value="${x}">${x}</option>`).join('')}</select></div></div>`;
  function draw(){
    const b=$('#v3brand').value,s=$('#v3style').value;
    const visible=items.filter(p=>(!b||p.brand===b)&&(!s||p.categories?.name===s));
    const allowed=new Set(visible.map(p=>p.slug));
    $$('.card',grid).forEach(card=>{
      const link=card.querySelector('a[href^="/producto/"]');
      const slug=link?.getAttribute('href')?.split('/').pop();
      card.style.display=allowed.has(slug)?'':'none';
    });
    if(count)count.textContent=`${visible.length} producto${visible.length===1?'':'s'}`;
  }
  $('#v3brand').onchange=draw;$('#v3style').onchange=draw;draw();
}

function refineCards(){
  $$('.card').forEach(card=>{
    card.classList.add('premium-card');
    const buttons=card.querySelectorAll('.cardacts .btn');
    if(buttons[0])buttons[0].textContent='Ver reloj';
  });
}

function refineFooter(){
  const footer=$('footer');
  if(!footer||footer.dataset.v3)return;
  footer.dataset.v3='1';
  footer.innerHTML=`<div class="container premium-footer"><div class="footer-brand"><img src="${LOGO}" alt="PILAR"><p>Relojes seleccionados para cada estilo.</p></div><div><h4>Navegación</h4><a href="/catalogo">Catálogo</a><a href="/nuevos">Nuevos</a><a href="/ofertas">Ofertas</a></div><div><h4>Atención</h4><p>Lunes a domingo<br>07:00 – 22:00</p><a href="https://wa.me/59175431088" target="_blank">WhatsApp 75431088</a><p>Delivery: consultar por WhatsApp</p></div><div><h4>Ubicación</h4><p>Sucre, Bolivia</p><a href="https://vm.tiktok.com/ZS9STUusRg83g-6J3Zl/" target="_blank">TikTok PILAR</a></div></div><div class="footer-meta">© 2026 PILAR · Sucre, Bolivia</div>`;
}

function run(){installLogo();simplifyHome();refineCards();refineFooter();rebuildFilters();}
const obs=new MutationObserver(()=>run());obs.observe(document.body,{childList:true,subtree:true});run();setTimeout(run,500);setTimeout(run,1500);
