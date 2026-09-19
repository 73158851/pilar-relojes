import fs from 'node:fs';
const css=fs.readFileSync('storefront-reference-hero.css','utf8');
const hero=fs.readFileSync('storefront-reference-hero.js','utf8');
const checks=[
 ['usa asset hero dedicado',hero.includes('/pilar-hero-watch-approved.webp')],
 ['hero móvil usa dos columnas',css.includes('grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)')||css.includes('grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr)')],
 ['copy y visual comparten primera fila',css.includes('grid-template-areas:"copy visual" "benefits benefits" "info info"')],
 ['reloj móvil se superpone sin bloque rectangular',css.includes('object-fit:contain')&&css.includes('mix-blend-mode:normal')],
 ['hero móvil compacto',css.includes('padding:24px 18px 18px')]
];
let failed=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}if(failed)process.exit(1);
