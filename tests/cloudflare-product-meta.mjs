import fs from 'node:fs';
const src=fs.readFileSync('functions/api/product-meta.js','utf8');
const checks=[['exports onRequestGet',src.includes('export async function onRequestGet')],['reads slug from URLSearchParams',src.includes("searchParams.get('slug')")||src.includes("searchParams.get(\'slug\')")],['uses getPublicOrigin',src.includes('getPublicOrigin')],['contains Product JSON-LD',src.includes("'@type':'Product'")||src.includes('"@type":"Product"')],['does not hardcode vercel origin',!src.includes('pilar-relojes.vercel.app')]];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
