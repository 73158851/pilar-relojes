import fs from 'node:fs';
const manifest=fs.readFileSync('manifest.webmanifest','utf8'),sw=fs.readFileSync('sw.js','utf8');
const checks=[['manifest has no vercel hostname',!manifest.includes('pilar-relojes.vercel.app')],['service worker has no vercel hostname',!sw.includes('pilar-relojes.vercel.app')],['manifest uses local 192 icon',manifest.includes('/pilar-icon-192.png')],['manifest uses local 512 icon',manifest.includes('/pilar-icon-512.png')],['display standalone',manifest.includes('"display": "standalone"')],['scope root',manifest.includes('"scope": "/"')]];
let failed=0;for(const[n,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
