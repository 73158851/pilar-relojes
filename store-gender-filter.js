// PILAR gender filter: UI is rendered with the catalog; this file only handles interaction.
let active='todos';
function normalize(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function infer(card){const stored=normalize(card.dataset.gender);if(stored)return stored;const text=normalize(card.querySelector('.sf-name')?.textContent);if(/\b(varon|varonil|hombre)\b/.test(text))return'varon';if(/\b(dama|mujer|femenin[oa])\b/.test(text))return'dama';return''}
function scope(){return document.querySelector('.pilar-home-all-products, .sf-catalog-page')}\nfunction update(){const page=scope();if(!page)return;const cards=[...page.querySelectorAll('.sf-card')];let visible=0;cards.forEach(card=>{const show=active==='todos'||infer(card)===active;card.classList.toggle('pilar-gender-hidden',!show);if(show)visible++});const count=page.querySelector('.sf-catalog-count');if(count)count.textContent=`${visible} reloj${visible===1?'':'es'}`;page.querySelectorAll('.pilar-gender-option').forEach(b=>{const on=b.dataset.gender===active;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))})}
function install(){const page=scope();const bar=page?.querySelector('.pilar-gender-filter');if(!bar||bar.dataset.ready)return;bar.dataset.ready='1';bar.addEventListener('click',e=>{const b=e.target.closest('.pilar-gender-option');if(!b)return;active=b.dataset.gender;update()});update()}
new MutationObserver(()=>requestAnimationFrame(install)).observe(document.getElementById('app'),{childList:true,subtree:true});
install();
