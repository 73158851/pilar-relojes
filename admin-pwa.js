import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const S=createClient(
  'https://lsuigiuthuycddlcvrds.supabase.co',
  'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu'
);

let installPrompt=window.__PILAR_ADMIN_INSTALL_PROMPT__||null;
let authenticated=false;
const isAdminPath=location.pathname.startsWith('/admin');

function adminInstalled(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}

async function registerAdminWorker(){
  if(!isAdminPath||!('serviceWorker' in navigator))return;
  try{
    const reg=await navigator.serviceWorker.register('/admin-sw.js?v=20260919-admin-sw-5',{scope:'/admin'});
    await navigator.serviceWorker.ready;
    return reg;
  }catch(err){console.warn('PILAR Admin PWA:',err)}
}

async function hasSession(){const {data:{user}}=await S.auth.getUser();if(!user)return false;const{data,error}=await S.from('profiles').select('role').eq('id',user.id).maybeSingle();return !error&&data?.role==='admin'}
function removeButton(){document.querySelector('.pilar-admin-install')?.remove()}
function showInstallHelp(){alert('Chrome aún no habilitó la instalación nativa. Cierra esta pestaña, vuelve a abrir el enlace de PILAR Admin en Chrome y espera unos segundos. Si continúa igual, toca ⋮ y revisa si aparece “Instalar aplicación”.')}

function showButton(){
  installPrompt=installPrompt||window.__PILAR_ADMIN_INSTALL_PROMPT__||null;
  if(!authenticated||adminInstalled()||document.querySelector('.pilar-admin-install'))return;
  const b=document.createElement('button');
  b.type='button';b.className='pilar-admin-install pa-btn primary';b.innerHTML='⬇ Instalar PILAR Admin';
  Object.assign(b.style,{position:'fixed',right:'16px',bottom:'16px',zIndex:'10000',padding:'12px 17px',borderRadius:'999px',boxShadow:'0 10px 30px rgba(0,0,0,.25)',fontWeight:'800'});
  b.onclick=async()=>{
    const prompt=installPrompt||window.__PILAR_ADMIN_INSTALL_PROMPT__;
    if(!prompt){showInstallHelp();return}
    prompt.prompt();
    const result=await prompt.userChoice;
    if(result.outcome==='accepted'){installPrompt=null;window.__PILAR_ADMIN_INSTALL_PROMPT__=null;removeButton()}
  };
  document.body.appendChild(b);
}

async function syncAuth(){authenticated=await hasSession();if(authenticated)showButton();else removeButton()}

if(isAdminPath){
  window.addEventListener('pilar-admin-install-ready',()=>{installPrompt=window.__PILAR_ADMIN_INSTALL_PROMPT__||installPrompt;showButton()});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;window.__PILAR_ADMIN_INSTALL_PROMPT__=e;showButton()});
  window.addEventListener('appinstalled',()=>{installPrompt=null;window.__PILAR_ADMIN_INSTALL_PROMPT__=null;removeButton()});
  await registerAdminWorker();
  await syncAuth();
  S.auth.onAuthStateChange(syncAuth);
}