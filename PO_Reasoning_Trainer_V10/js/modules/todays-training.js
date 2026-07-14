import{storage}from'../core/storage.js';
import{buildLearnerProfile,composeAdaptiveSession}from'../engines/adaptive-engine.js';
const DURATIONS=[5,10,20,30];
export async function renderTodaysTraining(){
 const view=document.querySelector('#view');
 document.querySelector('#page-title').textContent="Today's Training";
 document.querySelector('#page-eyebrow').textContent='ADAPTIVE DAILY PLAN';
 let masteries=[],attempts=[],reviews=[];
 try{[masteries,attempts,reviews]=await Promise.all([storage.getAll('mastery'),storage.getAll('attempts'),storage.getAll('reviews')])}catch(e){console.error(e)}
 const saved=Number(localStorage.getItem('rf-training-duration')||20);
 const profile=buildLearnerProfile(masteries,attempts,reviews);
 let plan=composeAdaptiveSession(profile,saved);
 const render=()=>{
  view.innerHTML=`<section class="section"><div class="card hero"><div><p class="eyebrow">ASSESS → TRAIN → REVIEW → TRANSFER</p><h2>Your session is built from your actual performance.</h2><p>The plan prioritizes weaknesses without training only weaknesses. It also preserves review, mixed reasoning, and full-puzzle transfer.</p></div><div class="card insight"><strong>Primary target</strong><h3>${plan.primary.id.replaceAll('_',' ')}</h3><p>${plan.primary.score}% mastery. ${profile.fatigue?'Recent performance suggests a temporary decline, so the session starts lighter.':'No strong recent fatigue signal detected.'}</p></div></div></section>
  <section class="section"><div class="section-head"><div><p class="eyebrow">SESSION LENGTH</p><h2>Choose your training window</h2></div><div class="duration-picker">${DURATIONS.map(d=>`<button class="button ${plan.duration===d?'':'secondary'}" data-duration="${d}">${d} min</button>`).join('')}</div></div>
  <div class="adaptive-plan">${plan.blocks.map((b,i)=>`<article class="card adaptive-block"><div class="adaptive-step">${i+1}</div><div><span class="chip">${b.minutes} min · ${b.kind}</span><h3>${b.label}</h3><p>${b.reason}</p></div><button class="button secondary" data-go="${b.route}">Start</button></article>`).join('')}</div></section>
  <section class="section"><div class="card"><p class="eyebrow">WHY THIS PLAN</p><h2>Transparent adaptation, not fake AI</h2><p>This version uses deterministic rules: lowest mastery receives the largest training share, due reviews are scheduled, mixed practice prevents overfitting, and full-puzzle transfer remains in every standard session.</p></div></section>`;
  view.querySelectorAll('[data-duration]').forEach(b=>b.onclick=()=>{const d=+b.dataset.duration;localStorage.setItem('rf-training-duration',d);plan=composeAdaptiveSession(profile,d);render()});
  view.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>location.hash=b.dataset.go);
 };
 render();
}
