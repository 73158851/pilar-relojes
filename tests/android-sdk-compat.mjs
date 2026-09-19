import fs from 'node:fs';

const root=fs.readFileSync('android-twa/build.gradle','utf8');
const app=fs.readFileSync('android-twa/app/build.gradle','utf8');

const agp=(root.match(/com\.android\.application' version '([^']+)'/)||[])[1]||'';
const compile=(app.match(/compileSdk\s+(\d+)/)||[])[1]||'0';

function versionAtLeast(v,min){
  const a=v.split('.').map(Number),b=min.split('.').map(Number);
  for(let i=0;i<Math.max(a.length,b.length);i++){const x=a[i]||0,y=b[i]||0;if(x>y)return true;if(x<y)return false}
  return true;
}

const checks=[
  ['compileSdk >= 36',Number(compile)>=36],
  ['Android Gradle Plugin >= 8.9.1',versionAtLeast(agp,'8.9.1')],
];

let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed)process.exit(1);
