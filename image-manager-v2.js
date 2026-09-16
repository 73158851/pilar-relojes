import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const S = createClient(
  'https://lsuigiuthuycddlcvrds.supabase.co',
  'sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu'
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function getProductBySku(sku) {
  if (!sku) return null;
  const { data } = await S.from('products')
    .select('id,name,sku,product_images(*)')
    .eq('sku', sku)
    .is('deleted_at', null)
    .maybeSingle();
  return data || null;
}

async function uploadFiles(product, files) {
  const rows = product.product_images || [];
  let order = rows.reduce((m, x) => Math.max(m, Number(x.sort_order || 0)), -1) + 1;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const path = `${product.id}/${Date.now()}-${i}-${safe}`;
    const up = await S.storage.from('product-images').upload(path, file, { cacheControl:'3600', upsert:false });
    if (up.error) throw up.error;
    const public_url = S.storage.from('product-images').getPublicUrl(path).data.publicUrl;
    const ins = await S.from('product_images').insert({
      product_id: product.id,
      storage_path: path,
      public_url,
      alt_text: product.name,
      is_primary: rows.length === 0 && i === 0,
      sort_order: order++
    });
    if (ins.error) throw ins.error;
  }
}

async function renderExtraManager(modal) {
  const skuInput = modal.querySelector('#psku');
  if (!skuInput) return;
  const sku = skuInput.value.trim();
  const product = await getProductBySku(sku);
  if (!product) return;

  modal.querySelector('.extra-image-manager-v2')?.remove();

  const wrap = document.createElement('div');
  wrap.className = 'extra-image-manager-v2 full';
  wrap.innerHTML = `
    <div class="panel extra-photo-panel">
      <div class="ahead">
        <div>
          <h3 style="margin:0 0 4px">Galería del producto</h3>
          <div class="muted">${product.product_images?.length || 0} foto${(product.product_images?.length || 0) === 1 ? '' : 's'} guardada${(product.product_images?.length || 0) === 1 ? '' : 's'}</div>
        </div>
        <button type="button" class="btn primary add-more-photos">+ Agregar más fotos</button>
      </div>
      <input class="extra-photo-input" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden>
      <div class="extra-photo-list">
        ${(product.product_images || []).map(img => `
          <div class="extra-photo-thumb">
            <img src="${esc(img.public_url)}" alt="${esc(img.alt_text || product.name)}">
            ${img.is_primary ? '<span>Principal</span>' : ''}
          </div>`).join('') || '<p class="muted">Todavía no hay imágenes guardadas.</p>'}
      </div>
    </div>`;

  const form = modal.querySelector('.form');
  (form || modal.querySelector('.modalbox'))?.appendChild(wrap);

  const button = wrap.querySelector('.add-more-photos');
  const input = wrap.querySelector('.extra-photo-input');
  button.onclick = () => input.click();
  input.onchange = async () => {
    const files = [...input.files];
    if (!files.length) return;
    button.disabled = true;
    const oldText = button.textContent;
    button.textContent = 'Subiendo...';
    try {
      await uploadFiles(product, files);
      alert(`${files.length} foto${files.length === 1 ? '' : 's'} agregada${files.length === 1 ? '' : 's'} correctamente.`);
      await renderExtraManager(modal);
    } catch (err) {
      alert(err.message || 'No se pudieron subir las fotos.');
      button.disabled = false;
      button.textContent = oldText;
    }
  };
}

function enhanceModal(modal) {
  if (!modal || modal.dataset.imageManagerV2 === '1') return;
  if (!modal.querySelector('#psku')) return;
  modal.dataset.imageManagerV2 = '1';

  const original = modal.querySelector('#pimg');
  if (original) {
    original.multiple = true;
    const label = original.parentElement?.querySelector('label');
    if (label) label.textContent = 'Fotos iniciales';
  }

  renderExtraManager(modal);

  const sku = modal.querySelector('#psku');
  let timer;
  sku?.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => renderExtraManager(modal), 350);
  });

  const save = modal.querySelector('#savep');
  save?.addEventListener('click', async () => {
    await sleep(1000);
  });
}

if (location.pathname.startsWith('/admin')) {
  const obs = new MutationObserver(() => {
    document.querySelectorAll('.modal').forEach(enhanceModal);
  });
  obs.observe(document.body, { childList:true, subtree:true });
  document.querySelectorAll('.modal').forEach(enhanceModal);
}
