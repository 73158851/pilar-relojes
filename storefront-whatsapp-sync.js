import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase=createClient(
  'https://lsuigiuthuycddlcvrds.supabase.co',
  'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu'
);

let currentRaw='';
let applying=false;

function normalizePhone(value){
  let digits=String(value||'').replace(/\D/g,'');
  if(!digits)return {target:'59175431088',display:'75431088'};
  if(digits.length===8)digits='591'+digits;
  const display=digits.startsWith('591')&&digits.length>=11?digits.slice(-8):digits;
  return {target:digits,display};
}

function applyWhatsApp(value){
  if(applying)return;
  applying=true;
  const {target,display}=normalizePhone(value);

  document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{
    try{
      const url=new URL(a.href,location.origin);
      const text=url.searchParams.get('text');
      a.href=`https://wa.me/${target}${text?`?text=${encodeURIComponent(text)}`:''}`;
    }catch{
      a.href=`https://wa.me/${target}`;
    }
  });

  const drawer=document.querySelector('.sf-drawer-wa span');
  if(drawer)drawer.textContent=`WhatsApp ${display}`;

  const footer=document.querySelector('.sf-footer-wa span');
  if(footer)footer.textContent=display;

  document.querySelectorAll('.sf-contact-card .sf-btn-wa span').forEach(el=>{
    el.textContent=`WhatsApp ${display}`;
  });

  document.querySelectorAll('[data-pilar-whatsapp]').forEach(el=>{
    el.textContent=display;
  });

  applying=false;
}

async function refreshWhatsApp(){
  const {data,error}=await supabase.from('settings').select('whatsapp').eq('id',1).maybeSingle();
  if(error){console.warn('PILAR: no se pudo leer WhatsApp desde configuración',error);return}
  const next=String(data?.whatsapp||'').trim();
  if(!next)return;
  currentRaw=next;
  applyWhatsApp(next);
}

const observer=new MutationObserver(()=>{
  if(currentRaw)requestAnimationFrame(()=>applyWhatsApp(currentRaw));
});
observer.observe(document.getElementById('app'),{childList:true,subtree:true});

window.addEventListener('focus',refreshWhatsApp);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshWhatsApp()});

try{
  supabase.channel('pilar-settings-whatsapp')
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'settings',filter:'id=eq.1'},payload=>{
      const value=payload.new?.whatsapp;
      if(value){currentRaw=String(value);applyWhatsApp(currentRaw)}
    })
    .subscribe();
}catch(e){console.warn('PILAR: realtime WhatsApp no disponible',e)}

refreshWhatsApp();
