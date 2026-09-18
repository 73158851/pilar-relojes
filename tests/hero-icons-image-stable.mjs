import fs from 'node:fs';
const js=fs.readFileSync('storefront-reference-hero.js','utf8');
const checks=[
 ['hero usa imagen dedicada y no reloj de producto', js.includes('/pilar-hero-reference-mobile.webp') && !js.includes("document.querySelector('.sf-card-media img')")],
 ['iconos son SVG reales', (js.match(/<svg/g)||[]).length >= 8],
 ['WhatsApp usa icono SVG', js.includes('aria-label="WhatsApp"')],
 ['catálogo usa icono SVG', js.includes('aria-label="Catálogo"')],
 ['mantiene protección de refresco', js.includes('MutationObserver') && js.includes('observer.observe')]
];
let failed=0; for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}
if(failed)process.exit(1);
