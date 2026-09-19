import fs from 'node:fs';
const js=fs.readFileSync('storefront-reference-hero.js','utf8');
const css=fs.readFileSync('storefront-reference-hero.css','utf8');
const checks=[
 ['usa reloj hero dedicado',js.includes('/pilar-hero-watch-approved.webp')],
 ['conserva iconos SVG',(js.match(/<svg/g)||[]).length>=8],
 ['conserva protección de refresco',js.includes('MutationObserver')&&js.includes('observer.observe')],
 ['no cambia layout móvil base',css.includes('grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr)')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
