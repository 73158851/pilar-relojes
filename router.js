const admin=location.pathname.startsWith('/admin');
if(admin){
  await import('/app.js');
  await import('/multi-images.js');
  await import('/admin-brand.js');
  await import('/admin-fixes.js');
}else{
  await import('/storefront.js');
}