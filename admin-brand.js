const PILAR_LOGO='https://lsuigiuthuycddlcvrds.supabase.co/storage/v1/object/public/product-images/87b25917-0e2e-46d1-92ab-f17b25d30d8f/1789530951622-1000503226.webp?v=20260916';

function logoMarkup(cls){
  return `<span class="admin-logo-shell"><img class="${cls}" src="${PILAR_LOGO}" alt="Logo PILAR" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="admin-logo-fallback">PILAR</span></span>`;
}

function ensureToast(){
  let toast=document.querySelector('.admin-update-toast');
  if(toast) return toast;
  toast=document.createElement('div');
  toast.className='admin-update-toast';
  toast.textContent='Tienda actualizada correctamente';
  document.body.appendChild(toast);
  return toast;
}

function ensureRefreshButton(side){
  if(!side || side.querySelector('.admin-refresh-store')) return;
  const button=document.createElement('button');
  button.type='button';
  button.className='admin-refresh-store';
  button.innerHTML='<span class="refresh-icon">↻</span><span>Actualizar tienda</span>';
  button.title='Confirmar los cambios guardados en la tienda';
  button.addEventListener('click',()=>{
    const toast=ensureToast();
    button.classList.add('done');
    const old=button.innerHTML;
    button.innerHTML='<span class="refresh-icon">✓</span><span>Actualizada</span>';
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),2200);
    setTimeout(()=>{button.innerHTML=old;button.classList.remove('done');},1800);
  });
  side.appendChild(button);
}

function applyAdminBrand(){
  const login=document.querySelector('.loginbox .brand');
  if(login&&!login.querySelector('.login-brand-logo')) login.innerHTML=logoMarkup('login-brand-logo');

  const sideBrand=document.querySelector('.side .brand');
  if(sideBrand&&!sideBrand.querySelector('.admin-brand-logo')) sideBrand.innerHTML=logoMarkup('admin-brand-logo');

  const side=document.querySelector('.side');
  ensureRefreshButton(side);
}

const observer=new MutationObserver(applyAdminBrand);
observer.observe(document.getElementById('app'),{childList:true,subtree:true});
applyAdminBrand();