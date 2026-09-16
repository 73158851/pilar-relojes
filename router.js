const admin=location.pathname.startsWith('/admin');
if(admin){
  await import('/app.js');
  await import('/multi-images.js');
  await import('/image-manager-v2.js');
}else{
  await import('/storefront.js');
}