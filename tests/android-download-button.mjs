import fs from 'node:fs';
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['APK public URL configured',pwa.includes('/downloads/PILAR-1.0.0.apk')],
 ['legacy beforeinstallprompt removed',!pwa.includes('beforeinstallprompt')],
 ['legacy installPrompt removed',!pwa.includes('installPrompt')],
 ['Android app hides install control',pwa.includes('document.referrer.startsWith(\'android-app://com.pilar.relojes\')')]
];
let failed=0;for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
