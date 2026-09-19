import fs from 'node:fs';
const js=fs.readFileSync('storefront-reference-hero.js','utf8');
const css=fs.readFileSync('storefront-reference-hero.css','utf8');
const checks=[
 ['restaura hero premium dinámico', js.includes("hero.className='sf-hero sf-premium-hero'")],
 ['usa imagen aprobada local', js.includes('/pilar-hero-watch-approved.webp') && !js.includes("document.querySelector('.sf-card-media img')")],
 ['mantiene reintento tras render asíncrono', js.includes('MutationObserver') && js.includes('observer.observe')],
 ['restaura layout premium', css.includes('.sf-premium-hero-inner') && css.includes('.sf-premium-visual')],
 ['mantiene título premium responsive', css.includes('.sf-premium-copy h1') && css.includes('@media(max-width:420px)')],
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed)process.exit(1);
