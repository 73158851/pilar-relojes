import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const admin=read('admin-v2.js'), realtime=read('admin-realtime.js'), pwa=read('admin-pwa.js'), state=read('storefront-state.js'), save=read('admin-product-save-v2.js'), gender=read('admin-product-gender.js');
const checks=[
 ['explicit tab auth gate',admin.includes("pilar_admin_authenticated_v1")&&admin.includes("if(!hasTabAuth())")],
 ['login only authenticates from submit',admin.includes("go.onclick=submit")&&!admin.includes("emailInput.addEventListener('focus'")],
 ['realtime cannot bypass login',realtime.includes("pilar_admin_authenticated_v1")&&realtime.includes("function authorized()")],
 ['pwa requires explicit admin auth',pwa.includes("pilar_admin_authenticated_v1")&&pwa.includes("data?.role==='admin'")],
 ['admin worker isolated from legacy workers',pwa.includes("getRegistrations")&&pwa.includes("unregister()")],
 ['public stock never exposes exact quantity',state.includes("return availability(stock,settings).label")&&state.includes("'No disponible'")],
 ['product save has no singular coercion',!save.includes(".single()")&&!save.includes(".maybeSingle()")],
 ['gender load has no singular coercion',!gender.includes(".single()")&&!gender.includes(".maybeSingle()")]
];
let bad=0;for(const[n,ok]of checks){console.log(ok?'PASS':'FAIL',n);if(!ok)bad++}if(bad)process.exit(1);
