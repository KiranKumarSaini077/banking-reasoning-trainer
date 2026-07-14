import{storage}from'../core/storage.js';import{median,pct}from'../utils/statistics.js';
export async function renderDashboard(){
 const view=document.querySelector('#view');document.querySelector('#page-title').textContent='Dashboard';document.querySelector('#page-eyebrow').textContent='YOUR REASONING PROFILE';
 let attempts=[],masteries=[];try{attempts=await storage.getAll('attempts');masteries=await storage.getAll('mastery')}catch(e){console.error(e)}
 const correct=attempts.filter(a=>a.correct).length,med=median(attempts.map(a=>a.responseMs))/1000;
 const masteryMap=Object.fromEntries(masteries.map(m=>[m.id,m.score]));
 const errors=attempts.filter(a=>a.errorType).reduce((m,a)=>(m[a.errorType]=(m[a.errorType]||0)+1,m),{});
 const topError=Object.entries(errors).sort((a,b)=>b[1]-a[1])[0];
 const tracked=['gap_calculation','direction_mapping','reference_tracking','constraint_integration','chain_inference'];
 const weakest=tracked.map(id=>[id,masteryMap[id]??50]).sort((a,b)=>a[1]-b[1])[0];
 const nextRoute=weakest[0]==='gap_calculation'?'skill-gym':['constraint_integration','chain_inference'].includes(weakest[0])?'puzzle-lab':'statement-lab';
 view.innerHTML=`
 <section class="section"><div class="card hero"><div><p class="eyebrow">ASSESS → ISOLATE → TRAIN → APPLY</p><h2>Build the mental operations that full PO puzzles depend on.</h2><p>V3 connects isolated skills into multi-clue reasoning: construct chains, integrate constraints, derive new relationships, and inspect recurring mistakes.</p><div class="hero-actions"><button class="button" data-go="${nextRoute}">Train Weakest Skill</button><button class="button secondary" data-go="puzzle-lab">Open Puzzle Lab</button></div></div><div class="card insight"><strong>Train next</strong><h3>${weakest[0].replaceAll('_',' ')}</h3><p>Current mastery ${weakest[1]}%. ${topError?`Most frequent recorded issue: ${topError[0].replaceAll('_',' ').toLowerCase()}.`:'Complete training to establish a stronger diagnostic profile.'}</p></div></div></section>
 <section class="section"><div class="section-head"><div><p class="eyebrow">ACTIONABLE SIGNALS</p><h2>Current performance</h2></div></div><div class="grid grid-4">
 <div class="card metric"><span class="muted">Overall accuracy</span><strong>${pct(correct,attempts.length)}%</strong><small>${attempts.length} recorded attempts</small></div>
 <div class="card metric"><span class="muted">Median response</span><strong>${med?med.toFixed(1):'–'}s</strong><small>Across recorded training</small></div>
 <div class="card metric"><span class="muted">Weakest tracked skill</span><strong style="font-size:1rem">${weakest[0].replaceAll('_',' ')}</strong><small>${weakest[1]}% mastery</small></div>
 <div class="card metric"><span class="muted">Recurring error</span><strong style="font-size:1rem">${topError?topError[0].replaceAll('_',' '):'No data yet'}</strong><small>${topError?`${topError[1]} occurrence(s)`:'Train to diagnose'}</small></div>
 </div></section>
 <section class="section"><div class="section-head"><div><p class="eyebrow">SKILL PROFILE</p><h2>Foundational mastery</h2></div></div><div class="grid grid-3">
 ${tracked.map(id=>`<div class="card"><div class="list-item"><strong>${id.replaceAll('_',' ')}</strong><strong>${masteryMap[id]??50}%</strong></div><div class="skill-bar"><span style="width:${masteryMap[id]??50}%"></span></div></div>`).join('')}
 </div></section>`;
 view.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>location.hash=b.dataset.go);
}