import{storage}from'../core/storage.js';import{buildLearnerProfile}from'../engines/adaptive-engine.js';
export async function renderWeaknessMap(){
 const view=document.querySelector('#view');document.querySelector('#page-title').textContent='Weakness Map';document.querySelector('#page-eyebrow').textContent='DIAGNOSE WHAT LIMITS TRANSFER';
 let m=[],a=[],r=[];try{[m,a,r]=await Promise.all([storage.getAll('mastery'),storage.getAll('attempts'),storage.getAll('reviews')])}catch(e){console.error(e)}
 const p=buildLearnerProfile(m,a,r),errors=Object.entries(p.errorCounts).sort((x,y)=>y[1]-x[1]);
 view.innerHTML=`<section class="section"><div class="grid grid-3">${p.weakest.map((s,i)=>`<article class="card"><div class="list-item"><span class="chip">${i<2?'Priority':'Tracked'}</span><strong>${s.score}%</strong></div><h3>${s.id.replaceAll('_',' ')}</h3><div class="skill-bar"><span style="width:${s.score}%"></span></div><button class="button secondary" data-go="${s.route}" style="margin-top:1rem">Train this skill</button></article>`).join('')}</div></section>
 <section class="section"><div class="card"><p class="eyebrow">RECURRING ERRORS</p><h2>Failure patterns</h2>${errors.length?`<div class="stack">${errors.map(([e,n])=>`<div class="list-item"><span>${e.replaceAll('_',' ')}</span><strong>${n}</strong></div>`).join('')}</div>`:'<p class="muted">No recurring errors recorded yet. Complete training attempts to build a diagnostic profile.</p>'}</div></section>`;
 view.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>location.hash=b.dataset.go);
}