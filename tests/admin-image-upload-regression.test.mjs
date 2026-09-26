import fs from 'node:fs';import assert from 'node:assert/strict';
const save=fs.readFileSync(new URL('../admin-product-save-v2.js',import.meta.url),'utf8');
assert.match(save,/functions\/v1\/pilar-image-upload/,'Images must use the dedicated Supabase image processor');
assert.match(save,/new FormData/);
assert.match(save,/form\.append\('image'/);
assert.doesNotMatch(save,/PilarImagePro\?\.optimizeFile/);
assert.match(save,/withTimeout\(fetch\(/);
assert.match(save,/const storedPath=reply\.path\|\|path/);
assert.match(save,/failedImages\s*>\s*0/);
console.log('PASS dedicated server image pipeline regression');
assert.match(save,/arrayBuffer\(\)/,'Selected Android files must be snapshotted before later upload');
assert.match(save,/selectedFilesPromise/,'Save must use the stable in-memory file snapshot');

assert.doesNotMatch(save,/S\.auth\.getSession\(\)/,'Image upload must not request a second auth session inside save');
assert.match(save,/S\.functions\.invoke\('pilar-image-upload'/,'Use the authenticated Supabase client to invoke the image function');

assert.match(save,/localStorage\.getItem\('sb-lsuigiuthuycddlcvrds-auth-token'\)/,'Upload must read the already-persisted token without invoking Supabase auth');
assert.match(save,/fetch\(`https:\/\/lsuigiuthuycddlcvrds\.supabase\.co\/functions\/v1\/pilar-image-upload/,'Upload must issue a direct network request');
assert.doesNotMatch(save,/S\.functions\.invoke\('pilar-image-upload'/,'Do not use invoke because the failing boundary is before its network request');
