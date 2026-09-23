import fs from 'node:fs';
const read=p=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
const storefront=read('storefront.js');
const css=read('storefront.css');
const admin=read('admin-v2.js');

const checks=[
 ['catálogo móvil usa dos columnas',()=>/max-width:\s*680px[\s\S]*?\.sf-grid,\.sf-grid-3\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(css)],
 ['existe navegación inferior móvil fija',()=>storefront.includes('sf-mobile-nav')&&css.includes('.sf-mobile-nav')&&css.includes('position:fixed')&&css.includes('bottom:0')],
 ['navegación inferior contiene Inicio Catálogo Ofertas Contacto',()=>['Inicio','Catálogo','Ofertas','Contacto'].every(x=>storefront.includes(x))],
 ['Nuevos no figura como enlace independiente',()=>!storefront.includes('href="/nuevos"')],
 ['sección Nuevos ingresos eliminada del inicio',()=>!storefront.includes('sf-new-arrivals')&&!storefront.includes('Nuevos <em>ingresos.</em>')],
 ['ruta /nuevos redirige al catálogo',()=>storefront.includes("path==='/nuevos'")&&storefront.includes("location.replace('/catalogo')")],
 ['panel usa iconos SVG en navegación principal',()=>admin.includes('NAV_ICON')&&admin.includes('pa-tab-icon')&&admin.includes('<svg')],
];
let failed=0;
for(const [name,fn] of checks){
 let ok=false;try{ok=!!fn()}catch{}
 console.log(`${ok?'PASS':'FAIL'} ${name}`);
 if(!ok)failed++;
}
if(failed){console.error(`\n${failed} comprobaciones fallaron`);process.exit(1)}
console.log(`\n${checks.length}/${checks.length} comprobaciones correctas`);
