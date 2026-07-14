let cache=null;
async function loadPatterns(){
 if(cache)return cache;
 const r=await fetch('./data/patterns/core-patterns.json');
 if(!r.ok)throw new Error(`Pattern data failed to load (${r.status})`);
 const data=await r.json();
 if(!Array.isArray(data)||data.some(x=>!x.id||!x.name||!x.rule||!x.route))throw new Error('Malformed pattern data');
 cache=data;return data;
}
export async function renderPatternLibrary(){
 const view=document.querySelector('#view');document.querySelector('#page-title').textContent='Pattern Library';document.querySelector('#page-eyebrow').textContent='RECOGNIZE STRUCTURES, NOT MEMORIZED QUESTIONS';
 view.innerHTML='<div class="card empty-state"><p>Loading reasoning patterns…</p></div>';
 try{
  const patterns=await loadPatterns();
  const families=[...new Set(patterns.map(p=>p.family))];
  view.innerHTML=`<section class="section"><div class="card hero"><div><p class="eyebrow">TRANSFER LIBRARY</p><h2>Learn the structure beneath different wording.</h2><p>These are reusable reasoning patterns. The goal is faster recognition in unfamiliar puzzles, not memorizing exact questions.</p></div><div class="card insight"><strong>Patterns available</strong><h3>${patterns.length}</h3><p>${families.length} reasoning families currently represented.</p></div></div></section>
  <section class="section"><div class="pattern-grid">${patterns.map(p=>`<article class="card pattern-card"><div class="list-item"><span class="chip">${p.family}</span><small class="muted">${p.skills.map(s=>s.replaceAll('_',' ')).join(' · ')}</small></div><h3>${p.name}</h3><p><strong>Recognition signal:</strong> ${p.signal}</p><p><strong>Working rule:</strong> ${p.rule}</p><div class="pattern-example">${p.example}</div><p class="pattern-trap"><strong>Common trap:</strong> ${p.trap}</p><button class="button secondary" data-go="${p.route}">Train this pattern</button></article>`).join('')}</div></section>`;
  view.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>location.hash=b.dataset.go);
 }catch(e){console.error(e);view.innerHTML=`<div class="card empty-state"><h2>Pattern Library could not load</h2><p>${e.message}</p><button class="button" id="retry-patterns">Retry</button></div>`;view.querySelector('#retry-patterns').onclick=()=>renderPatternLibrary()}
}