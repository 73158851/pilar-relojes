import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const pwa=fs.readFileSync('pwa.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const icons=manifest.icons||[];
const checks=[
 ['mantiene identidad original PILAR',manifest.id==='/?pwa=pilar-store'&&manifest.start_url==='/?source=pwa'&&manifest.scope==='/'],
 ['incluye PNG 192 local',icons.some(i=>i.src==='/pilar-icon-192.png'&&i.sizes==='192x192'&&i.type==='image/png')],
 ['incluye PNG 512 local',icons.some(i=>i.src==='/pilar-icon-512.png'&&i.sizes==='512x512'&&i.type==='image/png')],
 ['display standalone',manifest.display==='standalone'],
 ['botón depende del evento nativo',pwa.includes("window.addEventListener('beforeinstallprompt'")&&pwa.includes('installPrompt.prompt()')],
 ['manifest público sigue enlazado en tienda',html.includes('/manifest.webmanifest?v=20260918-installable-16')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);