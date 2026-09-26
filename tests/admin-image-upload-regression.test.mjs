import fs from 'node:fs';
import assert from 'node:assert/strict';

const image=fs.readFileSync(new URL('../admin-image-pro.js',import.meta.url),'utf8');
const save=fs.readFileSync(new URL('../admin-product-save-v2.js',import.meta.url),'utf8');

assert.match(image,/heic|heif/i,'El panel debe contemplar HEIC/HEIF de teléfonos');
assert.match(image,/canvas\.toBlob/,'Debe normalizar imágenes antes de subirlas');
assert.match(save,/No se cerrará el producto hasta que todas las fotos se hayan subido/i,'Debe impedir cerrar el modal con cargas fallidas');
assert.match(save,/failedImages\s*>\s*0/,'Debe tratar una carga fallida como guardado incompleto');
console.log('PASS admin image upload regression');
