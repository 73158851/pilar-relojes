import { getPublicOrigin } from '../_shared/origin.js';

const SUPABASE='https://lsuigiuthuycddlcvrds.supabase.co';
const KEY='sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu';
const esc=s=>String(s).replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));

export async function onRequestGet({request}){
  try{
    const origin=getPublicOrigin(request);
    const r=await fetch(`${SUPABASE}/rest/v1/products?select=slug,updated_at&visible=eq.true&deleted_at=is.null&order=updated_at.desc`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}});
    if(!r.ok)throw new Error('products');
    const products=await r.json(),staticPaths=['/','/catalogo','/nuevos','/ofertas','/contacto'];
    const urls=[...staticPaths.map(path=>({loc:origin+path,lastmod:null})),...products.map(p=>({loc:`${origin}/producto/${encodeURIComponent(p.slug)}`,lastmod:p.updated_at}))];
    const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(x=>`<url><loc>${esc(x.loc)}</loc>${x.lastmod?`<lastmod>${esc(new Date(x.lastmod).toISOString())}</lastmod>`:''}</url>`).join('')}</urlset>`;
    return new Response(xml,{status:200,headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=1800'}});
  }catch{return new Response('No se pudo generar el sitemap',{status:500});}
}
