import fs from 'node:fs';
const read=p=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
const storefront=read('storefront.js');
const router=read('router.js');
const pro=read('store-pro.js');
const seo=read('store-seo.js');
const robots=read('robots.txt');
const realtime=read('storefront-realtime.js');
const adminRealtime=read('admin-realtime.js');
const state=read('storefront-state.js');
const admin=read('admin-v2.js');
const save=read('admin-product-save-v2.js');

const checks=[
 ['public state module exists',()=>state.includes('normalizeSettings')&&state.includes('availability')],
 ['storefront reads settings',()=>storefront.includes("from('settings')")],
 ['storefront uses dynamic operational settings',()=>state.includes('delivery_text')&&state.includes('hours')&&state.includes('show_exact_stock')&&storefront.includes('SETTINGS.delivery_text')&&storefront.includes('SETTINGS.hours')],
 ['detail exposes real stock',()=>storefront.includes('data-product-stock')],
 ['availability does not infer stock from text',()=>!pro.includes("let stock=3")],
 ['public realtime products',()=>realtime.includes("table:'products'")],
 ['public realtime images',()=>realtime.includes("table:'product_images'")],
 ['public realtime categories',()=>realtime.includes("table:'categories'")],
 ['public realtime settings',()=>realtime.includes("table:'settings'")],
 ['admin realtime inventory',()=>adminRealtime.includes("table:'inventory_movements'")],
 ['router wires public realtime',()=>router.includes('storefront-realtime.js')],
 ['router wires admin realtime',()=>router.includes('admin-realtime.js')],
 ['admin refresh really reloads',()=>admin.includes("await render(")||admin.includes('await load()')],
 ['admin supports previous price',()=>save.includes('previous_price')],
 ['seo no stale vercel origin',()=>!seo.includes('pilar-relojes.vercel.app')],
 ['robots no stale vercel origin',()=>!robots.includes('pilar-relojes.vercel.app')],
];
let failed=0;
for(const [name,fn] of checks){let ok=false;try{ok=!!fn()}catch{};console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed){console.error(`\n${failed} storefront/admin stabilization checks failed`);process.exit(1)}
console.log(`\n${checks.length}/${checks.length} storefront/admin stabilization checks passed`);
