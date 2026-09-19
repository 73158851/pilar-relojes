import fs from 'node:fs';
const routes=JSON.parse(fs.readFileSync('_routes.json','utf8'));
const redirects=fs.readFileSync('_redirects','utf8');
const checks=[
 ['functions limited to api',JSON.stringify(routes.include)===JSON.stringify(['/api/*'])],
 ['routes schema v1',routes.version===1],
 ['spa fallback exists',redirects.includes('/* /index.html 200')],
 ['redirects do not rewrite api to itself',!redirects.includes('/api/* /api/:splat')]
];
let failed=0;for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
