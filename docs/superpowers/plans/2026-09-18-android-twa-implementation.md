# PILAR Android TWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear una aplicación Android real de PILAR mediante Trusted Web Activity, generar APK y AAB firmados, verificar Digital Asset Links y confirmar que la app aparece e inicia correctamente en Android.

**Architecture:** Se creará un proyecto Android TWA separado dentro del repositorio, apuntando a `https://pilar-relojes.pages.dev`. La web seguirá siendo la fuente viva de contenido y Supabase seguirá como backend. La relación app-dominio se verificará con `/.well-known/assetlinks.json` usando el SHA-256 real del certificado de firma.

**Tech Stack:** Android, Bubblewrap/TWA, Gradle, Java/Kotlin-generated project, Cloudflare Pages, Digital Asset Links, GitHub.

**Spec:** `docs/superpowers/specs/2026-09-18-android-twa-design.md`

## Global Constraints

- Nombre visible: `PILAR`.
- Package name: `com.pilar.relojes`.
- Host: `pilar-relojes.pages.dev`.
- Start URL: `https://pilar-relojes.pages.dev/`.
- Orientación: portrait.
- versionName inicial: `1.0.0`.
- versionCode inicial: `1`.
- No versionar keystore, contraseñas ni secretos.
- Mantener Vercel, Cloudflare Pages, Supabase y la PWA web sin eliminarlos.
- El mismo keystore debe conservarse para futuras actualizaciones.
- La app no se considera final hasta validar Digital Asset Links y apertura sin barra del navegador.

## Review Focus

- Dominio no verificable: la app debe seguir abriendo de forma segura aunque la TWA caiga a Custom Tab.
- Fingerprint incorrecto: assetlinks debe fallar la verificación de forma detectable y no ocultar el error.
- APK firmado con clave distinta: debe detectarse antes de distribuir.
- App sin conectividad: debe mostrar el comportamiento offline/web existente, no pantalla en blanco.
- Enlaces externos como WhatsApp: deben delegarse correctamente al sistema Android.

---

### Task 1: Crear estructura Android aislada

**Files:**
- Create: `android-twa/`
- Create: `tests/android-twa-structure.mjs`

**Interfaces:**
- Produces: proyecto Android TWA autocontenido bajo `android-twa/`.
- Consumes: host `pilar-relojes.pages.dev` y package `com.pilar.relojes`.

- [ ] **Step 1: Escribir la prueba fallida**

Crear `tests/android-twa-structure.mjs`:

```js
import fs from 'node:fs';

const checks = [
  ['android project exists', fs.existsSync('android-twa')],
  ['gradle wrapper exists', fs.existsSync('android-twa/gradlew') || fs.existsSync('android-twa/gradlew.bat')],
  ['manifest exists', fs.existsSync('android-twa/app/src/main/AndroidManifest.xml')],
  ['package configured', fs.existsSync('android-twa/app/build.gradle') || fs.existsSync('android-twa/app/build.gradle.kts')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
```

- [ ] **Step 2: Ejecutar la prueba**

Run:
```bash
node tests/android-twa-structure.mjs
```

Expected: FAIL porque `android-twa/` aún no existe.

- [ ] **Step 3: Inicializar el proyecto TWA**

Usar Bubblewrap con:

```text
Package ID: com.pilar.relojes
App name: PILAR
Launcher name: PILAR
Host: pilar-relojes.pages.dev
Start URL: /
Display: standalone
Orientation: portrait
Version name: 1.0.0
Version code: 1
```

Generar el proyecto dentro de:

```text
android-twa/
```

- [ ] **Step 4: Ejecutar la prueba**

Run:
```bash
node tests/android-twa-structure.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add android-twa tests/android-twa-structure.mjs
git commit -m "feat: scaffold PILAR Android TWA"
```

---

### Task 2: Configurar identidad, orientación e iconos Android

**Files:**
- Modify: `android-twa/app/src/main/AndroidManifest.xml`
- Modify: `android-twa/app/src/main/res/**`
- Test: `tests/android-twa-identity.mjs`

