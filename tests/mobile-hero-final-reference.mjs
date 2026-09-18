import fs from 'node:fs';
const js=fs.readFileSync('storefront-reference-hero.js','utf8');
const css=fs.readFileSync('storefront-reference-hero.css','utf8');
const checks=[
 ['mobile usa asset exacto',js.includes('/pilar-hero-exact-reference.webp?v=20260917-final-mobile-1')],
 ['mobile no usa foto de producto',!js.includes("document.querySelector('.sf-card-media img')")],
 ['hotspot catálogo',js.includes('sf-ref-hotspot catalog')&&js.includes('href="/catalogo"')],
 ['hotspot whatsapp',js.includes('sf-ref-hotspot whatsapp')&&js.includes('Hablar por WhatsApp')===false],
 ['proporción referencia',css.includes('aspect-ratio:343/429')],
 ['imagen cubre hero',css.includes('.sf-ref-exact-image')&&css.includes('object-fit:cover')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed)process.exit(1);
