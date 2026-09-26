const SUPABASE_URL='https://lsuigiuthuycddlcvrds.supabase.co';
const API_KEY='sb_publishable_kM87waiflFugm53n9o-B4A_mkn5P5Uu';

export async function onRequestPost({request}){
  try{
    const auth=request.headers.get('authorization')||'';
    if(!auth.startsWith('Bearer '))return Response.json({error:'Sesión de administrador no válida.'},{status:401});
    const url=new URL(request.url),path=url.searchParams.get('path');
    if(!path||path.includes('..'))return Response.json({error:'Ruta de imagen no válida.'},{status:400});
    let body,mime;
    const contentType=request.headers.get('content-type')||'';
    if(contentType.includes('multipart/form-data')){
      const form=await request.formData(),file=form.get('image');
      if(!file||typeof file.arrayBuffer!=='function')return Response.json({error:'No llegó la fotografía al servidor.'},{status:400});
      body=new Uint8Array(await file.arrayBuffer());
      mime=file.type||'application/octet-stream';
    }else if(contentType.includes('application/json')){
      const data=await request.json();
      if(!data?.base64)return Response.json({error:'La imagen llegó vacía.'},{status:400});
      const bin=atob(data.base64),bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      body=bytes;mime=data.mime||'application/octet-stream';
    }else{
      body=new Uint8Array(await request.arrayBuffer());mime=contentType||'application/octet-stream';
    }
    if(!body.byteLength)return Response.json({error:'La imagen llegó vacía.'},{status:400});
    if(body.byteLength>12*1024*1024)return Response.json({error:'La imagen supera 12 MB.'},{status:413});
    const target=SUPABASE_URL+'/storage/v1/object/product-images/'+path.split('/').map(encodeURIComponent).join('/');
    const up=await fetch(target,{method:'POST',headers:{'apikey':API_KEY,'authorization':auth,'content-type':mime,'cache-control':'3600','x-upsert':'false'},body});
    const raw=await up.text();
    if(!up.ok){let message=raw;try{const j=JSON.parse(raw);message=j?.message||j?.error||raw}catch{}return Response.json({error:message||'Storage rechazó la imagen.'},{status:up.status})}
    return Response.json({ok:true,path,size:body.byteLength});
  }catch(e){return Response.json({error:e?.message||'No se pudo subir la imagen.'},{status:500})}
}
