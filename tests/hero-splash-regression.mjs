import fs from 'node:fs';
const sw=fs.readFileSync('sw.js','utf8');
const splash=fs.readFileSync('store-splash.js','utf8');
const hero=fs.readFileSync('storefront-reference-hero.js','utf8');
const checks=[
 ['hero exacto',hero.includes('/pilar-hero-exact-reference.webp')],
 ['SW v4',sw.includes("pilar-shell-v4")],
 ['hero network-first',sw.includes("url.pathname==='/pilar-hero-exact-reference.webp'")&&sw.includes("cache:'no-store'"))],
 ['splash standalone',splash.includes('display-mode: standalone')],
 ['splash una vez por apertura',splash.includes('sessionStorage')],
 ['splash 2500 ms',splash.includes('2500')]
];
let failed=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}if(failed)process.exit(1);
