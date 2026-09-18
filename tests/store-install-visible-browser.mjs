import fs from 'node:fs';
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['botón aparece en navegador aunque prompt tarde',!pwa.includes("installed()||!installPrompt||document.querySelector('.pilar-install')")&&pwa.includes("installed()||document.querySelector('.pilar-install')")],
 ['botón sigue oculto en modo app instalada',pwa.includes("if(isAdmin||installed()||document.querySelector('.pilar-install'))return null")],
 ['si no hay prompt no queda mudo',pwa.includes("if(!installPrompt)")&&pwa.includes("installFallback")],
 ['cuando existe prompt usa instalador nativo',pwa.includes("installPrompt.prompt()")]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);