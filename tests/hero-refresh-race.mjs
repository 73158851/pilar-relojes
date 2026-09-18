import fs from 'node:fs';
const js=fs.readFileSync('storefront-reference-hero.js','utf8');
const checks=[
 ['observa render asíncrono del home', js.includes('MutationObserver')],
 ['no depende solo de DOMContentLoaded', !js.includes("document.addEventListener('DOMContentLoaded',enhanceHero,{once:true})")],
 ['reintenta cuando aparece .sf-hero', /querySelector\(['"]\.sf-hero['"]\)/.test(js) && js.includes('observer.observe')],
 ['mantiene hero aprobado', js.includes('sf-ref-exact')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed)process.exit(1);
