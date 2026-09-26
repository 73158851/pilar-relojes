import fs from 'node:fs';
import assert from 'node:assert/strict';

const save=fs.readFileSync(new URL('../admin-product-save-v2.js',import.meta.url),'utf8');

assert.match(save,/S\.storage\.from\('product-images'\)\.upload\(/,'Images must upload directly through the authenticated Supabase client');
assert.doesNotMatch(save,/\/api\/upload-image/,'Image upload must not depend on the Cloudflare proxy');
assert.doesNotMatch(save,/new FormData/,'Do not repackage mobile files before Storage upload');
assert.doesNotMatch(save,/btoa\(/,'Do not base64-encode mobile images');
assert.match(save,/failedImages\s*>\s*0/,'A failed image must keep the editor open');
console.log('PASS admin image upload regression');
