import fs from 'node:fs';
const store=fs.readFileSync('storefront.js','utf8');
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['menú no contiene Instalar PILAR',!store.includes('pilar-install-menu')],
 ['botón flotante está fuera del menú',pwa.includes("className='pilar-install'")&&pwa.includes("position:'fixed'")),
 ['botón está en esquina opuesta a WhatsApp',pwa.includes("left:'16px'")&&pwa.includes("bottom:'16px'")),
 ['botón se oculta en app instalada',pwa.includes("if(isAdmin||installed()||document.querySelector('.pilar-install'))return null")],
 ['botón desaparece tras instalar',pwa.includes("window.addEventListener('appinstalled'")&&pwa.includes("document.querySelector('.pilar-install')?.remove()")),
 ['botón mantiene apariencia premium',pwa.includes("linear-gradient")&&pwa.includes("boxShadow")]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);