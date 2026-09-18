import fs from 'node:fs';
const js=fs.readFileSync('storefront-reference-hero.js','utf8');
const css=fs.readFileSync('storefront-reference-hero.css','utf8');
const checks=[
 ['restaura hero premium dinámico', js.includes("hero.className='sf-hero sf-premium-hero'")],
 ['usa imagen de producto y no asset estático', js.includes("document.querySelector('.sf-card-media img')") && !js.includes('pilar-hero-approved')],
 ['mantiene reintento tras render asíncrono', js.includes('MutationObserver') && js.includes('observer.observe')],
 ['restaura layout premium', css.includes('.sf-premium-hero-inner') && css.includes('.sf-premium-visual')],
 ['mantiene título móvil en dos líneas', css.includes('.sf-title-line{display:block;white-space:nowrap}')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed)process.exit(1);
