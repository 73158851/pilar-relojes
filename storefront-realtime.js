import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { renderCurrentRoute } from '/storefront.js';

const S=createClient('https://lsuigiuthuycddlcvrds.supabase.co','sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu');
let timer=null,running=false,pending=false;
async function refresh(){
  if(running){pending=true;return}
  running=true;
  try{await renderCurrentRoute()}catch(e){console.warn('PILAR: no se pudo sincronizar la vista',e)}
  finally{running=false;if(pending){pending=false;schedule()}}
}
function schedule(){clearTimeout(timer);timer=setTimeout(refresh,180)}
const channel=S.channel('pilar-storefront-live')
  .on('postgres_changes',{event:'*',schema:'public',table:'products'},schedule)
  .on('postgres_changes',{event:'*',schema:'public',table:'product_images'},schedule)
  .on('postgres_changes',{event:'*',schema:'public',table:'categories'},schedule)
  .on('postgres_changes',{event:'UPDATE',schema:'public',table:'settings',filter:'id=eq.1'},schedule)
  .subscribe(status=>{if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('PILAR: realtime público no disponible:',status)});
window.addEventListener('focus',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.addEventListener('beforeunload',()=>S.removeChannel(channel),{once:true});
