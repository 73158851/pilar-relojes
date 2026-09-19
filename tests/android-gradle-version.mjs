import fs from 'node:fs';
const wf=fs.readFileSync('.github/workflows/android-twa-build.yml','utf8');
if(!wf.includes("gradle-version: '8.11.1'")){
  console.error('FAIL Gradle 8.11.1 required by AGP 8.9.1');
  process.exit(1);
}
console.log('PASS Gradle 8.11.1 configured');
