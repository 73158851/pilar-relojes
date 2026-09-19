import { getPublicOrigin } from '../functions/_shared/origin.js';

const req = new Request('https://pilar-demo.pages.dev/api/sitemap');
const actual = getPublicOrigin(req);
if (actual !== 'https://pilar-demo.pages.dev') {
  console.error('FAIL expected origin, got', actual);
  process.exit(1);
}
console.log('PASS public origin derived from request');
