import{createClient}from'https://esm.sh/@supabase/supabase-js@2';
const S=createClient('https://lsuigiuthuycddlcvrds.supabase.co','sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu');
const css=document.createElement('link');css.rel='stylesheet';css.href='/admin-enhance.css';document.head.appendChild(css);

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function notify(msg,type='ok'){let n=document.querySelector('.pax-notice');if(!n){n=document.createElement('div');n.className='pax-notice';document.body.appendChild(n)}n.className=`pax-notice ${type} show`;n.textContent=msg;clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),2600)}

async function compressImage(file){
  if(!file.type.startsWith('image/')||file.size<700000)return file;
  try{
    const bmp=await createImageBitmap(file),max=1600,scale=Math.min(1,max/Math.max(bmp.width,bmp.height));
    const w=Math.max(1,Math.round(bmp.width*scale)),h=Math.max(1,Math.round(bmp.height*scale));
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    canvas.getContext('2d',{alpha:false}).drawImage(bmp,0,0,w,h);bmp.close?.();
    const blob=await new Promise(r=>canvas.toBlob(r,'image/webp',.82));
    if(!blob||blob.size>=file.size)return file;
    return new File([blob],file.name.replace(/\.[^.]+$/,'.webp'),{type:'image/webp',lastModified:Date.now()});
  }catch{return file}
}

let compressing=false;
document.addEventListener('change',async e=>{
  if(e.target?.id!=='pfiles'||compressing||!e.target.files?.length)return;
  compressing=true;
  const input=e.target,files=[...input.files];
  const status=input.closest('.pa-form')?.querySelector('#pfiletext');
  if(status)status.textContent='Optimizando imágenes…';
  const optimized=[];for(const f of files)optimized.push(await compressImage(f));
  const dt=new DataTransfer();optimized.forEach(f=>dt.items.add(f));input.files=dt.files;
  if(status){const before=files.reduce((a,f)=>a+f.size,0),after=optimized.reduce((a,f)=>a+f.size,0);status.textContent=`${optimized.length} foto${optimized.length===1?'':'s'} lista${optimized.length===1?'':'s'} · ${Math.max(1,Math.round((1-after/before)*100))}% menos peso`}
  compressing=false;
},true);

function addAdminToolbar(){
  const title=[...document.querySelectorAll('.pa-title')].find(x=>['Productos','Inventario'].includes(x.textContent.trim()));
  if(!title)return;
  const page=title.textContent.trim();
  const card=title.closest('.pa-main')?.querySelector('.pa-card');if(!card||card.querySelector('.pax-toolbar'))return;
  const toolbar=document.createElement('div');toolbar.className='pax-toolbar';
  toolbar.innerHTML=`<div class="pax-search"><span>⌕</span><input type="search" placeholder="Buscar por nombre o código"></div><div class="pax-filters"><button class="active" data-filter="all">Todos</button><button data-filter="available">Disponibles</button><button data-filter="out">Agotados</button><button data-filter="hidden">Ocultos</button>${page==='Productos'?'<button data-filter="sale">Ofertas</button>':''}</div>`;
  card.insertBefore(toolbar,card.firstChild);
  const input=toolbar.querySelector('input');let current='all';
  function apply(){const q=norm(input.value);card.querySelectorAll('tbody tr').forEach(row=>{const txt=norm(row.textContent),stockCell=row.children[page==='Productos'?3:2],stock=Number(stockCell?.textContent.trim()||0),hidden=/oculto/i.test(row.textContent),sale=/oferta/i.test(row.textContent);let ok=!q||txt.includes(q);if(current==='available')ok=ok&&stock>0;if(current==='out')ok=ok&&stock<=0;if(current==='hidden')ok=ok&&hidden;if(current==='sale')ok=ok&&sale;row.style.display=ok?'':'none'})}
  input.addEventListener('input',apply);toolbar.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{toolbar.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');current=b.dataset.filter;apply()});
}

async function addDashboardAttention(){
  const title=[...document.querySelectorAll('.pa-title')].find(x=>x.textContent.trim()==='Dashboard');if(!title)return;
  const main=title.closest('.pa-main');if(!main||main.querySelector('.pax-attention'))return;
  const{data}=await S.from('products').select('id,name,sku,stock,visible,updated_at').is('deleted_at',null).order('updated_at',{ascending:false}).limit(50);
  if(!document.body.contains(main)||main.querySelector('.pax-attention'))return;
  const low=(data||[]).filter(p=>Number(p.stock)>0&&Number(p.stock)<=3),out=(data||[]).filter(p=>Number(p.stock)<=0),recent=(data||[]).slice(0,4);
  const box=document.createElement('section');box.className='pax-attention';box.innerHTML=`<div class="pax-attention-head"><div><h3>Requieren atención</h3><p>Resumen operativo para gestionar la tienda rápidamente.</p></div></div><div class="pax-attention-grid"><div><b>${out.length}</b><span>Agotados</span><small>Se ocultan automáticamente en la tienda pública.</small></div><div><b>${low.length}</b><span>Stock bajo</span><small>${low.slice(0,2).map(x=>x.name).join(' · ')||'Sin alertas'}</small></div><div class="pax-recent"><b>Últimos cambios</b>${recent.map(x=>`<span>${x.name} · ${x.stock} u.</span>`).join('')}</div></div>`;main.appendChild(box);
}

function rememberInitialSku(){document.querySelectorAll('.pa-modal #psku').forEach(i=>{if(i.dataset.initialSku===undefined)i.dataset.initialSku=i.value.trim()})}

function enhanceLogin(){const box=document.querySelector('.pa-loginbox');if(!box||box.querySelector('.pax-forgot'))return;const button=document.createElement('button');button.type='button';button.className='pax-forgot';button.textContent='¿Olvidaste tu contraseña?';button.onclick=async()=>{const email=box.querySelector('#lemail')?.value.trim();if(!email){notify('Escribe primero tu correo de administrador.','error');box.querySelector('#lemail')?.focus();return}const{error}=await S.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/admin`});if(error)return notify(error.message,'error');notify('Te enviamos un enlace para recuperar tu contraseña.')};box.appendChild(button)}

const obs=new MutationObserver(()=>{rememberInitialSku();addAdminToolbar();addDashboardAttention();enhanceLogin()});obs.observe(document.getElementById('app'),{childList:true,subtree:true});
rememberInitialSku();addAdminToolbar();addDashboardAttention();enhanceLogin();
