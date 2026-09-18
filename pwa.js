let installPrompt=window.__PILAR_INSTALL_PROMPT__||null;
const isAdmin=location.pathname.startsWith('/admin');

function standalone(){
  return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
}
async function pwaInstalled(){
  if(standalone())return true;
  if('getInstalledRelatedApps' in navigator){
    try{
      const apps=await navigator.getInstalledRelatedApps();
      if(apps.some(app=>app.platform==='webapp'||app.url?.includes('pilar-relojes.vercel.app')))return true;
    }catch{}
  }
  return false;
}
function removeButton(){document.querySelector('.pilar-install')?.remove()}
async function requestInstall(){
  if(await pwaInstalled()){removeButton();return}
  installPrompt=installPrompt||window.__PILAR_INSTALL_PROMPT__||null;
  if(!installPrompt){removeButton();return}
  installPrompt.prompt();
  const choice=await installPrompt.userChoice;
  if(choice?.outcome==='accepted')removeButton();
  installPrompt=null;window.__PILAR_INSTALL_PROMPT__=null;
}
async function button(){
  if(isAdmin||await pwaInstalled()||!installPrompt||document.querySelector('.pilar-install'))return null;
  const b=document.createElement('button');
  b.className='pilar-install';b.type='button';b.setAttribute('aria-label','Instalar aplicación PILAR');
  b.innerHTML='<span aria-hidden="true" style="font-size:20px;line-height:1">↓</span><span>Instalar PILAR</span>';
  Object.assign(b.style,{position:'fixed',left:'16px',bottom:'16px',zIndex:'9999',display:'flex',alignItems:'center',gap:'9px',padding:'12px 16px',border:'1px solid rgba(218,177,92,.75)',borderRadius:'999px',background:'linear-gradient(135deg,#071d30,#0d3555)',color:'#f5d486',fontWeight:'800',fontSize:'14px',letterSpacing:'.15px',boxShadow:'0 8px 24px rgba(3,18,31,.28),0 0 0 1px rgba(255,255,255,.05) inset',cursor:'pointer',fontFamily:'inherit'});
  b.addEventListener('click',requestInstall);document.body.appendChild(b);return b;
}
if(!isAdmin){
  window.addEventListener('pilar-install-ready',async()=>{installPrompt=window.__PILAR_INSTALL_PROMPT__||installPrompt;await button()});
  window.addEventListener('beforeinstallprompt',async e=>{e.preventDefault();installPrompt=e;window.__PILAR_INSTALL_PROMPT__=e;await button()});
  window.addEventListener('appinstalled',()=>{installPrompt=null;window.__PILAR_INSTALL_PROMPT__=null;removeButton()});
  window.matchMedia('(display-mode: standalone)').addEventListener?.('change',e=>{if(e.matches)removeButton()});
  window.addEventListener('load',async()=>{installPrompt=installPrompt||window.__PILAR_INSTALL_PROMPT__||null;await button()});
}
