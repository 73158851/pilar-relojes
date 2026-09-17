import fs from 'node:fs';
const read=(p)=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
const exists=p=>fs.existsSync(p);
const checks=[
 ['admin selector de género',()=>read('admin-product-gender.js').includes('pgender')],
 ['guardado de género',()=>read('admin-product-save-v2.js').includes("gender:")&&read('admin-product-save-v2.js').includes("$('pgender')")],
 ['filtro Todos Varón Dama',()=>['Todos','Varón','Dama'].every(x=>read('store-gender-filter.js').includes(x))],
 ['consulta género',()=>read('store-gender-filter.js').includes('gender')],
 ['optimización WEBP',()=>read('admin-image-pro.js').includes('image/webp')],
 ['foto principal se mantiene',()=>read('admin-v2.js').includes('is_primary')],
 ['SEO canonical/OG',()=>read('store-seo.js').includes('canonical')&&read('store-seo.js').includes('og:title')],
 ['nuevo asset exacto existe',()=>exists('pilar-hero-exact-reference.webp')],
 ['hero usa exclusivamente nuevo asset',()=>read('storefront-reference-hero.js').includes('/pilar-hero-exact-reference.webp?v=20260917-exact-crop-1')&&!read('storefront-reference-hero.js').includes('pilar-hero-reference-mobile.webp')],
 ['hotspots reales se conservan',()=>read('storefront-reference-hero.js').includes('sf-ref-hotspot catalog')&&read('storefront-reference-hero.js').includes('sf-ref-hotspot whatsapp')&&read('storefront-reference-hero.js').includes('/catalogo')],
 ['proporción exacta del recorte',()=>read('storefront-reference-hero.css').includes('aspect-ratio:343/429')&&read('storefront-reference-hero.css').includes('object-fit:cover')],
 ['splash dura 2.5 segundos',()=>read('store-splash.js').includes('2500')],
 ['hero integrado',()=>read('index.html').includes('storefront-reference-hero.css')&&read('router.js').includes('storefront-reference-hero.js')],
 ['robots sitemap',()=>read('robots.txt').includes('Sitemap: https://pilar-relojes.vercel.app/sitemap.xml')]
];
let failed=0;for(const [name,fn] of checks){let ok=false;try{ok=!!fn()}catch{};console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}if(failed){console.error(`\n${failed} comprobaciones fallaron`);process.exit(1)}console.log(`\n${checks.length}/${checks.length} comprobaciones correctas`);
