import fs from 'node:fs';
const manifest=fs.readFileSync('android-twa/app/src/main/AndroidManifest.xml','utf8');
const icon=fs.existsSync('android-twa/app/src/main/res/drawable/pilar_launcher.xml')?fs.readFileSync('android-twa/app/src/main/res/drawable/pilar_launcher.xml','utf8'):'';
const checks=[
 ['label PILAR',manifest.includes('android:label="PILAR"')],
 ['launcher icon configured',manifest.includes('android:icon="@drawable/pilar_launcher"')],
 ['round icon configured',manifest.includes('android:roundIcon="@drawable/pilar_launcher"')],
 ['portrait',manifest.includes('android:screenOrientation="portrait"')],
 ['Cloudflare start URL',manifest.includes('https://pilar-relojes.pages.dev/')],
 ['PILAR icon navy background',icon.includes('#0A1422')],
 ['PILAR icon gold crown',icon.includes('#C7A45A')]
];
let failed=0;for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
