import fs from 'node:fs';
const p=fs.existsSync('android-twa/gradle.properties')?fs.readFileSync('android-twa/gradle.properties','utf8'):'';
if(!p.includes('android.useAndroidX=true')){
  console.error('FAIL android.useAndroidX=true missing');
  process.exit(1);
}
console.log('PASS AndroidX enabled');
