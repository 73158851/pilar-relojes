# Diseño: Migración segura de PILAR a Cloudflare Pages

## Objetivo
Publicar una copia funcional de PILAR en Cloudflare Pages sin interrumpir la tienda actual en Vercel. La copia debe mantener diseño, navegación, panel administrativo, Supabase y comportamiento PWA. Solo después de verificarla de punta a punta se evaluará convertir Cloudflare en hosting principal.

## Alcance
Se conservará Vercel como producción actual durante la fase de validación. Cloudflare Pages será inicialmente un entorno paralelo con una URL `*.pages.dev`. No se moverá tráfico principal ni se cambiará el dominio de clientes hasta completar las pruebas.

## Arquitectura
La aplicación seguirá usando el mismo repositorio GitHub y Supabase como backend/datos. Cloudflare Pages servirá los archivos estáticos y el frontend. Las funciones específicas de Vercel bajo `/api` deberán adaptarse a Cloudflare Pages Functions o una alternativa equivalente.

## Componentes a migrar
1. Frontend estático: `index.html`, CSS, JS, imágenes, manifest y service workers.
2. Enrutamiento SPA: equivalencia de la reescritura global hacia `index.html`.
3. PWA pública: `manifest.webmanifest`, `sw.js`, iconos locales y flujo de instalación.
4. Panel admin: `/admin`, `admin-manifest.webmanifest`, `admin-sw.js` y módulos administrativos.
5. Funciones dinámicas:
   - `/api/sitemap`
   - `/api/product-meta?slug=...`
6. Integración con Supabase: mismas URLs públicas y publishable key existentes.
7. SEO y rutas de producto: `/producto/:slug`.

## Estrategia de despliegue
Se creará una rama dedicada para Cloudflare, por ejemplo `cloudflare-pages`, para evitar alterar `main` durante la migración. Los cambios específicos de Cloudflare vivirán allí hasta que la versión sea validada.

Cloudflare Pages se conectará al repositorio GitHub y desplegará desde esa rama. La URL `pages.dev` se usará para pruebas.

## Adaptación de rutas
La regla actual de Vercel que reescribe cualquier ruta hacia `index.html` deberá reproducirse con la configuración compatible de Cloudflare Pages.

Las rutas `/api/sitemap` y `/api/product-meta` se implementarán como Pages Functions conservando la misma interfaz pública que hoy usa la tienda. Así el frontend no tendrá que cambiar.

## PWA
El manifest y el service worker deberán usar rutas relativas al mismo origen para que funcionen tanto en `pages.dev` como, posteriormente, en un dominio propio.

La prueba de instalación será válida solo si:
- el manifest carga correctamente;
- los iconos 192x192 y 512x512 responden con 200;
- el service worker queda registrado y controla la página;
- Chrome ofrece instalación nativa;
- la app abre en `standalone`;
- el botón de instalación desaparece dentro de la app instalada.

## Verificación funcional
Antes de considerar Cloudflare como principal se comprobará:
- Inicio
- Catálogo
- Nuevos
- Ofertas
- Contacto
- Productos individuales
- WhatsApp
- Carga de imágenes
- Panel `/admin`
- Guardado y edición de productos
- Sitemap
- Metadatos sociales/SEO
- Manifest
- Service worker
- Instalación PWA en Android
- Comportamiento offline básico

## Estrategia de cambio a principal
Cloudflare solo pasará a principal después de superar las pruebas anteriores. El dominio principal se apuntará entonces a Cloudflare. Vercel se conservará temporalmente como respaldo y rollback.

## Rollback
Si Cloudflare presenta una regresión, el dominio podrá volver a apuntar a Vercel. Durante la fase inicial no se eliminará ni modificará la producción existente.

## Criterio de éxito
La migración se considerará exitosa cuando la versión `pages.dev` reproduzca el comportamiento de la tienda actual y la PWA pueda instalarse de forma nativa en Android, sin perder funciones del panel, rutas SEO o conexión con Supabase.
