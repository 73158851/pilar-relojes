import fs from 'node:fs';
const h=fs.readFileSync('_headers','utf8');
const checks=[['manifest content type',h.includes('/manifest.webmanifest')&&h.includes('application/manifest+json')],['service worker no-cache',h.includes('/sw.js')&&h.includes('no-cache')],['service worker scope header',h.includes('Service-Worker-Allowed: /')]];
let failed=0;for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
