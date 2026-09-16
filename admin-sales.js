import{createClient}from'https://esm.sh/@supabase/supabase-js@2';
const S=createClient('https://lsuigiuthuycddlcvrds.supabase.co','sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu');
const A=document.getElementById('app');

function notify(msg,type='ok'){
  let n=document.querySelector('.pax-notice');
  if(!n){n=document.createElement('div');n.className='pax-notice';document.body.appendChild(n)}
  n.className=`pax-notice ${type} show`;n.textContent=msg;clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),2400);
}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renameInventoryTab(){
  document.querySelectorAll('.pa-tab').forEach(b=>{if((b.textContent||'').trim()==='Inventario')b.textContent='Ventas'})
}
async function salesPage(){
  const title=[...document.querySelectorAll('.pa-title')].find(x=>(x.textContent||'').trim()==='Inventario');
  if(!title)return;
  title.textContent='Ventas';
  const main=title.closest('.pa-main'); if(!main||main.dataset.salesReady)return;
  main.dataset.salesReady='1';
  const sub=title.nextElementSibling;if(sub?.classList.contains('pa-sub'))sub.textContent='Registra las ventas realizadas y revisa el historial de movimientos.';
  const cards=[...main.querySelectorAll('.pa-card')];
  const inventoryCard=cards[0];
  const help=main.querySelector('.pa-code-help');
  const movements=cards.find(c=>c.querySelector('h3')?.textContent.trim()==='Movimientos');
  if(inventoryCard)inventoryCard.remove();
  if(help)help.remove();
  const head=document.createElement('div');head.className='pa-headrow sales-head';
  head.innerHTML=`<div><h2 class="sales-subtitle">Registro de ventas</h2><p class="pa-sub">Selecciona el producto, cantidad y método de pago.</p></div><button class="pa-btn primary" id="newSale">＋ Registrar venta</button>`;
  main.insertBefore(head,movements||null);
  document.getElementById('newSale').onclick=()=>openSaleModal();
  if(movements){
    movements.querySelector('h3').textContent='Historial de ventas';
    await enhanceMovementTable(movements);
  }
}
async function openSaleModal(){
  const{data:products,error}=await S.from('products').select('id,name,sku,stock').is('deleted_at',null).order('name');
  if(error)return notify('No se pudieron cargar los productos.','error');
  const available=(products||[]).filter(p=>Number(p.stock)>0);
  if(!available.length)return notify('No hay productos con stock disponible.','error');
  const m=document.createElement('div');m.className='pa-modal';
  m.innerHTML=`<div class="pa-modalbox pa-small-modal"><div class="pa-headrow"><h2 class="pa-modal-title">Registrar venta</h2><button class="pa-btn light close">Cerrar</button></div><div class="pa-field"><label>Producto</label><select id="saleProduct" class="pa-input">${available.map(p=>`<option value="${p.id}" data-stock="${p.stock}">${esc(p.name)} · ${esc(p.sku)} · ${p.stock} u.</option>`).join('')}</select></div><div class="pa-field"><label>Cantidad</label><input id="saleQty" class="pa-input" type="number" min="1" value="1"></div><div class="pa-field"><label>Método de pago</label><select id="salePay" class="pa-input"><option value="EFECTIVO">Efectivo</option><option value="QR">QR</option></select></div><div class="pa-field"><label>Nota opcional</label><input id="saleNote" class="pa-input" placeholder="Detalle de la venta"></div><button class="pa-btn primary pa-full" id="saveSale">Guardar venta</button></div>`;
  document.body.appendChild(m);document.body.classList.add('pa-modal-open');
  const close=()=>{m.remove();document.body.classList.remove('pa-modal-open')};
  m.querySelector('.close').onclick=close;
  m.querySelector('#saveSale').onclick=async()=>{
    const productId=m.querySelector('#saleProduct').value;
    const qty=Number(m.querySelector('#saleQty').value||0);
    const stock=Number(m.querySelector('#saleProduct').selectedOptions[0]?.dataset.stock||0);
    const pay=m.querySelector('#salePay').value;
    const note=m.querySelector('#saleNote').value.trim();
    if(qty<1)return notify('La cantidad debe ser mayor a 0.','error');
    if(qty>stock)return notify('La cantidad supera el stock disponible.','error');
    const fullNote=`[Pago: ${pay}]${note?` ${note}`:''}`;
    const{error}=await S.rpc('adjust_inventory',{p_product_id:productId,p_movement_type:'SALE',p_quantity:qty,p_note:fullNote});
    if(error)return notify(error.message,'error');
    close();notify('Venta registrada correctamente');
    const ventasTab=[...document.querySelectorAll('.pa-tab')].find(b=>(b.textContent||'').trim()==='Ventas');
    ventasTab?.click();
  };
}
async function enhanceMovementTable(card){
  const table=card.querySelector('.pa-table');if(!table||table.dataset.salesEnhanced)return;
  table.dataset.salesEnhanced='1';
  const{data}=await S.from('inventory_movements').select('movement_type,note').order('created_at',{ascending:false}).limit(50);
  const rows=[...table.querySelectorAll('tbody tr')];
  const header=table.querySelector('thead tr');
  const th=document.createElement('th');th.textContent='Pago';header.appendChild(th);
  rows.forEach((row,i)=>{
    const m=data?.[i];const td=document.createElement('td');let value='—';
    if(m?.movement_type==='SALE'){
      const hit=(m.note||'').match(/\[Pago:\s*(EFECTIVO|QR)\]/i);value=hit?hit[1].toUpperCase():'Sin registrar';
    }
    td.innerHTML=value==='QR'?'<span class="pa-pay qr">QR</span>':value==='EFECTIVO'?'<span class="pa-pay cash">Efectivo</span>':esc(value);
    row.appendChild(td);
  });
}
async function categoriesActions(){
  const title=[...document.querySelectorAll('.pa-title')].find(x=>(x.textContent||'').trim()==='Categorías');
  if(!title)return;
  const main=title.closest('.pa-main');const table=main?.querySelector('.pa-table');if(!table||table.dataset.categoryActions)return;
  table.dataset.categoryActions='1';
  const{data:cats}=await S.from('categories').select('id,name,slug').order('name');
  const header=table.querySelector('thead tr');const th=document.createElement('th');th.textContent='Acciones';header.appendChild(th);
  const rows=[...table.querySelectorAll('tbody tr')];
  rows.forEach((row,i)=>{
    const cat=cats?.[i];if(!cat)return;
    const td=document.createElement('td');td.innerHTML=`<button class="pa-btn danger cat-delete" data-id="${cat.id}" data-name="${esc(cat.name)}">Eliminar</button>`;row.appendChild(td);
  });
  table.querySelectorAll('.cat-delete').forEach(b=>b.onclick=async()=>{
    const id=b.dataset.id,name=b.dataset.name;
    const{count,error:countErr}=await S.from('products').select('id',{count:'exact',head:true}).eq('category_id',id).is('deleted_at',null);
    if(countErr)return notify('No se pudo validar la categoría.','error');
    if(count>0)return notify(`No puedes eliminar ${name}: todavía tiene ${count} producto(s).`,'error');
    if(!confirm(`¿Eliminar la categoría ${name}?`))return;
    const{error}=await S.from('categories').delete().eq('id',id);
    if(error)return notify(error.message,'error');
    notify('Categoría eliminada');
    const tab=[...document.querySelectorAll('.pa-tab')].find(x=>(x.textContent||'').trim()==='Categorías');tab?.click();
  });
}
const style=document.createElement('style');style.textContent=`.sales-head{margin-top:4px}.sales-subtitle{margin:0 0 5px;font-size:20px;color:#1a2739}.pa-pay{display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;font-size:10px;font-weight:800}.pa-pay.qr{background:#edf4fb;color:#245f94}.pa-pay.cash{background:#eef8f2;color:#23714f}@media(max-width:760px){.sales-head{align-items:flex-start}.sales-head .pa-btn{font-size:11px;padding:9px 11px}}`;document.head.appendChild(style);
const obs=new MutationObserver(()=>{renameInventoryTab();salesPage();categoriesActions()});obs.observe(A,{childList:true,subtree:true});
setTimeout(()=>{renameInventoryTab();salesPage();categoriesActions()},250);
