import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

if (location.pathname.startsWith('/admin')) {
  const S = createClient(
    'https://lsuigiuthuycddlcvrds.supabase.co',
    'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu'
  );

  let editingProductId = null;
  let saving = false;

  const slugify = (value) => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const timeout = (promise, ms = 30000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('La operación tardó demasiado. Verifica tu conexión e intenta nuevamente.')), ms))
  ]);

  function field(id) {
    return document.getElementById(id);
  }

  function closeModal() {
    document.querySelector('.pa-modal')?.remove();
    document.body.classList.remove('pa-modal-open');
  }

  function friendlyError(error) {
    const msg = String(error?.message || error || 'No se pudo guardar el producto.');
    if (msg.includes('products_sku_key')) return 'El código del producto ya existe. Intenta nuevamente.';
    if (msg.includes('products_slug_key')) return 'El nombre genera un identificador ya existente. Intenta nuevamente.';
    if (msg.includes('Failed to fetch')) return 'No se pudo conectar con el servidor. Revisa tu conexión e intenta nuevamente.';
    return msg;
  }

  async function uploadImage(product, file, primary, sortOrder) {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const path = `${product.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;

    const up = await timeout(S.storage.from('product-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false
    }), 45000);
    if (up.error) throw up.error;

    const publicUrl = S.storage.from('product-images').getPublicUrl(path).data.publicUrl;
    const ins = await timeout(S.from('product_images').insert({
      product_id: product.id,
      storage_path: path,
      public_url: publicUrl,
      alt_text: product.name,
      is_primary: primary,
      sort_order: sortOrder
    }), 30000);
    if (ins.error) throw ins.error;
  }

  async function saveProduct(button) {
    if (saving) return;

    const name = field('pn')?.value.trim();
    const sku = field('psku')?.value.trim();
    if (!name || !sku) {
      alert('Nombre y Código del producto son obligatorios');
      return;
    }

    saving = true;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = 'Guardando...';

    try {
      const obj = {
        name,
        brand: field('pb')?.value.trim() || 'Otra',
        sku,
        category_id: field('pcat')?.value || null,
        price: Number(field('pprice')?.value || 0),
        stock: Number(field('pstock')?.value || 0),
        material: field('pmat')?.value.trim() || null,
        description: field('pdesc')?.value.trim() || null,
        is_new: !!field('pnew')?.checked,
        on_sale: !!field('psale')?.checked,
        featured: !!field('pfeat')?.checked,
        visible: field('pvis') ? !!field('pvis').checked : true
      };

      let result;
      if (editingProductId) {
        result = await timeout(
          S.from('products').update(obj).eq('id', editingProductId).select().single(),
          30000
        );
      } else {
        obj.slug = slugify(name);
        result = await timeout(
          S.from('products').insert(obj).select().single(),
          30000
        );
      }

      if (result.error) throw result.error;
      const product = result.data;

      const files = [...(field('pfiles')?.files || [])];
      if (files.length) {
        const existing = await timeout(
          S.from('product_images').select('id,is_primary,sort_order').eq('product_id', product.id),
          30000
        );
        if (existing.error) throw existing.error;

        const images = existing.data || [];
        const hasPrimary = images.some(img => img.is_primary);
        const startOrder = images.length;

        for (let i = 0; i < files.length; i++) {
          button.innerHTML = `Subiendo foto ${i + 1} de ${files.length}...`;
          await uploadImage(product, files[i], !hasPrimary && i === 0, startOrder + i);
        }
      }

      button.innerHTML = 'Guardado ✓';
      closeModal();
      setTimeout(() => {
        location.href = `${location.origin}/admin?tab=products&saved=${Date.now()}`;
      }, 250);
    } catch (error) {
      console.error('PILAR save product:', error);
      alert(friendlyError(error));
      button.disabled = false;
      button.innerHTML = originalText;
      saving = false;
    }
  }

  document.addEventListener('click', (event) => {
    const edit = event.target.closest?.('.editp');
    if (edit?.dataset?.id) {
      editingProductId = edit.dataset.id;
      return;
    }

    if (event.target.closest?.('#addp')) {
      editingProductId = null;
      return;
    }

    const save = event.target.closest?.('.savep');
    if (!save) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    saveProduct(save);
  }, true);
}
