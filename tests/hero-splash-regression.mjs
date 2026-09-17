import fs from 'node:fs';
const hero=fs.readFileSync('storefront-reference-hero.js','utf8');
const splash=fs.readFileSync('store-splash.js','utf8');
const stat=fs.statSync('pilar-hero-exact-reference.webp');
const checks=[
 ['asset hero no está vacío',stat.size>100000],
 ['hero usa asset exacto',hero.includes('/pilar-hero-exact-reference.webp')],
 ['splash solo standalone',splash.includes("matchMedia('(display-mode: standalone)')")||splash.includes('display-mode: standalone')],
 ['splash solo una vez por apertura',splash.includes('sessionStorage')],
 ['splash dura 2500ms',splash.includes('2500')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
