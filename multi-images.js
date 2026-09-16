import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const S = createClient(
  'https://lsuigiuthuycddlcvrds.supabase.co',
  'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu'
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

function sortedImages(images = []) {
  return [...images].sort((a, b) => {
    if (Boolean(a.is_primary) !== Boolean(b.is_primary)) return a.is_primary ? -1 : 1;
    return Number(a.sort_order || 0) - Number(b.sort_order || 0);
  });
}

async function enhancePublicGallery() {
  if (!location.pathname.startsWith('/producto/')) return;
  const slug = decodeURIComponent(location.pathname.split('/').pop());
  const { data: product } = await S.from('products')
    .select('id,name,sku,product_images(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (!product) return;

  const detail = document.querySelector('.detail');
  const imageWrap = detail?.firstElementChild;
  const mainImage = imageWrap?.querySelector('img');
  if (!imageWrap || !mainImage) return;

  const rows = sortedImages(product.product_images || []);
  const images = rows
    .filter((row) => row.public_url)
    .map((row) => ({ src: row.public_url, alt: row.alt_text || product.name }));

  if (!images.some((image) => new URL(image.src, location.origin).href === new URL(mainImage.src, location.origin).href)) {
    images.unshift({ src: mainImage.src, alt: mainImage.alt || product.name });
  }

  const unique = [];
  const seen = new Set();
  for (const image of images) {
    const absolute = new URL(image.src, location.origin).href;
    if (seen.has(absolute)) continue;
    seen.add(absolute);
    unique.push(image);
  }

  if (unique.length <= 1) return;

  imageWrap.classList.add('product-gallery');
  mainImage.id = 'gallery-main-image';
  mainImage.src = unique[0].src;
  mainImage.alt = unique[0].alt;

  const oldThumbs = imageWrap.querySelector('.gallery-thumbs');
  if (oldThumbs) oldThumbs.remove();

  const thumbs = document.createElement('div');
  thumbs.className = 'gallery-thumbs';
  thumbs.innerHTML = unique.map((image, index) => `
    <button class="gallery-thumb ${index === 0 ? 'active' : ''}" type="button" data-src="${esc(image.src)}" data-alt="${esc(image.alt)}" aria-label="Ver imagen ${index + 1}">
      <img src="${esc(image.src)}" alt="">
    </button>`).join('');
  imageWrap.appendChild(thumbs);

  thumbs.querySelectorAll('.gallery-thumb').forEach((button) => {
    button.addEventListener('click', () => {
      mainImage.src = button.dataset.src;
      mainImage.alt = button.dataset.alt || product.name;
      thumbs.querySelectorAll('.gallery-thumb').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

async function waitUntilModalCloses(modal) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (!document.body.contains(modal)) return true;
    await sleep(400);
  }
  return false;
}

async function findProductBySku(sku) {
  if (!sku) return null;
  const { data } = await S.from('products')
    .select('id,name,sku,product_images(*)')
    .eq('sku', sku)
    .is('deleted_at', null)
    .maybeSingle();
  return data || null;
}

async function uploadExtraImages(product, files) {
  if (!product || !files.length) return;
  const current = sortedImages(product.product_images || []);
  let nextSort = current.reduce((max, row) => Math.max(max, Number(row.sort_order || 0)), -1) + 1;

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const storagePath = `${product.id}/${Date.now()}-${index}-${safeName}`;
    const upload = await S.storage.from('product-images').upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (upload.error) throw upload.error;

    const publicUrl = S.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl;
    const insert = await S.from('product_images').insert({
      product_id: product.id,
      storage_path: storagePath,
      public_url: publicUrl,
      alt_text: product.name,
      is_primary: false,
      sort_order: nextSort,
    });
    if (insert.error) throw insert.error;
    nextSort += 1;
  }
}

async function makePrimary(productId, imageId) {
  const clear = await S.from('product_images').update({ is_primary: false }).eq('product_id', productId);
  if (clear.error) throw clear.error;
  const set = await S.from('product_images').update({ is_primary: true }).eq('id', imageId);
  if (set.error) throw set.error;
}

async function deleteImage(productId, image) {
  if (image.storage_path) {
    const remove = await S.storage.from('product-images').remove([image.storage_path]);
    if (remove.error) throw remove.error;
  }
  const del = await S.from('product_images').delete().eq('id', image.id);
  if (del.error) throw del.error;

  if (image.is_primary) {
    const { data: remaining } = await S.from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });
    if (remaining?.length) await makePrimary(productId, remaining[0].id);
  }
}

async function renderImageManager(modal) {
  const skuInput = modal.querySelector('#psku');
  const fileInput = modal.querySelector('#pimg');
  if (!skuInput || !fileInput) return;

  fileInput.multiple = true;
  fileInput.accept = 'image/jpeg,image/png,image/webp';
  const label = fileInput.parentElement?.querySelector('label');
  if (label) label.textContent = 'Fotos del producto';

  if (!fileInput.parentElement.querySelector('.multi-hint')) {
    const hint = document.createElement('p');
    hint.className = 'muted small multi-hint';
    hint.textContent = 'Puedes elegir varias fotos a la vez. La primera será la principal y las demás aparecerán en la galería.';
    fileInput.insertAdjacentElement('beforebegin', hint);
  }

  const previous = modal.querySelector('.multi-image-manager');
  if (previous) previous.remove();

  const product = await findProductBySku(skuInput.value.trim());
  if (!product) return;

  const rows = sortedImages(product.product_images || []);
  const manager = document.createElement('div');
  manager.className = 'multi-image-manager';
  manager.innerHTML = `
    <div class="multi-manager-head">
      <strong>Fotos guardadas (${rows.length})</strong>
      <span class="muted small">Puedes cambiar la principal o eliminar una foto.</span>
    </div>
    <div class="admin-image-grid">
      ${rows.length ? rows.map((image) => `
        <div class="admin-image-item" data-id="${image.id}">
          <img src="${esc(image.public_url)}" alt="${esc(image.alt_text || product.name)}">
          <div class="admin-image-meta">
            <span class="${image.is_primary ? 'primary-label' : 'muted small'}">${image.is_primary ? 'Principal' : 'Secundaria'}</span>
            <div class="row">
              ${image.is_primary ? '' : `<button type="button" class="btn light multi-primary" data-id="${image.id}">Hacer principal</button>`}
              <button type="button" class="btn danger multi-delete" data-id="${image.id}">Eliminar</button>
            </div>
          </div>
        </div>`).join('') : '<div class="notice">Todavía no hay fotos cargadas en el almacenamiento. Puedes seleccionar varias arriba.</div>'}
    </div>`;

  fileInput.parentElement.appendChild(manager);

  manager.querySelectorAll('.multi-primary').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await makePrimary(product.id, button.dataset.id);
        await renderImageManager(modal);
      } catch (error) {
        alert(error.message || 'No se pudo cambiar la foto principal.');
      }
    });
  });

  manager.querySelectorAll('.multi-delete').forEach((button) => {
    button.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta foto?')) return;
      const image = rows.find((row) => row.id === button.dataset.id);
      if (!image) return;
      try {
        await deleteImage(product.id, image);
        await renderImageManager(modal);
      } catch (error) {
        alert(error.message || 'No se pudo eliminar la foto.');
      }
    });
  });
}

