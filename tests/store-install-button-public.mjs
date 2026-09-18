import fs from 'node:fs';
const p=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['botón público se crea sin esperar beforeinstallprompt',p.includes("window.addEventListener('load',()=>button())")&&!p.includes("if(!installPrompt)return null")],
 ['se oculta dentro de la app instalada',p.includes("if(isAdmin||installed()||document.querySelector('.pilar-install'))return null")],
 ['usa prompt nativo cuando está disponible',p.includes("installPrompt.prompt()")],
 ['si el prompt llega después se conserva',p.includes("window.addEventListener('beforeinstallprompt'")&&p.includes("installPrompt=e")]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);