import fs from 'node:fs';

const checks = [
  ['SPA fallback exists', fs.existsSync('_redirects')],
  ['Cloudflare sitemap function exists', fs.existsSync('functions/api/sitemap.js')],
  ['Cloudflare product meta function exists', fs.existsSync('functions/api/product-meta.js')],
  ['Cloudflare public origin helper exists', fs.existsSync('functions/_shared/origin.js')],
  ['PWA manifest uses local PNG 192', fs.readFileSync('manifest.webmanifest', 'utf8').includes('/pilar-icon-192.png')],
  ['PWA manifest uses local PNG 512', fs.readFileSync('manifest.webmanifest', 'utf8').includes('/pilar-icon-512.png')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
