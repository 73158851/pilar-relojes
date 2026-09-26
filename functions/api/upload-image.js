import libheif from 'libheif-js/wasm-bundle';
import jpeg from 'jpeg-js';

const SUPABASE_URL='https://lsuigiuthuycddlcvrds.supabase.co';
const API_KEY='sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu';
const isHeif=(b)=>{if(b.length<12)return false;const s=String.fromCharCode(...b.slice(4,12));return s.startsWith('ftyp')&&/(heic|heix|hevc|hevx|heim|heis|mif1|msf1)/.test(String.fromCharCode(...b.slice(8,32)))};
async function heifToJpeg(bytes){
 const decoder=new libheif.HeifDecoder(),images=decoder.decode(bytes);
 if(!images?.length)throw new Error('El servidor no pudo decodificar la fotografía HEIC/HEIF.');
 const image=images[0],width=image.get_width(),height=image.get_height(),data=new Uint8Array(width*height*4);
 await new Promise((resolve,reject)=>image.display({data,width,height},display=>{try{for(let y=0;y<height;y++)for(let x=0;x<width;x++){const s=(y*width+x)*4,d=s;data[d]=display.data[s];data[d+1]=display.data[s+1];data[d+2]=display.data[s+2];data[d+3]=255}resolve()}catch(e){reject(e)}}));
 const out=jpeg.encode({data,width,height},86);
 if(!out?.data?.length)throw new Error('No se pudo convertir la fotografía a JPEG.');
 return new Uint8Array(out.data);
}
export async function onRequestPost({request}){
 try{
  const auth=request.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer '))return Response.json({error:'Sesión de administrador no válida.'},{status:401});
  const url=new URL(request.url),requestedPath=url.searchParams.get('path');
  if(!requestedPath||requestedPath.includes('..'))return Response.json({error:'Ruta de imagen no válida.'},{status:400});
  const form=await request.formData(),file=form.get('image');
  if(!file||typeof file.arrayBuffer!=='function')return Response.json({error:'No llegó la fotografía al servidor.'},{status:400});
  let body=new Uint8Array(await file.arrayBuffer()),mime=file.type||'application/octet-stream',path=requestedPath;
  if(!body.byteLength)return Response.json({error:'La imagen llegó vacía.'},{status:400});
  if(body.byteLength>12*1024*1024)return Response.json({error:'La imagen supera 12 MB.'},{status:413});
  if(isHeif(body)){
    body=await heifToJpeg(body);mime='image/jpeg';path=path.replace(/\.[^.\/]+$/,'.jpg');
  }
  const target=SUPABASE_URL+'/storage/v1/object/product-images/'+path.split('/').map(encodeURIComponent).join('/');
  const up=await fetch(target,{method:'POST',headers:{apikey:API_KEY,authorization:auth,'content-type':mime,'cache-control':'3600','x-upsert':'false'},body,signal:AbortSignal.timeout(45000)});
  const raw=await up.text();
  if(!up.ok){let message=raw;try{const j=JSON.parse(raw);message=j?.message||j?.error||raw}catch{}return Response.json({error:message||'Storage rechazó la imagen.'},{status:up.status})}
  return Response.json({ok:true,path,size:body.byteLength,mime});
 }catch(e){const timeout=e?.name==='TimeoutError';return Response.json({error:timeout?'La subida superó 45 segundos y fue cancelada.':e?.message||'No se pudo procesar la imagen.'},{status:timeout?504:500})}
}
