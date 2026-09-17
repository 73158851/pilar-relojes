import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const S=createClient(
  'https://lsuigiuthuycddlcvrds.supabase.co',
  'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu'
);

let installPrompt=null;
let authorized=false;
const installed=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

function useAdminManifest(){
  let manifest=document.querySelector('link[rel="manifest"]');
  if(!manifest){manifest=document.createElement('link');manifest.rel='manifest';document.head.appendChild(manifest)}
  manifest.href='/admin-manifest.webmanifest?v=20260917-admin-pwa-1';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content','#080d14');
  document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content','PILAR Admin');
  let icon=document.querySelector('link[rel="apple-touch-icon"]');
  if(!icon){icon=document.createElement('link');icon.rel='apple-touch-icon';document.head.appendChild(icon)}
  icon.href='/pilar-admin-icon.svg?v=20260917-admin-pwa-1';
}

async function verifyAdmin(){
  const {data:{user}}=await S.auth.getUser();
  if(!user)return false;
  const {data,error}=await S.from('profiles').select('role').eq('id',user.id).maybeSingle();
  return !error&&data?.role==='admin';
}

function removeButton(){document.querySelector('.pilar-admin-install')?.remove()}

function showButton(){
  if(!authorized||!installPrompt||installed()||document.querySelector('.pilar-admin-install'))return;
  const b=document.createElement('button');
  b.type='button';
  b.className='pilar-admin-install pa-btn primary';
  b.innerHTML='⬇ Instalar PILAR Admin';
  Object.assign(b.style,{position:'fixed',right:'16px',bottom:'16px',zIndex:'10000',padding:'12px 17px',borderRadius:'999px',boxShadow:'0 10px 30px rgba(0,0,0,.25)'});
  b.onclick=async()=>{
    if(!authorized||!installPrompt)return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt=null;
    removeButton();
  };
  document.body.appendChild(b);
}

window.addEventListener('beforeinstallprompt',e=>{
  if(!location.pathname.startsWith('/admin'))return;
  e.preventDefault();
  installPrompt=e;
  showButton();
});

window.addEventListener('appinstalled',()=>{installPrompt=null;removeButton()});

if(location.pathname.startsWith('/admin')){
  authorized=await verifyAdmin();
  if(authorized){
    useAdminManifest();
    showButton();
  }
  S.auth.onAuthStateChange(async(event)=>{
    authorized=await verifyAdmin();
    if(authorized){useAdminManifest();showButton()}else removeButton();
  });
}
