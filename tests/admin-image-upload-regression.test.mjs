import fs from 'node:fs';
import assert from 'node:assert/strict';

const image=fs.readFileSync(new URL('../admin-image-pro.js',import.meta.url),'utf8');
const save=fs.readFileSync(new URL('../admin-product-save-v2.js',import.meta.url),'utf8');

assert.match(image,/heic|heif/i,'El panel debe contemplar HEIC/HEIF de teléfonos');
assert.match(image,/canvas\.toBlob/,'Debe poder normalizar imágenes');
assert.match(save,/file\.arrayBuffer\(\)/,'Debe materializar los bytes del archivo móvil antes de subir');
assert.match(save,/new Uint8Array/,'Debe enviar bytes estables a Storage');
assert.match(save,/contentType:file\.type/,'Debe conservar el MIME de la foto original');
assert.match(save,/failedImages\s*>\s*0/,'Debe tratar una carga fallida como guardado incompleto');
console.log('PASS admin image upload regression');

assert.match(save,/base64/,'Mobile upload must use a text-safe payload to avoid intermittent binary body loss');
