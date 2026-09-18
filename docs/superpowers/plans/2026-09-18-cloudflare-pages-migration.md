# Cloudflare Pages Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar una copia funcional de PILAR en Cloudflare Pages, mantener Vercel intacto como respaldo y validar de punta a punta que la tienda, el panel admin, Supabase, SEO y la instalación PWA funcionen antes de considerar Cloudflare como hosting principal.

**Architecture:** La migración se realizará en una rama dedicada `cloudflare-pages`. El frontend estático seguirá usando el mismo código y Supabase; las rutas dinámicas `/api/sitemap` y `/api/product-meta` se trasladarán a Cloudflare Pages Functions conservando sus URLs públicas. El enrutamiento SPA y los encabezados necesarios se definirán con archivos compatibles con Cloudflare Pages. Vercel y `main` no se modificarán durante la implementación.

**Tech Stack:** HTML/CSS/JavaScript estático, Cloudflare Pages, Cloudflare Pages Functions, Service Worker, Web App Manifest, Supabase REST API, GitHub.

**Spec:** `docs/superpowers/specs/2026-09-18-cloudflare-pages-migration-design.md`

## Global Constraints

- Vercel debe permanecer intacto durante la fase de validación.
- La primera publicación de Cloudflare debe usar una URL `*.pages.dev`.
- No mover el dominio principal ni tráfico real hasta completar las verificaciones.
- Mantener Supabase como backend y conservar las mismas interfaces públicas usadas por el frontend.
- Mantener `/admin`, `/producto/:slug`, `/api/sitemap` y `/api/product-meta?slug=...`.
- La PWA debe usar rutas del mismo origen para manifest, iconos y service worker.
- La migración solo se considerará exitosa cuando la PWA pueda instalarse de forma nativa en Android y abrir en modo `standalone`.
- Si Cloudflare presenta una regresión, Vercel debe seguir disponible como rollback.

---

### Task 1: Crear la rama de migración y una prueba de compatibilidad Cloudflare

**Files:**
- Create: `tests/cloudflare-pages-compat.mjs`
- Create: `docs/cloudflare/README.md`

**Interfaces:**
- Consumes: estructura actual del repositorio, `index.html`, `manifest.webmanifest`, `sw.js`, `api/product-meta.js`, `api/sitemap.js`.
- Produces: prueba automatizada que falla hasta que existan las piezas mínimas de Cloudflare Pages.

- [ ] **Step 1: Crear la rama dedicada**

Run:
```bash
git checkout -b cloudflare-pages
```

Expected: rama `cloudflare-pages` creada desde el `main` actual sin modificar `main`.

- [ ] **Step 2: Escribir la prueba fallida**

Crear `tests/cloudflare-pages-compat.mjs`:

```js
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
```

- [ ] **Step 3: Ejecutar la prueba y verificar que falla**

Run:
```bash
node tests/cloudflare-pages-compat.mjs
```

Expected: FAIL al menos en `_redirects` y `functions/api/*`.

- [ ] **Step 4: Documentar el propósito del entorno paralelo**

Crear `docs/cloudflare/README.md`:

```md
# PILAR en Cloudflare Pages

Esta rama publica una copia paralela de PILAR para validar Cloudflare Pages sin modificar la producción actual en Vercel.

Reglas:
- No apuntar el dominio principal a Cloudflare durante las pruebas.
- Validar tienda, /admin, Supabase, SEO y PWA en *.pages.dev.
- Mantener las rutas públicas existentes.
- Vercel permanece como rollback.
```

- [ ] **Step 5: Commit**

```bash
git add tests/cloudflare-pages-compat.mjs docs/cloudflare/README.md
git commit -m "test: define Cloudflare Pages migration contract"
```

---

### Task 2: Implementar el fallback SPA de Cloudflare Pages

**Files:**
- Create: `_redirects`
- Modify: `tests/cloudflare-pages-compat.mjs`

**Interfaces:**
- Consumes: rutas SPA existentes (`/`, `/catalogo`, `/nuevos`, `/ofertas`, `/contacto`, `/admin`, `/producto/:slug`).
- Produces: fallback de navegación a `index.html` sin interceptar `/api/*`.

- [ ] **Step 1: Ampliar la prueba para exigir el fallback correcto**

Añadir a `tests/cloudflare-pages-compat.mjs`:

