import fs from 'node:fs';

const checks = [
  ['android project exists', fs.existsSync('android-twa')],
  ['gradle settings exists', fs.existsSync('android-twa/settings.gradle')],
  ['app gradle exists', fs.existsSync('android-twa/app/build.gradle')],
  ['manifest exists', fs.existsSync('android-twa/app/src/main/AndroidManifest.xml')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
