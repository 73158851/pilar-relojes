import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

if (location.pathname.startsWith('/admin')) {
  const S = createClient(
    'https://lsuigiuthuycddlcvrds.supabase.co',
    'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu'
  );

  let currentProductId = null;
  let busy = false;

  const slugify = (value) => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const withTimeout = (promise, ms = 30000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('La operación tardó demasiado. Intenta nuevamente.')), ms))
  ]);

  const $ = (id) => document.getElementById(id);

  function toast(msg) {
    let el = document.querySelector('.pa-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'pa-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function friendlyError(error) {
    const msg = String(error?.message || error || 'No se pudo guardar el producto.');
    if (msg.includes('products_sku_key')) return 'El código del producto ya existe.';
    if (msg.includes('products_slug_key')) return 'El identificador del producto ya existe.';
    if (msg.includes('Failed to fetch')) return 'La foto no pudo subirse por un problema de conexión.';
    return msg;
  }

  async function uploadOnce(product, file, primary, sortOrder) {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const path = `${product.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;

    const upload = await withTimeout(
      S.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false }),
      45000
    );
    if (upload.error) throw upload.error;

    const publicUrl = S.storage.from('product-images').getPublicUrl(path).data.publicUrl;
    const insertImage = await withTimeout(
      S.from('product_images').insert({
        product_id: product.id,
        storage_path: path,
        public_url: publicUrl,
        alt_text: product.name,
        is_primary: primary,
        sort_order: sortOrder
      }),
      30000
    );
    if (insertImage.error) throw insertImage.error;
  }

  async function uploadImage(product, file, primary, sortOrder) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await uploadOnce(product, file, primary, sortOrder);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < 3) await wait(attempt * 1200);
      }
    }
    throw lastError;
  }

  async function save(button) {
    if (busy) return;

    const name = $('pn')?.value.trim();
    const sku = $('psku')?.value.trim();
    if (!name || !sku) {
      alert('Nombre y Código del producto son obligatorios');
      return;
    }

    busy = true;
    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = 'Guardando datos...';

    try {
      const payload = {
        name,
        brand: $('pb')?.value.trim() || 'Otra',
        sku,
        category_id: $('pcat')?.value || null,
        price: Number($('pprice')?.value || 0),
        stock: Number($('pstock')?.value || 0),
        material: $('pmat')?.value.trim() || null,
        description: $('pdesc')?.value.trim() || null,
        is_new: !!$('pnew')?.checked,
        on_sale: !!$('psale')?.checked,
        featured: !!$('pfeat')?.checked,
        visible: $('pvis') ? !!$('pvis').checked : true
      };

      let result;
      if (currentProductId) {
        result = await withTimeout(
          S.from('products').update(payload).eq('id', currentProductId).select().single(),
          30000
        );
      } else {
        payload.slug = slugify(name);
        result = await withTimeout(
          S.from('products').insert(payload).select().single(),
          30000
        );
      }

      if (result.error) throw result.error;
      const product = result.data;
      const files = [...($('pfiles')?.files || [])];
      let failedImages = 0;

      if (files.length) {
        const existing = await withTimeout(
          S.from('product_images').select('id,is_primary,sort_order').eq('product_id', product.id),
          30000
        );
        if (existing.error) throw existing.error;

        const images = existing.data || [];
        const hasPrimary = images.some((x) => x.is_primary);
        const startOrder = images.length;

        for (let i = 0; i < files.length; i++) {
          button.innerHTML = `Subiendo foto ${i + 1} de ${files.length}...`;
          try {
            await uploadImage(product, files[i], !hasPrimary && i === 0, startOrder + i);
          } catch (error) {
            console.error('PILAR image upload error:', error);
            failedImages++;
          }
        }
      }

      button.innerHTML = 'Guardado ✓';
      if (failedImages) {
        toast(`Producto actualizado. ${failedImages} foto${failedImages === 1 ? '' : 's'} no pudo${failedImages === 1 ? '' : 'ieron'} subirse.`);
      } else {
        toast(currentProductId ? 'Producto actualizado correctamente' : 'Producto guardado correctamente');
      }

      document.querySelector('.pa-modal')?.remove();
      document.body.classList.remove('pa-modal-open');
      busy = false;

      setTimeout(() => {
        location.href = `${location.origin}/admin?tab=products&t=${Date.now()}`;
      }, 500);
    } catch (error) {
      console.error('PILAR product save error:', error);
      alert(friendlyError(error));
      button.disabled = false;
      button.innerHTML = original;
      busy = false;
    }
  }

  function replaceSaveButton(modal) {
    const oldButton = modal.querySelector('.savep');
    if (!oldButton || oldButton.dataset.saveV2 === '1') return;

    const button = oldButton.cloneNode(true);
    button.dataset.saveV2 = '1';
    oldButton.replaceWith(button);
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      save(button);
    };
  }

  document.addEventListener('click', (event) => {
    const edit = event.target.closest?.('.editp');
    if (edit?.dataset?.id) currentProductId = edit.dataset.id;
    if (event.target.closest?.('#addp')) currentProductId = null;
  }, true);

  const observer = new MutationObserver(() => {
    const modal = document.querySelector('.pa-modal');
    if (modal) replaceSaveButton(modal);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