**Interfaces:**
- Consumes: iconos PILAR existentes `pilar-icon-192.png`, `pilar-icon-512.png`.
- Produces: identidad Android consistente con PILAR.

- [ ] **Step 1: Crear prueba**

```js
import fs from 'node:fs';

const manifest = fs.readFileSync('android-twa/app/src/main/AndroidManifest.xml', 'utf8');
const checks = [
  ['portrait orientation', manifest.includes('screenOrientation="portrait"')],
  ['PILAR launcher label present', manifest.includes('PILAR')],
  ['package id present in project', JSON.stringify(fs.readdirSync('android-twa')).length > 0],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
```

- [ ] **Step 2: Ejecutar la prueba**

Run:
```bash
node tests/android-twa-identity.mjs
```

Expected: FAIL hasta completar identidad.

- [ ] **Step 3: Configurar identidad**

Configurar:
```text
App label: PILAR
Orientation: portrait
Theme/splash: colores actuales PILAR
Launcher icons: derivados del icono PILAR local
```

- [ ] **Step 4: Ejecutar prueba**

Run:
```bash
node tests/android-twa-identity.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add android-twa tests/android-twa-identity.mjs
git commit -m "feat: configure PILAR Android identity"
```

---

### Task 3: Crear y proteger el keystore de PILAR

**Files:**
- Create: `android-twa/keystore/README.md`
- Modify: `.gitignore`
- Test: `tests/android-keystore-safety.mjs`

**Interfaces:**
- Produces: procedimiento de firma y exclusión de secretos.
- Consumes later: SHA-256 del certificado.

- [ ] **Step 1: Escribir prueba de seguridad**

```js
import fs from 'node:fs';

const ignore = fs.readFileSync('.gitignore', 'utf8');
const checks = [
  ['keystore ignored', ignore.includes('*.jks') || ignore.includes('*.keystore')],
  ['properties secrets ignored', ignore.includes('keystore.properties')],
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
node tests/android-keystore-safety.mjs
```

Expected: FAIL si no están las exclusiones.

- [ ] **Step 3: Añadir reglas de gitignore**

Agregar:

```gitignore
android-twa/**/*.jks
android-twa/**/*.keystore
android-twa/keystore.properties
```

- [ ] **Step 4: Crear keystore local**

Run:
```bash
keytool -genkeypair -v -keystore android-twa/pilar-release.jks -alias pilar -keyalg RSA -keysize 2048 -validity 10000
```

No versionar el archivo generado.

- [ ] **Step 5: Documentar recuperación y alias**

Crear `android-twa/keystore/README.md` indicando:
```text
Alias: pilar
Keystore local: android-twa/pilar-release.jks
No subir el archivo ni contraseñas al repositorio.
Conservar una copia segura para futuras actualizaciones.
```

- [ ] **Step 6: Ejecutar prueba**

Run:
```bash
node tests/android-keystore-safety.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add .gitignore android-twa/keystore/README.md tests/android-keystore-safety.mjs
git commit -m "chore: secure PILAR Android signing setup"
```

---

### Task 4: Obtener fingerprint SHA-256 y publicar Digital Asset Links

**Files:**
- Create: `.well-known/assetlinks.json`
- Create: `tests/android-assetlinks.mjs`
- Update: `_headers`

**Interfaces:**
- Consumes: certificado del keystore.
- Produces: verificación app-dominio para `com.pilar.relojes`.

- [ ] **Step 1: Obtener SHA-256**

Run:
```bash
keytool -list -v -keystore android-twa/pilar-release.jks -alias pilar
```

Registrar el valor exacto de:
```text
SHA256:
```

- [ ] **Step 2: Escribir prueba fallida**

```js
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('.well-known/assetlinks.json', 'utf8'));
const target = data[0]?.target;
const checks = [
  ['android namespace', target?.namespace === 'android_app'],
  ['package name', target?.package_name === 'com.pilar.relojes'],
  ['fingerprint exists', Array.isArray(target?.sha256_cert_fingerprints) && target.sha256_cert_fingerprints.length === 1],
  ['relation correct', data[0]?.relation?.includes('delegate_permission/common.handle_all_urls')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
```

