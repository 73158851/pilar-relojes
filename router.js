const admin=location.pathname.startsWith('/admin');
if(admin){
  await import('/admin-v2.js?v=20260917-admin-core-3');
  await import('/admin-enhance.js?v=20260916-save-fix-1');
  await import('/admin-sales.js?v=20260916-sales-2');
  await import('/admin-product-save-v2.js?v=20260917-save-v2-2');
  await import('/admin-pwa.js?v=20260917-admin-pwa-2');
}else{
  await import('/storefront.js');
  await import('/store-enhance.js');
  await import('/storefront-lightbox.js');
  await import('/store-pro.js');
  await import('/storefront-whatsapp-sync.js?v=20260916-wa-sync-1');
  await import('/store-premium-motion.js?v=20260917-motion-1');
  await import('/store-header-cleanup.js?v=20260917-wa-header-1');
}