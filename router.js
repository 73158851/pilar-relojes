const admin=location.pathname.startsWith('/admin');
if(admin){
  await import('/admin-v2.js?v=20260920-preview-multi-image-hotfix-3');
  await import('/admin-enhance.js?v=20260916-save-fix-1');
  await import('/admin-sales.js?v=20260916-sales-2');
  await import('/admin-product-gender.js?v=20260919-stable-4');
  await import('/admin-image-pro.js?v=20260917-image-pro-1');
  await import('/admin-product-save-v2.js?v=20260919-stable-4');
  await import('/admin-pwa.js?v=20260919-stable-4');
  await import('/admin-realtime.js?v=20260919-stable-4');
}else{
  await import('/storefront.js?v=20260925-home-text-v3');
  await import('/store-enhance.js?v=20260919-stable-4');
  await import('/store-pro.js?v=20260923-favorites-mobile-1');
  await import('/storefront-whatsapp-sync.js?v=20260916-wa-sync-1');
  await import('/store-premium-motion.js?v=20260917-motion-1');
  await import('/store-gender-filter.js?v=20260924-inline-filter-v2');
  await import('/store-seo.js?v=20260917-seo-1');
  await import('/store-header-cleanup.js?v=20260919-wa-header-remove-1');
}
