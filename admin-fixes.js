const ICONS={
  whatsapp:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.2 8.3c.3-.3.7-.2.9.2l.7 1.5c.1.3.1.6-.1.8l-.5.5c.6 1.2 1.5 2.1 2.8 2.7l.5-.6c.2-.2.5-.3.8-.1l1.5.7c.4.2.5.6.2.9-.5.7-1.2 1-2 1-2.7-.2-6-3.4-6.3-6.1 0-.6.5-1.2 1.5-1.5Z" fill="currentColor"/></svg>',
  location:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.2" fill="currentColor"/></svg>',
  tiktok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4v10.2a4.2 4.2 0 1 1-3.6-4.1v2.5a1.8 1.8 0 1 0 1.2 1.7V4h2.4Zm0 0c.5 2.2 1.8 3.5 4 4v2.4c-1.7-.2-3-.9-4-1.8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  stock:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4zM7 4h10v3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 11h8M8 15h5" stroke="currentColor" stroke-width="1.8"/></svg>'
};

function hideColorField(modal){
  const color=modal.querySelector('#pcolor');
  const wrap=color?.parentElement;
  if(wrap){wrap.style.display='none';wrap.setAttribute('aria-hidden','true');}
}

function enhanceFilePicker(modal){
  const input=modal.querySelector('#pimg');
  if(!input||input.dataset.proPicker==='1') return;
  input.dataset.proPicker='1';
  input.classList.add('native-photo-input');
  const holder=input.parentElement;
  const box=document.createElement('div');
  box.className='photo-picker-pro';
  box.innerHTML='<button type="button" class="photo-picker-button"><span>＋</span> Seleccionar fotos</button><span class="photo-picker-status">Ninguna foto seleccionada</span>';
  holder.insertBefore(box,input);
  const button=box.querySelector('.photo-picker-button');
  const status=box.querySelector('.photo-picker-status');
  button.onclick=()=>input.click();
  input.addEventListener('change',()=>{
    const n=input.files?.length||0;
    status.textContent=n?`${n} foto${n===1?'':'s'} seleccionada${n===1?'':'s'}`:'Ninguna foto seleccionada';
  });
}

function enhanceSaveActions(modal){
  const save=modal.querySelector('#savep');
  const input=modal.querySelector('#pimg');
  if(!save||!input||save.dataset.photoActions==='1') return;
  save.dataset.photoActions='1';
  const wrap=save.parentElement;
  wrap.classList.add('product-save-actions');
  const add=document.createElement('button');
  add.type='button';
  add.className='btn light add-photos-inline';
  add.innerHTML='<span class="add-photo-icon">＋</span> Agregar más fotos';
  add.onclick=()=>input.click();
  wrap.insertBefore(add,save);
}

function removeDuplicateGallery(modal){
  modal.querySelectorAll('.extra-image-manager-v2').forEach(el=>el.remove());
}

function decorateSettings(){
  const panel=document.querySelector('#swa')?.closest('.panel');
  if(!panel||panel.dataset.settingsPro==='1') return;
  panel.dataset.settingsPro='1';
  panel.classList.add('settings-panel-pro');
  const rows=[['swa','whatsapp','WhatsApp'],['sloc','location','Ubicación'],['stik','tiktok','TikTok'],['slow','stock','Umbral stock bajo']];
  rows.forEach(([id,icon,label])=>{
    const input=document.getElementById(id);
    const lab=input?.parentElement?.querySelector('label');
    if(!lab||lab.querySelector('.setting-icon')) return;
    lab.innerHTML=`<span class="setting-icon">${ICONS[icon]}</span><span>${label}</span>`;
    input.parentElement.classList.add('setting-field-pro');
  });
  document.getElementById('sshow')?.parentElement?.classList.add('setting-check-pro');
}

function enhanceModal(modal){
  if(!modal||!modal.querySelector('#psku')) return;
  hideColorField(modal);
  removeDuplicateGallery(modal);
  enhanceFilePicker(modal);
  enhanceSaveActions(modal);
}

function run(){
  document.querySelectorAll('.modal').forEach(enhanceModal);
  decorateSettings();
}

const observer=new MutationObserver(run);
observer.observe(document.getElementById('app'),{childList:true,subtree:true});
observer.observe(document.body,{childList:true,subtree:true});
run();