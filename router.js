const admin=location.pathname.startsWith('/admin');
if(admin){
  await import('/admin-v2.js');
  await import('/admin-enhance.js');
}else{
  await import('/storefront.js');
  await import('/store-enhance.js');
  await import('/storefront-lightbox.js');
}