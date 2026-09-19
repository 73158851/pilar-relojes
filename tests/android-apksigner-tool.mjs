import fs from 'node:fs';
const wf=fs.readFileSync('.github/workflows/android-twa-build.yml','utf8');
const checks=[
 ['exports Android apksigner tool',wf.includes('pilar-apksigner-tool')],
 ['locates apksigner from Android SDK',wf.includes('apksigner')],
];
let failed=0;for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
