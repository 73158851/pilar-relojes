import { getPublicOrigin } from '../_shared/origin.js';

const SUPABASE='https://lsuigiuthuycddlcvrds.supabase.co';
const KEY='sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function get(path){const r=await fetch(SUPABASE+'/rest/v1/'+path,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}});if(!r.ok)throw new Error('supabase');return r.json()}

export async function onRequestGet({request}){
 try{
  const u=new URL(request.url),slug=String(u.searchParams.get('slug')||'').trim();
  if(!slug||slug.length>160)return new Response('Producto inválido',{status:400});
  const ps=await get(`products?select=id,name,brand,description,price,stock,slug&slug=eq.${encodeURIComponent(slug)}&visible=eq.true&deleted_at=is.null&limit=1`),p=ps[0];
  if(!p)return new Response('Producto no encontrado',{status:404});
  const imgs=await get(`product_images?select=public_url,is_primary,sort_order&product_id=eq.${encodeURIComponent(p.id)}&order=is_primary.desc,sort_order.asc&limit=1`);
  const origin=getPublicOrigin(request),image=imgs[0]?.public_url||'',url=`${origin}/producto/${encodeURIComponent(p.slug)}`,price=Number(p.price||0),status=Number(p.stock)>0?'Disponible':'Agotado',title=`${p.name} | PILAR Relojes Sucre`,baseDescription=p.description||`${p.name} disponible en PILAR, Sucre, Bolivia.`,description=`${baseDescription} · Bs ${price.toFixed(0)} · ${status}`.slice(0,180);
  const json=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.name,image:image?[image]:[],description,brand:{'@type':'Brand',name:p.brand||'PILAR'},offers:{'@type':'Offer',url,priceCurrency:'BOB',price,availability:Number(p.stock)>0?'https://schema.org/InStock':'https://schema.org/OutOfStock'}}).replace(/</g,'\\u003c');
  const imageMeta=image?`<meta property="og:image" content="${esc(image)}"><meta property="og:image:secure_url" content="${esc(image)}"><meta property="og:image:alt" content="${esc(`${p.name} - PILAR Relojes Sucre`)}"><meta name="twitter:image" content="${esc(image)}">`:'';
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="product"><meta property="og:site_name" content="PILAR"><meta property="og:locale" content="es_BO"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(url)}">${imageMeta}<meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${json}</script><meta http-equiv="refresh" content="0;url=${esc(url)}"></head><body><a href="${esc(url)}">Ver ${esc(p.name)} en PILAR</a></body></html>`;
  return new Response(html,{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=600'}});
 }catch{return new Response('No se pudieron cargar los metadatos',{status:500});}
}
