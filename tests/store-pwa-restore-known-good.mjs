import fs from 'node:fs';
const pwa=fs.readFileSync('pwa.js','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const checks=[
 ['usa flujo probado beforeinstallprompt',pwa.includes("window.addEventListener('beforeinstallprompt'")&&pwa.includes("installPrompt.prompt()")],
 ['no usa getInstalledRelatedApps',!pwa.includes('getInstalledRelatedApps')],
 ['worker se registra al cargar y se actualiza',pwa.includes("navigator.serviceWorker.register('/sw.js?v=20260918-store-restore-1'")&&pwa.includes('await reg.update()')],
 ['manifest vuelve al id y icono que funcionaban',manifest.id==='/?pwa=pilar-store'&&manifest.icons?.[0]?.src?.includes('supabase.co')&&manifest.icons?.[0]?.sizes==='1536x1536'],
 ['index usa manifest tienda normal',html.includes("'/manifest.webmanifest?v=20260918-store-restore-1'")],
 ['service worker vuelve al shell estable',sw.includes("const CACHE='pilar-shell-v12'")&&sw.includes("'/pilar-icon.svg','/manifest.webmanifest'")]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}if(failed)process.exit(1);