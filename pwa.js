let installPrompt=null;
const isAdmin=location.pathname.startsWith('/admin');
function installed(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function showInstallHelp(){alert('Para instalar PILAR en Chrome, toca el menú ⋮ y elige “Instalar aplicación” o “Agregar a pantalla de inicio”.')}
async function requestInstall(){
  if(installed()){document.querySelector('.pilar-install')?.remove();return}
  if(!installPrompt){showInstallHelp();return}
  installPrompt.prompt();
  const choice=await installPrompt.userChoice;
  if(choice?.outcome==='accepted'){document.querySelector('.pilar-install')?.remove()}
  installPrompt=null;
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
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;button();});
  window.addEventListener('appinstalled',()=>{installPrompt=null;document.querySelector('.pilar-install')?.remove();});
  matchMedia('(display-mode: standalone)').addEventListener?.('change',e=>{if(e.matches)document.querySelector('.pilar-install')?.remove();});
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}else{
  const l=document.querySelector('link[rel="manifest"]');if(l)l.remove();
}
