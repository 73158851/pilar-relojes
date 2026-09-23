import fs from 'node:fs';
const read=(p)=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';

const storefront=read('storefront.js');
const css=read('storefront.css');
const admin=read('admin-v2.js');

const checks=[
  ['catálogo móvil usa dos columnas',()=>/max-width:\s*680px[\s\S]*?\.sf-grid,\.sf-grid-3\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(css)],
  ['existe navegación inferior móvil',()=>storefront.includes('sf-mobile-nav')&&['Inicio','Catálogo','Ofertas','Contacto'].every(x=>storefront.includes(x))],
  ['navegación inferior tiene estilo fijo móvil',()=>css.includes('.sf-mobile-nav')&&css.includes('position:fixed')&&css.includes('bottom:0')],
  ['Nuevos ya no aparece como navegación independiente',()=>!storefront.includes('href="/nuevos"')],
  ['ruta /nuevos vuelve al catálogo',()=>storefront.includes("path==='/nuevos'")&&storefront.includes("location.replace('/catalogo')")],
  ['panel administrador usa iconos SVG en navegación',()=>admin.includes('ADMIN_ICON')&&admin.includes('<svg')&&admin.includes('pa-tab-icon')],
];

let failed=0;
for(const [name,fn] of checks){
  let ok=false;
  try{ok=!!fn()}catch{}
  console.log(`${ok?'PASS':'FAIL'} ${name}`);
  if(!ok)failed++;
}
if(failed){
  console.error(`\n${failed} comprobaciones fallaron`);
  process.exit(1);
}
console.log(`\n${checks.length}/${checks.length} comprobaciones correctas`);
