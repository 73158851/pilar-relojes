import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('.well-known/assetlinks.json','utf8'));
const t=data[0]?.target;
const checks=[
 ['android namespace',t?.namespace==='android_app'],
 ['package name',t?.package_name==='com.pilar.relojes'],
 ['fingerprint exact',t?.sha256_cert_fingerprints?.[0]==='9F:CE:67:96:48:B0:94:25:E3:DF:BC:6C:5E:7D:20:45:F6:EA:61:AB:8D:77:5E:42:9C:8C:46:81:79:D5:C2:FB'],
 ['relation',data[0]?.relation?.includes('delegate_permission/common.handle_all_urls')]
];
let failed=0;for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
