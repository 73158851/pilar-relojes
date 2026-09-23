import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const src=fs.readFileSync('store-pro.js','utf8');
const marker='function favoritesView(){';
const start=src.indexOf(marker);
assert.notEqual(start,-1,'store-pro.js debe contener favoritesView');

let brace=src.indexOf('{',start),depth=0,end=-1;
for(let i=brace;i<src.length;i++){
  if(src[i]==='{')depth++;
  else if(src[i]==='}'){
    depth--;
    if(depth===0){end=i+1;break;}
  }
}
assert.ok(end>start,'no se pudo extraer favoritesView');
const fnSource=src.slice(start,end);

const title={textContent:'Nuestros relojes'};
const sub={textContent:'Diseño, calidad y estilo en cada detalle.'};
const count={textContent:'2 relojes'};
const makeClassList=()=>{const s=new Set();return{add:x=>s.add(x),remove:x=>s.delete(x),contains:x=>s.has(x)}};
const makeCard=slug=>({hidden:false,slug});
const cards=[makeCard('a'),makeCard('b')];
let empty=null;
const grid={
  querySelectorAll:s=>s==='.sf-card'?cards:[],
  querySelector:s=>s==='.sfp-favorites-empty'?empty:null,
  appendChild:el=>{empty=el;el.remove=()=>{empty=null;}}
};
const page={
  classList:makeClassList(),
  querySelector:s=>({'.sf-grid':grid,'.sf-title':title,'.sf-catalog-sub':sub,'.sf-catalog-count':count}[s]||null)
};
const bottomLinks=[
  {href:'/',classList:makeClassList()},
  {href:'/catalogo',classList:makeClassList()},
  {href:'/catalogo#favoritos',classList:makeClassList()}
];
const document={
  querySelector:s=>{
    if(s==='.sf-catalog-page')return page;
    if(s==='.sf-mobile-bottom a[href="/catalogo"]')return bottomLinks[1];
    if(s==='.sf-mobile-bottom a[href="/catalogo#favoritos"]')return bottomLinks[2];
    return null;
  },
  querySelectorAll:s=>s==='.sf-mobile-bottom a'?bottomLinks:[],
  createElement:()=>({className:'',innerHTML:'',remove(){empty=null;}})
};
const location={pathname:'/catalogo',hash:'#favoritos'};
const sandbox={document,location,favs:()=>[],slugFromCard:c=>c.slug,Set};
vm.createContext(sandbox);
vm.runInContext(fnSource,sandbox);

sandbox.favoritesView();
assert.equal(title.textContent,'Mis favoritos');
assert.equal(cards.every(c=>c.hidden),true,'sin favoritos, la vista de favoritos debe ocultar las tarjetas');
assert.equal(bottomLinks[2].classList.contains('active'),true,'Favoritos debe quedar activo');

location.hash='';
sandbox.favoritesView();
assert.equal(title.textContent,'Nuestros relojes','al salir de Favoritos debe restaurarse el título del catálogo');
assert.equal(sub.textContent,'Diseño, calidad y estilo en cada detalle.','al salir de Favoritos debe restaurarse el subtítulo');
assert.equal(cards.every(c=>!c.hidden),true,'al salir de Favoritos deben reaparecer las tarjetas');
assert.equal(empty,null,'al salir de Favoritos debe eliminarse el estado vacío');
assert.equal(bottomLinks[1].classList.contains('active'),true,'Catálogo debe quedar activo');
assert.equal(bottomLinks[2].classList.contains('active'),false,'Favoritos debe dejar de estar activo');

console.log('PASS favoritos -> catálogo restaura la vista y navegación');