```js
const redirects = fs.existsSync('_redirects') ? fs.readFileSync('_redirects', 'utf8') : '';
checks.push(
  ['API routes are excluded before SPA fallback', redirects.includes('/api/* /api/:splat 200') || redirects.includes('/api/*')],
  ['SPA fallback maps to index.html', redirects.includes('/* /index.html 200')]
);
```

- [ ] **Step 2: Ejecutar la prueba y verificar fallo**

Run:
```bash
node tests/cloudflare-pages-compat.mjs
```

Expected: FAIL en reglas de redirects.

- [ ] **Step 3: Crear `_redirects`**

```text
/api/* /api/:splat 200
/* /index.html 200
```

- [ ] **Step 4: Ejecutar la prueba**

Run:
```bash
node tests/cloudflare-pages-compat.mjs
```

Expected: las comprobaciones del fallback pasan; las funciones todavía fallan.

- [ ] **Step 5: Commit**

```bash
git add _redirects tests/cloudflare-pages-compat.mjs
git commit -m "feat: add Cloudflare Pages SPA fallback"
```

---

### Task 3: Crear helper de origen público para Cloudflare Functions

**Files:**
- Create: `functions/_shared/origin.js`
- Test: `tests/cloudflare-origin.mjs`

**Interfaces:**
- Produces: `getPublicOrigin(request): string`
- Consumes later: `functions/api/sitemap.js`, `functions/api/product-meta.js`.

- [ ] **Step 1: Escribir la prueba fallida**

Crear `tests/cloudflare-origin.mjs`:

```js
import { getPublicOrigin } from '../functions/_shared/origin.js';

const req = new Request('https://pilar-demo.pages.dev/api/sitemap');
const actual = getPublicOrigin(req);
if (actual !== 'https://pilar-demo.pages.dev') {
  console.error('FAIL expected origin, got', actual);
  process.exit(1);
}
console.log('PASS public origin derived from request');
```

- [ ] **Step 2: Ejecutar la prueba**

Run:
```bash
node tests/cloudflare-origin.mjs
```

Expected: FAIL porque el módulo no existe.

- [ ] **Step 3: Implementar helper mínimo**

Crear `functions/_shared/origin.js`:

```js
export function getPublicOrigin(request) {
  return new URL(request.url).origin;
}
```

- [ ] **Step 4: Ejecutar la prueba**

Run:
```bash
node tests/cloudflare-origin.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/_shared/origin.js tests/cloudflare-origin.mjs
git commit -m "feat: add Cloudflare public origin helper"
```

---

### Task 4: Migrar `/api/sitemap` a Cloudflare Pages Functions

**Files:**
- Create: `functions/api/sitemap.js`
- Create: `tests/cloudflare-sitemap.mjs`

**Interfaces:**
- Consumes: `getPublicOrigin(request)`, Supabase REST API.
- Produces: `onRequestGet(context): Response` en `/api/sitemap`.

- [ ] **Step 1: Escribir la prueba de forma y origen**

Crear `tests/cloudflare-sitemap.mjs`:

```js
import fs from 'node:fs';

const src = fs.readFileSync('functions/api/sitemap.js', 'utf8');
const checks = [
  ['exports onRequestGet', src.includes('export async function onRequestGet')],
  ['uses getPublicOrigin', src.includes('getPublicOrigin')],
  ['uses Supabase products endpoint', src.includes('/rest/v1/products')],
  ['returns application/xml', src.includes('application/xml')],
  ['does not hardcode vercel origin', !src.includes('pilar-relojes.vercel.app')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
```

- [ ] **Step 2: Ejecutar y verificar fallo**

Run:
```bash
node tests/cloudflare-sitemap.mjs
```

Expected: FAIL porque el archivo no existe.

- [ ] **Step 3: Implementar la función**

Crear `functions/api/sitemap.js`:

```js
import { getPublicOrigin } from '../_shared/origin.js';

const SUPABASE = 'https://lsuigiuthuycddlcvrds.supabase.co';
const KEY = 'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu';

const esc = s => String(s).replace(/[<>&'"]/g, c => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
}[c]));

export async function onRequestGet({ request }) {
  try {
    const origin = getPublicOrigin(request);
    const response = await fetch(
      `${SUPABASE}/rest/v1/products?select=slug,updated_at&visible=eq.true&deleted_at=is.null&order=updated_at.desc`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );

    if (!response.ok) throw new Error('products');

    const products = await response.json();
    const staticPaths = ['/', '/catalogo', '/nuevos', '/ofertas', '/contacto'];
    const urls = [
      ...staticPaths.map(path => ({ loc: origin + path, lastmod: null })),
      ...products.map(p => ({
        loc: `${origin}/producto/${encodeURIComponent(p.slug)}`,
        lastmod: p.updated_at,
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(x => `<url><loc>${esc(x.loc)}</loc>${x.lastmod ? `<lastmod>${esc(new Date(x.lastmod).toISOString())}</lastmod>` : ''}</url>`).join('')}</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=1800',
      },
    });
  } catch {
    return new Response('No se pudo generar el sitemap', { status: 500 });
  }
}
```

