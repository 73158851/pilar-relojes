import fs from 'node:fs';
const router=fs.readFileSync('router.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const checks=[
 ['admin core fresh',router.includes("/admin-v2.js?v=20260919-product-id-fix-1")],
 ['save module fresh',router.includes("/admin-product-save-v2.js?v=20260919-product-id-fix-1")],
 ['router fresh',html.includes("/router.js?v=20260919-product-id-fix-1")]
];
let bad=0;for(const[n,ok]of checks){console.log(ok?'PASS':'FAIL',n);if(!ok)bad++}if(bad)process.exit(1);
