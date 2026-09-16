const admin=location.pathname.startsWith('/admin');
if(admin){
  await import('/admin-v2.js');
}else{
  await import('/storefront.js');
}