const admin=location.pathname.startsWith('/admin');
if(admin){
  await import('/admin-v2.js?v=20260916-admin-core-2');
  await import('/admin-enhance.js?v=20260916-admin-enhance-2');
  await import('/admin-sales.js?v=20260916-sales-2');
}else{
  await import('/storefront.js');
  await import('/store-enhance.js');
  await import('/storefront-lightbox.js');
  await import('/store-pro.js');
}