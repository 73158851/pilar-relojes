const isAdmin=location.pathname.startsWith('/admin');
const isAndroidApp=document.referrer.startsWith('android-app://com.pilar.relojes');
const APK_URL='https://pilar-apk.angelitoortiz101.workers.dev/PILAR-1.0.0.apk';

function installed(){
  return isAndroidApp||window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
}
function button(){
  if(isAdmin||installed()||document.querySelector('.pilar-install'))return null;
  const b=document.createElement('a');
  b.className='pilar-install';
  b.href=APK_URL;
  b.download='PILAR-1.0.0.apk';
  b.innerHTML='<span aria-hidden="true">↓</span> Instalar PILAR';
  Object.assign(b.style,{position:'fixed',left:'16px',bottom:'16px',zIndex:'9998',border:'1px solid rgba(199,164,90,.55)',background:'#0a1422',color:'#fff',padding:'11px 15px',borderRadius:'999px',font:'600 13px Arial,sans-serif',boxShadow:'0 8px 26px rgba(10,20,34,.2)',cursor:'pointer',textDecoration:'none'});
  document.body.appendChild(b);
  return b;
}
if(!isAdmin)window.addEventListener('load',button);
