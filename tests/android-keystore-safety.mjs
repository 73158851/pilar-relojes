import fs from 'node:fs';
const ig=fs.readFileSync('.gitignore','utf8');
const checks=[
 ['jks ignored',ig.includes('android-twa/**/*.jks')],
 ['keystore ignored',ig.includes('android-twa/**/*.keystore')],
 ['keystore properties ignored',ig.includes('android-twa/keystore.properties')]
];
let failed=0;for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
