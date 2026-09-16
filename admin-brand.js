const PILAR_LOGO='https://lsuigiuthuycddlcvrds.supabase.co/storage/v1/object/public/product-images/87b25917-0e2e-46d1-92ab-f17b25d30d8f/1789530951622-1000503226.webp';
function applyAdminBrand(){
  const login=document.querySelector('.loginbox .brand');
  if(login&&!login.querySelector('.login-brand-logo')) login.innerHTML=`<img class="login-brand-logo" src="${PILAR_LOGO}" alt="PILAR">`;
  const side=document.querySelector('.side .brand');
  if(side&&!side.querySelector('.admin-brand-logo')) side.innerHTML=`<img class="admin-brand-logo" src="${PILAR_LOGO}" alt="PILAR">`;
}
const observer=new MutationObserver(applyAdminBrand);
observer.observe(document.getElementById('app'),{childList:true,subtree:true});
applyAdminBrand();