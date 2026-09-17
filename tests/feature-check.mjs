import fs from 'node:fs';
const read=(p)=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
const checks=[
 ['admin selector de género',()=>read('admin-product-gender.js').includes('pgender')],
 ['guardado de género',()=>read('admin-product-save-v2.js').includes("gender:")&&read('admin-product-save-v2.js').includes("$('pgender')")],
 ['filtro Todos Varón Dama',()=>['Todos','Varón','Dama'].every(x=>read('store-gender-filter.js').includes(x))],
 ['consulta género',()=>read('store-gender-filter.js').includes('gender')],
 ['optimización WEBP',()=>read('admin-image-pro.js').includes('image/webp')&&read('admin-image-pro.js').includes('1600')&&read('admin-image-pro.js').includes('0.82')],
 ['preview de imágenes',()=>read('admin-image-pro.js').includes('pilar-image-preview')],
 ['orden visual sin recarga',()=>read('admin-image-pro.js').includes('pendingOrder')&&read('admin-image-pro.js').includes('insertBefore')&&!read('admin-image-pro.js').includes('location.reload()')],
 ['orden se guarda con producto',()=>read('admin-product-save-v2.js').includes('savePendingOrder')],
 ['una foto oculta controles',()=>read('admin-image-pro.js').includes('photos.length<2')],
 ['orden y principal',()=>read('admin-image-pro.js').includes('sort_order')&&read('admin-v2.js').includes('is_primary')&&read('admin-v2.js').includes('Hacer principal')],
 ['SEO canonical/OG',()=>read('store-seo.js').includes('canonical')&&read('store-seo.js').includes('og:title')],
 ['SEO Product JSON-LD',()=>read('store-seo.js').includes('application/ld+json')&&read('store-seo.js').includes('Product')],
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