let installPrompt=null;
const isAdmin=location.pathname.startsWith('/admin');

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(err=>console.warn('PILAR PWA:',err)));
}

function installed(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}

function button(){
  if(isAdmin||installed()||document.querySelector('.pilar-install'))return null;
  const b=document.createElement('button');
  b.type='button';
  b.className='pilar-install';
  b.innerHTML='<span aria-hidden="true">↓</span> Instalar PILAR';
  Object.assign(b.style,{position:'fixed',left:'16px',bottom:'16px',zIndex:'9998',border:'1px solid rgba(199,164,90,.55)',background:'#0a1422',color:'#fff',padding:'11px 15px',borderRadius:'999px',font:'600 13px Arial,sans-serif',boxShadow:'0 8px 26px rgba(10,20,34,.2)',cursor:'pointer'});
  b.addEventListener('click',async()=>{
    if(!installPrompt)return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt=null;
    b.remove();
  });
  document.body.appendChild(b);
  return b;
}

window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  installPrompt=e;
  button();
});
window.addEventListener('appinstalled',()=>{
  installPrompt=null;
  document.querySelector('.pilar-install')?.remove();
});