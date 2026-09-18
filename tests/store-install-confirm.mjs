import fs from 'node:fs';
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['muestra confirmación propia',pwa.includes('¿Deseas instalar PILAR?')&&pwa.includes('Cancelar')&&pwa.includes('Instalar')],
 ['aceptar dispara prompt nativo',pwa.includes('installPrompt.prompt()')],
 ['cancelar cierra sin instalar',pwa.includes("data-action='cancel'")||pwa.includes('data-action="cancel"')],
 ['no usa alert de instrucciones como flujo principal',!pwa.includes("alert('Para instalar PILAR en Chrome"))
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);