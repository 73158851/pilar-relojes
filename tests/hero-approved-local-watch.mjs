import fs from 'node:fs';
const js=fs.readFileSync('storefront-reference-hero.js','utf8');
const css=fs.readFileSync('storefront-reference-hero.css','utf8');
const checks=[
 ['usa reloj aprobado local',js.includes('/pilar-hero-watch-approved.webp')],
 ['no usa imagen externa',!js.includes('wallpapers.com')],
 ['mantiene iconos',(js.match(/<svg/g)||[]).length>=8],
 ['mantiene refresco estable',js.includes('MutationObserver')&&js.includes('observer.observe')],
 ['no cambia layout base',css.includes('grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr)')]
];let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);