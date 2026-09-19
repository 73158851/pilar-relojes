# PILAR en Cloudflare Pages

Esta rama publica una copia paralela de PILAR para validar Cloudflare Pages sin modificar la producción actual en Vercel.

Reglas:
- No apuntar el dominio principal a Cloudflare durante las pruebas.
- Validar tienda, /admin, Supabase, SEO y PWA en *.pages.dev.
- Mantener las rutas públicas existentes.
- Vercel permanece como rollback.
