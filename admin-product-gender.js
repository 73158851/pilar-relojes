import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const S=createClient('https://lsuigiuthuycddlcvrds.supabase.co','sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu');
let editingId=null;

document.addEventListener('click',e=>{
  const edit=e.target.closest?.('.editp');
  if(edit?.dataset?.id)editingId=edit.dataset.id;
  if(e.target.closest?.('#addp'))editingId=null;
},true);

async function enhance(modal){
  if(!modal||modal.dataset.genderReady==='1'||!modal.querySelector('#pcat'))return;
  modal.dataset.genderReady='1';
  const category=modal.querySelector('#pcat')?.closest('.pa-field');
  const field=document.createElement('div');
  field.className='pa-field pa-gender-field';
  field.innerHTML='<label for="pgender">Género</label><select id="pgender" class="pa-input"><option value="">Sin clasificar</option><option value="varon">Varón</option><option value="dama">Dama</option></select><small>Define dónde aparecerá este reloj en el catálogo.</small>';
  category?.after(field);
  if(editingId){
    const {data,error}=await S.from('products').select('gender').eq('id',editingId).limit(2);
    if(!error&&modal.isConnected&&(data||[]).length===1&&data[0]?.gender)modal.querySelector('#pgender').value=data[0].gender;
  }
}

const observer=new MutationObserver(()=>enhance(document.querySelector('.pa-modal')));
observer.observe(document.body,{childList:true,subtree:true});
enhance(document.querySelector('.pa-modal'));
