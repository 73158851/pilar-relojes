# Verificación de integración PILAR

Contrato esperado por `tests/feature-check.mjs`:

- Admin selector `#pgender`: implementado en `admin-product-gender.js`.
- Persistencia `gender`: implementada en `admin-product-save-v2.js`.
- Filtro Todos/Varón/Dama: implementado en `store-gender-filter.js`.
- Optimización WEBP 1600 / 0.82: implementada en `admin-image-pro.js` e integrada al guardado.
- Preview, resolución y orden: implementados en `admin-image-pro.js`.
- SEO canonical, Open Graph, Twitter y Product JSON-LD: `store-seo.js`.
- robots/sitemap: `robots.txt`, `api/sitemap.js`.
- metadata server para crawlers: `api/product-meta.js` + regla condicional de `vercel.json`.
- Wiring: `router.js` e `index.html`.

Nota de entorno: el checkout local automatizado no pudo ejecutarse porque el contenedor no tiene resolución de red hacia GitHub. La verificación final debe usar CI/preview de GitHub/Vercel antes de fusionar a `main`.