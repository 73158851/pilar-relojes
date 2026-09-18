import fs from 'node:fs';
const sw=fs.readFileSync('sw.js','utf8');
const checks=[
 ['reloj aprobado usa network-first',sw.includes("url.pathname==='/pilar-hero-watch-approved.webp'")],
 ['reloj aprobado evita cache-first genérico',sw.indexOf("url.pathname==='/pilar-hero-watch-approved.webp'") < sw.indexOf("['image','font'].includes(req.destination)")],
 ['cache rota después de limpiar respuesta envenenada',sw.includes("pilar-shell-v12")]
];let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);