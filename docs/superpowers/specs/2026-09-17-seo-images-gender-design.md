# PILAR SEO, imágenes y género — Diseño

## Objetivo
Mejorar PILAR sin alterar su estética aprobada, incorporando: SEO por producto, gestión avanzada de imágenes y filtro de catálogo por género.

## Género y catálogo
- `products.gender` será nullable y aceptará `varon` o `dama`.
- Los productos existentes sin género seguirán visibles en `Todos`, pero no en `Varón` ni `Dama` hasta ser clasificados.
- El formulario Admin mostrará `Género` con Varón/Dama al crear o editar.
- El catálogo mostrará una barra premium `Todos | Varón | Dama` y filtrará sin recargar, actualizando contador y animando la cuadrícula.

## Gestión de imágenes
- Mantener `product_images`, `is_primary` y `sort_order` existentes.
- Antes de subir una imagen nueva, optimizarla en el navegador a WEBP, con lado máximo 1600 px y calidad 0.82; si el navegador no puede procesarla, conservar el original.
- Mostrar vista previa de nuevas imágenes antes de guardar.
- Mantener cambio de imagen principal y eliminación.
- Permitir reordenar imágenes guardadas mediante controles izquierda/derecha accesibles en móvil; persistir `sort_order`.
- Mostrar tamaño original/optimizado y advertir imágenes menores de 700 px en su lado más largo.

## SEO
- Mantener SPA existente y añadir SEO dinámico robusto para navegador: title, description, canonical, Open Graph, Twitter Card y JSON-LD Product por reloj.
- Inicio, Catálogo, Nuevos y Ofertas tendrán metadatos específicos.
- `robots.txt` será público.
- `sitemap.xml` será generado dinámicamente desde una función serverless de Vercel leyendo productos visibles de Supabase.
- Para enlaces de producto compartidos, una función serverless de Vercel inyectará metadatos OG del producto cuando la solicitud provenga de crawlers sociales/buscadores y servirá el `index.html` normal para usuarios. Esto mantiene la SPA sin duplicar páginas.

## Estética
- Mantener marfil, navy, dorado, tipografía y animaciones actuales.
- Nuevos controles Admin usarán las clases visuales existentes.
- El filtro de género tendrá transición y cambio de cuadrícula sin parpadeos.

## Compatibilidad
- No cambiar URL de productos, favoritos, WhatsApp, PWA ni flujo de compra.
- Productos sin género siguen funcionando.
- Si falla la optimización de una foto, el original seguirá siendo válido.