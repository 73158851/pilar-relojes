const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

function storefront(){return document.querySelector('.storefront')}

function relocateCatalogCount(){
  const head=document.querySelector('.sf-catalog-head');
  const count=head?.querySelector('.sf-catalog-count');
  const subtitle=head?.querySelector('.sf-catalog-sub');
  if(!head||!count||!subtitle||count.dataset.premiumPlaced)return;
  count.dataset.premiumPlaced='1';
  count.classList.add('sf-catalog-count-premium');
  count.innerHTML=`<span class="sf-count-dot">◈</span><span>${count.textContent.trim()}</span>`;
  subtitle.insertAdjacentElement('afterend',count);
}

function revealTargets(){
  const root=storefront();
  if(!root)return;
  root.classList.add('motion-ready','motion-high');

  const targets=[...document.querySelectorAll('.sf-hero .sf-kicker,.sf-hero h1,.sf-hero .sf-lead,.sf-hero .sf-actions,.sf-hero .sf-meta,.sf-section-head,.sf-catalog-head,.sf-product-gallery,.sf-detail-info,.sf-contact-card,.sf-footer-grid,.sf-card,.sf-catalog-count-premium')];

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
        el.style.transitionDelay=`${Math.min(index*70,350)}ms`;
      }
      el.classList.add('is-visible');
      observer.unobserve(el);
    });
  },{threshold:.06,rootMargin:'0px 0px -14px 0px'});

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
      setTimeout(()=>image.classList.remove('sf-image-switching'),260);
    },true);
  });
}

function favoriteBurst(){
  document.querySelectorAll('.sfp-fav').forEach(button=>{
    if(button.dataset.burstBound)return;
    button.dataset.burstBound='1';
    button.addEventListener('click',()=>{
      if(reduceMotion)return;
      button.classList.remove('sf-fav-pop');
      requestAnimationFrame(()=>button.classList.add('sf-fav-pop'));
      setTimeout(()=>button.classList.remove('sf-fav-pop'),520);
    });
  });
}

function cardTilt(){
  if(!finePointer||reduceMotion)return;
  document.querySelectorAll('.sf-card').forEach(card=>{
    if(card.dataset.tiltBound)return;
    card.dataset.tiltBound='1';
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--tilt-x',`${(-y*3.2).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y',`${(x*4).toFixed(2)}deg`);
      card.classList.add('sf-tilting');
    });
    card.addEventListener('pointerleave',()=>{
      card.classList.remove('sf-tilting');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
}

function badgePop(){
  document.querySelectorAll('.sf-badge').forEach((badge,i)=>{
    if(badge.dataset.popReady)return;
    badge.dataset.popReady='1';
    if(!reduceMotion){badge.style.animationDelay=`${Math.min(i%6*90,450)}ms`}
  });
}

function run(){
  relocateCatalogCount();
  revealTargets();
  imageTransitions();
  favoriteBurst();
  cardTilt();
  badgePop();
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
