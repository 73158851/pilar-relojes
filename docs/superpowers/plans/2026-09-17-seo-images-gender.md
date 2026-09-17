# PILAR SEO, imágenes y género Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir género filtrable, control avanzado de imágenes y SEO profesional sin romper el diseño ni los flujos existentes de PILAR.

**Architecture:** Mantener la SPA y añadir módulos pequeños cargados por `router.js`. Supabase sigue siendo fuente de verdad para productos/imágenes; Vercel aporta endpoints SEO para sitemap y crawlers sin reemplazar el frontend actual.

**Tech Stack:** JavaScript ES modules, Supabase JS v2/PostgreSQL/Storage, Vercel rewrites/functions, HTML/CSS.

**Spec:** `docs/superpowers/specs/2026-09-17-seo-images-gender-design.md`

## Global Constraints
- Mantener estética premium actual de tienda y Admin.
- Mantener 0, 1 o múltiples fotos y posibilidad de añadir más después.
- No romper PWA, WhatsApp, favoritos, ventas ni URLs actuales.
- `gender` solo acepta `varon`, `dama` o null.

---

### Task 1: Género en datos y Admin
**Files:**
- Modify DB: `public.products`
- Create: `admin-product-gender.js`
- Modify: `admin-product-save-v2.js`
- Modify: `router.js`

**Interfaces:**
- Produces: `products.gender: 'varon'|'dama'|null`, DOM `#pgender`.

- [ ] Crear prueba estática que exija selector `#pgender`, payload `gender` e import del módulo; verificar que falla.
- [ ] Aplicar migración `ALTER TABLE products ADD COLUMN gender text` con CHECK.
- [ ] Implementar selector en modal crear/editar y precarga del valor.
- [ ] Persistir `gender` desde `admin-product-save-v2.js`.
- [ ] Ejecutar prueba y verificar PASS.
- [ ] Confirmar esquema con SQL.

### Task 2: Filtro premium del catálogo
**Files:**
- Create: `store-gender-filter.js`
- Create: `store-gender-filter.css`
- Modify: `router.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `products.gender` y tarjetas `.sf-card`.
- Produces: control `Todos | Varón | Dama` y contador sincronizado.

- [ ] Crear prueba estática de opciones, consulta de gender, import y CSS; verificar FAIL.
- [ ] Implementar filtro con consulta Supabase y mapa id/slug→gender.
- [ ] Añadir animación de salida/entrada y estado activo accesible.
- [ ] Actualizar contador según tarjetas visibles.
- [ ] Ejecutar prueba y verificar PASS.

### Task 3: Imágenes avanzadas
**Files:**
- Create: `admin-image-pro.js`
- Create: `admin-image-pro.css`
- Modify: `admin-product-save-v2.js`
- Modify: `router.js`
- Modify: `index.html`

**Interfaces:**
- Produces: `window.PilarImagePro.optimizeFile(file)` y preview de `#pfiles`.
- Persiste `product_images.is_primary` y `sort_order`.

- [ ] Crear prueba estática para WEBP/1600/0.82, preview, principal y sort_order; verificar FAIL.
- [ ] Implementar optimización Canvas con fallback al archivo original.
- [ ] Implementar preview de nuevas fotos y advertencia de baja resolución.
- [ ] Implementar reordenamiento de imágenes guardadas y cambio de principal.
- [ ] Integrar optimización en subida existente sin eliminar reintentos.
- [ ] Ejecutar prueba y verificar PASS.

### Task 4: SEO de cliente y archivos públicos
**Files:**
- Create: `store-seo.js`
- Create: `robots.txt`
- Modify: `router.js`
- Modify: `index.html`

**Interfaces:**
- Produce meta title/description/canonical/OG/Twitter/JSON-LD para rutas públicas.

- [ ] Crear prueba estática de metatags, canonical y Product JSON-LD; verificar FAIL.
- [ ] Implementar metadatos por rutas generales.
- [ ] Implementar metadatos de `/producto/:slug` desde Supabase y foto principal.
- [ ] Crear `robots.txt` con sitemap de producción.
- [ ] Ejecutar prueba y verificar PASS.

### Task 5: SEO server-side Vercel
**Files:**
- Create: `api/sitemap.js`
- Create: `api/product-meta.js`
- Modify: `vercel.json`

**Interfaces:**
- `/sitemap.xml` devuelve XML de productos visibles.
- Crawlers de `/producto/:slug` reciben HTML con OG/JSON-LD; usuarios reciben SPA.

- [ ] Crear prueba estática para endpoints y rewrites; verificar FAIL.
- [ ] Implementar sitemap usando REST de Supabase con publishable key y XML escapado.
- [ ] Implementar product-meta con validación de slug, consulta de producto/foto y HTML seguro.
- [ ] Configurar rewrites sin afectar `/admin`, assets ni SPA.
- [ ] Ejecutar prueba y verificar PASS.

### Task 6: Verificación integral
**Files:**
- Test: `tests/feature-check.mjs`

**Interfaces:**
- Verifica wiring de los tres bloques antes de integrar.

- [ ] Ejecutar `node tests/feature-check.mjs` y exigir 0 fallos.
- [ ] Consultar Supabase y verificar CHECK de gender y columnas de imágenes.
- [ ] Comparar rama contra `main` y revisar que no haya cambios no relacionados.
- [ ] Abrir PR de revisión sin fusionar automáticamente.
