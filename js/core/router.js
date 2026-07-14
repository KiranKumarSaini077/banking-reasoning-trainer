const routes=new Map();

function renderRouteError(error,path){
 console.error(`Route "${path}" failed`,error);
 const view=document.querySelector('#view');
 if(view)view.innerHTML=`<div class="card empty-state"><p class="eyebrow">RECOVERABLE APPLICATION ERROR</p><h2>This screen could not be rendered.</h2><p>${escapeHtml(error?.message||'Unknown route error')}</p><div class="hero-actions"><button class="button" id="route-retry">Retry</button><button class="button secondary" id="route-home">Dashboard</button></div></div>`;
 document.querySelector('#route-retry')?.addEventListener('click',()=>router.navigate(path));
 document.querySelector('#route-home')?.addEventListener('click',()=>router.navigate('dashboard'));
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

export const router={
 register(path,handler){routes.set(path,handler)},
 async navigate(path){
  const safe=routes.has(path)?path:'dashboard';
  window.dispatchEvent(new CustomEvent('reasonforge:before-route',{detail:{to:safe,from:location.hash.slice(1)||null}}));
  if(location.hash.slice(1)!==safe)history.replaceState(null,'',`#${safe}`);
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.route===safe));
  try{
   const handler=routes.get(safe);
   if(typeof handler!=='function')throw new Error(`No handler registered for ${safe}`);
   await handler();
  }catch(error){renderRouteError(error,safe)}
 },
 start(){
  window.addEventListener('hashchange',()=>this.navigate(location.hash.slice(1)||'dashboard'));
  return this.navigate(location.hash.slice(1)||'dashboard');
 }
};