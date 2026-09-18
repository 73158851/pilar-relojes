import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['captura beforeinstallprompt antes de cargar módulos',html.includes('__PILAR_INSTALL_PROMPT__')&&html.includes("beforeinstallprompt")&&html.indexOf('__PILAR_INSTALL_PROMPT__')<html.indexOf('/pwa.js')],
 ['pwa recupera prompt capturado',pwa.includes("window.__PILAR_INSTALL_PROMPT__||null")],
 ['evento tardío sincroniza prompt global',pwa.includes("window.__PILAR_INSTALL_PROMPT__=e")],
 ['botón abre diálogo si prompt fue capturado',pwa.includes('installDialog()')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);