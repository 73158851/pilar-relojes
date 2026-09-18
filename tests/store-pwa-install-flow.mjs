import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const pwa=fs.readFileSync('pwa.js','utf8');
const checks=[
 ['manifest estático en head',html.includes('id="pilar-manifest"')&&html.includes('rel="manifest"')&&html.indexOf('id="pilar-manifest"')<html.indexOf('/pwa.js')],
 ['service worker se registra temprano',html.includes("navigator.serviceWorker.register('/sw.js?v=20260918-pwa15')")&&html.indexOf("serviceWorker.register")<html.indexOf('/pwa.js')],
 ['manifest declara relación consigo misma',Array.isArray(manifest.related_applications)&&manifest.related_applications.some(x=>x.platform==='webapp'&&x.url==='/manifest.webmanifest')],
 ['detecta PWA ya instalada',pwa.includes('navigator.getInstalledRelatedApps')&&pwa.includes('async function pwaInstalled')],
 ['botón solo se crea con prompt nativo disponible',pwa.includes('if(isAdmin||await pwaInstalled()||!installPrompt') || pwa.includes('if(isAdmin||installed||!installPrompt')],
 ['prompt nativo sigue siendo la acción final',pwa.includes('installPrompt.prompt()')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);