import fs from 'node:fs';
const pwa=fs.readFileSync('pwa.js','utf8');
const APK_URL='https://pilar-apk-v2.angelitoortiz101.workers.dev/PILAR-1.0.0.apk';
const checks=[
 ['public APK worker URL configured',pwa.includes(APK_URL)],
 ['legacy local APK placeholder removed',!pwa.includes("const APK_URL='/downloads/PILAR-1.0.0.apk'")],
 ['legacy beforeinstallprompt removed',!pwa.includes('beforeinstallprompt')],
 ['legacy installPrompt removed',!pwa.includes('installPrompt')],
 ['Android app hides install control',pwa.includes("document.referrer.startsWith('android-app://com.pilar.relojes')")]
];
let failed=0;
for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}
if(failed)process.exit(1);
