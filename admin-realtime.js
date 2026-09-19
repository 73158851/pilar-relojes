import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const S=createClient('https://lsuigiuthuycddlcvrds.supabase.co','sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu');
let timer=null,pending=false;
function refresh(){
  if(!document.querySelector('.padmin')||document.querySelector('.pa-login')){pending=false;return}
  if(document.querySelector('.pa-modal')){pending=true;return}
  const tab=new URLSearchParams(location.search).get('tab')||document.querySelector('.pa-tab.active')?.dataset.tab||'dash';
  window.dispatchEvent(new CustomEvent('pilar-admin-refresh',{detail:{tab}}));
  pending=false;
}
function schedule(){if(!document.querySelector('.padmin')||document.querySelector('.pa-login'))return;clearTimeout(timer);timer=setTimeout(refresh,220)}
const observer=new MutationObserver(()=>{if(pending&&!document.querySelector('.pa-modal'))schedule()});
observer.observe(document.body,{childList:true,subtree:true});
const channel=S.channel('pilar-admin-live')
  .on('postgres_changes',{event:'*',schema:'public',table:'products'},schedule)
  .on('postgres_changes',{event:'*',schema:'public',table:'product_images'},schedule)
  .on('postgres_changes',{event:'*',schema:'public',table:'categories'},schedule)
  .on('postgres_changes',{event:'*',schema:'public',table:'inventory_movements'},schedule)
  .on('postgres_changes',{event:'UPDATE',schema:'public',table:'settings',filter:'id=eq.1'},schedule)
  .subscribe(status=>{if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('PILAR: realtime admin no disponible:',status)});
window.addEventListener('focus',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.addEventListener('beforeunload',()=>S.removeChannel(channel),{once:true});
