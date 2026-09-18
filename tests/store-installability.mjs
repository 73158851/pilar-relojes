import fs from 'node:fs';
const manifest=fs.readFileSync('manifest.webmanifest','utf8');
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['manifest usa icono local 192 PNG',manifest.includes('/pilar-icon-192.png')&&manifest.includes('"sizes": "192x192"')],
 ['manifest usa icono local 512 PNG',manifest.includes('/pilar-icon-512.png')&&manifest.includes('"sizes": "512x512"')],
 ['click siempre abre confirmación',/async function requestInstall\(\)\{[\s\S]*installDialog\(\)/.test(pwa)],
 ['si no hay prompt, confirmación no queda muda',pwa.includes('Instalación no disponible todavía')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);