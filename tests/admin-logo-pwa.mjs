import fs from 'node:fs';
const manifest=fs.readFileSync('admin-manifest.webmanifest','utf8');
const html=fs.readFileSync('index.html','utf8');
const checks=[
 ['manifest usa logo admin PNG',manifest.includes('/pilar-admin-logo-20260918.png')],
 ['manifest declara 512',manifest.includes('"sizes": "512x512"')&&manifest.includes('"type": "image/png"')],
 ['apple touch admin usa mismo logo',html.includes("i.href='/pilar-admin-logo-20260918.png")]
];let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);