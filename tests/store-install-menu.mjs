import fs from 'node:fs';
const store=fs.readFileSync('storefront.js','utf8');
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['menú de tienda incluye Instalar PILAR',store.includes('class="pilar-install-menu"')&&store.includes('Instalar PILAR')],
 ['instalación se maneja por delegación',pwa.includes("closest('.pilar-install-menu')")],
 ['no se oculta opción por modo standalone',!store.includes('pilar-install-menu hidden')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);