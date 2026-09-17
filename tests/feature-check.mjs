import fs from 'node:fs';
const read=(p)=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
const exists=p=>fs.existsSync(p);
const checks=[
 ['admin selector de género',()=>read('admin-product-gender.js').includes('pgender')],
 ['guardado de género',()=>read('admin-product-save-v2.js').includes("gender:")&&read('admin-product-save-v2.js').includes("$('pgender')")],
 ['filtro Todos Varón Dama',()=>['Todos','Varón','Dama'].every(x=>read('store-gender-filter.js').includes(x))],
 ['consulta género',()=>read('store-gender-filter.js').includes('gender')],
 ['optimización WEBP',()=>read('admin-image-pro.js').includes('image/webp')&&read('admin-image-pro.js').includes('1600')&&read('admin-image-pro.js').includes('0.82')],
 ['preview de imágenes',()=>read('admin-image-pro.js').includes('pilar-image-preview')],
 ['sin controles de orden',()=>!read('admin-image-pro.js').includes('pilar-image-order')&&!read('admin-image-pro.js').includes('data-move')&&!read('admin-image-pro.js').includes('reorder(')&&!read('admin-image-pro.js').includes('location.reload()')],
 ['foto principal se mantiene',()=>read('admin-v2.js').includes('is_primary')&&read('admin-v2.js').includes('Hacer principal')],
 ['SEO canonical/OG',()=>read('store-seo.js').includes('canonical')&&read('store-seo.js').includes('og:title')],
 ['SEO Product JSON-LD',()=>read('store-seo.js').includes('application/ld+json')&&read('store-seo.js').includes('Product')],
 ['compartir incluye precio y disponibilidad',()=>read('store-pro.js').includes('sf-detail-price')&&read('store-pro.js').includes('sfp-status')&&read('store-pro.js').includes('Descubre este modelo en PILAR Relojes Sucre')],
 ['preview social enriquecido',()=>['og:image:secure_url','og:image:alt','product:price:amount','product:price:currency','twitter:title','twitter:image'].every(x=>read('api/product-meta.js').includes(x))],
 ['asset exacto de referencia existe',()=>exists('pilar-hero-reference-mobile.webp')],
 ['hero fuerza descarga fresca',()=>read('storefront-reference-hero.js').includes('pilar-hero-reference-mobile.webp?v=20260917-hero-fresh-3')&&read('storefront-reference-hero.js').includes('onerror')],
 ['hotspots reales se conservan',()=>read('storefront-reference-hero.js').includes('sf-ref-hotspot catalog')&&read('storefront-reference-hero.js').includes('sf-ref-hotspot whatsapp')&&read('storefront-reference-hero.js').includes('/catalogo')],
 ['proporción móvil coincide',()=>read('storefront-reference-hero.css').includes('aspect-ratio:343/430')&&read('storefront-reference-hero.css').includes('object-fit:cover')],
 ['animaciones sin deformar referencia',()=>read('storefront-reference-hero.css').includes('@keyframes heroExactReveal')&&read('storefront-reference-hero.css').includes('@keyframes heroExactShine')&&read('storefront-reference-hero.css').includes('prefers-reduced-motion')],
 ['splash animado integrado',()=>exists('store-splash.js')&&exists('store-splash.css')&&read('index.html').includes('store-splash.css')&&read('index.html').includes('store-splash.js')],
 ['splash anima logo y salida',()=>read('store-splash.css').includes('@keyframes pilarSplashLogo')&&read('store-splash.css').includes('@keyframes pilarSplashExit')&&read('store-splash.js').includes('1500')],
 ['service worker renovado',()=>read('sw.js').includes("pilar-shell-v3")&&read('pwa.js').includes('store-cache-3')],
 ['hero integrado',()=>read('index.html').includes('storefront-reference-hero.css')&&read('router.js').includes('storefront-reference-hero.js')],
 ['robots sitemap',()=>read('robots.txt').includes('Sitemap: https://pilar-relojes.vercel.app/sitemap.xml')],
 ['sitemap server',()=>read('api/sitemap.js').includes('urlset')&&read('api/sitemap.js').includes('products')],
 ['meta server',()=>read('api/product-meta.js').includes('og:title')&&read('api/product-meta.js').includes('application/ld+json')],
 ['router módulos',()=>['admin-product-gender.js','admin-image-pro.js','store-gender-filter.js','store-seo.js'].every(x=>read('router.js').includes(x))],
 ['CSS integrado',()=>read('index.html').includes('store-gender-filter.css')&&read('index.html').includes('admin-image-pro.css')],
 ['Vercel SEO',()=>read('vercel.json').includes('sitemap.xml')&&read('vercel.json').includes('product-meta')]
];
let failed=0;
for(const [name,fn] of checks){let ok=false;try{ok=!!fn()}catch{};console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed){console.error(`\n${failed} comprobaciones fallaron`);process.exit(1)}
console.log(`\n${checks.length}/${checks.length} comprobaciones correctas`);
