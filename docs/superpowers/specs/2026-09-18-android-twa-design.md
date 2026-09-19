# Diseño: Aplicación Android PILAR con TWA

## Objetivo
Crear una aplicación Android real para PILAR que pueda instalarse mediante APK, aparecer en el cajón de aplicaciones, abrir la tienda como experiencia independiente y quedar preparada también como AAB para una futura publicación en Google Play.

## Resultado esperado
La aplicación se llamará **PILAR**, usará como origen web `https://pilar-relojes.pages.dev`, conservará la tienda y el panel web existentes como fuente de contenido y datos, y no requerirá recompilación cuando cambien productos, precios, imágenes o stock.

## Enfoque elegido
Se utilizará una **Trusted Web Activity (TWA)** generada con Bubblewrap. Este enfoque aprovecha la PWA existente y evita rehacer la tienda como aplicación nativa.

Se descartan por ahora:
- **WebView pura:** más simple, pero menos integrada con la experiencia web instalada y con peor comportamiento de seguridad/navegación.
- **Capacitor:** más flexible para funciones nativas, pero añade una capa y complejidad que PILAR todavía no necesita.

## Arquitectura
La app Android será un contenedor TWA firmado que abre el dominio público de PILAR en Cloudflare Pages.

Componentes:
1. **Cloudflare Pages**: hosting principal de la web utilizada por la app.
2. **Supabase**: backend de productos, imágenes, autenticación y datos existentes.
3. **Proyecto Android TWA**: paquete Android, recursos, iconos, splash y configuración de navegación.
4. **Digital Asset Links**: archivo `/.well-known/assetlinks.json` publicado en el mismo origen web para verificar que el APK autorizado puede abrir el sitio sin barra del navegador.
5. **Keystore Android**: clave privada utilizada para firmar APK y AAB.

## Identidad de la aplicación
- Nombre visible: `PILAR`
- Application ID / package name: `com.pilar.relojes`
- Host principal: `pilar-relojes.pages.dev`
- Start URL: `https://pilar-relojes.pages.dev/`
- Orientación: portrait
- Display mode esperado: fullscreen/standalone mediante TWA
- Iconografía: reutilizar la identidad visual PILAR existente; generar recursos Android en densidades requeridas.
- Splash: simple, consistente con el logo y colores actuales de PILAR.

## Firma
Se creará un keystore exclusivo para PILAR.

Reglas:
- La clave privada no se subirá al repositorio.
- El repositorio podrá contener únicamente documentación sobre alias y procedimiento, nunca contraseña ni keystore.
- El SHA-256 del certificado será usado en `assetlinks.json`.
- El mismo keystore debe conservarse para futuras actualizaciones del APK/AAB.

## Digital Asset Links
Para que Android trate la TWA como aplicación verificada, Cloudflare publicará:

`/.well-known/assetlinks.json`

El contenido deberá declarar:
- namespace: `android_app`
- package_name: `com.pilar.relojes`
- sha256_cert_fingerprints: fingerprint real del certificado de firma.

La app no se considerará terminada hasta confirmar que el archivo responde con HTTP 200 y que Android verifica la relación app-dominio.

## APK
Se generará un APK firmado para distribución directa.

Uso:
- pruebas internas;
- instalación manual en Android;
- compartir por enlace con clientes, teniendo en cuenta que Android puede mostrar advertencias de instalación desde fuentes externas.

El APK deberá:
- instalarse sin reemplazar otra app ajena;
- aparecer en Ajustes > Aplicaciones;
- aparecer en launcher/cajón de aplicaciones;
- abrir PILAR;
- mostrar el icono correcto;
- poder desinstalarse normalmente.

## AAB
Se generará un Android App Bundle con la misma identidad y firma para futura publicación en Google Play.

El AAB no se instalará directamente en el teléfono. Su objetivo es dejar el proyecto listo para Play Console sin rehacer la arquitectura.

## Navegación
La app abrirá solo el origen autorizado de PILAR en TWA.

Enlaces externos:
- WhatsApp puede abrir la aplicación de WhatsApp o navegador correspondiente.
- URLs fuera del dominio PILAR se delegarán al sistema Android/navegador.
- Las rutas internas `/catalogo`, `/producto/*`, `/contacto` y demás deben permanecer dentro de la TWA.

## Actualizaciones
Los cambios web no requieren nueva versión Android cuando afecten:
- productos;
- precios;
- stock;
- imágenes;
- contenido visual o textos;
- lógica frontend servida desde Cloudflare.

Se requerirá nueva compilación Android cuando cambien:
- package name;
- icono nativo;
- splash nativo;
- permisos;
- orientación;
- firma;
- configuración TWA;
- versión de la app.

## Versionado
Versión inicial:
- versionName: `1.0.0`
- versionCode: `1`

Cada publicación Android posterior incrementará `versionCode`.

## Seguridad
- No incluir claves privadas dentro del APK.
- No incluir secretos de Supabase distintos de claves publishable públicas ya utilizadas por la web.
- No versionar keystore ni contraseñas.
- Mantener HTTPS obligatorio.
- Verificar Digital Asset Links antes de distribuir como versión final.

## Pruebas
La validación deberá incluir:

### Instalación
- APK se instala correctamente.
- PILAR aparece en launcher.
- PILAR aparece en Ajustes > Aplicaciones.
- Desinstalación funciona.

### Identidad
- Nombre PILAR correcto.
- Icono correcto.
- Splash correcto.

### Navegación
- Inicio carga.
- Catálogo carga.
- Producto individual carga.
- Contacto carga.
- WhatsApp abre correctamente.
- Navegación interna no muestra barra de Chrome si Digital Asset Links está validado.

### Backend
- Productos cargan desde Supabase.
- Imágenes cargan.
- Precios y stock cargan.
- Login/admin web sigue funcionando donde corresponda.

### Actualización web
- Modificar un producto en backend/web.
- Reabrir app.
- Confirmar que el cambio se refleja sin recompilar APK.

## Distribución
Fase 1:
- APK firmado para pruebas directas.

Fase 2:
- AAB firmado y validado localmente.

Fase 3 opcional:
- Google Play Console, ficha, política de privacidad, screenshots, clasificación de contenido y publicación.

## Rollback
La creación de la app Android no modifica ni elimina:
- Vercel;
- Cloudflare Pages;
- Supabase;
- la PWA web existente.

Si la TWA presenta problemas, la tienda web seguirá disponible normalmente.

## Criterio de éxito
El proyecto se considerará exitoso cuando:
1. el APK firmado se instale;
2. PILAR aparezca como app Android real;
3. abra la tienda desde Cloudflare;
4. Digital Asset Links esté validado;
5. la app funcione sin barra de navegador;
6. los datos sigan actualizándose desde la web;
7. exista también un AAB firmado listo para futura publicación.
