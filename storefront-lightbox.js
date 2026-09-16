const style=document.createElement('style');
style.textContent=`
.sf-gallery-main{position:relative;cursor:zoom-in}.sf-gallery-main:after{content:'⛶';position:absolute;right:10px;bottom:10px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(17,24,39,.78);color:#fff;font-size:17px;box-shadow:0 5px 16px rgba(0,0,0,.18);pointer-events:none}.sf-gallery-main:hover:after{background:#111827}
.pilar-lightbox{position:fixed;inset:0;z-index:9999;background:rgba(5,9,16,.96);display:none;align-items:center;justify-content:center;padding:18px}.pilar-lightbox.open{display:flex}.pilar-lightbox-stage{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}.pilar-lightbox-img{max-width:94vw;max-height:90vh;width:auto;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none}.pilar-lightbox-close{position:absolute;top:8px;right:8px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.13);color:#fff;font-size:30px;line-height:1;cursor:pointer;z-index:2}.pilar-lightbox-close:hover{background:rgba(255,255,255,.22)}.pilar-lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);width:46px;height:56px;border:0;border-radius:12px;background:rgba(255,255,255,.12);color:#fff;font-size:30px;cursor:pointer}.pilar-lightbox-prev{left:8px}.pilar-lightbox-next{right:8px}.pilar-lightbox-nav:hover{background:rgba(255,255,255,.22)}.pilar-lightbox-count{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);padding:7px 11px;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font:700 12px/1 system-ui,sans-serif;letter-spacing:.4px}.pilar-lightbox-hint{position:absolute;top:14px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.7);font:600 11px/1.2 system-ui,sans-serif;white-space:nowrap}
@media(max-width:680px){.sf-gallery-main:after{width:30px;height:30px;right:6px;bottom:6px;font-size:15px}.pilar-lightbox{padding:0}.pilar-lightbox-img{max-width:100vw;max-height:88vh}.pilar-lightbox-close{top:12px;right:12px;width:42px;height:42px;background:rgba(0,0,0,.45)}.pilar-lightbox-nav{width:42px;height:52px;background:rgba(0,0,0,.4)}.pilar-lightbox-prev{left:6px}.pilar-lightbox-next{right:6px}.pilar-lightbox-count{bottom:14px}.pilar-lightbox-hint{top:18px;font-size:10px}}
`;
document.head.appendChild(style);

let box=null,viewer=null,count=null,prev=null,next=null,images=[],index=0,touchX=0;
function ensureLightbox(){
  if(box)return;
  box=document.createElement('div');box.className='pilar-lightbox';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Vista ampliada del reloj');
  box.innerHTML=`<div class="pilar-lightbox-stage"><div class="pilar-lightbox-hint">Vista ampliada · toca × para cerrar</div><button class="pilar-lightbox-close" aria-label="Cerrar">×</button><button class="pilar-lightbox-nav pilar-lightbox-prev" aria-label="Foto anterior">‹</button><img class="pilar-lightbox-img" alt="Vista ampliada del reloj"><button class="pilar-lightbox-nav pilar-lightbox-next" aria-label="Foto siguiente">›</button><div class="pilar-lightbox-count"></div></div>`;
  document.body.appendChild(box);viewer=box.querySelector('.pilar-lightbox-img');count=box.querySelector('.pilar-lightbox-count');prev=box.querySelector('.pilar-lightbox-prev');next=box.querySelector('.pilar-lightbox-next');
  box.querySelector('.pilar-lightbox-close').onclick=close;
  prev.onclick=e=>{e.stopPropagation();show(index-1)};next.onclick=e=>{e.stopPropagation();show(index+1)};
  box.addEventListener('click',e=>{if(e.target===box||e.target.classList.contains('pilar-lightbox-stage'))close()});
  box.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
  box.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1))},{passive:true});
}
function collect(){
  const thumbs=[...document.querySelectorAll('.sf-thumb img')].map(i=>i.currentSrc||i.src).filter(Boolean);
  const main=document.getElementById('sf-main-img');const mainSrc=main?.currentSrc||main?.src;
  images=[...new Set([mainSrc,...thumbs].filter(Boolean))];
}
function show(i){if(!images.length)return;index=(i+images.length)%images.length;viewer.src=images[index];count.textContent=`${index+1} / ${images.length}`;const multi=images.length>1;prev.style.display=multi?'block':'none';next.style.display=multi?'block':'none'}
function open(src){ensureLightbox();collect();const found=images.indexOf(src);index=found>=0?found:0;show(index);box.classList.add('open');document.body.style.overflow='hidden'}
function close(){if(!box)return;box.classList.remove('open');document.body.style.overflow=''}

document.addEventListener('click',e=>{const img=e.target.closest('#sf-main-img');if(!img)return;e.preventDefault();open(img.currentSrc||img.src)});
document.addEventListener('keydown',e=>{if(!box?.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});
