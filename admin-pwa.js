import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const S=createClient(
  'https://lsuigiuthuycddlcvrds.supabase.co',
  'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu'
);

let installPrompt=null;
let authorized=false;
const isAdminPath=location.pathname.startsWith('/admin');

function adminInstalled(){
  if(!window.matchMedia('(display-mode: standalone)').matches&&window.navigator.standalone!==true)return false;
  return location.pathname.startsWith('/admin');
}

async function registerAdminWorker(){
  if(!isAdminPath||!('serviceWorker' in navigator))return;
  try{
    await navigator.serviceWorker.register('/admin-sw.js',{scope:'/admin/'});
  }catch(err){console.warn('PILAR Admin PWA:',err)}
}

async function verifyAdmin(){
  const {data:{user}}=await S.auth.getUser();
  if(!user)return false;
  const {data,error}=await S.from('profiles').select('role').eq('id',user.id).maybeSingle();
  return !error&&data?.role==='admin';
}

function removeButton(){document.querySelector('.pilar-admin-install')?.remove()}

function showButton(){
  if(!authorized||!installPrompt||adminInstalled()||document.querySelector('.pilar-admin-install'))return;
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

if(isAdminPath){
  await registerAdminWorker();

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    installPrompt=e;
    showButton();
  });

  window.addEventListener('appinstalled',()=>{installPrompt=null;removeButton()});

  authorized=await verifyAdmin();
  showButton();

  S.auth.onAuthStateChange(async()=>{
    authorized=await verifyAdmin();
    if(authorized)showButton();else removeButton();
  });
}