- [ ] **Step 4: Ejecutar prueba**

Run:
```bash
node tests/cloudflare-sitemap.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/api/sitemap.js tests/cloudflare-sitemap.mjs
git commit -m "feat: add Cloudflare sitemap function"
```

---

### Task 5: Migrar `/api/product-meta` a Cloudflare Pages Functions

**Files:**
- Create: `functions/api/product-meta.js`
- Create: `tests/cloudflare-product-meta.mjs`

**Interfaces:**
- Consumes: `getPublicOrigin(request)`, query param `slug`, Supabase REST API.
- Produces: `onRequestGet(context): Response` en `/api/product-meta?slug=...`.

- [ ] **Step 1: Escribir prueba de forma y origen**

Crear `tests/cloudflare-product-meta.mjs`:

```js
import fs from 'node:fs';

const src = fs.readFileSync('functions/api/product-meta.js', 'utf8');
const checks = [
  ['exports onRequestGet', src.includes('export async function onRequestGet')],
  ['reads slug from URLSearchParams', src.includes("searchParams.get('slug')")],
  ['uses getPublicOrigin', src.includes('getPublicOrigin')],
  ['contains Product JSON-LD', src.includes("'@type': 'Product'") || src.includes('"@type":"Product"')],
  ['does not hardcode vercel origin', !src.includes('pilar-relojes.vercel.app')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
```

- [ ] **Step 2: Ejecutar y verificar fallo**

Run:
```bash
node tests/cloudflare-product-meta.mjs
```

Expected: FAIL porque el archivo no existe.

- [ ] **Step 3: Implementar función compatible**

Crear `functions/api/product-meta.js` adaptando la lógica actual de `api/product-meta.js` a `Request/Response`. La implementación debe:

```js
import { getPublicOrigin } from '../_shared/origin.js';

const SUPABASE = 'https://lsuigiuthuycddlcvrds.supabase.co';
const KEY = 'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[c]));

async function get(path) {
  const response = await fetch(`${SUPABASE}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!response.ok) throw new Error('supabase');
  return response.json();
}

export async function onRequestGet({ request }) {
  try {
    const urlObject = new URL(request.url);
    const slug = String(urlObject.searchParams.get('slug') || '').trim();
    if (!slug || slug.length > 160) {
      return new Response('Producto inválido', { status: 400 });
    }

    const products = await get(
      `products?select=id,name,brand,description,price,stock,slug&slug=eq.${encodeURIComponent(slug)}&visible=eq.true&deleted_at=is.null&limit=1`
    );
    const p = products[0];
    if (!p) return new Response('Producto no encontrado', { status: 404 });

    const imgs = await get(
      `product_images?select=public_url,is_primary,sort_order&product_id=eq.${encodeURIComponent(p.id)}&order=is_primary.desc,sort_order.asc&limit=1`
    );

    const origin = getPublicOrigin(request);
    const image = imgs[0]?.public_url || '';
    const productUrl = `${origin}/producto/${encodeURIComponent(p.slug)}`;
    const price = Number(p.price || 0);
    const status = Number(p.stock) > 0 ? 'Disponible' : 'Agotado';
    const title = `${p.name} | PILAR Relojes Sucre`;
    const baseDescription = p.description || `${p.name} disponible en PILAR, Sucre, Bolivia.`;
    const description = `${baseDescription} · Bs ${price.toFixed(0)} · ${status}`.slice(0, 180);
    const json = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image: image ? [image] : [],
      description,
      brand: { '@type': 'Brand', name: p.brand || 'PILAR' },
      offers: {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'BOB',
        price,
        availability: Number(p.stock) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    }).replace(/</g, '\\u003c');

    const imageMeta = image
      ? `<meta property="og:image" content="${esc(image)}"><meta property="og:image:secure_url" content="${esc(image)}"><meta property="og:image:alt" content="${esc(`${p.name} - PILAR Relojes Sucre`)}"><meta name="twitter:image" content="${esc(image)}">`
      : '';

    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(productUrl)}"><meta property="og:type" content="product"><meta property="og:site_name" content="PILAR"><meta property="og:locale" content="es_BO"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(productUrl)}">${imageMeta}<script type="application/ld+json">${json}</script><meta http-equiv="refresh" content="0;url=${esc(productUrl)}"></head><body><a href="${esc(productUrl)}">Ver ${esc(p.name)} en PILAR</a></body></html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=600',
      },
    });
  } catch {
    return new Response('No se pudieron cargar los metadatos', { status: 500 });
  }
}
```

- [ ] **Step 4: Ejecutar prueba**

Run:
```bash
node tests/cloudflare-product-meta.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/api/product-meta.js tests/cloudflare-product-meta.mjs
git commit -m "feat: add Cloudflare product metadata function"
```

---

### Task 6: Asegurar portabilidad PWA entre `pages.dev` y dominio futuro

**Files:**
- Modify: `manifest.webmanifest`
- Modify: `sw.js`
- Create: `tests/cloudflare-pwa-portability.mjs`

**Interfaces:**
- Consumes: manifest e iconos locales.
- Produces: PWA sin URLs absolutas de Vercel.

- [ ] **Step 1: Crear prueba**

```js
import fs from 'node:fs';

