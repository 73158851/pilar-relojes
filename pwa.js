let installPrompt=window.__PILAR_INSTALL_PROMPT__||null;
const isAdmin=location.pathname.startsWith('/admin');
function installed(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function installDialog(){
  if(document.querySelector('.pilar-install-dialog'))return;
  const d=document.createElement('div');d.className='pilar-install-dialog';
  d.innerHTML='<div role="dialog" aria-modal="true" aria-label="Instalar PILAR" style="width:min(88vw,360px);background:#fff;color:#102235;border-radius:22px;padding:24px;box-shadow:0 22px 60px rgba(0,0,0,.32);font-family:inherit"><div style="font-size:21px;font-weight:800;margin-bottom:9px">Instalar PILAR</div><div style="font-size:16px;line-height:1.45;margin-bottom:22px">¿Deseas instalar PILAR?</div><div style="display:flex;justify-content:flex-end;gap:10px"><button type="button" data-action="cancel" style="border:0;background:transparent;padding:10px 14px;font-weight:700;color:#52606d">Cancelar</button><button type="button" data-action="install" style="border:0;border-radius:12px;background:#0a2942;color:#f5d486;padding:10px 16px;font-weight:800">Instalar</button></div></div>';
  Object.assign(d.style,{position:'fixed',inset:'0',zIndex:'10001',display:'grid',placeItems:'center',background:'rgba(2,12,21,.52)',padding:'20px'});
  d.addEventListener('click',async e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(action==='cancel'){d.remove();return}if(action==='install'){d.remove();if(!installPrompt)return;installPrompt.prompt();const choice=await installPrompt.userChoice;if(choice?.outcome==='accepted')document.querySelector('.pilar-install')?.remove();installPrompt=null;}});
  document.body.appendChild(d);
}
async function requestInstall(){
  if(installed()){document.querySelector('.pilar-install')?.remove();return}
  if(!installPrompt)return;
  installDialog();
}
function button(){
  if(isAdmin||installed()||document.querySelector('.pilar-install'))return null;
  const b=document.createElement('button');
  b.className='pilar-install';
  b.type='button';
  b.setAttribute('aria-label','Instalar aplicación PILAR');
  b.innerHTML='<span aria-hidden="true" style="font-size:20px;line-height:1">↓</span><span>Instalar PILAR</span>';
  Object.assign(b.style,{
    position:'fixed',left:'16px',bottom:'16px',zIndex:'9999',
    display:'flex',alignItems:'center',gap:'9px',
    padding:'12px 16px',border:'1px solid rgba(218,177,92,.75)',
    borderRadius:'999px',background:'linear-gradient(135deg,#071d30,#0d3555)',
    color:'#f5d486',fontWeight:'800',fontSize:'14px',letterSpacing:'.15px',
    boxShadow:'0 8px 24px rgba(3,18,31,.28),0 0 0 1px rgba(255,255,255,.05) inset',
    cursor:'pointer',fontFamily:'inherit'
  });
  b.addEventListener('click',requestInstall);
  document.body.appendChild(b);
  return b;
}
if(!isAdmin){
  window.addEventListener('load',()=>button());
  window.addEventListener('pilar-install-ready',()=>{installPrompt=window.__PILAR_INSTALL_PROMPT__||installPrompt;button();});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;window.__PILAR_INSTALL_PROMPT__=e;button();});
  window.addEventListener('appinstalled',()=>{installPrompt=null;document.querySelector('.pilar-install')?.remove();});
  matchMedia('(display-mode: standalone)').addEventListener?.('change',e=>{if(e.matches)document.querySelector('.pilar-install')?.remove();});
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}else{
  const l=document.querySelector('link[rel="manifest"]');if(l)l.remove();
}
