import fs from 'node:fs';
const router=fs.readFileSync('router.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const checks=[
 ['admin save module cache-busted after id fix',router.includes("/admin-product-save-v2.js?v=20260919-product-id-fix-1")],
 ['admin core cache-busted after modal id fix',router.includes("/admin-v2.js?v=20260919-product-id-fix-1")],
 ['router cache-busted after admin fix',html.includes("/router.js?v=20260919-product-id-fix-1")]
];
let bad=0;for(const[n,ok]of checks){console.log(ok?'PASS':'FAIL',n);if(!ok)bad++}if(bad)process.exit(1);
