export function toast(message){
 const region=document.querySelector('#toast-region'),el=document.createElement('div');el.className='toast';el.textContent=message;region.append(el);setTimeout(()=>el.remove(),2800);
}