- [ ] **Step 3: Crear assetlinks.json con fingerprint real**

Formato:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.pilar.relojes",
      "sha256_cert_fingerprints": [
        "FINGERPRINT_SHA256_REAL"
      ]
    }
  }
]
```

Sustituir `FINGERPRINT_SHA256_REAL` por el valor real obtenido en Step 1.

- [ ] **Step 4: Añadir headers**

Agregar a `_headers`:

```text
/.well-known/assetlinks.json
  Content-Type: application/json
  Cache-Control: no-cache
```

- [ ] **Step 5: Ejecutar prueba**

Run:
```bash
node tests/android-assetlinks.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .well-known/assetlinks.json _headers tests/android-assetlinks.mjs
git commit -m "feat: publish PILAR Digital Asset Links"
```

---

### Task 5: Configurar firma release

**Files:**
- Modify: `android-twa/app/build.gradle` or `android-twa/app/build.gradle.kts`
- Create locally only: `android-twa/keystore.properties`
- Test: `tests/android-release-config.mjs`

**Interfaces:**
- Consumes: local keystore and passwords.
- Produces: release APK/AAB signed with PILAR key.

- [ ] **Step 1: Crear prueba de configuración**

```js
import fs from 'node:fs';
const candidates = ['android-twa/app/build.gradle','android-twa/app/build.gradle.kts'];
const file = candidates.find(fs.existsSync);
if (!file) process.exit(1);
const src = fs.readFileSync(file, 'utf8');
const checks = [
  ['release build exists', src.includes('release')],
  ['signing config exists', src.includes('signingConfig') || src.includes('signingConfigs')],
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
node tests/android-release-config.mjs
```

Expected: FAIL si release no está configurado.

- [ ] **Step 3: Crear keystore.properties local**

Contenido local:

```properties
storeFile=../pilar-release.jks
storePassword=<password-local>
keyAlias=pilar
keyPassword=<password-local>
```

No versionar.

- [ ] **Step 4: Configurar signingConfigs release**

Leer `keystore.properties` desde Gradle y asignarlo a `buildTypes.release`.

- [ ] **Step 5: Ejecutar prueba**

Run:
```bash
node tests/android-release-config.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add android-twa/app tests/android-release-config.mjs
git commit -m "feat: configure PILAR Android release signing"
```

---

### Task 6: Generar APK y AAB release

**Files:**
- Build outputs only under `android-twa/app/build/outputs/`
- No generated binaries committed unless explicitly desired later.

**Interfaces:**
- Produces:
  - APK release firmado.
  - AAB release firmado.

- [ ] **Step 1: Limpiar build**

Run:
```bash
cd android-twa
./gradlew clean
```

Expected: BUILD SUCCESSFUL.

- [ ] **Step 2: Generar APK**

Run:
```bash
./gradlew assembleRelease
```

Expected:
```text
BUILD SUCCESSFUL
```

Archivo esperado:
```text
android-twa/app/build/outputs/apk/release/app-release.apk
```

- [ ] **Step 3: Generar AAB**

Run:
```bash
./gradlew bundleRelease
```

Expected:
```text
BUILD SUCCESSFUL
```

Archivo esperado:
```text
android-twa/app/build/outputs/bundle/release/app-release.aab
```

- [ ] **Step 4: Verificar firma APK**

Run:
```bash
apksigner verify --verbose android-twa/app/build/outputs/apk/release/app-release.apk
```

Expected: verificación exitosa.

- [ ] **Step 5: Verificar certificado**

Run:
```bash
apksigner verify --print-certs android-twa/app/build/outputs/apk/release/app-release.apk
```

Expected: SHA-256 coincide con `.well-known/assetlinks.json`.

---

### Task 7: Verificar Digital Asset Links en producción Cloudflare

**Files:**
- No code changes unless verification fails.

**Interfaces:**
- Consumes: deployment Cloudflare de `.well-known/assetlinks.json`.
- Produces: evidencia de relación válida app-dominio.

- [ ] **Step 1: Confirmar HTTP 200**

Abrir:
```text
https://pilar-relojes.pages.dev/.well-known/assetlinks.json
```

Expected: HTTP 200 y JSON válido.

- [ ] **Step 2: Confirmar package y fingerprint**

Expected:
```text
package_name = com.pilar.relojes
fingerprint = certificado del APK release
```

- [ ] **Step 3: Verificar ausencia de redirección**

Expected: el archivo se entrega directamente desde el mismo origen.

- [ ] **Step 4: Si falla, detener distribución**

No distribuir APK final mientras assetlinks no sea válido.

---

### Task 8: Prueba real en Android

**Files:**
- Update: `docs/android/validation.md`

**Interfaces:**
- Consumes: APK release firmado.
- Produces: checklist real de instalación.

- [ ] **Step 1: Instalar APK**

Transferir `app-release.apk` al dispositivo e instalarlo.

Expected: Android permite instalación después de autorizar la fuente correspondiente.

- [ ] **Step 2: Verificar presencia del sistema**

Comprobar:
```text
- launcher/cajón de aplicaciones
- Ajustes > Aplicaciones
```

Expected: PILAR aparece en ambos.

- [ ] **Step 3: Abrir PILAR**

Expected:
- abre `https://pilar-relojes.pages.dev/`;
- no muestra barra de Chrome si DAL está validado;
- icono y nombre correctos.

- [ ] **Step 4: Verificar navegación**

Comprobar:
```text
/
/catalogo
/producto/<slug-real>
/contacto
```

Expected: navegación interna permanece dentro de la app.

- [ ] **Step 5: Verificar enlace externo**

Tocar WhatsApp.

Expected: Android abre WhatsApp o selector correspondiente fuera de la TWA.

- [ ] **Step 6: Verificar actualización web sin recompilar**

Modificar un dato visible en la tienda web, volver a abrir PILAR y confirmar que el cambio se refleja.

- [ ] **Step 7: Registrar resultados**

Crear `docs/android/validation.md`:

```md
# Validación Android PILAR

- APK instala: PASS/FAIL
- Aparece en launcher: PASS/FAIL
- Aparece en Ajustes > Aplicaciones: PASS/FAIL
- Icono correcto: PASS/FAIL
- Nombre PILAR: PASS/FAIL
- TWA sin barra: PASS/FAIL
- Catálogo: PASS/FAIL
- Producto: PASS/FAIL
- WhatsApp externo: PASS/FAIL
- Actualización web sin recompilar: PASS/FAIL
- AAB generado: PASS/FAIL
```

- [ ] **Step 8: Commit**

```bash
git add docs/android/validation.md
git commit -m "docs: record PILAR Android validation"
```

---

### Task 9: Preparar distribución segura del APK

**Files:**
- Create: `docs/android/distribution.md`

**Interfaces:**
- Produces: instrucciones de distribución directa y conservación de firma.

- [ ] **Step 1: Documentar instalación directa**

Incluir:
```md
# Distribución PILAR Android

El APK firmado puede compartirse por enlace privado o descarga directa.
Android puede solicitar autorización para instalar aplicaciones desde esa fuente.
No compartir el keystore ni sus contraseñas.
Conservar el mismo keystore para todas las actualizaciones futuras.
```

- [ ] **Step 2: Documentar AAB**

Indicar:
```text
El AAB está destinado a Google Play Console y no se instala directamente en Android.
```

- [ ] **Step 3: Commit**

```bash
git add docs/android/distribution.md
git commit -m "docs: add PILAR Android distribution guide"
```

## Self-Review

- APK y AAB están cubiertos.
- Firma, keystore y fingerprint están cubiertos.
- Digital Asset Links está cubierto y bloquea distribución si falla.
- La instalación real en Android está cubierta.
- La actualización web sin recompilación está cubierta.
- Enlaces externos y offline están incluidos en Review Focus.
- No se requiere modificar Supabase ni rehacer la tienda.
