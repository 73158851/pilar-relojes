import fs from 'node:fs';
const src=fs.readFileSync('functions/api/sitemap.js','utf8');
const checks=[['exports onRequestGet',src.includes('export async function onRequestGet')],['uses getPublicOrigin',src.includes('getPublicOrigin')],['uses Supabase products endpoint',src.includes('/rest/v1/products')],['returns application/xml',src.includes('application/xml')],['does not hardcode vercel origin',!src.includes('pilar-relojes.vercel.app')]];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);
