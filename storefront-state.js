export const DEFAULT_SETTINGS=Object.freeze({
  store_name:'PILAR',
  location:'Sucre - Bolivia',
  whatsapp:'59173158851',
  delivery_text:'Consultar por WhatsApp',
  shipping_text:'',
  hours:'Lunes a domingo, de 7:00 a 22:00',
  show_exact_stock:true,
  low_stock_threshold:2,
  tiktok_url:''
});

export function normalizePhone(value){
  let digits=String(value||'').replace(/\D/g,'');
  if(digits.length===8)digits='591'+digits;
  if(!digits)digits=DEFAULT_SETTINGS.whatsapp;
  return {target:digits,display:digits.startsWith('591')&&digits.length>=11?digits.slice(-8):digits};
}

export function normalizeSettings(row={}){
  return {
    ...DEFAULT_SETTINGS,
    ...row,
    whatsapp:normalizePhone(row.whatsapp||DEFAULT_SETTINGS.whatsapp).target,
    location:String(row.location||DEFAULT_SETTINGS.location).trim(),
    delivery_text:String(row.delivery_text||DEFAULT_SETTINGS.delivery_text).trim(),
    shipping_text:String(row.shipping_text||'').trim(),
    hours:String(row.hours||DEFAULT_SETTINGS.hours).trim(),
    show_exact_stock:row.show_exact_stock!==false,
    low_stock_threshold:Math.max(1,Number(row.low_stock_threshold||DEFAULT_SETTINGS.low_stock_threshold)),
    tiktok_url:String(row.tiktok_url||'').trim()
  };
}

export function availability(stock,settings=DEFAULT_SETTINGS){
  const qty=Math.max(0,Number(stock||0));
  const low=Math.max(1,Number(settings.low_stock_threshold||2));
  if(qty<=0)return {label:'Agotado',className:'out',qty};
  if(qty<=low)return {label:'Últimas unidades',className:'low',qty};
  return {label:'Disponible',className:'ok',qty};
}

export function stockText(stock,settings=DEFAULT_SETTINGS){
  const a=availability(stock,settings);
  if(a.qty<=0)return 'Agotado';
  if(settings.show_exact_stock)return `${a.qty} unidad${a.qty===1?'':'es'} disponible${a.qty===1?'':'s'}`;
  return a.label;
}
