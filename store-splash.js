if(!location.pathname.startsWith('/admin')){
  const splash=document.createElement('div');
  splash.className='pilar-splash';
  splash.setAttribute('aria-hidden','true');
  splash.innerHTML=`<div class="pilar-splash-mark"><span class="pilar-splash-crown">♕</span><strong>PILAR</strong><i></i></div>`;
  document.body.prepend(splash);
  requestAnimationFrame(()=>splash.classList.add('is-visible'));
  window.setTimeout(()=>{
    splash.classList.add('is-leaving');
    splash.addEventListener('animationend',()=>splash.remove(),{once:true});
    window.setTimeout(()=>splash.remove(),650);
  },2500);
}