const manifest = fs.readFileSync('manifest.webmanifest', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

const checks = [
  ['manifest has no vercel hostname', !manifest.includes('pilar-relojes.vercel.app')],
  ['service worker has no vercel hostname', !sw.includes('pilar-relojes.vercel.app')],
  ['manifest uses local 192 icon', manifest.includes('/pilar-icon-192.png')],
  ['manifest uses local 512 icon', manifest.includes('/pilar-icon-512.png')],
  ['display standalone', manifest.includes('"display": "standalone"')],
  ['scope root', manifest.includes('"scope": "/"')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
```

- [ ] **Step 2: Ejecutar prueba**

Run:
```bash
node tests/cloudflare-pwa-portability.mjs
```

Expected: PASS si el manifest actual ya cumple; si falla, modificar solo las URLs absolutas detectadas.

- [ ] **Step 3: Actualizar service worker para una caché específica de Cloudflare**

Cambiar únicamente el nombre de caché en la rama Cloudflare:

```js
const CACHE='pilar-cloudflare-shell-v1';
```

Mantener el resto de la estrategia actual salvo que una prueba funcional demuestre un problema.

- [ ] **Step 4: Ejecutar pruebas**

Run:
```bash
node tests/cloudflare-pwa-portability.mjs
node tests/cloudflare-pages-compat.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add manifest.webmanifest sw.js tests/cloudflare-pwa-portability.mjs
git commit -m "fix: make PILAR PWA portable across hosts"
```

---

### Task 7: Añadir configuración de headers para PWA

**Files:**
- Create: `_headers`
- Create: `tests/cloudflare-headers.mjs`

**Interfaces:**
- Produces: tipos/caché adecuados para manifest y service worker.

- [ ] **Step 1: Crear prueba**

```js
import fs from 'node:fs';
const h = fs.readFileSync('_headers', 'utf8');

const checks = [
  ['manifest content type', h.includes('/manifest.webmanifest') && h.includes('application/manifest+json')],
  ['service worker no-cache', h.includes('/sw.js') && h.includes('no-cache')],
  ['service worker scope header', h.includes('Service-Worker-Allowed: /')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
```

- [ ] **Step 2: Ejecutar y verificar fallo**

Run:
```bash
node tests/cloudflare-headers.mjs
```

Expected: FAIL porque `_headers` no existe.

- [ ] **Step 3: Crear `_headers`**

```text
/manifest.webmanifest
  Content-Type: application/manifest+json
  Cache-Control: no-cache

/sw.js
  Cache-Control: no-cache
  Service-Worker-Allowed: /

/admin-manifest.webmanifest
  Content-Type: application/manifest+json
  Cache-Control: no-cache

/admin-sw.js
  Cache-Control: no-cache
  Service-Worker-Allowed: /
```

- [ ] **Step 4: Ejecutar prueba**

Run:
```bash
node tests/cloudflare-headers.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add _headers tests/cloudflare-headers.mjs
git commit -m "feat: add Cloudflare PWA headers"
```

---

### Task 8: Ejecutar suite local de regresión antes del despliegue

**Files:**
- No production files.
- Uses: `tests/*.mjs`

**Interfaces:**
- Produces: evidencia de que la rama no rompe la tienda existente.

- [ ] **Step 1: Ejecutar pruebas Cloudflare**

Run:
```bash
node tests/cloudflare-pages-compat.mjs
node tests/cloudflare-origin.mjs
node tests/cloudflare-sitemap.mjs
node tests/cloudflare-product-meta.mjs
node tests/cloudflare-pwa-portability.mjs
node tests/cloudflare-headers.mjs
```

Expected: todas PASS.

- [ ] **Step 2: Ejecutar pruebas existentes de PWA y hero que no dependan de Vercel**

Run:
```bash
node tests/store-pwa-installability.mjs
node tests/store-install-button-public.mjs
node tests/hero-stable-rollback.mjs
node tests/hero-icons-image-stable.mjs
```

Expected: todas PASS.

- [ ] **Step 3: Revisar diff**

Run:
```bash
git diff main...cloudflare-pages --stat
git diff main...cloudflare-pages -- _redirects _headers functions manifest.webmanifest sw.js
```

Expected: no cambios en `storefront.js`, CSS de diseño, imágenes hero ni módulos admin ajenos a la migración.

- [ ] **Step 4: Commit de correcciones menores si fueran necesarias**

Solo si las pruebas exigen una corrección específica:

```bash
git add <archivos-corregidos>
git commit -m "test: satisfy Cloudflare migration regression suite"
```

---

### Task 9: Conectar el repositorio a Cloudflare Pages y crear preview público

**Files:**
- No repository changes required unless Cloudflare requests configuration adicional.

**Interfaces:**
- Consumes: rama `cloudflare-pages`.
- Produces: URL pública `https://<project>.pages.dev`.

- [ ] **Step 1: Crear proyecto en Cloudflare Pages**

En Cloudflare Dashboard:

```text
Workers & Pages → Create → Pages → Connect to Git
```

Seleccionar el repositorio:

```text
73158851/pilar-relojes
```

- [ ] **Step 2: Configurar rama y build**

Usar:

```text
Production branch: cloudflare-pages
Framework preset: None
Build command: (vacío)
Build output directory: /
```

Si Cloudflare exige un directorio de salida y no acepta `/`, usar el modo de assets estáticos recomendado por Pages para repositorios sin build y validar que los archivos raíz se publiquen sin transformación.

- [ ] **Step 3: Desplegar**

Expected: estado `Success` y URL `*.pages.dev`.

- [ ] **Step 4: Registrar URL de preview en `docs/cloudflare/README.md`**

Añadir:

```md
## Preview activo
- URL: https://<project>.pages.dev
- Rama: cloudflare-pages
- Estado: validación
```

- [ ] **Step 5: Commit**

```bash
git add docs/cloudflare/README.md
git commit -m "docs: record Cloudflare Pages preview"
```

---

### Task 10: Verificación end-to-end en Cloudflare Pages

**Files:**
- Modify only if a specific failing test identifies a bug.
- Update: `docs/cloudflare/README.md`

**Interfaces:**
- Consumes: URL `*.pages.dev`.
- Produces: checklist de aceptación con evidencia.

- [ ] **Step 1: Verificar HTTP y assets críticos**

Comprobar:

```text
GET /
GET /catalogo
GET /admin
GET /manifest.webmanifest
GET /pilar-icon-192.png
GET /pilar-icon-512.png
GET /sw.js
GET /api/sitemap
```

Expected: 200 para todos los recursos válidos.

- [ ] **Step 2: Verificar navegación SPA**

Abrir directamente:

```text
/catalogo
/nuevos
/ofertas
/contacto
/admin
/producto/<slug-real>
```

Expected: la app carga sin 404 del host.

- [ ] **Step 3: Verificar Supabase**

En catálogo/admin:

```text
- productos cargan
- imágenes cargan
- stock/precio visibles
- login/admin funciona
- editar/guardar producto funciona
```

Expected: comportamiento equivalente a Vercel.

- [ ] **Step 4: Verificar funciones SEO**

Abrir:

```text
/api/sitemap
/api/product-meta?slug=<slug-real>
```

Expected:
- sitemap XML usa hostname `pages.dev`
- product-meta usa canonical/og:url con hostname `pages.dev`
- no aparece `pilar-relojes.vercel.app` en salida generada.

- [ ] **Step 5: Verificar PWA Android**

En Chrome Android con PILAR no instalada:

```text
1. Abrir https://<project>.pages.dev
2. Esperar registro de service worker.
3. Confirmar que Chrome ofrece instalación.
4. Tocar Instalar PILAR.
5. Aceptar el diálogo nativo.
6. Abrir PILAR desde el icono instalado.
7. Confirmar ausencia de barra de direcciones.
8. Confirmar que Instalar PILAR ya no aparece dentro de la app.
```

Expected: instalación PWA nativa y `display-mode: standalone`.

- [ ] **Step 6: Verificar offline básico**

Con app ya cargada:

```text
1. Abrir inicio.
2. Activar modo avión.
3. Recargar.
```

Expected: shell/offline fallback responde según `sw.js`.

- [ ] **Step 7: Registrar resultados**

Actualizar `docs/cloudflare/README.md` con:

```md
## Validación
- Inicio: PASS/FAIL
- Catálogo: PASS/FAIL
- Admin: PASS/FAIL
- Supabase: PASS/FAIL
- Sitemap: PASS/FAIL
- Product meta: PASS/FAIL
- Manifest: PASS/FAIL
- Service worker: PASS/FAIL
- Instalación Android: PASS/FAIL
- Standalone: PASS/FAIL
- Offline básico: PASS/FAIL
```

- [ ] **Step 8: Commit**

```bash
git add docs/cloudflare/README.md
git commit -m "docs: record Cloudflare validation results"
```

---

### Task 11: Decidir promoción a hosting principal

**Files:**
- Update: `docs/cloudflare/README.md`

**Interfaces:**
- Consumes: resultados de Task 10.
- Produces: decisión explícita GO/NO-GO.

- [ ] **Step 1: Aplicar criterio GO**

GO solo si todos son PASS:

```text
Inicio
Catálogo
Admin
Supabase
Sitemap
Product meta
Manifest
Service worker
Instalación Android
Standalone
Offline básico
```

- [ ] **Step 2: Si hay cualquier FAIL, mantener Vercel como principal**

Registrar:

```md
## Decisión
NO-GO: Vercel sigue como principal. Cloudflare permanece en validación.
```

- [ ] **Step 3: Si todo está PASS, solicitar aprobación explícita antes de mover dominio**

Registrar:

```md
## Decisión
GO técnico: Cloudflare está listo para convertirse en principal.
Pendiente: aprobación del propietario antes de cambiar DNS/dominio.
```

- [ ] **Step 4: Commit**

```bash
git add docs/cloudflare/README.md
git commit -m "docs: record Cloudflare go-no-go decision"
```

---

### Task 12: Cambio de dominio principal solo después de aprobación

**Files:**
- No code changes expected.
- Update: `docs/cloudflare/README.md`

**Interfaces:**
- Consumes: aprobación explícita del propietario y GO técnico.
- Produces: dominio principal apuntando a Cloudflare, Vercel conservado como rollback.

- [ ] **Step 1: Añadir dominio en Cloudflare Pages**

En Cloudflare Pages:

```text
Custom domains → Set up a custom domain
```

- [ ] **Step 2: Actualizar DNS solo cuando Cloudflare muestre configuración válida**

Expected: certificado TLS activo y estado del dominio `Active`.

- [ ] **Step 3: Repetir la verificación crítica sobre el dominio principal**

Comprobar:

```text
/
 /catalogo
 /admin
 /manifest.webmanifest
 /sw.js
 /api/sitemap
 /producto/<slug>
 instalación PWA Android
```

Expected: PASS.

- [ ] **Step 4: Mantener Vercel sin eliminar**

No borrar el proyecto Vercel ni desconectar Git todavía.

- [ ] **Step 5: Registrar rollback**

Actualizar documentación:

```md
## Producción
Hosting principal: Cloudflare Pages
Rollback disponible: Vercel
Fecha de cambio: <fecha real>
```

- [ ] **Step 6: Commit**

```bash
git add docs/cloudflare/README.md
git commit -m "docs: record Cloudflare production cutover"
```

## Self-Review

- Cobertura del spec: frontend, SPA, API dinámicas, Supabase, admin, SEO, PWA, Android, offline, rollback y cambio de principal están cubiertos.
- No se mueve tráfico antes de validar `pages.dev`.
- Las funciones de Cloudflare conservan las interfaces públicas existentes.
- No se incluyen refactors de diseño ni cambios ajenos a la migración.
- No quedan marcadores TBD/TODO en el plan.
