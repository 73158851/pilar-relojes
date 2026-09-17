const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function storefront(){return document.querySelector('.storefront')}

function revealTargets(){
  const root=storefront();
  if(!root)return;
  root.classList.add('motion-ready');

  const targets=[
    ...document.querySelectorAll('.sf-hero .sf-kicker,.sf-hero h1,.sf-hero .sf-lead,.sf-hero .sf-actions,.sf-hero .sf-meta,.sf-section-head,.sf-catalog-head,.sf-product-gallery,.sf-detail-info,.sf-contact-card,.sf-footer-grid,.sf-card')
  ];

  if(reduceMotion||!('IntersectionObserver' in window)){
    targets.forEach(el=>el.classList.add('is-visible'));
    return;
  }

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      if(el.classList.contains('sf-card')){
        const grid=el.parentElement;
        const cards=[...(grid?.querySelectorAll('.sf-card')||[])];
        const index=Math.max(0,cards.indexOf(el)%6);
        el.style.transitionDelay=`${Math.min(index*45,225)}ms`;
      }
      el.classList.add('is-visible');
      observer.unobserve(el);
    });
  },{threshold:.08,rootMargin:'0px 0px -20px 0px'});

  targets.forEach(el=>{
    if(el.dataset.motionObserved)return;
    el.dataset.motionObserved='1';
    observer.observe(el);
  });
}

function headerMotion(){
  const root=storefront();
  if(!root)return;
  root.classList.toggle('sf-scrolled',window.scrollY>36);
}

function imageTransitions(){
  document.querySelectorAll('.sf-thumb').forEach(button=>{
    if(button.dataset.motionBound)return;
    button.dataset.motionBound='1';
    button.addEventListener('click',()=>{
      const image=document.getElementById('sf-main-img');
      if(!image||reduceMotion)return;
      image.classList.add('sf-image-switching');
      setTimeout(()=>image.classList.remove('sf-image-switching'),190);
    },true);
  });
}

function run(){
  revealTargets();
  imageTransitions();
  headerMotion();
}

let ticking=false;
window.addEventListener('scroll',()=>{
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(()=>{headerMotion();ticking=false});
},{passive:true});

const app=document.getElementById('app');
if(app){
  const mutation=new MutationObserver(()=>requestAnimationFrame(run));
  mutation.observe(app,{childList:true,subtree:true});
}

requestAnimationFrame(run);
setTimeout(run,250);
