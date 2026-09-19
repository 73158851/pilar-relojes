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
 ['splash solo PWA y una vez',()=>read('store-splash.js').includes('display-mode: standalone')&&read('store-splash.js').includes('sessionStorage')&&read('store-splash.js').includes('2500')],
 ['hero premium funcional',()=>read('storefront-reference-hero.js').includes('sf-premium-hero')&&read('storefront-reference-hero.js').includes("document.querySelector('.sf-card-media img')")&&!read('storefront-reference-hero.js').includes('pilar-hero-exact-reference.webp')],
 ['hero botones reales',()=>read('storefront-reference-hero.js').includes('href="/catalogo"')&&read('storefront-reference-hero.js').includes('Hablar por WhatsApp')],
 ['hero beneficios completos',()=>['Productos','originales','Entrega','a coordinar','Pagos','seguros','Asesoría','personalizada'].every(x=>read('storefront-reference-hero.js').includes(x))],
 ['hero animaciones accesibles',()=>read('storefront-reference-hero.css').includes('@keyframes premiumHeroReveal')&&read('storefront-reference-hero.css').includes('@keyframes premiumWatchFloat')&&read('storefront-reference-hero.css').includes('prefers-reduced-motion')],
 ['hero integrado',()=>read('index.html').includes('storefront-reference-hero.css')&&read('router.js').includes('storefront-reference-hero.js')],
 ['robots sitemap',()=>read('robots.txt').includes('Sitemap: https://pilar-relojes.pages.dev/sitemap.xml')]
];
let failed=0;for(const [name,fn] of checks){let ok=false;try{ok=!!fn()}catch{};console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}if(failed){console.error(`\n${failed} comprobaciones fallaron`);process.exit(1)}console.log(`\n${checks.length}/${checks.length} comprobaciones correctas`);