function enhanceAdminModal(modal) {
  if (!modal || modal.dataset.multiImageEnhanced === '1') return;
  const fileInput = modal.querySelector('#pimg');
  const saveButton = modal.querySelector('#savep');
  const skuInput = modal.querySelector('#psku');
  if (!fileInput || !saveButton || !skuInput) return;

  modal.dataset.multiImageEnhanced = '1';
  modal.querySelector('.modalbox')?.classList.add('modalbox-wide');
  modal.querySelector('.form')?.classList.add('product-form');
  renderImageManager(modal);

  saveButton.addEventListener('click', () => {
    const files = [...fileInput.files];
    if (files.length <= 1) return;

    const extraFiles = files.slice(1);
    const sku = skuInput.value.trim();
    (async () => {
      const closed = await waitUntilModalCloses(modal);
      if (!closed) return;
      await sleep(500);
      const product = await findProductBySku(sku);
      if (!product) return;
      try {
        await uploadExtraImages(product, extraFiles);
        alert(`${extraFiles.length} foto${extraFiles.length === 1 ? '' : 's'} adicional${extraFiles.length === 1 ? '' : 'es'} guardada${extraFiles.length === 1 ? '' : 's'} correctamente.`);
      } catch (error) {
        alert(error.message || 'El producto se guardó, pero algunas fotos adicionales no pudieron subirse.');
      }
    })();
  }, true);
}

function watchAdminModals() {
  if (!location.pathname.startsWith('/admin')) return;
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.modal').forEach(enhanceAdminModal);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.modal').forEach(enhanceAdminModal);
}

enhancePublicGallery();
watchAdminModals();
