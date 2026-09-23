import fs from 'node:fs';
const read=p=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
const storefront=read('storefront.js');
const css=read('storefront.css');
const pro=read('store-pro.js');

const checks=[
 ['catálogo móvil usa dos columnas',()=>/max-width:\s*680px[\s\S]*?\.sf-grid,\.sf-grid-3\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(css)],
 ['escritorio conserva tres columnas',()=>/\.sf-grid,\.sf-grid-3\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/.test(css)],
 ['hamburguesa queda oculta en móvil',()=>/max-width:\s*680px[\s\S]*?\.sf-menu\{display:none!important\}/.test(css)],
 ['navegación inferior móvil usa Favoritos en vez de Ofertas',()=>storefront.includes('href="/favoritos"')&&storefront.includes('<span>Favoritos</span>')&&!/sf-mobile-nav[\s\S]*?<span>Ofertas<\/span>/.test(storefront)],
 ['existe ruta de favoritos',()=>storefront.includes("path==='/favoritos'")&&storefront.includes("catalog('favoritos')")],
 ['favoritos lee pilar_favorites_v1 y filtra productos',()=>storefront.includes("pilar_favorites_v1")&&storefront.includes("mode==='favoritos'")&&storefront.includes("favoriteSlugs")],
 ['todos los relojes cargan directamente sin botón Ver más',()=>!pro.includes('BATCH=12')&&!pro.includes('Ver más relojes')&&!pro.includes('sfp-more-wrap')],
 ['Nuevos sigue sin ser sección independiente',()=>!storefront.includes('href="/nuevos"')&&storefront.includes("location.replace('/catalogo')")],
];

let failed=0;
for(const [name,fn] of checks){
 let ok=false;try{ok=!!fn()}catch{}
 console.log(`${ok?'PASS':'FAIL'} ${name}`);
 if(!ok)failed++;
}
if(failed){console.error(`\n${failed} comprobaciones fallaron`);process.exit(1)}
console.log(`\n${checks.length}/${checks.length} comprobaciones correctas`);
