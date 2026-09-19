import fs from 'node:fs';
const admin=fs.readFileSync('admin-v2.js','utf8');
const save=fs.readFileSync('admin-product-save-v2.js','utf8');
const checks=[
 ['modal carries product id',()=>admin.includes("m.dataset.productId=p?.id||''")],
 ['save reads product id from modal',()=>save.includes("modal?.dataset?.productId")],
 ['save does not depend on edit click capture',()=>!save.includes("const edit=e.target.closest?.('.editp')")]
];
let bad=0;for(const [n,f] of checks){if(f())console.log('PASS',n);else{console.error('FAIL',n);bad++}}if(bad)process.exit(1);
