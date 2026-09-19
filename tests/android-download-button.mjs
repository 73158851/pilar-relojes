import fs from 'node:fs';
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['install button class removed',!pwa.includes('pilar-install')],
 ['APK URL removed from storefront',!pwa.includes('PILAR-1.0.0.apk')],
 ['install label removed',!pwa.includes('Instalar PILAR')],
 ['legacy beforeinstallprompt removed',!pwa.includes('beforeinstallprompt')]
];
let failed=0;
for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}
if(failed)process.exit(1);
