const admin=location.pathname.startsWith('/admin');
if(admin){
  await import('/admin-v2.js?v=20260924-admin-fixes-1');
  await import('/admin-enhance.js?v=20260924-admin-fixes-1');
  await import('/admin-sales.js?v=20260916-sales-2');
  await import('/admin-product-gender.js?v=20260917-gender-1');
  await import('/admin-image-pro.js?v=20260917-image-pro-1');
  await import('/admin-product-save-v2.js?v=20260924-admin-fixes-1');
  await import('/admin-pwa.js?v=20260917-admin-pwa-2');
}else{
  await import('/storefront.js?v=20260923-mobile-nav-1');
  await import('/store-enhance.js?v=20260919-availability-final-1');
  await import('/storefront-lightbox.js');
  await import('/store-pro.js?v=20260919-availability-final-1');
  await import('/storefront-whatsapp-sync.js?v=20260916-wa-sync-1');
  if(location.pathname==='/'||location.pathname==='') await import('/storefront-reference-hero.js?v=20260918-approved-local-1');
  await import('/store-premium-motion.js?v=20260917-motion-1');
  await import('/store-gender-filter.js?v=20260917-gender-1');
  await import('/store-seo.js?v=20260917-seo-1');
  await import('/store-header-cleanup.js?v=20260917-wa-header-1');
}
