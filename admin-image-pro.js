const MAX=1400,QUALITY=0.80;
const human=n=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(0)} KB`:`${(n/1048576).toFixed(1)} MB`;
function dimensions(file){return new Promise(resolve=>{const img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{resolve({w:img.naturalWidth,h:img.naturalHeight});URL.revokeObjectURL(u)};img.onerror=()=>{resolve({w:0,h:0});URL.revokeObjectURL(u)};img.src=u})}
function loadImage(file){return new Promise((resolve,reject)=>{const img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{URL.revokeObjectURL(u);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(u);reject(new Error('No se pudo leer esta imagen en el navegador. Usa JPG, PNG o WEBP.'))};img.src=u})}
async function optimizeFile(file){
 if(!file)return file;
 const type=String(file.type||'').toLowerCase();
 const name=String(file.name||'imagen');
 const supported=/image\/(jpeg|jpg|png|webp)/.test(type)||/\.(jpe?g|png|webp)$/i.test(name);
 if(!supported)throw new Error('Formato de imagen no compatible. Selecciona una foto JPG, PNG o WEBP.');
 let source=null,close=()=>{};
 try{source=await createImageBitmap(file);close=()=>source.close?.()}catch{source=await loadImage(file)}
 const sw=source.width||source.naturalWidth,sh=source.height||source.naturalHeight;
 if(!sw||!sh)throw new Error('La imagen no tiene dimensiones válidas.');
 const scale=Math.min(1,MAX/Math.max(sw,sh)),w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale)),canvas=document.createElement('canvas');
 canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(source,0,0,w,h);close();
 const blob=await new Promise(r=>canvas.toBlob(r,'image/webp',QUALITY));
 if(!blob)throw new Error('No se pudo convertir la imagen. Prueba con otra foto JPG o PNG.');
 return new File([blob],name.replace(/\.[^.]+$/,'.webp'),{type:'image/webp',lastModified:file.lastModified||Date.now()})
}
window.PilarImagePro={optimizeFile};
async function preview(input,modal){let box=modal.querySelector('.pilar-image-preview');if(!box){box=document.createElement('div');box.className='pilar-image-preview';input.closest('.pa-upload')?.after(box)}box.innerHTML='';for(const file of [...input.files]){const d=await dimensions(file),url=URL.createObjectURL(file),card=document.createElement('div');card.className='pilar-preview-card';card.innerHTML=`<img src="${url}" alt="Vista previa"><div><strong>${file.name}</strong><span>${d.w}×${d.h} · ${human(file.size)}</span>${Math.max(d.w,d.h)<700?'<small>⚠ Resolución baja</small>':'<small>Se optimizará automáticamente a WEBP</small>'}</div>`;card.querySelector('img').onload=()=>URL.revokeObjectURL(url);box.appendChild(card)}}
function enhance(modal){if(!modal||modal.dataset.imagePro==='1')return;modal.dataset.imagePro='1';const input=modal.querySelector('#pfiles');if(input){input.addEventListener('change',()=>preview(input,modal));const small=modal.querySelector('#pfiletext');if(small)small.textContent='JPG, PNG o WEBP · optimización automática · máximo recomendado 1600 px'}}
new MutationObserver(()=>enhance(document.querySelector('.pa-modal'))).observe(document.body,{childList:true,subtree:true});
enhance(document.querySelector('.pa-modal'));
